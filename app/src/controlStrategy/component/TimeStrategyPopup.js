/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter'
import Select from '../../components/Select'
import CustomDateInput from './CustomDateInput';

import {timeStrategy} from '../util/chart';
import {getMomentDate, momentDateFormat,getMomentUTC,getCurHM, getDaysByYearMonth} from '../../util/time'

import {STRATEGY_NAME_LENGTH, Name2Valid} from '../../util/index'

import Immutable from 'immutable'
export default class TimeStrategyPopup extends Component{
    constructor(props){
        super(props);
        const {data, strategyList} = this.props;
        this.state = {
            chartId:"",
            name:data.name,
            deviceName:data.deviceName,
            startTime:{
                year:Immutable.fromJS({value:"0",list:[]}),
                month:Immutable.fromJS({value:"1", list:[]}),
                date:Immutable.fromJS({value:"1", list:[]})
            },
            endTime:{
                year:Immutable.fromJS({value:"0",list:[]}),
                month:Immutable.fromJS({value:"1", list:[]}),
                date:Immutable.fromJS({value:"1", list:[]})
            },
            workTime:Immutable.fromJS([{id:1, name:"周一", active:true},{id:2, name:"周二", active:true}, {id:3, name:"周三", active:true},
                    {id:4, name:"周四",active:true},{id:5, name:"周五",active:true},{id:6, name:"周六", active:true},
                    {id:7, name:"周日", active:true}]),
            time:getCurHM(),
            light:Immutable.fromJS({
                list:[
                    {id:1, value:"关"},{id:2, value:20},{id:3, value:40},{id:4, value:60},{id:5, value:80}
                ],
                placeholder:"选择灯亮度",
                value:"开",
                index:0
            }),
            strategyList:strategyList,
            prompt:{
                name:false,
                workTime: false,
                time: false
            }
        }
        this.timeStrategy = null;
        this.renderChart = this.renderChart.bind(this);
        this.updateChart = this.updateChart.bind(this);

        this.onChange = this.onChange.bind(this);
        this.dateOnChange = this.dateOnChange.bind(this);
        this.checkOnChange = this.checkOnChange.bind(this);
        this.setLightOnChange = this.setLightOnChange.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.onClick = this.onClick.bind(this);
        this.delStrategy = this.delStrategy.bind(this);

        this.workTimeValid = this.workTimeValid.bind(this);
        this.getDatesList = this.getDatesList.bind(this);
        this.timeValid = this.timeValid.bind(this);

    }

    componentWillMount(){
        this.workTimeValid();

        const {startTime, endTime} = this.state
        let year = [];
        let month = [];
        let date = [];
        year.push({id:0, value:0, name:"不限"})
        for(let i=2015;i<=2035;i++){
            year.push({id:i, value:i, name:i+"年"});
        }

        for(let j=1;j<=12;j++){
            month.push({id:j, value:j, name:j+"月"});
        }

        date = this.getDatesList(getDaysByYearMonth(0, 1));

        let curDate = new Date();

        let nextDate = new Date(curDate);

        this.setState({
            strategyList:this.props.strategyList,
            startTime:{
                year:Immutable.fromJS({value:curDate.getFullYear(), list:year}),
                month:Immutable.fromJS({value:curDate.getMonth()+1, list:month}),
                date:Immutable.fromJS({value:curDate.getDate(),list:date})
            },
            endTime:{
                year:Immutable.fromJS({value:nextDate.getFullYear(),list:year}),
                month:Immutable.fromJS({value:nextDate.getMonth()+2, list:month}),
                date:Immutable.fromJS({value:nextDate.getDate(), list:date})
            }
        });
    }

    getDatesList(dates){
        let date = [];
        for(let i=1;i<=dates;i++){
            date.push({id:i, value:i, name:i+"日"});
        }

        return date;
    }

    workTimeValid(){
        let dayList = this.state.workTime;
        for(let i=0;i<dayList.size;i++){
            if(dayList.getIn([i, 'active'])){
                this.setState({prompt:Object.assign({}, this.state.prompt, {workTime:false})})
                return;
            }
        }

        this.setState({prompt:Object.assign({}, this.state.prompt, {workTime:true})});
    }

    onChange(event){
        let id = event.target.id;
        let value = event.target.value;
        let newValue;
        let prompt=false;
        if(id == "deviceName"){
            const {options, valueKey} = this.props.deviceList;
            value = options[event.target.selectedIndex][valueKey];
        }else if(id == "name"){
            prompt = !Name2Valid(value);
        }else if(id == "time"){
            // prompt = Number(value);
            prompt = false;
        }

        this.setState({[id]:value, prompt:Object.assign({}, this.state.prompt, {[id]:prompt})});
    }

