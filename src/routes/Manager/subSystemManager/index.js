import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Button, Select, Modal,Popconfirm } from 'antd';
import RemoteTable from '../../../components/TableGrid';
import jxh from '../../../api/jxh';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Search, TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
    md: {span: 6}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: {span: 16}
  },
}

class SubSystemManager extends PureComponent{
  state = {
    query: {},
    title: '添加管理员',
    visible: false,
    isEdit: false,
    record: {}
  }
  resetPwd = (record) =>{
    this.props.dispatch({
      type: 'subSystemManager/resetPwd',
      payload: { userId: record.userId },
      callback: () => this.refs.table.fetch()
    })
  }
  delete = (record) =>{
    this.props.dispatch({
      type: 'subSystemManager/deleteUser',
      payload: { userId: record.userId },
      callback: () => this.refs.table.fetch()
    })
  }
  edit = (record) =>{
    this.setState({ record, visible: true, title: '编辑',isEdit: true })
  }
  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if(!err){
        values.userLevel = '07';
        if(this.state.isEdit){
          values.userId = this.state.record.userId
        }
        console.log(values,'values');
        this.setState({ loading: true });
        this.props.dispatch({
          type: 'subSystemManager/addOrupdate',
          payload: values,
          callback: () => {
            this.setState({ visible: false,loading: false })
            this.refs.table.fetch()
          }
        })
      }
    })
  }
  render(){
    const { title, visible ,record, isEdit, loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      title: '账号',
      dataIndex: 'userNo'
    },{
      title: '用户名',
      dataIndex: 'userName'
    },{
      title: '状态',
      dataIndex: 'fstate',
      width: 80,
      render: (text,record) =>{
        return text === '00'? <span style={{ color: 'red' }}>{'停用'}</span>: <span style={{ color: 'green' }}>{'启用'}</span>
      }
    },{
      title: '工号',
      dataIndex: 'jobNum'
    },{
      title: '联系电话',
      dataIndex: 'mobilePhone',
      width: 170
    },{
      title: '备注',
      dataIndex: 'tfRemark'
    },{
      title: '操作',
      dataIndex: 'actions',
      fixed: 'right',
      width: 180,
      render: (text,record,index) =>{
        return (
          <span>
            <Popconfirm title="是否确认重置该用户密码?" onConfirm={this.resetPwd.bind(null, record)} okText="是" cancelText="否">
              <a>重置密码</a>
            </Popconfirm>
            <a style={{ margin: '0 10px' }} onClick={this.edit.bind(null,record)}>编辑</a>
            <Popconfirm title="是否确认删除此条记录?" onConfirm={this.delete.bind(null, record)} okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }]
    return (
      <div>
        <Row className='ant-row-bottom'>
          <Col span={6}>
            <Search 
              style={{ width: 256 }}
              placeholder='账号/用户名'
              onSearch={(value)=>this.refs.table.fetch({searchName: value }) }
            />
          </Col>
          <Col span={18} style={{ textAlign: 'right' }}>
            <Button type='primary' onClick={()=>{
              this.props.form.resetFields();
              this.setState({ visible: true,title: '添加管理员',isEdit: false });
            }}>{'添加管理员'}</Button>
          </Col>
        </Row>
        <Modal 
          title={title}
          visible={visible}
          style={{ top: 20 }}
          width={460}
          onCancel={()=>this.setState({ visible: false })}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label={`账号`}>
              {
                getFieldDecorator(`userNo`,{
                  initialValue: isEdit ? record.userNo: '',
                  rules: [{required: true,message: '请输入账号'}]
                })(
                  <Input placeholder='请输入' disabled={isEdit ? true: false}/>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={`用户名`}>
              {
                getFieldDecorator(`userName`,{
                  initialValue: isEdit ? record.userName: '',
                  rules: [{required: true,message: '请输入用户名'}]
                })(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={`工号`}>
              {
                getFieldDecorator(`jobNum`,{
                  initialValue: isEdit ? record.jobNum: '',
                  rules: [{required: true,message: '请输入用工号'}]
                })(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={`手机号`}>
              {
                getFieldDecorator(`mobilePhone`,{
                  initialValue: isEdit ? record.mobilePhone: '',
                  rules: [{required: true,message: '请输入手机号'}]
                })(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={`状态`}>
              {
                getFieldDecorator(`fstate`,{
                  initialValue: isEdit ? record.fstate: null,
                  rules: [{required: true,message: '请选择状态'}]
                })(
                  <Select placeholder='请选择'>
                    <Option key={-1} value='00'>{'禁用'}</Option>
                    <Option key={1} value='01'>{'启用'}</Option>
                    <Option key={2} value='02'>{'注销'}</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={`邮箱`}>
              {
                getFieldDecorator(`eMail`,{
                  initialValue: isEdit ? record.eMail: '',
                  rules: [{required: true,message: '请输入邮箱'}]
                })(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={`备注`}>
              {
                getFieldDecorator(`tfRemark`,{
                  initialValue: isEdit ? record.tfRemark: '',
                })(
                  <TextArea placeholder='请输入' rows={4}/>
                )
              }
            </FormItem>
            <FormItem wrapperCol={{ span: 22,offset: 2 }}>
              <Button type='primary' htmlType='submit' loading={loading} style={{ width: '95%' }}>{ isEdit ? '保存': '确认'}</Button>
            </FormItem>
          </Form>
        </Modal>
        <RemoteTable 
          ref='table'
          url={jxh.FINDSUBSYSTEMMANAGER}
          rowKey={'userId'}
          scroll={{ x:'100%' }}
          query={this.state.query}
          columns={columns}
          showHeader={true}
        />
      </div>
    )
  }
}
export default connect(state =>  state)(Form.create()(SubSystemManager));