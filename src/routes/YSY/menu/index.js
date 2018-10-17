import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
// import { connect } from 'dva';
import YSYPlatform from './ysy';
import Refine from './refine';

const TabPane = Tabs.TabPane;


class MenuMgt extends PureComponent{
  render(){
    return (
        <div style={{ padding: '0 16px',backgroundColor:'#fff' }}>
          <Tabs defaultActiveKey={'2'}>
            <TabPane tab="医商云" key="1" disabled>
              <YSYPlatform />
            </TabPane>
            <TabPane tab="精细化平台" key="2" >
              <Refine  />
            </TabPane>
          </Tabs>
        </div>
    )
  }
}
export default MenuMgt;