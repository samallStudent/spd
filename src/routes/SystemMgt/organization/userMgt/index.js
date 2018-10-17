/*
 * @Author: wwb 
 * @Date: 2018-08-21 14:27:32 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 00:56:45
 */

 /**
 * @file 系统管理--组织机构--用户管理
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Button, Icon, Popconfirm, Modal, Badge } from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import { systemMgt } from '../../../../api/systemMgt';
import { Link } from 'dva/router';
import { connect } from 'dva';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const singleFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  },
}

class SearchForm extends PureComponent{
  state = {
    expand: false,
    deptOptions: [], //所属科室
    departmentOptions: [] //所属部门
  }
  componentDidMount = () =>{
    let { dispatch } = this.props.formProps;
    // 所属科室
    dispatch({
      type: 'Organization/getAllDeptByCondition',
      payload: {},
      callback: (data) =>{
        this.setState({ deptOptions: data })
      }
    });
    // 所属部门
    dispatch({
      type: 'Organization/getAllDepts',
      payload: {},
      callback: (data) =>{
        this.setState({ departmentOptions: data })
      }
    });
    let { queryConditons } = this.props.formProps.base;
    //找出表单的name 然后set
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
  }
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  handleSearch = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if(!err){
        console.log(values,'查询数据');
        this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
        });
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { deptOptions, departmentOptions } = this.state;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`账号`}>
              {
                getFieldDecorator(`loginName`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`姓名`}>
              {
                getFieldDecorator(`name`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`所属科室`}>
              {
                getFieldDecorator(`hisDeptIds`,{
                  initialValue: ''
                })(
                  <Select
                    allowClear={true}
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value=''>全部</Option>
                    {
                      deptOptions.map((item,index)=> <Option key={index} value={item.ctdCode}>{item.ctdName}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`部门`}>
              {
                getFieldDecorator(`deptIds`,{
                  initialValue: ''
                })(
                  <Select
                  allowClear={true}
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value=''>全部</Option>
                    {
                      departmentOptions.map((item,index)=> <Option key={index} value={item.id}>{item.deptName}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
           <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
             {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
           </a>
         </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);
class UserMgt extends PureComponent{
  state = {
    loading: false,
    visible: false
  }
  // 重置密码
  resetPwd = (record,index) =>{
    this.props.dispatch({
      type: 'Organization/ResetPwd',
      payload: { id: record.id },
      callback: () =>{
        this.refs.table.fetch(this.state.query);
      }
    })
  }
  save = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if(!err){
        console.log(values,'values')
      }
    })
  }
  add = () =>{
    const { history, location } = this.props;
    history.push({ pathname: `${location.pathname}/add` });
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    })
  }
  render(){
    const {location} = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '账号',
        dataIndex: 'loginName',
        width: 168
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        width: 112
      },
      {
        title: '部门性质',
        dataIndex: 'deptType',
        width: 168
      },
      {
        title: '科室名称',
        dataIndex: 'hisCtDeptNme',
        width: 168,
      },
      {
        title: '部门名称',
        dataIndex: 'deptName',
        width: 168,
      },
      {
        title: '状态',
        dataIndex: 'isStart',
        width: 112,
        render: text => <Badge status={text==="0" ? "success" :"error"} text={text==="0" ? "启用" :"停用"}/>
      },
      {
        title: '编辑人',
        dataIndex: 'updateUserName',
        width: 168,
      },
      {
        title: '编辑时间',
        dataIndex: 'updateDate',
        width: 224,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 130,
        fixed: 'right',
        render: (text,record,index)=>{
          return <span>
            <Popconfirm title="是否确认重置该用户密码?" onConfirm={this.resetPwd.bind(null, record,index)} okText="是" cancelText="否">
              <a>重置密码</a>
            </Popconfirm>
            <Link style={{ marginLeft: 8 }} to={{pathname: `${location.pathname}/edit/${record.loginName}`}}>{'编辑'}</Link>
          </span>
        }
      },
    ];
    let query = this.props.base.queryConditons;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm 
          formProps={{...this.props}}
        />
        <div style={{ marginBottom: 24 }}>
          <Button type='primary' icon='plus' onClick={this.add}>新增用户</Button>
        </div>
        <RemoteTable
          ref='table'
          columns={columns}
          bordered
          query={query}
          scroll={{ x: 1250 }}
          url={systemMgt.FINDUSERLIST}
          rowKey={'loginName'}
          onChange={this._tableChange}
        />
        <Modal
          title={'用户修改'}
          width={488}
          visible={visible}
          onCancel={()=>this.setState({ visible: false })}
          footer={[
            <Button key="submit" htmlType='submit' type='primary' onClick={this.save}>
                确认
            </Button>,
            <Button key="back"  type='default' onClick={()=>this.setState({ visible: false })}>取消</Button>
          ]}
        >
          <Form onSubmit={this.onSubmit}>
            <FormItem {...singleFormItemLayout} label={`工号`}>
              {
                getFieldDecorator(`jobNum`,{
                  rules: [{ required: true,message: '请填写工号' }]
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`姓名`}>
              {
                getFieldDecorator(`userName`,{
                  rules: [{ required: true,message: '请填写姓名' }]
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`登录名`}>
              {
                getFieldDecorator(`loginName`,{
                  rules: [{ required: true,message: '请填写登录名' }]
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`电话`}>
              {
                getFieldDecorator(`tel`)(
                  <Input />
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`手机`}>
              {
                getFieldDecorator(`mobile`)(
                  <Input />
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`备注`}>
              {
                getFieldDecorator(`tfRemark`)(
                  <TextArea rows={3}/>
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default connect( state => state)(Form.create()(UserMgt));