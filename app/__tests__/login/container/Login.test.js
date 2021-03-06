import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import Login from '../../../src/login/container/Login';
import configureStore from '../../../src/store/configureStore';
import {loginHandler} from '../../../src/login/action/index';
import {login} from '../../../src/util/network';

const store = configureStore();
describe('<Login />',() => {
    const login = mount(<Provider store={store}>
        <IntlProvider>
            <Login />
        </IntlProvider>
    </Provider>);

    it('input change',() =>{
        let username = login.find('#username');
        expect(username.prop('value')).toBe('');
        username.simulate('change',{target:{value:'a'}});
        username = login.find('input').at(0);
        expect(username.prop('value')).toBe('a');

        let password = login.find('#password');
        expect(password.prop('value')).toBe('');
        password.simulate('change',{target:{value:'b'}});
        password = login.find('input').at(1);
        expect(password.prop('value')).toBe('b');

    })

    it('renderer',() =>{
        expect(login.find('.container-login').length).toBe(1);
    })

    it('snapshot', () => {
        const cmp = renderer.create(<Provider store={store}>
            <IntlProvider>
                <Login />
            </IntlProvider>
        </Provider>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    // it('loginHandler ',()=>{
    //     const fn = jest.fn();
    //     loginHandler('','',fn)();
    //     expect(fn).toHaveBeenCalledTimes(1);
    // })

})