import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import YSYConfig from './ysyPlate';
import JXHPlate from './jxhPlate';

const TabPane = Tabs.TabPane;


class SubSystemConfig extends PureComponent{
  render(){
    return (
        <div style={{ padding: '0 16px',backgroundColor:'#fff' }}>
          <Tabs defaultActiveKey={'2'}>
            <TabPane tab="医商云" key="1" disabled>
              <YSYConfig />
            </TabPane>
            <TabPane tab="精细化平台" key="2" >
              <JXHPlate  />
            </TabPane>
          </Tabs>
        </div>
    )
  }
}
export default SubSystemConfig;