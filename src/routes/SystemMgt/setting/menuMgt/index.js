/*
 * @Author: yuwei 
 * @Date: 2018-08-22 10:24:25 
* @Last Modified time: 2018-08-22 10:24:25 
 */
 /**
 * @file 系统管理--系统设置--菜单管理
 */
import React, { PureComponent } from 'react';
import { Row, Button, Table, Icon } from 'antd';
import querystring from 'querystring';
import { Link } from 'dva/router';
import { menuFormat } from '../../../../utils/utils';
import { systemMgt } from '../../../../api/systemMgt';
import { DeptFormat } from '../../../../common/dic';

class MenuMgt extends PureComponent{

  state = {
    loading: false,
    query:{},
    dataSource: []
  }
  componentWillMount = () =>{
    this.setState({ loading: true });
    fetch(systemMgt.MenuList,{
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
    })
    .then(res => res.json())
    .then(data=>{
      if(data.code === 200 && data.msg === 'success'){
        let newData = menuFormat(data.data, true );
        this.setState({ dataSource: newData, loading: false});
      }
    })
  }
  // 添加菜单
  add = () =>{
    //跳转至添加菜单页面
    const {history} = this.props;
    history.push('/sys/menu/menuMgt/add');
  }

  render(){
    const { dataSource, loading } = this.state;
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        width: 224
      },
      {
        title: '链接',
        dataIndex: 'href',
        width: 280
      },
      {
        title: '图标',
        dataIndex: 'icon',
        width: 60,
        render: (text) => text ? <Icon type={text}/> : null
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 60
      },
      {
        title: '可见',
        dataIndex: 'isShow',
        width: 60,
        render:(text,record,index)=>text==="1"?"是":"否",
      },
      {
        title: '部门类型',
        dataIndex: 'depType',
        width: 168,
        render:(text,record,index)=>text?DeptFormat[text]:text
      },
      {
        title: '备注',
        width: 280,
        dataIndex: 'remarks',
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 170,
        render: (text,record,index)=>{
          return <span>
            <Link className='button-gap' to={{pathname:`/sys/menu/menuMgt/add/${querystring.stringify({id:record.id,parentId:record.parentId})}`}}>编辑</Link>
            <Link className='button-gap' to={{pathname: `/sys/menu/menuMgt/add/${querystring.stringify({parentId:record.id,parentName:record.name})}` ,state:record }}>添加下级菜单</Link>
          </span>
        }
      }
    ]
    return (
      <div className='ysynet-main-content'>
        <Row>
          <Button type='primary' icon='plus' onClick={this.add}>添加菜单</Button>
        </Row>
        <Table 
          bordered
          loading={loading}
          defaultExpandAllRows
          dataSource={dataSource}
          style={{marginTop: 20}}
          columns={columns}
          scroll={{ x: 1166 }}
          rowKey='id'
        />

      </div>

    )
  }
}
export default MenuMgt;