/*
 * @Author: yuwei 
 * @Date: 2018-08-22 14:12:02 
* @Last Modified time: 2018-08-22 14:12:02 
 */
 /**
 * @file 系统管理--角色管理--角色
 */
import React, { PureComponent } from 'react';
import {Button, message} from 'antd';
import { systemMgt } from '../../../../api/systemMgt';
import RemoteTable from '../../../../components/TableGrid';
import { Link } from 'dva/router';
import { connect } from 'dva';


class RoleMgt extends PureComponent{

  state = {
    loading: false,
    query: {},
  }

  //新增角色
  add = ()=> {
    const { history } =this.props;
    history.push({pathname:'/sys/role/roleMgt/add'})

  }
  //删除角色
  delete = () => {
    const { selectRowKeys } = this.state;
    if(selectRowKeys && selectRowKeys.length!==0){
      //发出删除请求
      this.props.dispatch({
        type: 'systemRole/RoleDelete',
        payload: { id:selectRowKeys},
        callback: (data) => {
          message.success('删除成功！')
          this.refs.table.fetch();
        }
      })
    }else{
      message.warn('请最少选择一个角色进行操作！')
    }
  }

  render(){
    const { query } = this.state;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 60,
        render: (text,record,index)=>{
          return <span>
            <Link to={{pathname:`/sys/role/roleMgt/edit/${record.id}`,state:record}}>编辑</Link>
          </span>
        }
      },
    ]
    return (
      <div className='ysynet-main-content'>
        <div>
          <Button type='primary' icon='plus' className='button-gap' onClick={this.add}>新增</Button>
          <Button type='primary' icon='minus' onClick={this.delete}>删除</Button>
        </div>

        <RemoteTable 
          ref='table'
          method='GET'
          query={query}
          style={{marginTop: 20}}
          columns={columns}
          scroll={{ x: '100%' }}
          url={systemMgt.RoleList}
          rowSelection={{
            onChange:(selectRowKeys, selectedRows)=>{
              this.setState({selectRowKeys})
            }
          }}
          rowKey='id'
        />

      </div>
    )
  }
}
export default connect( state => state)(RoleMgt);