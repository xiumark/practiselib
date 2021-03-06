/**
 * Created by a on 2017/10/19.
 */
import { /*HOST_IP,*/ getHttpHeader, httpRequest } from '../util/network';
const HOST_IP = 'http://192.168.155.196:3002/api';
const UPLOAD_IP = 'http://192.168.155.196:3001/api/file/upload'; //上传文件地址
import { HeadBar } from '../components/HeadBar';


//上传文件

export function uploadMaterialFile(list, index) {
  console.log(list)
  const currentXhr = list[index].xhr;
  const data = list[index].form;
  currentXhr.open('POST', UPLOAD_IP, true);
  currentXhr.send(data);
}

//统计
export function getStatDeviceCount(cb) {
  //模拟实现
  // console.log('发起请求')
  setTimeout(() => {
    const res = {
      count: 500,
      inline: 380,
      outline: 120,
      normal: 410,
      fault: 90
    };
    cb && cb(res)
  }, 300)

}

//根据playerId获取projects
export function getProjectsByPlayerId(id, cb) {
  let headers = getHttpHeader();
  let url = HOST_IP + `/players/${id}/projects?detail=true`;
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}
export function getCurrentIdActive(id, cb) {
  let headers = getHttpHeader();
  let url = HOST_IP + `/players/${id}/active`;
  httpRequest(url, {
    headers: headers,
    method: 'GET'
  }, response => {
    cb && cb(response)
  })
}
//播放器应用选中方案
export function applyProjectOnPlayer(playerId, projectId, cb) {
  let headers = getHttpHeader();
  let url = HOST_IP + `/players/${playerId}/active/${projectId}`;
  httpRequest(url, {
    headers,
    method: 'PUT'
  }, response => {
    cb && cb(response);
  })
}

