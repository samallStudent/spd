/*
 * @Author: wwb 
 * @Date: 2018-08-21 17:46:47 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 00:57:20
 */
 /**
 * @file 系统管理--组织机构--用户管理--添加
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Radio, Input, Button, Table, Affix, Modal, message } from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import { DeptSelect } from '../../../../common/dic';
import { connect } from 'dva';
// const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Search } = Input;
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
const modalColumns = [{
  title: '账号',
  dataIndex: 'ctcpCode'
},{
  title: '姓名',
  dataIndex: 'ctcpName'
},{
  title: '所属科室',
  dataIndex: 'hisDeptName'
}];
class AddUser extends PureComponent{
  state = {
    userType: '0',
    hasStyle: null,// 选中行变色 index
    record: {},// 选中行 
    visible: false,
    tableLoading: false,
    btnLoading: false,
    userDataSource: [],// 角色列表
    userLoading: false,
    deptDataSource: [],
    deptLoading: false,
    selected: [], // 所属部门
    selectedRows: [],
    userSelected: [], // 角色分配
    UserselectedRows: [],
    ctcpName: null,// 新增人员查询输入库姓名
    hisDeptName: null // 新增人员查询输入库 所属科室
  }
  componentDidMount = () =>{
    this.setState({ userLoading: true, deptLoading: true });
    let { dispatch } = this.props;
    // 所属部门
    dispatch({
      type: 'Organization/getAllDepts',
      payload: {},
      callback: (data) =>{
        this.setState({ deptDataSource: data,deptLoading: false });
      }
    });
    // 角色列表
    dispatch({
      type: 'Organization/getRoleInfo',
      payload: {},
      callback: (data) =>{
        this.setState({ userDataSource: data, userLoading: false });
      }
    });
  }
  onSearch = (values) =>{
    this.setState({ visible: true, tableLoading: true,record: {},hasStyle: null })
    this.props.dispatch({
      type: 'Organization/getFilterCareProv',
      payload: values ? {...values}: {},
      callback: (data) =>{
        this.setState({ modalDataSource: data, tableLoading: false })
      }
    })
  }
  setUser = () =>{
    let { record } = this.state;
    this.props.form.setFieldsValue({ loginName: record.ctcpCode, name: record.ctcpName  });
    this.setState({ visible: false });
  }
  addUser = () =>{
    let { form, dispatch, history } = this.props;
    form.validateFields((err,values)=>{
      if(!err){
        let userInfo = {}, deptList = [],roleList = [];
        let { selectedRows, userSelected } = this.state;
        if(userSelected.length === 0) {
          return message.warning('至少选择一个角色');
        };
        selectedRows.map(item => deptList.push({ deptType: item.deptType, id: item.id }));
        userSelected.map(item => roleList.push({ id: item }));
        userInfo.deptList = deptList;
        userInfo.roleList = roleList;
        userInfo.loginName = values.loginName;
        userInfo.name = values.name;
        userInfo.phone = values.phone;
        console.log(userInfo,'userInfo');
        this.setState({ btnLoading: true })
        dispatch({
          type: 'Organization/operUserInfo',
          payload: { userInfo },
          callback: () =>{
            this.setState({ btnLoading: false });
            history.push({ pathname: '/sys/organization/userMgt' })
          } 
        })
      }
    })
  }
  search = () =>{
    let { ctcpName, hisDeptName } = this.state;
    let values = { ctcpName, hisDeptName };
    this.onSearch(values);
  }
  reset = () =>{
    this.onSearch()
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { userType, visible, deptDataSource, userDataSource, modalDataSource, 
      userLoading, btnLoading, deptLoading, tableLoading, hasStyle } = this.state;
    return (
      <div>
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <div style={{ display:'flex',justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 'bold' }}>用户信息</h3>
          </div>
          <hr className='hr' />
          <Form>
            <Row>
              <Col span={6}>
                <FormItem colon={false} label={''} wrapperCol={{ span: 20 }}>
                  {
                    getFieldDecorator(`userType`,{
                      initialValue: userType
                    })(
                      <RadioGroup onChange={e => {
                        this.props.form.resetFields();
                        this.setState({ userType: e.target.value,record: {},hasStyle: null })
                      }}>
                        <Radio value={'0'}>已有医院用户</Radio>
                        <Radio value={'1'}>无医院用户</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Row>
                  <Col span={6}>
                    {
                      userType === '0'?
                      <FormItem {...formItemLayout} label={`账号`}>
                        {
                          getFieldDecorator(`loginName`,{
                            initialValue: '',
                            rules: [{ required: true, message: '请选择账号' }]
                          })(
                            <Search
                              readOnly
                              placeholder='请选择'
                              onSearch={this.onSearch}
                            />
                          )
                        }
                      </FormItem>
                      :
                      <FormItem {...formItemLayout} label={`账号`}>
                        {
                          getFieldDecorator(`loginName`,{
                            initialValue: '',
                            rules: [{ required: true, message: '请选择账号' }]
                          })(
                            <Input placeholder='请输入'/>
                          )
                        }
                      </FormItem>
                    }
                  </Col>
                  <Col span={6} push={2}>
                    <FormItem {...formItemLayout} label={`姓名`}>
                      {
                        getFieldDecorator(`name`,{
                          initialValue: '',
                          rules: [{ required: true, message: '请选择姓名' }]
                        })(
                          <Input disabled={userType === '0'? true: false }/>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label={`手机号`}>
                  {
                    getFieldDecorator(`phone`,{
                      rules: [
                      {min:11, message: '电话号最少11位!' },
                      {pattern: /^\d+$/,message:'只能是数字'},
                      {max:11, message: '联系电话最多11位!' }]
                    })(
                      <Input placeholder='请输入'/>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className='detailCard'>
          <h3>所属部门</h3>
          <hr className='hr'/>
          <Table 
            columns={deptColumns}
            bordered
            rowKey={'id'}
            loading={deptLoading}
            dataSource={deptDataSource}
            size={'small'}
            scroll={{ x: '100%' }}
            pagination={{
              size: 'small',
              showQuickJumper: true,
              showSizeChanger: true
            }}
            rowSelection={{
              selectedRowKeys: this.state.selected,
              onChange: (selectedRowKeys, selectedRows) => {
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
            loading={userLoading}
            dataSource={userDataSource}
            size={'small'}
            scroll={{ x: '100%' }}
            pagination={{
              size: 'small',
              showQuickJumper: true,
              showSizeChanger: true
            }}
            rowSelection={{
              selectedRowKeys: this.state.userSelected,
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({userSelected: selectedRowKeys, UserselectedRows: selectedRows})
              }
            }}
          />
        </div>
      </div>
      <Modal 
        title={'用户信息'}
        visible={visible}
        onCancel={()=>this.setState({ visible: false })}
        footer={[
          <Button key="submit" type='primary' onClick={this.setUser}>
              确认
          </Button>,
          <Button key="back"  type='default' onClick={()=>this.setState({ visible: false })}>取消</Button>
        ]}
      >
        <Row style={{ marginBottom: 16 }}>
          <Col span={16}>
            <Input 
              style={{ width: 120 }} 
              onBlur={(e)=>this.setState({ ctcpName: e.target.value  })} 
              placeholder='姓名关键字'
            />
            <Input 
              style={{ width: 120, marginLeft: 8 }} 
              onBlur={(e)=>this.setState({ hisDeptName: e.target.value  })} 
              placeholder='科室关键字'
            />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type='primary' onClick={this.search}>查询</Button>
            <Button type='primary' style={{ marginLeft: 8 }} onClick={this.reset}>重置</Button>
          </Col>
        </Row>
        <Table 
          columns={modalColumns}
          size='small'
          loading={tableLoading}
          dataSource={modalDataSource}
          rowClassName={ (record, index) => index === hasStyle ? 'rowClassBg' : ''}
          rowKey={'id'}
          pagination={{
            size: 'small',
            showQuickJumper: true,
            showSizeChanger: true
          }}
          scroll={{ x: '100%' }}
          onRow={(record,index)=>{
            return {
              onClick: () =>{
                this.setState({ hasStyle: index, record });
              }
            }
          }}
        />
      </Modal>
      <Affix offsetBottom={0}>
        <Row>
          <Col style={{ textAlign:'right', padding: '20px 10px', }}>
            <Button type='primary' loading={btnLoading} onClick={this.addUser}>保存</Button>
            <Button type='danger' style={{ marginLeft: 8 }} ghost onClick={()=> window.history.go(-1)} >取消</Button>
          </Col>
        </Row>
      </Affix>
      </div>
    )
  }
}
export default connect()(Form.create()(AddUser));