/**
 * Created by Azrael on 2017/9/1.
 */
import '../../../public/styles/smartLightManage-list.less';
import React, { Component } from 'react';

import {injectIntl} from 'react-intl';

import Content from '../../components/Content';
import Select from '../../components/Select.1';
import SearchText from '../../components/SearchText';
import TableWithHeader from '../components/TableWithHeader';
import TableTr from '../components/TableTr';
import Page from '../../components/Page';
import { getDomainList } from '../../api/domain';
import { getSearchAssets, getSearchCount, getDeviceStatusByModelAndId, getModelSummariesByModelID } from '../../api/asset';
import { getMomentDate, momentDateFormat } from '../../util/time';
export class Sensor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: {
                value: '',
                placeholder: this.formatIntl('app.input.device.name')
            },
            page: {
                total: 0,
                current: 1,
                limit: 10
            },
            currentDomain: null,
            domainList: {
                titleField: 'name',
                valueField: 'name',
                options: []
            },
            currentDevice: null,
            deviceList: [],
            sidebarCollapse: false,
        };
        this.model = 'sensor';
        this.sensorProps = null;
        this.columns = [
            { accessor: 'name', title: this.formatIntl('app.device.name') },
            { accessor(data) { return data.extend.type; }, title: this.formatIntl('app.type') },
            {
                accessor: (data) => {
                    // console.log(this)
                    // console.log(this.sensorProps[data.extend.type].unit);
                    if (this.sensorProps) {
                        return this.sensorProps[data.extend.type].unit;
                    }
                }, title: this.formatIntl('app.unit')
            },
            { accessor: 'value', title: this.formatIntl('app.param') },
            {
                accessor(data) {
                    return data.updated ? momentDateFormat(getMomentDate(data.updated, 'YYYY-MM-DDTHH:mm:ss Z'), 'YYYY/MM/DD HH:mm') : '';
                }, title: this.formatIntl('app.update.time')
            }
        ];

        this.formatIntl = this.formatIntl.bind(this);

    }
    componentWillMount() {

        this.mounted = true;
        getModelSummariesByModelID('sensor', data => {
            this.sensorProps = data.defaults.values;
            // console.log(this.sensorProps)
        });
        this.initData();
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    formatIntl(formatId){
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
        // return formatId;
    }

    initData = () => {
        getDomainList(data => {
            this.mounted && this.updateDomainData(data);
            this.mounted && this.initDeviceData();

        });
    }
    updateDomainData = data => {
        let currentDomain, options = data;
        if (data.length === 0) {
            currentDomain = null;
        } else {
            currentDomain = data[0];
        }
        this.setState({ domainList: { ...this.state.domainList, options }, currentDomain });

    }
    initDeviceData = isSearch => {
        let { search: { value }, page, page: { limit }, currentDomain } = this.state;
        if (isSearch) {
            page.current = 1;
            this.setState({ page: page });
        }

        let offset = limit * (page.current - 1);
        getSearchAssets(currentDomain ? currentDomain.id : null, this.model, value, offset, limit, this.mounted && this.updateDeviceData);
        getSearchCount(currentDomain ? currentDomain.id : null, this.model, value, this.mounted && this.updatePageSize);

    }
    updateDeviceData = data => {
        let currentDevice = data.length === 0 ? null : data[0];
        this.setState({ deviceList: data, currentDevice });
        console.log(this.state.deviceList);
    }
    updatePageSize = data => {
        this.setState({ page: { ...this.state.page, total: data.count } });
    }
    onChange = e => {
        const { id, value } = e.target;
        switch (id) {
        case 'domain':
            let currentDomain = this.state.domainList.options[e.target.selectedIndex];
            this.setState({ currentDomain }, this.initDeviceData);
            break;
        }
    }
    searchChange = value => {
        this.setState({
            search: { ...this.state.search, value }
        });
    }
    searchSubmit = () => {
        this.initDeviceData(true);
    }
    pageChange = page => {
        this.setState({ page: { ...this.state.page, current: page } }, this.initDeviceData);
    }
    tableClick = currentDevice => {
        this.setState({ currentDevice });
    }
    collapse = () => {
        this.setState({ sidebarCollapse: !this.state.sidebarCollapse });
    }
    // formatData(data) {
    //     if (data.updated) {
    //         data.updated = momentDateFormat(getMomentDate(data.updated, 'YYYY-MM-DDTHH:mm:ss Z'), 'YYYY/MM/DD HH:mm');
    //     }
    // }
    render() {
        const { page: { total, current, limit }, sidebarCollapse, currentDevice, deviceList,
            search: { value, placeholder }, currentDomain, domainList } = this.state;
        const disabled = deviceList.length === 0 ? true : false;
        return <Content className={`list-sensor ${sidebarCollapse ? 'collapse' : ''}`}>
            <div className="content-left">
                <div className="heading">
                    <Select id='domain' titleField={domainList.titleField} valueField={domainList.valueField}
                        options={domainList.options} value={currentDomain === null ? '' : currentDomain[domainList.valueField]}
                        onChange={this.onChange} />
                    <SearchText placeholder={placeholder} value={value} onChange={this.searchChange} submit={this.searchSubmit} />
                </div>
                <div className="table-container">
                    {/*<Table columns={this.columns} keyField='id' data={deviceList} activeId={currentDevice === null ? '' : currentDevice.id}
                        rowClick={this.tableClick} />*/}
                    <TableWithHeader columns={this.columns}>
                        {
                            deviceList.map(item => <TableTr key={item.id} data={item} columns={this.columns} activeId={currentDevice.id}
                                rowClick={this.tableClick} willMountFuncs={[getDeviceStatusByModelAndId(this.model, item.id)]}
                            />)
                        }
                    </TableWithHeader>
                    <Page className={`page ${total === 0 ? 'hidden' : ''}`} pageSize={limit}
                        current={current} total={total} onChange={this.pageChange} />
                </div>
            </div>
            <div className={`container-fluid sidebar-info ${sidebarCollapse ? 'sidebar-collapse' : ''}`}>
                <div className="row collapse-container" onClick={this.collapse}>
                    <span className={sidebarCollapse ? 'icon_horizontal' : 'icon_vertical'}></span>
                </div>
                <div className="panel panel-default panel-1">
                    <div className="panel-heading">
                        <span className="icon_select"></span>{this.formatIntl('sysOperation.selected.device')}
                    </div>
                    <div className="panel-body">
                        <span title={currentDevice === null ? '' : currentDevice.name}>{currentDevice === null ? '' : currentDevice.name}</span>
                    </div>
                </div>
            </div>
        </Content>;
    }
}

export default injectIntl(Sensor);