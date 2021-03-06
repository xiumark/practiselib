import React, {Component} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import Select from '../../components/Select.1';
import LineChart from './LineChart';
import PropTypes from 'prop-types';
import {NameValid, numbersValid} from '../../util/index';
import {IsExistInArray1} from '../../util/algorithm';
import {addStrategy, updateStrategy} from '../../api/strategy';
import {getModelSummariesByModelID} from '../../api/asset';
import NotifyPopup from '../../common/containers/NotifyPopup';

export default class SensorStrategyPopup extends Component {
    constructor(props) {
        super(props);
        const {data: {id, strategyName="", sensorType='', controlDevice='lc', screenSwitch='off', sensorParam='', brightness='off', sensorParamsList=[]}, controlDeviceList, brightnessList} = this.props;
        this.state = {
            data: {
                id,
                strategyName,
                sensorType,
                controlDevice,
                screenSwitch,
                sensorParam,
                brightness
            },
            controlDeviceList,
            brightnessList,
            screenSwitchList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {value: 'on', title: this.formatIntl('app.open')},
                    {value: 'off', title: this.formatIntl('app.close')}
                ]
            },
            sensorParamsList: sensorParamsList,
            checkStatus: {
                strategyName: false,
                sensorType: false,
                controlDevice: false,
                sensorParam: true,
                brightness: false,
                screenSwitch: false
            }
        };

        this.sensorTransform = {
            SENSOR_NOISE: 'noise',
            SENSOR_PM25: 'PM25',
            SENSOR_PA: 'pa',
            SENSOR_HUMIS: 'humis',
            SENSOR_TEMPS: 'temps',
            SENSOR_WINDS: 'windSpeed',
            SENSOR_WINDDIR: 'windDir',
            SENSOR_CO: 'co',
            SENSOR_O2: 'o2',
            SENSOR_CH4: 'ch4',
            SENSOR_CH2O: 'ch2o'
        }

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.sensorParamDelete = this.sensorParamDelete.bind(this);
        this.addSensorParam = this.addSensorParam.bind(this);

        this.addStrategy = this.addStrategy.bind(this);
        this.updateStrategy = this.updateStrategy.bind(this);
        this.formatIntl = this.formatIntl.bind(this);
    }

    formatIntl(formatId){
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
        // return formatId;
    }

    onChange(e) {
        const {popupId} = this.props;
        const {id, value} = e.target;
        if((id == 'screenSwitch' || id == 'sensorType' || id == 'brightness') && value === '' ) {
            this.setState({checkStatus: Object.assign({}, this.state.checkStatus, {[id]: true})});
            return ;
        }
        switch(id) {
            case 'strategyName':
                let strategyNameStatus = !NameValid(value);
                this.setState({
                    data: Object.assign({}, this.state.data, {strategyName: value}),
                    checkStatus: Object.assign({}, this.state.checkStatus, {strategyName: strategyNameStatus})
                });
                break;
            case 'sensorType':
            case 'controlDevice':
                this.setState({data: Object.assign({}, this.state.data, {[id]: value, sensorParam: '' })});
                popupId == 'add' && this.setState({sensorParamsList: []});
                break;
            case 'sensorParam':
                let val = value;
                let sensorParamStatus = false;
                if ( !numbersValid(value) || IsExistInArray1( this.state.sensorParamsList, d => d.condition[ this.sensorTransform[this.state.data.sensorType] ], val ) ) {
                    sensorParamStatus = true;
                }
                this.setState({
                    data: Object.assign({}, this.state.data, {sensorParam: val}),
                    checkStatus: Object.assign({}, this.state.checkStatus, {sensorParam: sensorParamStatus})
                });
                break;
            case 'screenSwitch':
            case 'brightness':
                this.setState({data: Object.assign({}, this.state.data, {[id]: value})});
                break;
        }
    }

    sensorParamDelete(e) {
        const index = e.target.id;
        let sensorParamsList = Object.assign([], this.state.sensorParamsList);
        sensorParamsList.splice(index,1);
        this.setState({sensorParamsList});
    }

    addSensorParam() {
        const {sensorParam, brightness, screenSwitch, controlDevice, sensorType} = this.state.data;
        let value = '';
        let title = '';
        if(controlDevice=='lc') {
            value = brightness;
            if(value == 'off') {
                title = this.formatIntl('app.close');
            } else {
                title = `${this.formatIntl('app.brightness')}' '${value}`;
            }
        } else {
            value = screenSwitch;
            title = value == 'off'?this.formatIntl('app.close'):this.formatIntl('app.open');
        }
        const data = {value: value, title: title};
        let sensorParamsList = Object.assign([], this.state.sensorParamsList);
        sensorParamsList.push({condition: {[ this.sensorTransform[sensorType] ]: sensorParam}, rpc: data});
        this.setState({sensorParamsList, data: Object.assign({}, this.state.data, {sensorParam: ''}), checkStatus: Object.assign({}, this.state.checkStatus, {sensorParam: true})});
    }

    onCancel() {
        this.props.overlayerHide && this.props.overlayerHide();
    }

    onConfirm() {
        const {data: {strategyName}, sensorParamsList} = this.state;
        const {addNotify} = this.props;
        const notifyText = {
            strategyName: this.formatIntl('sysOperation.strategy.alert'),
            sensorParamsList: this.formatIntl('sysOperation.set.param')
        }
        if(strategyName === '') {
            addNotify(0, notifyText.strategyName);
            return ;
        }
        if(sensorParamsList.length == 0) {
            addNotify(0, notifyText.sensorParamsList);
            return ;
        }
        if(this.props.popupId == 'add') {
            this.addStrategy();
        } else {
            this.updateStrategy();
        }
    }

    updateStrategy() {
        const {data,sensorParamsList} = this.state;
        let _data = {
            id: data.id,
            name: data.strategyName,
            type: 'sensor',
            asset: data.controlDevice,
            expire : {
              expireRange: [],
              executionRange: [],
              week: 0,
            },
            strategy: sensorParamsList
        };
        updateStrategy(_data, ()=>{
            this.props.updateSensorStrategyList();
        });
        this.props.overlayerHide && this.props.overlayerHide();
    }

    addStrategy() {
        const {data,sensorParamsList} = this.state;
        let _data = {
            name: data.strategyName,
            type: 'sensor',
            asset: data.controlDevice,
            expire : {
              expireRange: [],
              executionRange: [],
              week: 0,
            },
            strategy: sensorParamsList
        };
        addStrategy(_data, ()=>{
            this.props.updateSensorStrategyList();
        });
        this.props.overlayerHide && this.props.overlayerHide();
    }

    render() {
        const {controlDeviceList, screenSwitchList, brightnessList, sensorParamsList, data, data: {strategyName, sensorType, controlDevice, screenSwitch, sensorParam, brightness}, checkStatus} = this.state;
        const {sensorTypeList, sensorsProps, popupId} = this.props;
        const {className, title} = this.props;
        const footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']}
                                  btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]}
                                  onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title={title} footer={footer} closeBtn={true} closeClick={this.onCancel}>
                <div className="form-group">
                    <label htmlFor="strategyName" className="control-label">{this.formatIntl('app.strategy.name')}</label>
                    <div className="form-group-right">
                        <input type="text" className="form-control" id="strategyName" placeholder={this.formatIntl('app.sensor.strategy')} value={strategyName}
                            onChange={this.onChange}/>
                        <span style={{visibility: checkStatus.strategyName ? 'visible' : 'hidden'}}>{this.formatIntl('mediaPublish.prompt')}</span>
                    </div>
                </div>
                <div className="inline-group">
                    <div className="form-group">
                        <label htmlFor="sensorType" className="control-label">{this.formatIntl('app.sensor.type')}</label>
                        <div className="form-group-right">
                            <Select id="sensorType" className="form-control" titleField={sensorTypeList.titleField}
                                    valueField={sensorTypeList.valueField} options={sensorTypeList.options} value={sensorType}
                                    onChange={this.onChange} disabled={popupId=='add' ? false : true}/>
                            <span style={{visibility: checkStatus.sensorType ? 'visible' : 'hidden'}}>{this.formatIntl('sysOperation.select.sensor')}</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="controlDevice" className="control-label">{this.formatIntl('app.control.device')}</label>
                        <div className="form-group-right">
                            <Select id="controlDevice" className="form-control" titleField={controlDeviceList.titleField}
                                    valueField={controlDeviceList.valueField} options={controlDeviceList.options} value={controlDevice}
                                    onChange={this.onChange} disabled={popupId=='add' ? false : true}/>
                            <span style={{visibility: checkStatus.controlDevice ? 'visible' : 'hidden'}}>{this.formatIntl('sysOperation.select.device')}</span>
                        </div>
                    </div>
                </div>
                <div className="form-group chart">
                    <label className="control-label">{this.formatIntl('app.chart')}</label>
                    <LineChart sensorParamsList={sensorParamsList} data={data} sensorsProps={sensorsProps} sensorTransform={this.sensorTransform}/>
                </div>
                <div className="form-group">
                    <label className="control-label">{this.formatIntl('app.set.param')}</label>
                    <div className="form-group-right lightness">
                        <button className="btn btn-primary" onClick={this.addSensorParam} disabled={checkStatus.sensorParam}>{this.formatIntl('app.add.node')}</button>
                        <div className="lightness-right">
                            <div>
                                <input id="sensorParam" type='text' className='form-control' placeholder={this.formatIntl('app.sensor.input.placeholder')} value={sensorParam} onChange={this.onChange}/>
                                {
                                    controlDevice != 'lc' ?
                                    <Select id="screenSwitch" className="form-control" titleField={screenSwitchList.titleField}
                                        valueField={screenSwitchList.valueField} options={screenSwitchList.options} value={screenSwitch}
                                        onChange={this.onChange}/>
                                    :
                                    <Select id="brightness" className="form-control" titleField={brightnessList.titleField}
                                        valueField={brightnessList.valueField} options={brightnessList.options} value={brightness}
                                        onChange={this.onChange}/>
                                }
                            </div>
                            <ul>
                            {
                                sensorParamsList.map((item, index) => <li key={index}><span className="sensor-param">{`${item.condition[ this.sensorTransform[sensorType] ]} ${sensorsProps[sensorType]?sensorsProps[sensorType].unit:''}`}</span><span className="sensor-other">{item.rpc.title}</span><span id={index} className="glyphicon glyphicon-trash" onClick={this.sensorParamDelete}></span></li>)
                            }
                            </ul>
                        </div>
                    </div>
                </div>
                <NotifyPopup />
            </Panel>
        )
    }
}
