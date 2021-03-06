import React from 'react';
import common from './Common';
import Select from '../../components/Select.1';
import { injectIntl } from 'react-intl';
import { getLightLevelConfig } from '../../util/network';
import { updateAssetsRpcById } from '../../api/asset';
import { message } from 'antd';

import columns from '../TableData/ssslcTable.json';
class DeviceOperation extends React.Component {
  state = {
    currentSwitchStatus: 'on',
    deviceSwitchList: {
      titleField: 'title',
      valueField: 'value',
      options: [
        {
          value: 'on',
          title: this.props.intl.formatMessage({ id: 'lightManage.list.on' })
        },
        {
          value: 'off',
          title: this.props.intl.formatMessage({ id: 'lightManage.list.off' })
        }
      ]
    },
    currentBrightness: 0,
    brightnessList: {
      titleField: 'title',
      valueField: 'value',
      options: []
    }
  };
  componentDidMount() {
    this._isMounted = true;
    if(this.props.currentDevice!==''&&this.props.currentDevice.switchStatus&&this.props.currentDevice.brightness!==undefined){
      this.setState({currentSwitchStatus:this.props.currentDevice.switchStatus,currentBrightness:this.props.currentDevice.brightness})
    }
    getLightLevelConfig(this.updateBrightnessList);
  }
  onChange = e => {
    const { id, value } = e.target;
    switch (id) {
      case 'deviceSwitch':
        this.setState({ currentSwitchStatus: value });
        break;
      case 'dimming':
        this.setState({ currentBrightness: value });
        break;
    }
  };
  updateBrightnessList = data => {
    if (!this._isMounted||!data.length) {
      return;
    }
    const options=[];
    data.shift(); // 删除第一项'关'
    data.forEach(item=>{
      options.push({value:item,title:`${item}`})
    })
    this.setState({brightnessList:{...this.state.brightnessList,options}})
  };
  switchApply = () => {
    const { id } = this.props.currentDevice;
    const { currentSwitchStatus } = this.state;
    let status;
    if(currentSwitchStatus==='on'){
      status=1
    }else if(currentSwitchStatus==='off'){
      status=0
    }
    updateAssetsRpcById(id,'device-sensor:switch-status', [{index:0,status}], res => {
      if (res.success) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    });
  };
  dimmingApply = () => {
    const { id } = this.props.currentDevice;
    const { currentBrightness } = this.state;
    updateAssetsRpcById(id,'device-sensor:dim-level', [{index:0,level:currentBrightness}], res => {
      if (res.success) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    });
  };
  componentWillReceiveProps(nextProps){
    // 伪代码， 对照api接口修改字段即可
    if(nextProps.currentDevice!==''&&nextProps.currentDevice.switchStatus!==undefined&&nextProps.currentDevice.brightness!==undefined){
      this.setState({currentSwitchStatus:nextProps.currentDevice.switchStatus,currentBrightness:nextProps.currentDevice.brightness})
    }
  }
  render() {
    const { disabled } = this.props;
    const { formatMessage } = this.props.intl;
    const {
      currentSwitchStatus,
      deviceSwitchList,
      currentBrightness,
      brightnessList
    } = this.state;
    return (
      <div>
        <div className="device-switch">
          <span className="tit">
            {formatMessage({ id: 'lightManage.list.switch' })}：
          </span>
          <Select
            id="deviceSwitch"
            titleField={deviceSwitchList.titleField}
            valueField={deviceSwitchList.valueField}
            options={deviceSwitchList.options}
            value={currentSwitchStatus}
            onChange={this.onChange}
            disabled={disabled}
          />
          <button
            className="btn btn-primary"
            disabled={disabled}
            onClick={this.switchApply}
          >
            {formatMessage({ id: 'lightManage.list.apply' })}
          </button>
        </div>
        <div>
          <span className="tit">
            {formatMessage({ id: 'lightManage.list.dimming' })}：
          </span>
          <Select
            id="dimming"
            titleField={brightnessList.titleField}
            valueField={brightnessList.valueField}
            options={brightnessList.options}
            value={currentBrightness}
            onChange={this.onChange}
            disabled={disabled}
          />
          <button
            className="btn btn-primary"
            disabled={disabled}
            onClick={this.dimmingApply}
          >
            {formatMessage({ id: 'lightManage.list.apply' })}
          </button>
        </div>
      </div>
    );
  }
}

export default common(injectIntl(DeviceOperation));
