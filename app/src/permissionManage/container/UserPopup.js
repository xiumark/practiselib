import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import '../../../public/styles/permissionManage.less';
import InputCheck from '../../components/InputCheck';
import Select from '../../components/Select';
import Immutable from 'immutable';
import {PassWordValid} from '../../util/index';
import {IsExitInArray} from '../../util/algorithm';
import {FormattedMessage} from 'react-intl';

export default class UserPopup extends Component{
    constructor(props){
        super(props);
        const {data,isEdit=false} = this.props;
        this.state={
            id:isEdit?data.id:'',
            username:Immutable.fromJS({value:isEdit?data.username:'',checked:'',reminder:''}),
            lastName:Immutable.fromJS({value:isEdit?data.lastName:'',checked:'',reminder:''}),
            firstName:Immutable.fromJS({value:isEdit?data.firstName:'',checked:'',reminder:''}),
            password:Immutable.fromJS({value:'',checked:'',reminder:''}),
            rePassword:Immutable.fromJS({value:'',checked:'',reminder:''}),
            role:Immutable.fromJS({list:[{id:4, value:this.props.intl.formatMessage({id:'permission.guest'})},{id:3, value:this.props.intl.formatMessage({id:'permission.deviceOperator'})},{id:2, value:this.props.intl.formatMessage({id:'permission.deviceAdmin'})},{id:1, value:this.props.intl.formatMessage({id:'permission.admin'})}], index:isEdit?data.roleId.index:0, value:isEdit?data.roleId.value:this.props.intl.formatMessage({id:'permission.guest'})}),
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.roleChange = this.roleChange.bind(this);
        this.checkOut = this.checkOut.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    onCancel(){
        this.props.overlayerHide();
    }

    onConfirm(){
        const {id,username,lastName,firstName,password,rePassword,role} = this.state;
        const datas = this.props.isEdit?{
            id:id,
            lastName:lastName.get('value'),
            firstName:firstName.get('value'),
            roleId:role.getIn(['list',role.get('index'),'id'])
        }:{
            username:username.get('value'),
            password:password.get('value'),
            lastName:lastName.get('value'),
            firstName:firstName.get('value'),
            roleId:role.getIn(['list',role.get('index'),'id'])
        }
        this.props.onConfirm(datas,this.props.isEdit);
        this.props.overlayerHide();
    }

    roleChange(selectIndex){
        let role = this.state.role.update('index', v=>selectIndex).update('value', () => this.state.role.getIn(['list', selectIndex, 'value']));
        this.setState({role: role})
    }

    checkOut(id){
        switch(id){
            case 'username':
            case 'lastName':
            case 'firstName':
                break;
            case 'password':
                PassWordValid(this.state.password.get('value'))?
                    this.setState({password:this.state.password.update('checked',v=>'success')})
                :
                    this.setState({password:this.state.password.update(v=>{
                        return v.set('checked','fail')
                                .set('reminder','密码只能为字母或数字')})})
                
                break;
            case 'rePassword':
                if(this.state.password.get('value')!==this.state.rePassword.get('value')){
                    this.setState({rePassword:this.state.rePassword.update(v=>{
                        return v.set('checked','fail')
                                .set('reminder','两次密码不一致')})})
                }
                else{
                    this.setState({rePassword:this.state.rePassword.update('checked',v=>'success')})
                }
                
        }
    }

    onFocus(id){
        this.setState({[id]:this.state[id].update(v=>{
                        return v.set('checked','')
                                .set('reminder','')})});
    }

    onChange(e){
        this.setState({[e.target.id]:this.state[e.target.id].update('value',v=>e.target.value)});
    }

    render() {
        let {className = '',title = '',isEdit=false} = this.props;
        let {username,lastName,firstName,password,rePassword,toggle,domainList} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className = 'form-group row basic-info'>
                    <InputCheck label='permission.username' id='username' value= {username.get('value')} disabled={isEdit?true:false}
                        checked={username.get('checked')} reminder={username.get('reminder')} onBlur = {this.checkOut} onFocus={this.onFocus} onChange = {this.onChange}/>
                    <div className="inputCheck">
                        <label className="control-label"><FormattedMessage id='permission.grade'/>:</label>
                        <div className="has-feedback">
                            <Select className="role" data={this.state.role}
                                onChange={this.roleChange}/>
                            <span className="glyphicon  form-control-feedback" aria-hidden="true"></span><span className="reminder"></span>
                        </div>
                    </div>
                    <InputCheck label='permission.lastname' id='lastName' value= {lastName.get('value')}
                        checked={lastName.get('checked')} reminder={lastName.get('reminder')} onBlur = {this.checkOut} onFocus={this.onFocus} onChange = {this.onChange}/>
                    <InputCheck label='permission.firstname' id='firstName' value= {firstName.get('value')}
                        checked={firstName.get('checked')} reminder={firstName.get('reminder')} onBlur = {this.checkOut} onFocus={this.onFocus} onChange = {this.onChange}/>
                    <InputCheck label='permission.password' className={`${isEdit?'hidden':''}`} id='password' type='password' value= {password.get('value')} 
                        checked={password.get('checked')} reminder={password.get('reminder')} onBlur = {this.checkOut} onFocus={this.onFocus} onChange = {this.onChange}/>
                    <InputCheck label='permission.repassword' className={`${isEdit?'hidden':''}`} id='rePassword' type='password' value= {rePassword.get('value')} 
                        checked={rePassword.get('checked')} reminder={rePassword.get('reminder')} onBlur = {this.checkOut} onFocus={this.onFocus} onChange = {this.onChange}/>
                </div>
            </Panel>
        )
    }
}