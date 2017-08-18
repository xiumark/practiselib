/**
 * Created by a on 2017/7/26.
 */
import {USERCENTER_POPUP_CONFIRM_LOGIN} from '../common/actionTypes/userCenter';
import {LOGED_IN} from '../authentication/actionTypes'
import {login} from '../util/network';
import {setCookie} from '../util/cache'
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network'

export const loginHandler = (username, password,cbSuccess,cbFail) => dispatch => {
    if(username.length <= 2 || password.length <= 4){
        cbFail && cbFail();
        return;
    }

    login({username:username, password:password}, response=>{
        let headers = getHttpHeader();
        httpRequest(`${HOST_IP}/users/${response.userId}`, {
            method: 'GET',
            headers: headers,
          }, res=>{
            response.roleId = res.roleId;
            setCookie("user", response);
            dispatch({ type: LOGED_IN });
            cbSuccess && cbSuccess();
          })
        
    }, err=>{
        cbFail && cbFail();
    })

}