    timeValid(){
        const {startTime, endTime} = this.state;
        let startYear = parseInt(startTime.year.get("value"));
        let startMonth = parseInt(startTime.month.get("value"));
        let startDate = parseInt(startTime.date.get("value"));
        let endYear = parseInt(endTime.year.get("value"));
        let endMonth = parseInt(endTime.month.get("value"));
        let endDate = parseInt(endTime.date.get("value"));

        let prompt = false;
        if(startYear>endYear){
            prompt = true;
        }else if(startYear==endYear){
            if(startMonth>endMonth){
                prompt = true;
            }else if(startMonth==endMonth){
                if(startDate>=endDate){
                    prompt = true;
                }
            }
        }

        this.setState({prompt:Object.assign({}, this.state.prompt, {time:prompt})});
    }

    dateOnChange(id, childId, selectIndex){
        let curNode = this.state[id][childId];
        let curValue = curNode.getIn(["list", selectIndex, "value"]);
        if(childId=="month"){
            let year = this.state[id].year.get("value");
            let days = getDaysByYearMonth(year, curValue);
            console.log(days);
            let date = this.getDatesList(days);
            this.setState({[id]:Object.assign({}, this.state[id], {[childId]:curNode.update("value", v=>curValue)}, {date:Immutable.fromJS({value:1, list:date})})}, this.timeValid)
            return;
        }

        this.setState({[id]:Object.assign({}, this.state[id], {[childId]:curNode.update("value", v=>curValue)})}, this.timeValid);
    }

    checkOnChange(event){
        let index = event.target.id-1;
        this.setState({workTime:this.state.workTime.updateIn([index, 'active'],v=>event.target.checked)}, ()=>{
            this.workTimeValid();
        });
    }

    setLightOnChange(id, selectIndex){
        this.state[id] = this.state[id].update("index", v=>selectIndex);
        this.setState({[id]:this.state[id].update("value",v=>this.state[id].getIn(['list', selectIndex, 'value']))})
    }

    onConfirm() {
        this.props.onConfirm && this.props.onConfirm(this.state);
    }

    onCancel() {
        this.props.onCancel() && this.props.onCancel();
    }

    onClick(){
        const {time, light, strategyList} = this.state;
        let curTime = time;
        let curlight = light.getIn(["list", light.get("index"), "value"]);
        for(let key in strategyList){
            let strategy = strategyList[key];
            if(strategy.time == curTime && strategy.light==curlight){
                return;
            }
        }

        let strategy2 = {time:curTime, light:curlight};
        let newList = this.state.strategyList;
        newList.push(strategy2)
        this.setState({strategyList:newList}, ()=>{
            this.updateChart();
        });
    }

    delStrategy(selectIndex){
        this.state.strategyList.splice(selectIndex, 1);
        let newList = this.state.strategyList;
        this.setState({strategyList:newList}, ()=>{
            this.updateChart();
        });
    }

    updateChart(){
        const {chartId} = this.state;
        if(!chartId) {
            return;
        }

        const {strategyList} = this.state;
        let chartList = strategyList.map(strategy=>{
            return {x:strategy.time, y:strategy.light=="关"||strategy.light=="开"?0:strategy.light}
        })
        if(chartList){
            this.timeStrategy && this.timeStrategy.destory();
            this.timeStrategy = timeStrategy({id:chartId, data:chartList});
        }
    }

    renderChart(ref){
        if(ref){
            this.setState({chartId:ref.id}, ()=>{
                this.updateChart();
            });
        }
    }

