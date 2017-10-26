import React, { Component } from 'react'
import Text from './materialText'
import Media from './materialMedia'

import { Modal ,Tabs} from 'antd';

import '../../../public/styles/mediaPublish-modal.css'
// import 'antd/lib/style/index.css'

const TabPane=Tabs.TabPane;

export default class Material extends Component {
    state = { visible: this.props.showModal }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
        this.props.hideModal()
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
        this.props.hideModal()
    }
    render() {
        return (
            <div>
                <Modal title="添加素材" visible={this.state.visible}
                    onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Tabs  defaultActiveKey="2">
                        <TabPane tab="插件" key="1">
                        </TabPane>
                        <TabPane tab="文字" key="2">
                            <Text/>
                        </TabPane>
                        <TabPane tab="图片/视频" key="3">
                            <Media/>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        );
    }
}
