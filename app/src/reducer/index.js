
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import test from './test';
import course from './course';
import app from '../App/reducer/index';

import login from '../login/reducer/index'
const reducer = combineReducers({
    routing,
    course,
    test,

    login,
    app
});
export default reducer;
