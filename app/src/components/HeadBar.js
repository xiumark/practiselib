/**
 * Created by a on 2017/7/4.
 */
import React, { Component } from 'react'
import UserCenter from '../common/containers/UserCenter'

import {history} from '../root/index'
export default class HeadBar extends Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(event){
        history.push('/');
    }

    render(){
        const {moduleName} = this.props
        return <div className="head">
            <div className="home" onClick={this.onClick}>
                <span className="icon"></span>
            </div>
            <span className="title">{moduleName}</span>
            <UserCenter />
        </div>
    }
}


// <div className="avatar">
//     <span className="icon"></span>
//     </div>