    render(){
        const {name, deviceName, startTime, endTime, workTime, time, light, strategyList, prompt} = this.state;
        const {deviceList} = this.props;
        let {titleKey, valueKey, options} = deviceList;
        let valid = prompt.name || !options.length || prompt.workTime || prompt.time;

        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','保存']}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>

        return <div className="time-strategy-popup">
            <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel} footer={footer}>
                <div className="row name-container">
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-3 control-label" htmlFor="name">策略名称：</label>
                            <div className="col-sm-9">
                                <input type="text" className="form-control" id="name" placeholder="输入策略名称"
                                       maxLength={STRATEGY_NAME_LENGTH} value={name} onChange={this.onChange}/>
                                <span className={prompt.name?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>

                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-3 control-label" htmlFor="deviceName">控制设备：</label>
                            <div className="col-sm-9">
                                <select className="form-control" id="deviceName" placeholder="选择设备" value={deviceName} onChange={this.onChange}>
                                    {
                                        options.map(item => <option key={item.id} value={item[valueKey]}>{item[titleKey]}</option>)
                                    }
                                </select>
                                <span className={options.length==0?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row date-range">
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-3 control-label" htmlFor="startTime">日期范围：</label>
                            <div className="col-sm-9">
                                <div className="col-sm-5 select-container">
                                    <Select className="form-control" id="startYear" valueKey="value" titleKey="name" data={startTime.year} onChange={selectIndex=>this.dateOnChange("startTime","year", selectIndex)}/>
                                    <span className={prompt.time?"prompt ":"prompt hidden"}>{"日期错误"}</span>
                                </div>
                                <div className="col-sm-3 select-container">
                                    <Select className="form-control" id="startMonth" valueKey="value" titleKey="name" data={startTime.month} onChange={selectIndex=>this.dateOnChange("startTime", "month", selectIndex)}/>
                                </div>
                                <div className="col-sm-3 select-container last">
                                    <Select className="form-control" id="startDate" valueKey="value" titleKey="name" data={startTime.date} onChange={selectIndex=>this.dateOnChange("startTime", "date", selectIndex)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 date-range">
                        <div className="form-group row">
                            <label className="col-sm-3 control-label" htmlFor="startTime">至：</label>
                            <div className="col-sm-9">
                                <div className="col-sm-5 select-container">
                                    <Select className="form-control" id="endYear" valueKey="value" titleKey="name" data={endTime.year} onChange={selectIndex=>this.dateOnChange("endTime", "year", selectIndex)}/>
                                </div>
                                <div className="col-sm-3 select-container">
                                    <Select className="form-control" id="endMonth" valueKey="value" titleKey="name" data={endTime.month} onChange={selectIndex=>this.dateOnChange("endTime", "month", selectIndex)}/>
                                </div>
                                <div className="col-sm-3 select-container last">
                                    <Select className="form-control" id="endDate" valueKey="value" titleKey="name" data={endTime.date} onChange={selectIndex=>this.dateOnChange("endTime", "date", selectIndex)}/>
                                </div>
                                <span className={false?"prompt ":"prompt hidden"}>{"日期错误"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row work-day">
                    <div className="form-group row">
                        <label className="col-sm-3 control-label" htmlFor="startTime">工作日选择：</label>
                        <div className="col-sm-9">
                            <div className="">
                                {
                                    workTime.map(date=>{
                                        return <label key={date.get('id')} className="checkbox-inline" onChange={this.checkOnChange}>
                                            <input id={date.get('id')} type="checkbox" checked={date.get('active')}
                                            onChange={()=>{}}/>{date.get('name')}</label>
                                    })
                                }
                            </div>
                            <span className={prompt.workTime?"prompt ":"prompt hidden"}>{"请选择工作日"}</span>
                        </div>
                    </div>
                </div>
                <div className="row chart">
                    <div className="form-group row">
                        <label className="col-sm-3 control-label" htmlFor="startTime">图表：</label>
                        <div className="col-sm-9">
                            <div className="time-strategy-chart" id="timeStrategy" ref={this.renderChart}>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row set-light">
                    <div className="form-group row">
                        <label className="col-sm-3 control-label" htmlFor="startTime">设置亮度：</label>
                        <div className="col-sm-9 right">
                            <div className="form-group row">
                                <button className="btn btn-default" onClick={this.onClick}>添加节点</button>
                                <div className="col-sm-4 select-container">
                                    <input className="form-control" id="time" type="time" value={time} onChange={this.onChange}/>
                                </div>
                                <div className="col-sm-4 select-container">
                                    <Select className="form-control" data={light} onChange={selectedIndex=>{this.setLightOnChange("light", selectedIndex)}}></Select>
                                </div>
                            </div>
                            <div className="row list-group">
                                {
                                    strategyList.map((strategy,index)=>{
                                        return <div key={index} className="row">
                                            <span className="col-sm-5 time-point">{strategy.time}</span>
                                            <span className="col-sm-5 light">{strategy.light}</span>
                                            <span className="glyphicon icon icon-delete" onClick={()=>this.delStrategy(index)}></span>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    }
}

// <DatePicker customInput={<CustomDateInput />} dateFormat="MM/DD" selected={startTime} onChange={date=>{this.dateOnChange("startTime", date)}}/>
TimeStrategyPopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        deviceName: PropTypes.string.isRequired
    }).isRequired,
    deviceList: PropTypes.shape({
        titleKey: PropTypes.string.isRequired,
        valueKey: PropTypes.string.isRequired,
        options: PropTypes.array.isRequired
    }).isRequired,
    strategyList: PropTypes.array.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}