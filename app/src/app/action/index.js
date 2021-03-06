/**
 * Created by a on 2017/8/10.
 */
import {getHttpHeader, getModuleConfig} from '../../util/network'
import {getCookie} from '../../util/cache'
import {
    MODULE_INIT
} from '../actionType/index'
export function getModule(cb) {
  return dispatch=>{
    let user = getCookie("user");
    getModuleConfig(user, response=>{
      dispatch({type:MODULE_INIT, data:response});
      cb && cb();
    }, err=>{
       throw (err);
   })
  }
}
