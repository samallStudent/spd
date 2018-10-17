/* 
  医商云平台 Tab
*/

import React, { PureComponent } from 'react';
import { Table, Input, Switch } from 'antd';

const { Search } = Input;
const dataSource = [{
  menuName:'菜单一',
  menuCode: '001',
  routes:'/菜单一',
  fstate: '00',
  tfRemark: "备注"
},{
  menuName:'菜单二',
  menuCode: '002',
  routes:'/菜单二',
  fstate: '01',
  tfRemark: "备注11"
}]
class YSYPlatform extends PureComponent{
  render(){
    const columns = [{
      title: '菜单名称',
      dataIndex: 'menuName'
    },{
      title:'菜单编号',
      dataIndex: 'menuCode'
    },{
      title:'路径',
      dataIndex: 'routes'
    },{
      title:'状态',
      dataIndex: 'fstate',
      render:(text,record) =>{
        return <Switch  defaultChecked={text === '01' ? true: false}/>
      }
    },{
      title:'备注',
      dataIndex: 'tfRemark'
    }]

    return (
    <div>
      <Search 
        style={{ width: 300 }}
        onSearch={this.onSearch}
        placeholder='请输入菜单名称/路径/编号'
      />
      <Table 
        style={{ marginTop: 10 }}
        columns={columns}
        rowKey={'menuCode'}
        bordered
        dataSource={dataSource}
        pagination={false}
        size='small'
        scroll={{ x: "100%" }}
      />
    </div>
    )
  }
}
export default YSYPlatform;