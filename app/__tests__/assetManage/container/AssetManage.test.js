/**
 * Created by a on 2017/7/21.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import {AssetManage} from '../../../src/assetManage/container/AssetManage';


test('AssetManage renders', ()=>{
    const component = renderer.create(
        <AssetManage />
    )

    let assetManage = component.toJSON();
    expect(assetManage).toMatchSnapshot();
})

test('AssetManage div click', ()=>{
    const component = shallow(<AssetManage />)
    expect(component.find('.property').length).toEqual(1);
    expect(component.find('.type').length).toEqual(1);
})
