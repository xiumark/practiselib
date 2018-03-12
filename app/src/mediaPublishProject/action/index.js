/**
 * Created by a on 2018/3/8.
 */
import {
  INIT_PROJECT,
  INIT_PROGRAM_LIST,
  INIT_PLAN,
  INIT_SCENE_LIST,
  INIT_SCENE,
  INIT_ZONE,
  INIT_ITEM,

  UPDATE_TREE_DATA,
  UPDATE_TREE_LIST,
  UPDATE_TREE_JUDGE,

  UPDATE_ITEM_NAME,

  CLEAR_TREE_STATE
} from '../actionType/index';

import {getProgramList, getSceneList, getItemList, updateProgramOrders, updateSceneOrders, updateZoneOrders,
  removeProgramsById, removeSceneById, removeZoneById, updateProjectById, updateProgramById, updateSceneById, updateZoneById, updateItemById,
  addProgram, addScene, addZone, getAssetById} from '../../api/mediaPublish';

import {addTreeNode, moveTree, getTreeParentNode, removeTree, parsePlanData, IsSystemFile} from '../util/index';
import {getListObjectByKey, DeepCopy} from '../../util/algorithm';
import lodash from 'lodash';
import Immutable from 'immutable';

import systemFile from '../data/systemFile.json';
import systemInitFile from '../data/systemInitFile.json';
export function initProject(project){
  return dispatch=>{
    dispatch({type: INIT_PROJECT, data:project});
    dispatch(requestProgrameList(project));
  }
}

function requestProgrameList(project) {
  return (dispatch)=>{
    getProgramList(project.id, data=>{
      dispatch({type: INIT_PROGRAM_LIST, data:data});
    })
  }
}

export function initPlan(plan) {
  return dispatch=>{
    dispatch({type: INIT_PLAN, data:plan});
    // dispatch(requestSceneList(plan.id))
  }
}

export function requestSceneList(programId){
  return (dispatch, getState)=>{
    const project = getState().mediaPublish.project;
    getSceneList(project.id, programId, data=>{
      dispatch({type: INIT_SCENE_LIST, programId: programId, data: data});
    })
  }
}

export function initScene(scene) {
  return dispatch=>{
    dispatch({type: INIT_SCENE, data:scene});
  }
}

export function initZone(zone) {
  return dispatch=>{
    dispatch({type: INIT_SCENE, data:zone});
  }
}

export function initItem(item) {
  return dispatch=>{
    dispatch({type: INIT_ITEM, data:item});
  }
}

export function updateTreeJudge(IsUpdateTree) {
  return {
    type: UPDATE_TREE_JUDGE,
    data: IsUpdateTree
  }
}

export function addPlayerPlan(id, formatIntl) {
  return (dispatch, getState)=>{
    dispatch(clearTreeState());
    const node = addTreeNode(id, formatIntl);
    dispatch(initPlan(node.node));
    dispatch(updateTreeData(node.node))
  }
}

export function updateTreeData(node, parentNode, parentParentNode) {
  return {
    type: UPDATE_TREE_DATA,
    node: node,
    parentNode: parentNode,
    parentParentNode: parentParentNode
  }
}

export function clearTreeState() {
  return {
    type: CLEAR_TREE_STATE
  }
}

export function treeOnMove(key, node){
  return (dispatch, getState)=>{
    const project = getState().mediaPublishProject.project;
    const playerData = getState().mediaPublishProject.data;
console.log('treeOnMove:',node.type);
    switch (node.type) {
      case 'plan':
      case 'plan2':
      case 'plan3':
        dispatch(updatePlanOrders({ key: key, node: node }, playerData, project));
        break;
      case 'scene':
        dispatch(updateScenesOrders({ key: key, node: node }, playerData, project));
        break;
      case 'area':
        dispatch(updateAreaOrders({ key: key, node: node }, playerData, project));
        break;
      default:
        break;
    }
  }
}

function updatePlanOrders(data, playerData, project){
  return dispatch=>{
    const newTreeList = moveTree(playerData, data);
    const ids = getListObjectByKey(newTreeList, 'id');
    dispatch(updateTreeList(newTreeList));
    updateProgramOrders(project.id, ids, response => {
      console.log('plan orders:', ids);
    });
  }

}

function updateScenesOrders(data, playerData, project){
  return dispatch=>{
    let parentNode = getTreeParentNode(playerData, data.node);
    let index = lodash.findIndex(playerData, plan => { return plan.type == parentNode.type && plan.id == parentNode.id; });

    playerData[index].children = moveTree(parentNode.children, data);
    let ids = getListObjectByKey(playerData[index].children, 'id');
    dispatch(updateTreeList(playerData));
    updateSceneOrders(project.id, parentNode.id, ids, response => {
      console.log('scene orders:', ids);
    });
  }
}

