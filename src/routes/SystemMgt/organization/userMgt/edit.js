/*
 * @Author: wwb 
 * @Date: 2018-08-21 17:46:47 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 00:58:04
 */
 /**
 * @file 系统管理--组织机构--用户管理--编辑
 */
import React, { PureComponent } from 'react';
import { Row, Col, Button, Table, Input, message } from 'antd';
import { DeptSelect } from '../../../../common/dic';
import { connect } from 'dva';

const deptColumns = [{
  title: '部门类别',
  dataIndex: 'deptType',
  render: (text,record)=>{
    return DeptSelect.filter(item => item.value === Number(text))[0].text
  }
},{
  title: '部门名称',
  dataIndex: 'deptName'
}];
const distributUser = [{
  title: '角色名称',
  dataIndex: 'roleName'
},{
  title: '备注',
  dataIndex: 'remarks'
}];
class AddUser extends PureComponent{
  state = {
    baseData: {},// 用户详情信息
    phone: '',
    loading: false,
    btnLoading: false,
    selected: [], // 所属部门
    selectedRows: [],   //部门
    userSelected: [], // 角色分配
    UserselectedRows: [],   //角色
    modalSelected: [], // 人员选择
    modalSelectedRows: []
  }
  componentWillMount = () =>{
    this.setState({ loading: true })
    const { loginName } = this.props.match.params;
    this.props.dispatch({
      type: 'Organization/findUserInfo',
      payload: { loginName },
      callback: (data) =>{
        let UserselectedRows = data.listRole.filter(item => item.checked === 1);
        let selectedRows = data.listDept.filter(item => item.checked === 1);
        this.setState({ 
          baseData: data, 
          phone: data.phone, 
          loading: false,
          UserselectedRows,
          selectedRows
        })
      }
    })
  }
  save = () =>{
    let userInfo = {}, deptList = [],roleList = [];
    let { selectedRows, UserselectedRows, baseData } = this.state;
    selectedRows.map(item => deptList.push({ deptType: item.deptType, id: item.id }));
    UserselectedRows.map(item => roleList.push({ id: item.id }));
    userInfo.deptList = deptList;
    userInfo.roleList = roleList;
    userInfo.loginName = baseData.loginName;
    userInfo.name = baseData.userName;
    userInfo.phone = this.state.phone;
    console.log(userInfo,'userInfo');
    this.setState({ btnLoading: true });
    let { dispatch, history } = this.props;
    dispatch({
      type: 'Organization/operUserInfo',
      payload: { userInfo },
      callback: () =>{
        this.setState({ btnLoading: false });
        let {location} = this.props;
        location.pathname = location.pathname.split('/');
        location.pathname.length = 4;
        location.pathname = location.pathname.join('/');
        history.push({ pathname: location.pathname })
      } 
    })
  }
  render(){
    const { baseData, loading, btnLoading, phone } = this.state;
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <div style={{ display:'flex',justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 'bold' }}>用户信息</h3>
            <Button type='primary' loading={btnLoading} onClick={this.save}>保存</Button>
          </div>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>账号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.loginName }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>姓名</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.userName }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>手机号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>
                  <Input  
                    style={{ width: 200 }} 
                    value={phone !==''?phone: baseData.phone} 
                    onChange={(e)=>{
                      let value = e.target.value;
                      if(/^\d+$/.test(value)){
                        this.setState({ phone: value })
                      }else{
                        return message.warning('只能输入数字')
                      }
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <h3>所属部门</h3>
          <hr className='hr'/>
          <Table 
            columns={deptColumns}
            bordered
            rowKey={'id'}
            loading={loading}
            dataSource={baseData.listDept}
            size={'small'}
            scroll={{ x: '100%' }}
            pagination={{
              size: 'small',
              showQuickJumper: true,
              showSizeChanger: true
            }}
            rowSelection={{
              getCheckboxProps: record => ({
                defaultChecked: record.checked === 1
              }),
              selectedRowKeys: this.state.selected,
              onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys);
                
                this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
              }
            }}
          />
        </div>
        <div className='detailCard'>
          <h3>分配角色</h3>
          <hr className='hr'/>
          <Table 
            columns={distributUser}
            bordered
            rowKey={'id'}
            loading={loading}
            dataSource={baseData.listRole}
            size={'small'}
            scroll={{ x: '100%' }}
            pagination={{
              size: "small",
              showQuickJumper: true,
              showSizeChanger: true
            }}
            rowSelection={{
              getCheckboxProps: record => ({
                defaultChecked: record.checked === 1
              }), 
              selectedRowKeys: this.state.userSelected,
              onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys);
                this.setState({userSelected: selectedRowKeys, UserselectedRows: selectedRows})
              }
            }}
          />
        </div>
      </div>
    )
  }
}
export default connect()(AddUser);