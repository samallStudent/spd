/*
 * @Author: wwb 
 * @Date: 2018-08-21 15:45:52 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-09-06 17:53:32
 */
 /**
 * @file 系统管理--系统设置--字典管理
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Button, Modal } from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import { systemMgt } from '../../../../api/systemMgt';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
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
  handleSearch = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if(!err){
        console.log(values,'查询数据');
        this.props.query(values);
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`类型`}>
              {
                getFieldDecorator(`type`,{
                  initialValue: ''
                })(
                  <Select
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                    <Option value=''>请选择</Option>
                    {
                      this.props.typeListData.map((item, index) => <Option value={item.type} key={index}>{item.description}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`描述`}>
              {
                getFieldDecorator(`description`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type='primary' htmlType='submit'>查询</Button>
            <Button type="default" onClick={this.handleReset} style={{ marginLeft: 10 }}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class ItemsData extends PureComponent{
  state = {
    visible: false,
    isDisabled: true,
    query: {},
    ModalTitle: '',
    record: {},
    loading: false,
    typeListData: []
  }
  componentDidMount = () => {
    this.props.dispatch({
      type: 'Dictionary/DictTypeList',
      payload: {},
      callback: (data) =>{
        this.setState({ typeListData: data });
      }
    });
  }
  queryHandle = (query) =>{
    this.setState({ query });
    this.refs.table.fetch(query);
  }
  // 修改
  modify = (record,index) =>{
    console.log(record,index,'modify');
    this.setState({ visible: true, isDisabled: true, ModalTitle: '编辑', record });
    // const setFields = ['keyValue','tag','type','describe','sort'];
    // let Fields = {};
    // setFields.map((item,index)=> Fields[item] = record[item]);
    // this.props.form.setFieldsValue(Fields);
  }
  add = () => {
    this.props.form.resetFields();
    this.setState({ ModalTitle: '新增', visible: true, record: {}, isDisabled: false });
  }
  newAdd = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { record } = this.state;
        if (this.state.ModalTitle === '编辑') {
          values.id = record.id;
        }
        this.setState({ loading: true });
        console.log('确认条件：', values);
        this.props.dispatch({
          type:'Dictionary/DictSave',
          payload: values,
          callback:(data)=>{
            console.log(data);
            this.setState({ 
              loading: false, 
              visible: false,
            });
            this.props.form.resetFields();
            this.refs.table.fetch();
          }
        })
      }
    });
  }
  // 添加键值对
  // addkeyValue = (record,index) =>{
  //   console.log(record,index,'addkeyValue');
  //   this.props.form.setFieldsValue({ type: record.type,describe: record.describe,sort: record.sort, keyValue: '', tag: '' });
  //   this.setState({ visible: true, isDisabled: true });
  // }
  render(){
    const { visible, record } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '键值',
        dataIndex: 'value',
        width: 112,
      },
      {
        title: '标签',
        dataIndex: 'label',
        width: 168,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 168,
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 60,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 168,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 60,
        render: (text,record,index)=>{
          return <span>
            <a onClick={this.modify.bind(null,record,index)} style={{ marginRight: 8 }}>编辑</a>
            {/* <Popconfirm title="是否确认删除此条记录?" onConfirm={this.delete.bind(null, record)} okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
            <a onClick={this.addkeyValue.bind(null,record,index)} style={{ marginLeft: 8 }}>添加键值对</a> */}
          </span>
        }
      },
    ]
    return (
      <div className='ysynet-main-content'>
        <WrapperForm query={this.queryHandle} typeListData={this.state.typeListData}/>
        <div>
          <Button type='primary' icon='plus' onClick={this.add}>新建字典</Button>
        </div>
        <RemoteTable
          query={this.state.query}
          ref="table"
          columns={columns}
          scroll={{x: '100%'}}
          rowKey={'id'}
          style={{marginTop: 20}}
          url={systemMgt.DICTIONARYLIST}
        />
        <Modal
          title={this.state.ModalTitle}
          width={488}
          visible={visible}
          onCancel={()=>{this.setState({ visible: false }); this.props.form.resetFields();}}
          footer={[
            <Button key="submit" htmlType='submit' type='primary' onClick={this.newAdd} loading={this.state.loading}>确认</Button>,
            <Button key="back"  type='default' onClick={()=>{this.setState({ visible: false }); this.props.form.resetFields();}}>取消</Button>
          ]}
        >
          <Form>
            {
              this.state.isDisabled ?
                <FormItem {...singleFormItemLayout} label={`编码`}>
                  {
                    getFieldDecorator(`id`, {
                      initialValue: record ? record.id : ''
                    })(
                      <Input placeholder="请输入" disabled={this.state.isDisabled} />
                    )
                  }
                </FormItem> : null
            }
            <FormItem {...singleFormItemLayout} label={`键值`}>
              {
                getFieldDecorator(`value`, {
                  initialValue: record ? record.value : '',
                  rules: [{ required: true, message: '请填写键值' }]
                })(
                  <Input placeholder="请输入" />
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`标签`}>
              {
                getFieldDecorator(`label`, {
                  initialValue: record ? record.label : '',
                  rules: [{ required: true, message: '请填写标签' }]
                })(
                  <Input placeholder="请输入" />
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`类型`}>
              {
                getFieldDecorator(`type`, {
                  initialValue: record ? record.type : '',
                  rules: [{ required: true, message: '请填写类型' }]
                })(
                  <Input placeholder="请输入" />
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`排序`}>
              {
                getFieldDecorator(`sort`, {
                  initialValue: record ? record.sort : ''
                })(
                  <Input placeholder="请输入" />
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`描述`}>
              {
                getFieldDecorator(`description`, {
                  initialValue: record ? record.description : ''
                })(
                  <TextArea rows={2} placeholder="请输入" />
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default connect(state=>state)(Form.create()(ItemsData));