//播放方案
export function searchProjectList(type, projectName, offset, limit, cb) {
  let headers = getHttpHeader();
  let obj = Object.assign({}, { 'where': getProjectParam(type, projectName) }, { 'offset': offset, 'limit': limit });

  let param = JSON.stringify(obj);
  let url = HOST_IP + '/projects?filter=' + encodeURIComponent(param);
  httpRequest(url, {
    headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

function getProjectParam(type, projectName) {
  let param = {};
  if (type) {
    param = Object.assign(param, { type: type });
  }

  if (projectName) {
    param = Object.assign(param, { name: { like: projectName } });
  }

  return param;
}

export function getProjectByName(type, projectName, cb) {
  let headers = getHttpHeader();
  let obj = {};
  if (projectName) {
    obj = Object.assign({ 'where': { type: type, name: { like: projectName } } }, obj);
  }

  let param = JSON.stringify(obj);
  let url = HOST_IP + '/projects?filter=' + encodeURIComponent(param);
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getProjectList(cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects';
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getPublishProjectList(cb) {
  let headers = getHttpHeader();
  const param = JSON.stringify({ "where": { "binKey": { "neq": "" } } });
  let url = HOST_IP + '/projects?filter=' + encodeURIComponent(param);
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getProjectById(data, cb, errCb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + data.id;
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  }, null, error=>{
    errCb && errCb();
  });
}

export function getProjectPreviewById(data, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + data.id + '/preview';
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}


export function addProject(data, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects';
  httpRequest(url, {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateProjectById(data, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + data.id;
  httpRequest(url, {
    headers: headers,
    method: 'PATCH',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function removeProjectById(id, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + id;
  httpRequest(url, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

//播放表
export function getProgramList(projectId, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + projectId + '/programs';
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getProgramById(projectId, id, cb, errCb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + projectId + '/programs/' + id;
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  }, null, error=>{
    errCb && errCb()
  });
}

export function addProgram(projectId, data, cb) {
  let headers = getHttpHeader();

  httpRequest(HOST_IP + '/projects/' + projectId + '/programs', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateProgramById(projectId, data, cb) {
  let headers = getHttpHeader();

  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + data.id, {
    headers: headers,
    method: 'PUT',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateProgramOrders(projectId, data, cb) {
  let headers = getHttpHeader();

  httpRequest(HOST_IP + '/projects/' + projectId + '/orders', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function removeProgramsById(projectId, id, cb) {
  let headers = getHttpHeader();

  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + id, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

//场景
export function getSceneList(projectId, programId, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes', {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getSceneById(projectId, programId, id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + id, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function addScene(projectId, programId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateSceneById(projectId, programId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + data.id, {
    headers: headers,
    method: 'PUT',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateSceneOrders(projectId, programId, data, cb) {
  let headers = getHttpHeader();

  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/orders', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function removeSceneById(projectId, programId, id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + id, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

//区域
export function getZoneList(projectId, programId, sceneId, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones', {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getZoneById(projectId, programId, sceneId, id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + id, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function addZone(projectId, programId, sceneId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateZoneById(projectId, programId, sceneId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + data.id, {
    headers: headers,
    method: 'PUT',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateZoneOrders(projectId, programId, sceneId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/orders', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function removeZoneById(projectId, programId, sceneId, id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + id, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

//播放项
export function getItemList(projectId, programId, sceneId, zoneId, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/items', {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getItembyId(projectId, programId, sceneId, zoneId, id, type, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/items/' + id + '?itemType=' + type, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getItemPreviewbyId(id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/items/' + id + '/preview', {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getScenePreview(projectId, programId, sceneId, cb) {
  const headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/'+projectId+'/programs/'+programId+'/scenes/'+sceneId+'/preview',{
    headers: headers,
    method: 'GET'
  }, response=>{
    cb && cb(response);
  })
}

export function getSceneItemPreview(projectId, programId, sceneId, zoneId, itemId, cb) {
  const headers = getHttpHeader();
  httpRequest(HOST_IP+'/projects/'+projectId+'/programs/'+programId+'/scenes/'+sceneId+'/zones/'+zoneId+'/items/'+itemId+'/preview',{
    headers: headers,
    method: 'GET'
  }, (response, res, itemId)=>{
    cb && cb(response, itemId);
  }, itemId)
}

export function addItem(projectId, programId, sceneId, zoneId, itemType, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/items?itemType=' + itemType, {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateItemById(projectId, programId, sceneId, zoneId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/items/' + data.baseInfo.id + '?itemType=' + data.baseInfo.type, {
    headers: headers,
    method: 'PUT',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateItemOrders(projectId, programId, sceneId, zoneId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/orders', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function removeItemById(projectId, programId, sceneId, zoneId, id, itemType, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/items/' + id + '?itemType=' + itemType, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

//素材库
const FILE_HOST_IP = 'http://192.168.155.196:3001/api';
export function getAssetList(cb) {
  let headers = getHttpHeader();
  httpRequest(FILE_HOST_IP + '/file', {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getAssetListByTypeWithName(type, name, cb) {
  let headers = getHttpHeader();
  let obj = Object.assign({}, { "where": getAssetParam(type, name) });
  let param = JSON.stringify(obj);

  httpRequest(FILE_HOST_IP + '/file?filter=' + encodeURIComponent(param), {
    headers: headers,
    method: 'GET'
  }, response => {
    cb && cb(response);
  })
}

export function searchAssetList(type, name, offset, limit, cb) {
  let headers = getHttpHeader();
  let obj = Object.assign({}, { 'where': getAssetParam(type, name) }, { 'offset': offset, 'limit': limit });

  let param = JSON.stringify(obj);
  let url = FILE_HOST_IP + '/file?filter=' + encodeURIComponent(param);
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

function getAssetParam(type, name) {
  let param = {};
  if (type) {
    param = Object.assign(param, { type: type });
  }

  if (name) {
    param = Object.assign(param, { name: { like: `%${name}%` } });
  }

  return param;
}
/**
 *
 * @param data({"id": "string",
                    "name": "string",
                    "fingerprint": "string",
                    "filepath": "string",
                    "size": 0})
 * @param cb
 */
export function addAsset(data, cb) {
  let headers = getHttpHeader();
  httpRequest(FILE_HOST_IP + '/file', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function getAssetById(id, cb) {
  let headers = getHttpHeader();
  httpRequest(FILE_HOST_IP + '/file/' + id, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function removeAssetById(id, cb) {
  let headers = getHttpHeader();
  httpRequest(FILE_HOST_IP + '/file/' + id, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

export function previewPlayItem(itemInfo, callback) {
  const { projectId, programId, sceneId, zoneId, finalItem } = itemInfo;
  const urlItems = encodeURIComponent('[' + finalItem.toString() + ']');
  const headers = getHttpHeader();
  httpRequest('http://192.168.155.196:3002/api' + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/preview' + '?items=' + urlItems, {
    headers: headers,
    method: 'GET',
  }, (response) => {
    return callback(response);
  })
}

export function projectPublish(projectId, cb) {
  const headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/publish?id=' + projectId, {
    headers: headers,
    method: 'PUT',
  }, (response) => {
    cb && cb(response);
  })
}

export function updateScreenProject(playerId, projectId, data, cb) {
  const headers = getHttpHeader();
  httpRequest(HOST_IP + '/players/' + playerId + '/projects/rel/' + projectId, {
    headers: headers,
    method: 'PUT',
    body: JSON.stringify(data)
  }, response => {
    cb && cb(response);
  })
}

export function removeScreenProject(playerId, projectId, cb) {
  const headers = getHttpHeader();
  httpRequest(HOST_IP + '/players/' + playerId + '/projects/rel/' + projectId, {
    headers: headers,
    method: 'DELETE'
  }, response => {
    cb && cb(response);
  })
}