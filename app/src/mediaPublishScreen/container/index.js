/**
 * Created by a on 2018/2/1.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import Content from '../../components/Content';
import Select from '../../reporterManage/component/select';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table'
import Page from '../../components/Page'
import MapView from '../../components/MapView'
import ProjectPopup from '../component/ProjectPopup';
import PreViewPopup from '../component/PreViewPopup';
import { getDomainList } from '../../api/domain';
import { getSearchAssets, getSearchCount } from '../../api/asset'
import { getProjectsByPlayerId, getProjectPreviewById } from '../../api/mediaPublish'
import '../../../public/styles/media-publish-screen.less';

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
export class MediaPublishScreen extends Component {
    state = {
        sidebarCollapse: false,
        deviceCollapse: false,
        operationCollapse: false,
        mapCollapse: false,
        domainList: [
            { name: '域' }
        ],
        currentDomain: null,
        deviceList: [],
        currentDevice: null,
        search: { value: '', placeholder: '输入设备名称' },
        page: { total: 0, current: 1, limit: 10 },
        playScheme: [
            { name: '无', id: 'empty' },
            { name: '方案管理...', id: 'manage' }
        ],
        currentPlan: null,
        currentPlayerId: null,
        currentProjectList: [],
    }
    componentWillMount() {
        this._isMounted = true;
        this.model = 'ssads';
        this.deviceColumns = [
            { field: 'name', title: '名称' },
            { field: 'ratio', title: '分辨率' },
            { field: 'screenStatus', title: '屏体状态' },
            { field: 'switchStatus', title: '开关状态' },
            { field: 'onlineStatus', title: '在线状态' }
        ];
        this.initDomainData();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    //初始化域，更新域列表
    initDomainData = () => {
        getDomainList(data => {
            this._isMounted && this.updateDomainData(data)
        })
    }
    updateDomainData = (data) => {
        if (!data.length) {
            return;
        }
        this.setState({ currentDomain: data[0], domainList: data }, this.initDeviceData);
    }
    initDeviceData = () => {
        if (!this._isMounted) {
            return;
        }
        if (this.state.currentDomain) {
            const { currentDomain, search: { value }, page: { current, limit } } = this.state;
            const offset = limit * (current - 1);
            getSearchCount(currentDomain.id, this.model, value, this.updatePageSize)
            getSearchAssets(currentDomain.id, this.model, value, offset, limit, this.updateDeviceData);
        }
    }
    updatePageSize = (data) => {
        this._isMounted && this.setState({ page: { ...this.state.page, total: data.count } });
    }
    updateDeviceData = (data) => {
        this._isMounted && this.setState({
            deviceList: data,
            currentDevice: data.length ? data[0] : null,
            currentPlayerId: data[0].extend.player
        }, () => {
            this.getCurrentProjects()
        });
    }
    getCurrentProjects = () => {
        const id = this.state.currentPlayerId;
        getProjectsByPlayerId(id, (res) => {
            this.setState({ currentProjectList: res },()=>{
                console.log(this.state.currentProjectList)
            })
        })
    }
    handleCollapse = (id) => {
        this.setState({ [id]: !this.state[id] })
    }
    handleCollapseAll = () => {
        if (this.state.sidebarCollapse) {
            this.setState({
                sidebarCollapse: false,
                deviceCollapse: false,
                operationCollapse: false,
                mapCollapse: false
            })
        } else {
            this.setState({
                sidebarCollapse: true,
                deviceCollapse: true,
                operationCollapse: true,
                mapCollapse: true
            })
        }

    }
    handleSelectDomain = (e) => {
        const { domainList, page } = this.state;
        this.setState({ currentDomain: domainList[e.target.selectedIndex], page: { ...page, current: 1 } }, this.initDeviceData)
    }
    handleSearchValue = (value) => {
        this.setState({ search: { ...this.state.search, value } })
    }
    handleSearchSubmit = () => {
        this.setState({ page: { ...this.state.page, current: 1 } }, this.initDeviceData)
    }
    handlePagination = (current) => {
        this.setState({ page: { ...this.state.page, current, } }, this.initDeviceData)
    }
    //预览待时实现
    handleViewDevice = () => {
        const { currentDevice, currentPlan } = this.state;
        const { actions } = this.props;
        actions.overlayerShow(<PreViewPopup title="显示屏预览" data={{ url: "http://localhost:8080/images/smartLight/screen_test.png" }} onCancel={() => {
            actions.overlayerHide();
        }} />)
    }
    //弹出方案管理弹框
    hanldePlanManage = () => {
        const { actions } = this.props;
        const {currentPlayerId,currentProjectList}=this.state;
        // const applyProjectList = [{ id: '5a67f0216c64c71518b0140f', name: "project1" }, { id: '5a67f05c6c64c71518b01410', name: "project3" }];
        // const applyProjectList=this.state.currentProjectList;

        actions.overlayerShow(<ProjectPopup title="方案管理" data={{ playerId:currentPlayerId,applyProjectList: currentProjectList }} onConfirm={data => {
            actions.overlayerHide();
        }} onCancel={() => {
            actions.overlayerHide();
        }} />)
    }
    selectDevice = (currentDevice) => {
        this.setState({ currentDevice: currentDevice.toJS() })
    }
    //设备开关动作
    handleSubmit = (e) => {
        e.preventDefault();
        const { currentDevice } = this.state;
        console.log(e.target)
        console.log('应用设备开关', currentDevice)
    }
    handleSelectPlayScheme = (e) => {
        const { playScheme, currentPlan } = this.state;
        const id = playScheme[e.target.selectedIndex].id
        if (id === 'manage') {
            this.setState({ currentPlan: null }, this.hanldePlanManage)
            return;
        }
        this.setState({ currentPlan: playScheme[e.target.selectedIndex] })
    }
    //应用当前方案
    handlePlanApply = () => {
        const { currentDevice, currentPlan } = this.state;
        console.log('应用当前方案', currentDevice, currentPlan)
    }
    componentDidUpdate() {
        const { sidebarCollapse, domainList, currentDomain, deviceList, currentDevice,
            search: { value, placeholder }, page: { total, current, limit }, playScheme, currentPlan } = this.state;
        // console.log('currentDevice', currentDevice)
        // console.log(domainList)
        // console.log(currentDomain)
        // console.log(value)
        // console.log(currentDevice)
        // console.log(currentPlan)
    }
    render() {
        const { sidebarCollapse, deviceCollapse, operationCollapse, mapCollapse, domainList, currentDomain, deviceList, currentDevice,
            search: { value, placeholder }, page: { total, current, limit }, playScheme, currentPlan } = this.state;

        const offset1 = deviceCollapse ? 60 : 0
        const offset2 = operationCollapse ? 130 : 0
        const top = 349 - offset1 - offset2;
        return (
            <Content id='media-publish-screen' class={`${sidebarCollapse ? 'mr60' : ''}`}>
                <div class='content-left'>
                    <div class='heading'>
                        <Select id='domain' className='select-domain' options={domainList}
                            current={currentDomain} onChange={this.handleSelectDomain} />
                        <SearchText className='search-text' placeholder={placeholder} value={value}
                            onChange={this.handleSearchValue} submit={this.handleSearchSubmit} />
                    </div>
                    <div class='body'>
                        <Table columns={this.deviceColumns} data={Immutable.fromJS(deviceList)} activeId={deviceList.length && currentDevice.id}
                            rowClick={this.selectDevice} />
                        <div class={`page-center ${total === 0 ? 'hidden' : ''}`}>
                            <Page class='page' showSizeChanger pageSize={limit} current={current} total={total} onChange={this.handlePagination} />
                        </div>
                    </div>
                </div>
                <div class={`sidebar-info ${sidebarCollapse ? 'sidebar-collapse' : ''}`}>
                    <div class='row collapse-container' role="presentation" onClick={this.handleCollapseAll}>
                        <span class={sidebarCollapse ? 'icon_horizontal' : 'icon_vertical'}></span>
                    </div>
                    <div class='panel panel-default' role="presentation" onClick={() => this.handleCollapse('deviceCollapse')}>
                        <div class='panel-heading'>
                            <span class="icon_select"></span>选中设备
                        <span class="icon icon_collapse pull-right" ></span>
                        </div>
                        <div class={`panel-body ${deviceCollapse ? 'screen-hidden' : ''}`}>
                            <span title={currentDevice === null ? '无设备' : currentDevice.name}>{currentDevice === null ? '无设备' : currentDevice.name}</span>
                            <button onClick={this.handleViewDevice} class='btn btn-primary pull-right' disabled={currentDevice === null ? true : false}>预览</button>
                        </div>
                    </div>
                    <div class='panel panel-default'>
                        <div class='panel-heading' role="presentation" onClick={() => this.handleCollapse('operationCollapse')}>
                            <span class='icon_touch'></span>设备操作
                            <span class="icon icon_collapse pull-right" ></span>
                        </div>
                        <div class={`panel-body ${operationCollapse ? 'screen-hidden' : ''}`}>
                            <div class='item'>
                                <form onSubmit={this.handleSubmit}>
                                    <span>设备开关：</span>
                                    <input type='radio' name='operation' value='open' defaultChecked /><span class='action'>开</span>
                                    <input type='radio' name='operation' value='close' /><span class='action'>关</span>
                                    <button class='btn btn-primary pull-right' type='submit' disabled={currentDevice === null ? true : false}>应用</button>
                                </form>
                            </div>
                            <div class='item'>
                                <span>方案列表：</span>
                                <Select id='playScheme' className='play-scheme' options={playScheme} onChange={this.handleSelectPlayScheme} />
                                <button class='btn btn-primary pull-right' onClick={this.handlePlanApply}
                                    disabled={(currentDevice !== null && currentPlan !== null) ? false : true}>应用</button>
                            </div>
                        </div>
                    </div>
                    <div class='panel panel-default'>
                        <div class='panel-heading' role="presentation" onClick={() => this.handleCollapse('mapCollapse')}>
                            <span class="icon_map"></span><span>地图位置</span>
                            <span class="icon icon_collapse pull-right" ></span>
                        </div>
                        <div class={`panel-body map-container ${mapCollapse ? 'screen-hidden' : ''}`} style={{ top: top }}>
                            <MapView option={{ mapZoom: false }} mapData={{ id: 'example' }} />
                        </div>
                    </div>
                </div>
            </Content >
        )
    }
}

function mapStateToProps(state) {
    return {
        sidebarNode: state.domainManage.get('sidebarNode')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            overlayerShow: overlayerShow,
            overlayerHide: overlayerHide
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaPublishScreen);