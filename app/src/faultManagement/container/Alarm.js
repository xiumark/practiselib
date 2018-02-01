import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import ConfirmPopup from '../../components/ConfirmPopup';
import Immutable from 'immutable';
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';

import Content from '../../components/Content';
import {treeViewInit} from '../../common/actions/treeView';
import {injectIntl} from 'react-intl';
import {getChildDomainList} from '../../api/domain';
import { DatePicker} from 'antd';
import moment from 'moment';

export class Alarm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: 'sensor',
      collapse: false,
      infoCollapse:false,
      page: Immutable.fromJS({
        pageSize: 10,
        current: 1,
        total: 0,
      }),
      data: Immutable.fromJS([]
      ),
      domainList: {
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: '',
        options: [],
      },
      paramList: {
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: '',
        options: [],
      },
      levelList: {
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: '',
        options: [],
      },
      start:moment(),
      end:moment(),      
    };

    this.columns = [
      {
        id: 0,
        field: 'type',
        title: this.props.intl.formatMessage({id:'sysOperation.alarm.type'}),
      },
      {
        id: 1,
        field: 'model',
        title: this.props.intl.formatMessage({id:'sysOperation.alarm.device.model'}),
      },
      {
        id: 2,
        field: 'name',
        title: this.props.intl.formatMessage({id:'app.device.name'}),
      },
      {
        id: 3,
        field: 'level',
        title: this.props.intl.formatMessage({id:'sysOperation.alarm.level'}),
      },
      {
        id: 4,
        field: 'threshold',
        title: this.props.intl.formatMessage({id:'sysOperation.alarm.threshold'}),
      },
      {
        id: 5,
        field: 'value',
        title: this.props.intl.formatMessage({id:'sysOperation.alarm.test.value'}),
      },
      {
        id: 6,
        field: 'time',
        title: this.props.intl.formatMessage({id:'sysOperation.alarm.time'}),
      },
      {
        id: 7,
        field: 'status',
        title: this.props.intl.formatMessage({id:'sysOperation.alarm.status'}),
      },
      {
        id: 8,
        field: 'person',
        title: this.props.intl.formatMessage({id:'sysOperation.alarm.person'}),
      },
      {
        id: 9,
        field: 'handleTime',
        title: this.props.intl.formatMessage({id:'sysOperation.alarm.handle.time'}),
      },
    ];
  }

  componentWillMount() {
    this.mounted = true;
    getChildDomainList(data => {
      this.mounted && this.initDomainList(data);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {}


  initDomainList=(data) => {
    let domainList = Object.assign({}, this.state.domainList, {index: 0},
      {value: data.length ? data[0].name : ''}, {options: data});
    this.setState({domainList: domainList});
    this.requestSearch();
  }

  requestSearch=() => {

  }
  
  initPageSize=(data) => {
    let page = this.state.page.set('total', data.count);
    this.setState({
      page: page,
    });
  }

  pageChange=(current, pageSize) => {
    let page = this.state.page.set('current', current);
    this.setState({
      page: page,
    }, () => {
      this.requestSearch();
    });
  }

  collapseHandler=(id) => {
    this.setState({
      [id]: !this.state[id],
    });
  }

  selectChange=(event, key) => {
    let index = event.target.selectedIndex;
    let list = this.state[key];
    list.index = index;
    list.value = list.options[index].name;
    this.setState({[key]: list}, () => {
      this.requestSearch();
    });
  }

  dateChange=(id, value) => {
    this.setState({[id]: value}, () => {
      const {start, end} = this.state;  
      let prompt = (start && end) && end.isBefore(start);                  
      this.setState({prompt:Object.assign({}, this.state.prompt, {date:prompt})});
    });
  }

  render() {
    const {collapse, infoCollapse, page, data, domainList, paramList, levelList, start, end} = this.state;
    return <Content className={'offset-right ' + (collapse ? 'collapsed' : '')}>
      <div className="heading">
        <Select id="domain" titleField={domainList.valueField} valueField={domainList.valueField} 
          options={domainList.options} value={domainList.value}
          onChange={(e) => {this.selectChange(e, 'domainList');}}/>
        <Select id="param" titleField={paramList.valueField} valueField={paramList.valueField}
          options={paramList.options} value={paramList.value} onChange={(e) => {this.selectChange(e, 'paramList');}}/>
        <Select id="level" titleField={levelList.valueField} valueField={levelList.valueField}
          options={levelList.options} value={levelList.value} onChange={(e) => {this.selectChange(e, 'levelList');}}/>
        <div className="datePicker">
          <DatePicker id="startDate" format="YYYY/MM/DD" placeholder="点击选择开始日期" style={{ width: '100px' }}
            defaultValue={start} value={start} onChange={value => this.dateChange('start', value)} />
          <span>-</span>
          <DatePicker id="endDate" format="YYYY/MM/DD" placeholder="点击选择结束日期" style={{ width: '100px' }}
            defaultValue={end} value={end} onChange={value => this.dateChange('end', value)} />
        </div>
        <div className="button-group">
          <button className="btn btn-primary">{this.props.intl.formatMessage({id:'button.ignore'})}</button>
          <button className="btn btn-primary">{this.props.intl.formatMessage({id:'button.solve'})}</button>
          <button className="btn btn-primary">{this.props.intl.formatMessage({id:'button.to.fault'})}</button>
        </div>
      </div>
      <div className="table-container">
        <Table columns={this.columns} data={data}/>
        <Page className={'page ' + (page.get('total') == 0 ? 'hidden' : '')} pageSize={page.get('pageSize')}
          current={page.get('current')} total={page.get('total')}  onChange={this.pageChange}/>
      </div>
      <SideBarInfo collapseHandler={this.collapseHandler} 
        className={(infoCollapse ? 'infoCollapse ' : '')}>
        <div className="panel panel-default statistical-info">
          <div className="panel-heading" role="presentation"
            onClick={() => { !collapse && this.collapseHandler('infoCollapse'); }}>
            <span className="icon_select"></span>
            {this.props.intl.formatMessage({id:'sysOperation.alarm.statistical.info'})}
            <span className="icon icon_collapse pull-right"></span>      
          </div>
          <div className={'panel-body' + (infoCollapse ? 'collapsed' : '')}>
            <div className="left"></div>
            <div className="right"></div>
          </div>
        </div>
      </SideBarInfo>
    </Content>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    treeViewInit,
    overlayerShow,
    overlayerHide,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Alarm));