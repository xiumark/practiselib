/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/domainmanage.less';
import Content from '../../components/Content'
import SideBarInfo from '../../components/SideBarInfo'
import Table from '../../components/Table';
import SearchText from '../../components/SearchText'
import Page from '../../components/Page'
import {TreeData} from '../../data/domainModel'
import Immutable from 'immutable';

export class DomainEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listMode: true,
            collapse: false,
            selectDevice: {
                position: {
                    "device_id": 1,
                    "device_type": 'DEVICE',
                    x: 121.49971691534425,
                    y: 31.239658843127756
                },
                data: {
                    id: 1,
                    name: '上海市'
                }
            },

            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 21
            }),

            search: Immutable.fromJS({placeholder: '输入域名称', value: ''}),
            data: Immutable.fromJS([{id:1,name: '上海市', parentDomain: '无'},
                {id:2, name: '闵行区', parentDomain: '上海市'},
                {id:3, name: '徐汇区', parentDomain: '上海市'}])
        }

        this.columns = [{id: 1, field: "name", title: "域名称"}, {id:2, field: "parentDomain", title: "上级域"}]

        this.onToggle = this.onToggle.bind(this);
        this.initTreeData = this.initTreeData.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);
    }

    componentWillMount() {
        this.initTreeData();
    }

    componentWillReceiveProps(nextProps) {
        const {sidebarNode} = nextProps;
        if (sidebarNode) {
            this.onToggle(sidebarNode);
        }
    }

    componentWillUnmount() {
        this.mounted = true;
    }

    initTreeData() {

    }

    domainHandler(id){
        console.log(id);
    }

    pageChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=>{
        });
    }

    searchSubmit(){
        console.log('submit');
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    onToggle(node) {
        let mode = true;
        if(node.id == "list-mode"){

            mode = true;
        }else{
            mode = false;
        }

        this.setState({listMode:mode});
    }

    collpseHandler() {
        this.setState({collapse: !this.state.collapse})
    }

    render() {
        const {listMode, collapse, selectDevice, page, search, data} = this.state
        return (
            <Content className={'offset-right '+(collapse?'collapsed':'')}>
                <div className="heading">
                    <button className="btn btn-default add-domain" onClick={()=>this.domainHandler('add')}>添加</button>
                    <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={this.searchChange} submit={this.searchSubmit}/>
                </div>
                {
                    listMode ?
                        <div className="list-mode">
                            <div className="table-container">
                                <Table columns={this.columns} data={data} activeId={selectDevice.data.id}/>
                                <Page className="page" showSizeChanger pageSize={page.get('pageSize')}
                                      current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
                            </div>
                        </div> :
                        <div className="topology-mode">topology</div>
                }
                <SideBarInfo mapDevice={selectDevice} collpseHandler={this.collpseHandler}>
                    <div className="panel panel-default device-statics-info">
                        <div className="panel-heading">
                            <span className="icon_statistics"></span>域属性
                        </div>
                        <div className="panel-body domain-property">
                            <span className="domain-name">{selectDevice.data.name}</span>
                            <button className="btn btn-default pull-right" onClick={()=>this.domainHandler('delete')}>删除</button>
                            <button className="btn btn-default pull-right" onClick={()=>this.domainHandler('update')}>修改</button>
                        </div>
                    </div>
                </SideBarInfo>
            </Content>
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
        actions: bindActionCreators({}, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DomainEdit);