function updateAreaOrders(data, playerData, project){
  return dispatch=>{
    let parentNode = getTreeParentNode(playerData, data.node);
    let parentParentNode = getTreeParentNode(playerData, parentNode);

    let planIndex = lodash.findIndex(playerData, plan => { return plan.type == parentParentNode.type && plan.id == parentParentNode.id; });
    let sceneIndex = lodash.findIndex(parentParentNode.children, scene => { return scene.type == parentNode.type && scene.id == parentNode.id; });

    playerData[planIndex].children[sceneIndex].children = moveTree(parentNode.children, data);
    let ids = getListObjectByKey(playerData[planIndex].children[sceneIndex].children, 'id');
    dispatch(updateTreeList(playerData));
    updateZoneOrders(project.id, parentParentNode.id, parentNode.id, ids, response => {
      console.log('area orders:', ids);
    });
  }
}

export function treeOnRemove(node){
  return (dispatch, getState)=>{
    const project = getState().mediaPublishProject.project;
    const sCurNode = getState().mediaPublishProject.zone;
    const sParentNode = getState().mediaPublishProject.scene;
    const sParentParentNode = getState().mediaPublishProject.plan;
    const playerData = getState().mediaPublishProject.data;

    let parentNode = getTreeParentNode(playerData, node);
    let parentParentNode = getTreeParentNode(playerData, parentNode);
    if (sCurNode && node.type === sCurNode.type && node.id === sCurNode.id
      || sParentNode && parentNode && parentNode.type === sParentNode.type && parentNode.id === sParentNode.id
      || sParentParentNode && parentParentNode && parentParentNode.type === sParentParentNode.type && parentParentNode.id === sParentParentNode.id) {
    }

    if(typeof node.id === "string" && (node.id.indexOf("plan")>-1 || node.id.indexOf("scene")>-1 || node.id.indexOf("area")>-1)){
      return dispatch(updateTreeList(removeTree(playerData, node)));
    }

    switch (node.type) {
      case 'scene':
        removeSceneById(project.id, parentNode.id, node.id, () => {
          dispatch(updateTreeList(removeTree(playerData, node)))
        });
        break;
      case 'plan':
        removeProgramsById(project.id, node.id, () => {
          dispatch(updateTreeList(removeTree(playerData, node)));
        });
        break;
      case 'plan2':
        break;
      case 'plan3':
        break;
      case 'area':
        removeZoneById(project.id, parentParentNode.id, parentNode.id, node.id, () => {
          dispatch(updateTreeList(removeTree(playerData, node)));
        });
        break;
      default:
        break;
    }
  }
}


function updateTreeList(treeList) {
  return {
    type: UPDATE_TREE_LIST,
    data: DeepCopy(treeList)
  }
}

export function applyClick(id, data) {
  return (dispatch, getState)=>{
    const project = getState().mediaPublishProject.project;
    const parentParentNode = getState().mediaPublishProject.plan;
    const parentNode = getState().mediaPublishProject.scene;
    const curNode = getState().mediaPublishProject.zone;
    const playerData = getState().mediaPublishProject.data;
    switch (id) {
      case 'playerProject':
        updateProjectById(data, response => {
          dispatch({type: INIT_PROJECT, data: Object.assign({}, project, response)})
        });
        break;
      case 'playerPlan':
        dispatch(addUpdatePlan(data, project, playerData));
        break;
      case 'playerScene':
        dispatch(addUpdateScene(data, project, parentNode, playerData));
        break;
      case 'playerAreaPro':
        dispatch(addUpdateArea(data, project, parentParentNode, parentNode, playerData));
        break;
      default:
        dispatch(addUpdateItem(data, project, parentParentNode, parentNode, curNode));
    }
  }
}

function addUpdatePlan(data, project, playerData){
  return dispatch=>{
    let planData = parsePlanData(data);
    if (data.id) {
      planData = Object.assign({}, planData, { id: data.id });
      updateProgramById(project.id, planData, (response) => {
        dispatch(updatePlayerPlanData(Object.assign({}, planData, {type:'plan'}), playerData));
      });
    } else {
      addProgram(project.id, planData, response => {
        dispatch(updatePlayerPlanData(Object.assign({}, planData, { id: response.playlistId }, {type:'plan'}), playerData));
      });
    }
  }
}

function addUpdateScene(data, project, parentNode, playerData){
  return dispatch=>{
    let sceneData = data;
    if (data.id) {
      sceneData = Object.assign({}, sceneData, { id: data.id });
      updateSceneById(project.id, parentNode.id, sceneData, (response) => {
        dispatch(updatePlayerSceneData(Object.assign({}, sceneData, {type:'scene'}), parentNode, playerData));
      });
    } else {
      addScene(project.id, parentNode.id, sceneData, response => {
        dispatch(updatePlayerSceneData(Object.assign({}, sceneData, { id: response.sceneId }, {type: 'scene'}), parentNode, playerData));
      });
    }
  }
}

function addUpdateArea(data, project, parentParentNode, parentNode, playerData){
  return dispatch=>{
    let areaData = data;
    if (data.id) {
      areaData = Object.assign({}, areaData, { id: data.id });
      updateZoneById(project.id, parentParentNode.id, parentNode.id, areaData, (response) => {
        dispatch(updatePlayerAreaData(Object.assign({}, areaData, {type:'area'}), parentParentNode, parentNode, playerData));
      });
    } else {
      addZone(project.id, parentParentNode.id, parentNode.id, areaData, response => {
        dispatch(updatePlayerAreaData(Object.assign({}, areaData, { id: response.regionId }, {type:'area'}), parentParentNode, parentNode, playerData));
      });
    }
  }
}

function addUpdateItem(data, project, parentParentNode, parentNode, curNode){
  return dispatch=>{
    updateItemById(project.id, parentParentNode.id, parentNode.id, curNode.id, data, response => {
      dispatch(requestItemList(parentParentNode.id, parentNode.id, curNode.id));
    });
  }
}

function updatePlayerPlanData(response, playerData){
  return dispatch=>{
    const newPlayerData = playerData.map(plan => {
      if ((typeof plan.id === 'string' && plan.id.indexOf('plan&&') > -1) || plan.id == response.id) {
        return Object.assign({}, plan, response);
      }

      return plan;
    });

    dispatch(initPlan(response));
    dispatch(updateTreeList(newPlayerData));
  }
}

function updatePlayerSceneData(response, parentNode, playerData){
  return dispatch=>{
    let index = lodash.findIndex(playerData, plan => { return plan.id == parentNode.id; });
    playerData[index].children = playerData[index].children.map(scene => {
      if ((typeof scene.id === 'string' && scene.id.indexOf('scene&&') > -1) || scene.id == response.id) {
        return Object.assign({}, scene, response);
      }

      return scene;
    });

    dispatch(initScene(response, playerData[index]));
    dispatch(updateTreeList(playerData));
  }
}

function updatePlayerAreaData(response, parentParentNode, parentNode, playerData){
  return dispatch=>{
    let planIndex = lodash.findIndex(playerData, plan => { return plan.id == parentParentNode.id; });
    let sceneIndex = lodash.findIndex(playerData[planIndex].children, scene => { return scene.id == parentNode.id; });
    playerData[planIndex].children[sceneIndex].children = playerData[planIndex].children[sceneIndex].children.map(area => {
      if ((typeof area.id === 'string' && area.id.indexOf('area&&') > -1) || area.id == response.id) {
        return Object.assign({}, area, response);
      }

      return area;
    });

    dispatch(initZone(response, playerData[planIndex].children[sceneIndex], playerData[planIndex]));
    dispatch(updateTreeList(playerData));
    dispatch(requestItemList(parentParentNode.id, parentNode.id, response.id));
  }

}

export function requestItemList(programId, sceneId, zoneId){
  return (dispatch, getState)=>{
    const project = getState().mediaPublish.project;
    // getItemList(project.id, programId, sceneId, zoneId, data=>{
      // dispatch({type: UPDATE_ITEM_LIST, programId: programId, sceneId: sceneId, zoneId: zoneId, data: data});
      // dispatch(requestItemName(Immutable.fromJS(data)));
    // })
  }
}

function requestItemName(data) {
  return dispatch=>{
    console.log('requestItemName:', data);
    data.map(item => {
      const itemObject = item.toJS();
      if (IsSystemFile(item.get('type'))) {
        const sysfile = lodash.find(systemFile, file => { return file.id === itemObject.materialId; });
        dispatch(updateItemName(itemObject, sysfile));
      } else {
        getAssetById(item.get('materialId'), response => {
          dispatch(updateItemName(itemObject, response));
        });
      }
    });
  }
}

function updateItemName(itemObject, sysfile) {
  return {
    type: UPDATE_ITEM_NAME,
    item: itemObject,
    file: sysfile
  }
}