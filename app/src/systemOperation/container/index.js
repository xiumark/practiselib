/**
 * Created by a on 2017/8/1.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {injectIntl} from 'react-intl';

import '../../../public/styles/systemOperation-config.less';
import '../../../public/styles/systemOperation-strategy.less';
import '../../../public/styles/systemOperation-sysConfig.less';
import '../../../public/styles/systemOperation-serviceMonitoring.less';
import '../../../public/styles/systemOperation-deviceMonitoring.less';
import '../../../public/styles/systemOperation-faultManage.less';

import HeadBar from '../../components/HeadBar';
import SideBar from '../../components/SideBar';
import Overlayer from '../../common/containers/Overlayer';

import { getModelData, TreeData } from '.././../data/systemModel';
import { treeViewInit, onToggleById } from '../../common/actions/treeView';
import { sideBarToggled } from '../action/index';

import {treeViewNavigator} from '../../common/util/index';
class SystemOperationIndex extends Component {
  constructor(props) {
    super(props);
    this.initTreeData = this.initTreeData.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.getActiveNode = this.getActiveNode.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    getModelData(null, () => {
      this.mounted && this.initTreeData();
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.pathname !== this.props.location.pathname){
      this.props.actions.onToggleById(nextProps.location.pathname);
    }
  }

  getActiveNode(TreeData){
    let pathname = this.props.location.pathname;//当前页面路径
    for(let i = 0;i<TreeData.length;i++){
      let childNode = TreeData[i];
      if(childNode.children){
        let result = this.getActiveNode(childNode.children);
        if (result!==null){
          return result;
        }
      }else {
        if(childNode.link==pathname){
          return childNode;
        }
      }
    }
    return null;
  }

  initTreeData() {
    const {actions} = this.props;
    TreeData.map(tree=>{
      return Object.assign({}, tree, {name:this.props.intl.formatMessage({id:tree.name})});
    })
    this.props.actions.treeViewInit(TreeData);
    treeViewNavigator(TreeData, this.props.router);

    let node = this.getActiveNode(TreeData);
    node&&actions.sideBarToggled(node);  
  }

  onToggle(node) {
    const {actions} = this.props;
    actions.sideBarToggled(node);
  }

  render() {
    let parentPath = '';
    let childPath = '';
    const {routes} = this.props;
    if (routes.length > 4) {
      parentPath = routes[4].path;
    }

    if (routes.length > 5) {
      childPath = routes[5].path;
    }

    return <div className={ 'container systemOperation-' + parentPath + ' ' + parentPath + '-' + childPath }>
      <HeadBar moduleName={ 'app.system.operation' } router={ this.props.router } />
      <SideBar onToggle={ this.onToggle } />
      { this.props.children }
      <Overlayer/>
    </div>;
  }
}

function mapStateToProps(state) {
  return {
    userCenter: state.userCenter,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      treeViewInit: treeViewInit,
      onToggleById: onToggleById,
      sideBarToggled: sideBarToggled,
    }, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SystemOperationIndex));