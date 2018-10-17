import React, { PureComponent } from 'react';
import { Table, Modal, Input, Form, Layout, Button, Select,Popconfirm,message } from 'antd';
import { connect } from 'dva';
import uuid from 'uuid';
const { Content, Sider } = Layout;
const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;
const formItemLayOut = {
  labelCol:{ span: 6 },
  wrapperCol: {span: 16}
}

const EditableCell = ({ editable, value, column, onChange }) => (
  <div>
  {editable && column === 'gender'
      ? 
      <Select 
        onSelect={value => onChange(value)}
        defaultValue={value} style={{ width: '100%' }}
      >
        <Option key='1' value=''>请选择</Option>
        <Option key='2' value='男'>男</Option>
        <Option key='3' value='女'>女</Option>
      </Select>
      :
      editable ?
      <Input style={{ margin: '-5px 0' }} defaultValue={value} onChange={e => onChange(e.target.value)} />
      : value
  }
  </div>
);
@connect(({ users, app })=>({
  users, app
}))
@Form.create()
class User extends PureComponent{
  state = {
    visible: false,
    dataSource: []
  }
  
  componentDidMount = () =>{
    /* this.props.dispatch({
      type: 'users/fetchUserList',
      payload: {}
    }) */
  }
  onSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if(!err){
        console.log(values,'values');
        values.userId = uuid();
        this.props.dispatch({
          type: 'users/add',
          payload: { values }
        });
        this.setState({ visible: false });
      }
    })
  }
  onClick = () =>{
    this.props.form.resetFields();
    this.setState({ visible: true })
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        column={column}
        value={text}
        onChange={value => this.handleChange(value, record, column)}
      />
    );
  }
  handleChange(value, record, column) {
    let len = null,text = null;
    if(column === 'userName'){
      len = 10;
      text = '用户名'
    }else if(column === 'age'){
      len = 3;
      text = '年龄'
    }else if(column === 'address'){
      len = 50;
      text = '地址'
    }
    if(column === 'gender'){
      if(value === ''){
        return message.warning('性别不能为空')
      }
    }else{
      if(value.length > len){
        return message.warning(`${text}的长度不能超过${len}`);
      }
    }
    const { dataSource } = this.props.users;
    const target = dataSource.filter(item => record.userId === item.userId)[0];
    if (target) {
      target[column] = value;
      this.props.dispatch({
        type: 'users/update',
        payload: { target }
      })
    }
  }
  deleteHandler = (record) =>{
    this.props.dispatch({
      type: 'users/delete',
      payload: { userId: record.userId }
    })
  }
  edit = (record) =>{
    console.log(record,'record')
    const { dataSource } = this.props.users;
    console.log(dataSource,'newData');
    const target = dataSource.filter(item => record.userId === item.userId)[0];
    if(target.editable){
      this.props.dispatch({
        type: 'users/updateEditFalse',
        payload: { ...record }
      })
    }else{
      this.props.dispatch({
        type: 'users/updateEdit',
        payload:{ userId: record.userId }
      })
    }
  }
  //搜索
  onSearch = (value) =>{
    console.log(value,'value');
    this.props.dispatch({
      type: 'users/search',
      payload: { value }
    })
  }
  render(){
    // const { loading } = this.props;
    // const isLoading = loading.effects['users/fetch'] || loading.effects['users/updateEditFalse'];

    const columns = [{
      title: 'Name',
      dataIndex: 'userName',
      width: '20%',
      render: (text, record) => this.renderColumns(text, record,'userName')
    }, {
      title: 'Age',
      dataIndex: 'age',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record,'age')
    },{
      title:' Gender',
      dataIndex: 'gender',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record,'gender')
    },{
      title: 'Address',
      dataIndex: 'address',
      width: '20%',
      render: (text, record) => this.renderColumns(text, record,'address')
    },{
      title: 'Tel',
      dataIndex: 'mobilePhone',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record,'mobilePhone')
    },{
      title: 'Action',
      dataIndex: 'action',
      render: (text,record,index) =>{
        return <span>
          <Popconfirm title="是否确认删除此条记录?" onConfirm={this.deleteHandler.bind(null, record)} okText="是" cancelText="否">
              <a>删除</a>
          </Popconfirm>
          <a onClick={this.edit.bind(null,record)} style={{ marginLeft: 8 }} >{ record.editable ?'保存':'编辑' }</a>
        </span>
      }
    }];
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    const { users: { dataSource } } = this.props;
    return (
        <Layout>
          <Sider>

          </Sider>
          <Content>
            <div style={{ display:'flex', justifyContent: 'space-between',padding: 8 }}>
              <div>
                搜索：
                <Search 
                  style={{ width: 300 }}
                  placeholder='请输入姓名/年龄/性别'
                  onSearch={this.onSearch} 
                />  
              </div>
              <div>
                <Button type='primary' icon='plus' onClick={()=>this.onClick()}>添加</Button>
              </div>
            </div>
            <Modal
              title='添加人员'
              visible={visible}
              onCancel={()=>this.setState({ visible: false })}
              onOk={this.onSubmit}
            >
              <Form>
                <FormItem {...formItemLayOut} label={`用户名`} hasFeedback>
                  {
                    getFieldDecorator(`userName`,{
                      initialValue:'',
                      rules:[{ required: true, message: '请填写用户名' }]
                    })(
                      <Input placeholder='用户名'/>
                    )
                  }
                </FormItem>
                <FormItem {...formItemLayOut} label={`年龄`} hasFeedback>
                  {
                    getFieldDecorator(`age`,{
                      initialValue:'',
                      rules:[{ required: true, message: '请填写年龄' }]
                    })(
                      <Input placeholder='年龄'/>
                    )
                  }
                </FormItem>
                <FormItem {...formItemLayOut} label={`性别`} hasFeedback>
                  {
                    getFieldDecorator(`gender`,{
                      initialValue:'',
                      rules:[{ required: true, message: '请选择性别' }]
                    })(
                      <Select>
                        <Option key='1' value={''}>请选择</Option>
                        <Option key='2' value={'男'}>男</Option>
                        <Option key='3' value={'女'}>女</Option>
                      </Select>
                    )
                  }
                </FormItem>
                <FormItem {...formItemLayOut} label={`地址`} hasFeedback>
                  {
                    getFieldDecorator(`address`,{
                      initialValue:'',
                      rules:[{ required: true, message: '请填写地址' }]
                    })(
                      <Input placeholder='地址'/>
                    )
                  }
                </FormItem>
                <FormItem {...formItemLayOut} label={`联系方式`} hasFeedback>
                  {
                    getFieldDecorator(`mobilePhone`,{
                      initialValue:'',
                      rules:[{ required: true, message: '请填写联系方式' }]
                    })(
                      <Input placeholder='号码'/>
                    )
                  }
                </FormItem>
              </Form>
            </Modal>
            <Table
              columns={columns}
              dataSource={dataSource}
              // loading={isLoading}
              size={'small'}
              pagination={{
                size: 'small',
                pageSize: 15
              }}
              rowKey={'userId'}
            />
          </Content>
        </Layout>
        
    )
  }
}

export default User;