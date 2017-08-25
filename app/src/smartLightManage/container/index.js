/**
 * Created by a on 2017/8/24.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/smartLightManage-map.less';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Overlayer from '../../common/containers/Overlayer'

import {TreeData} from '.././../data/smartLightModel'
import {treeViewInit} from '../../common/actions/treeView'
// import {sideBarToggled} from '../action/index'
class SystemOperationIndex extends Component{
    constructor(props){
        super(props);
        this.initTreeData = this.initTreeData.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount(){

        this.mounted = true;
        this.mounted && this.initTreeData();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidMount(){
    }

    initTreeData(){
        this.props.actions.treeViewInit(TreeData);
    }

    onToggle(node){
        // console.log(node);
        // this.props.actions.sideBarToggled(node);
    }

    render(){
        let path = "";
        const {children} = this.props;
        if(children){
            path = children.props.route.path;
        }
        return <div className={"container "+path}>
            <HeadBar moduleName={"智慧路灯控制系统"} router={this.props.router}/>
            <SideBar onToggle={this.onToggle}/>
            {this.props.children}
            <Overlayer />
        </div>
    }
}

function mapStateToProps(state) {
    return {
        userCenter:state.userCenter
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            treeViewInit: treeViewInit,
            // sideBarToggled: sideBarToggled
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SystemOperationIndex);