/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import { NameValid,numbersValid } from '../../util/index';
export default class PlayerScene extends PureComponent{
    constructor(props){
        super(props);
        const {sceneName, playMode, playModeCount} = props;
        this.state = {
            property: {
                //场景名称
                sceneName: { key: "assetName", title: "素材名称", placeholder: '素材名称', defaultValue:sceneName?sceneName:"", value: sceneName?sceneName:"" },
                playMode: { key: "playMode", title: "播放方式", list: [{ id: 1, name: "按次播放" }, { id: 2, name: "按时长播放" }, { id: 3, name: "循环播放" }], defaultIndex: 0, index: 0, name: "按次播放" },
                playModeCount: { key: "playModeCount", title: "播放次数", placeholder: '次', defaultValue: playModeCount?playModeCount:"", value: playModeCount?playModeCount:"", active: true }
            },
            prompt: {
                //场景
                sceneName: sceneName?false:true, /*playMode: playMode?false:true,*/ playModeCount: playModeCount?false:true,
            }
        }

        this.onChange = this.onChange.bind(this);
        this.playerSceneClick = this.playerSceneClick.bind(this);
        this.updatePlayMode = this.updatePlayMode.bind(this);
    }

    componentWillMount(){
        const {playMode} = this.props;
        this.updatePlayMode(playMode);
    }

    updatePlayMode(playMode){
        const playModeList = this.state.property.playMode.list;
        if(playMode != undefined && playMode>-1 && playMode<playModeList.length){
            this.state.property.playMode.defaultIndex = playMode;
            this.state.property.playMode.index = playMode;
            this.state.property.playMode.name = playModeList[playMode].name
            if(playMode==2){
                this.state.property.playModeCount.active = false;
            }else{
                this.state.property.playModeCount.active = true;
            }
            this.setState({property:Object.assign({}, this.state.property)})
        }
    }

    playerSceneClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                for(let key in this.state.property){
                    if(key == "playMode"){
                        this.updatePlayMode(this.state.property[key].defaultIndex);
                    }
                    const defaultValue = this.state.property[key].defaultValue;
                    this.state.property[key].value = defaultValue;
                }

                for(let key in this.state.prompt){
                    const defaultValue2 = this.state.property[key].defaultValue;
                    this.state.prompt[key] = defaultValue2?false:true;
                }
                this.setState({property: Object.assign({}, this.state.property)});
                break;
        }
    }

    onChange(id, value) {
        console.log("id:", id);
        if( id == "playMode"){
            const curIndex = value.target.selectedIndex;
            console.log("correct", curIndex);
            let title = "播放次数";
            let placeholder = '次';
            let active = true;
            let updateId = (id == "playMode") ? "playModeCount" : "timingPlayModeCount";
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
            if(id == "sceneName"){
                if (!NameValid(val)) {
                    prompt = true;
                }
            }else{
                if(!numbersValid(val)){
                    prompt = true;
                }
            }

            this.setState({
                property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
                prompt: Object.assign({}, this.state.prompt, { [id]: prompt })
            })
        }
    }

    render(){
        const {property, prompt} = this.state;
        return <div className={"pro-container playerScene "}>
            <div className="row">
                <div className="form-group  scene-name">
                    <label className="control-label"
                           htmlFor={property.sceneName.key}>{property.sceneName.title}</label>
                    <div className="input-container">
                        <input type="text" className={"form-control "}
                               placeholder={property.sceneName.placeholder} maxLength="8"
                               value={property.sceneName.value}
                               onChange={event => this.onChange("sceneName", event)} />
                        <span className={prompt.sceneName ? "prompt " : "prompt hidden"}>{"请输入名称"}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group">
                    <label className="control-label"
                           htmlFor={property.playMode.key}>{property.playMode.title}</label>
                    <div className="input-container">
                        <select className={"form-control"} value={property.playMode.name} onChange={event => this.onChange("playMode", event)}>
                            {
                                property.playMode.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                        {/*<span className={prompt.playMode?"prompt ": "prompt hidden"}>{"请输入正确参数"}</span>*/}
                    </div>
                </div>
                <div className={"form-group " + (property.playModeCount.active ? '' : 'hidden')}>
                    <label className="control-label">{property.playModeCount.title}</label>
                    <div className={"input-container "}>
                        <input type="text" className={"form-control "} htmlFor={property.playModeCount.key} placeholder={property.playModeCount.placeholder} maxLength="8"
                               value={property.playModeCount.value} onChange={event => this.onChange("playModeCount", event)} />
                        <span className={prompt.playModeCount ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.playerSceneClick('apply') }}>应用</button>
                <button className="btn btn-gray pull-right" onClick={() => { this.playerSceneClick('reset') }}>重置</button>
            </div>
        </div>
    }
}
