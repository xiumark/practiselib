/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import 'antd/lib/date-picker/style';
import 'antd/lib/checkbox/style';
import { DatePicker, Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

import moment from 'moment'

import { momentDateFormat, dateStrReplaceZh } from '../../util/time';
import { weekReplace } from '../util/index';

import { NameValid } from '../../util/index';
export default class TimingPlan extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            property: {
                //定时插播计划
                timingName: { key: "timingName", title: "计划名称", placeholder: '请输入名称', value: "" },
                timingList: {
                    key: "timingList", title: "定时插播",
                    list: [{ id: 1, startTime: moment(), startDate: moment(), endDate: moment(), appointDate: false, week: [1, 2, 5] },
                        { id: 2, startTime: moment(), startDate: moment(), endDate: moment(), appointDate: false, week: [2, 4, 6] },],
                    index: 0, id: 1,
                    sort: { list: [{ id: 1, name: "时间排序" }, { id: 2, name: "日期排序" }], index: 0, name: "时间排序" },
                },
                timingPlayMode: { key: "timingPlayMode", title: "播放方式", list: [{ id: 1, name: "按次播放" }, { id: 2, name: "按时长播放" }, { id: 3, name: "循环播放" }], index: 0, name: "按次播放" },
                timingPlayModeCount: { key: "timingPlayModeCount", title: "播放次数", placeholder: '次', value: "", active: true },
                timingPause: { key: "timingPause", title: "暂停标志", list: [{ id: '1', name: '暂停' }, { id: '2', name: '不暂停' }], index: 0, name: "暂停" },

            },
            prompt: {
                //定时插播计划
                timingName: true, timingPlayModeCount: true
            }
        }

        this.onChange = this.onChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.timingPlanSelect = this.timingPlanSelect.bind(this);
        this.timingPlanClick = this.timingPlanClick.bind(this);
    }

    timingPlanClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                break;
            case "sort-add":
                const data = {
                    startTime: moment(),
                    startDate: moment(),
                    endDate: moment(),
                    week: []
                }
                this.props.updateTimingPlanPopup(data);
                break;
            case "sort-edit":
                const data2 = {
                    startTime: moment(),
                    startDate: moment(),
                    endDate: moment(),
                    week: [1, 0, 1, 0, 1, 1, 1]
                }
                this.props.updateTimingPlanPopup(data2);
                break;
            case "sort-remove":
                break;
        }

    }

    timingPlanSelect(item) {
        this.setState({ property: Object.assign({}, this.state.property, { timingList: Object.assign({}, this.state.property.timingList, { id: item.id }) }) });
    }

    dateChange(id, value) {
        if (id == "week" || id == "cycleWeek") {
            console.log(value);
            this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }) });
        } else {
            this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }) });
        }
    }

    onChange(id, value) {
        console.log("id:", id);
        if(id == "timingPause"){
            const curIndex = value.target.selectedIndex;
            this.setState({
                property: Object.assign({}, this.state.property, {
                    [id]: Object.assign({}, this.state.property[id], {
                        index: curIndex,
                        name: this.state.property[id].list[curIndex].name
                    })
                })
            })
        }else if(id == "timingList-sort"){
            const curIndex = value.target.selectedIndex;
            this.setState({
                property: Object.assign({}, this.state.property,
                    {
                        timingList: Object.assign({}, this.state.property.timingList,
                            { sort: Object.assign({}, this.state.property.timingList.sort, { index: curIndex, name: this.state.property.timingList.sort.list[curIndex].name }) })
                    })
            })
        }else if(id == "timingPlayMode"){
            const curIndex = value.target.selectedIndex;
            console.log("correct", curIndex);
            let title = "播放次数";
            let placeholder = '次';
            let active = true;
            let updateId =  "timingPlayModeCount";
            switch (curIndex) {
                case 0:
                    title = "播放次数";
                    placeholder = "次";
                    break;
                case 1:
                    title = "播放时长";
                    placeholder = "秒";
                    break;
                case 2:
                    active = false;
                    break;
            }
            this.setState({
                property: Object.assign({}, this.state.property,

                    { [id]: Object.assign({}, this.state.property[id], { index: curIndex, name: this.state.property[id].list[curIndex].name }) },
                    { [updateId]: Object.assign({}, this.state.property[updateId], { title: title, placeholder: placeholder, active: active }) })
            })
        }else{
            let prompt = false;

            const val = value.target.value;
            if (!NameValid(val)) {
                prompt = true;
            }

            this.setState({
                property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
                prompt: Object.assign({}, this.state.prompt, { [id]: prompt })
            })
        }
    }

    render(){
        const {property, prompt} = this.state;
        return <div className={"pro-container timingPlan "}>
            <div className="row">
                <div className="form-group timing-name">
                    <label className="control-label"
                           htmlFor={property.timingName.key}>{property.timingName.title}</label>
                    <div className="input-container">
                        <input type="text" className="form-control" placeholder={property.timingName.placeholder} value={property.timingName.value} onChange={event => this.onChange("timingName", event)} />
                        <span className={prompt.timingName ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group timing-list">
                    <label className="control-label"
                           htmlFor={property.timingList.key}>{property.timingList.title}</label>
                    <div className="input-container">
                        <div className="edit-head">
                            <select value={property.timingList.sort.name} onChange={event => this.onChange("timingList-sort", event)}>
                                {
                                    property.timingList.sort.list.map((option, index) => {
                                        let value = option.name;
                                        return <option key={index} value={value}>
                                            {value}
                                        </option>
                                    })}
                            </select>
                            <button className="btn btn-primary timing-sort-add" onClick={() => { this.timingPlanClick('sort-add') }}>添加</button>
                            <button className="btn btn-gray timing-sort-edit" onClick={() => { this.timingPlanClick('sort-edit') }}>编辑</button>
                        </div>
                        <div className="edit-body">
                            <ul>
                                {
                                    property.timingList.list.map(item => {
                                        let dateStr = dateStrReplaceZh(momentDateFormat(item.startDate, "YYYY-MM-DD")) + ' 至 ' + dateStrReplaceZh(momentDateFormat(item.endDate, "YYYY-MM-DD"));
                                        let weekStr = weekReplace(item.week);
                                        return <li key={item.id} onClick={() => this.timingPlanSelect(item)}>
                                            <div className={"background " + (property.timingList.id == item.id ? '' : 'hidden')}></div>
                                            {'[' + momentDateFormat(item.startTime, 'HH:mm') + ']'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'[' + dateStr + ']'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'[' + weekStr + ']'}
                                            <span className="icon icon-delete pull-right" onClick={() => this.timingPlanClick('sort-remove')}></span>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group">
                    <label className="control-label"
                           htmlFor={property.timingPlayMode.key}>{property.timingPlayMode.title}</label>
                    <div className="input-container">
                        <select className={"form-control"} value={property.timingPlayMode.name} onChange={event => this.onChange("timingPlayMode", event)}>
                            {
                                property.timingPlayMode.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                        {/*<span className={prompt.playMode?"prompt ": "prompt hidden"}>{"请输入正确参数"}</span>*/}
                    </div>
                </div>
                <div className={"form-group " + (property.timingPlayModeCount.active ? '' : 'hidden')}>
                    <label className="control-label">{property.timingPlayModeCount.title}</label>
                    <div className={"input-container "}>
                        <input type="text" className={"form-control "} htmlFor={property.timingPlayModeCount.key} placeholder={property.timingPlayModeCount.placeholder} maxLength="8"
                               value={property.timingPlayModeCount.value} onChange={event => this.onChange("timingPlayModeCount", event)} />
                        <span className={prompt.timingPlayModeCount ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group timing-pause">
                    <label className="control-label"
                           htmlFor={property.timingPause.key}>{property.timingPause.title}</label>
                    <div className="input-container">
                        <select className={"form-control"} value={property.timingPause.name} onChange={event => this.onChange("timingPause", event)}>
                            {
                                property.timingPause.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                        {/*<span className={prompt.cyclePause?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>*/}
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.timingPlanClick('apply') }}>应用</button>
                <button className="btn btn-gray pull-right" onClick={() => { this.timingPlanClick('reset') }}>重置</button>
            </div>
        </div>
    }
}