import React, { PureComponent } from 'react';
import { Badge, Icon, Popover, Tabs , List, Avatar} from 'antd';
import styles from './style.css';
//import NoticeItem from './noticeItem';
const TabPane = Tabs.TabPane;
const data = [
  {
    title: '编辑属性',
    img:'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    descr:'A超机 EQUIPMENT_NAME 2018-02-11 10:43:40'
  },
  {
    title: '你收到了 14 份新周报',
    img:'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    descr:'A超机 EQUIPMENT_NAME 2018-02-11 10:43:40'
  },
  {
    title: '你推荐的 曲妮妮 已通过第三轮面试',
    img:'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
    descr:'A超机 EQUIPMENT_NAME 2018-02-11 10:43:40'
  },
  {
    title: '左侧图标用于区分不同的类型',
    img:'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
    descr:'A超机 EQUIPMENT_NAME 2018-02-11 10:43:40'
  },
];
const NoticeList = () => (
  <Tabs defaultActiveKey="1" style={{width: 400,paddingLeft:20}}>
    <TabPane tab="提示（4）" key="1">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.img} />}
              title={<a href="http://www.ysynet.com/">{item.title}</a>}
              description={item.descr}
            />
          </List.Item>
        )}
      />
    </TabPane>
  </Tabs>
)

class Notice extends PureComponent {
  render() {
    return (
      <Popover content={<NoticeList/>} trigger="click" placement="bottomRight">
        <div className={styles.noticeWrapper}>
          <Badge count={4}>
            <Icon type='bell' style={{fontSize: 18}}/>
          </Badge>
        </div>
      </Popover> 
    )
  }
}

export default Notice;