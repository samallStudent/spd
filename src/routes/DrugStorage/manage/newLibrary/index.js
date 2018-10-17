/*
 * @Author: yuwei  新建入库 /newLibrary
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import { Table , Form, Row, Col, Button, Icon, Select , Input , DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import { createData } from '../../../../common/data';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
   title: '入库单',
   dataIndex: 'medicinalCode',
   width:150,
   render: (text, record) => 
   <span>
     <Link to={{pathname: `/drugStorage/drugStorageManage/newLibrary/details`}}>{text}</Link>
   </span>
  },
  {
    title: '配送单',
    width:150,
    dataIndex: 'productName',
  },
  {
    title: '订单',
    width:150,
    dataIndex: 'productName1',
    render: (text, record, index) => '8690255100025' + index
  },
  {
    title: '入库分类',
    width:100,
    dataIndex: 'fmodal2',
    render:(text)=>'采购入库'
  },
  {
    title: '库房',
    dataIndex: 'spec1',
    width: 80,
    render:(text)=>'药库'
  },
  {
    title: '供应商',
    dataIndex: 'spec1232',
    width: 80,
    render: (text, record, index) => index
  },
  {
    title: '入库人',
    width:100,
    dataIndex: 'custodian',
    render: (text, record, index) => '张三三'
  },
  {
   title: '入库时间',
   width:120,
   dataIndex: 'useDept',
   render: (text, record, index) => '2018-7-25 21:34'
  },
 {
  title: '备注',
  width:100,
  dataIndex: 'useDept1',
  render: (text, record, index) => '加班'
 }
];

class NewLibrary extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      query:{},
    }
  }
  queryHandler = (query) => {
    this.setState({ query:query })
  }
  render(){
    return (
      <div className='ysynet-main-content'>
        <SearchForm query={this.queryHandler} />
        <Row>
          <Button type='primary' className='button-gap'>
            <Link to={{pathname:`/drugStorage/drugStorageManage/newLibrary/add`}}>新建入库</Link>
          </Button>
        </Row>
        <Table
          dataSource={createData()}
          bordered
          loading={ this.state.loading}
          scroll={{x: '100%'}}
          pagination={{
            size: "small",
            showQuickJumper: true,
            showSizeChanger: true
          }}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 20}}
        /> 
      </div>
    )
  }
}
export default NewLibrary;
/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
 state = {
   display: 'none',
 }
 toggle = () => {
   const { display, expand } = this.state;
   this.setState({
     display: display === 'none' ? 'block' : 'none',
     expand: !expand
   })
 }
 handleSearch = (e) => {
   e.preventDefault();
   this.props.form.validateFields((err, values) => {
     this.props.query(values);
   });
 }
 //重置
 handleReset = () => {
   this.props.form.resetFields();
   this.props.query({});
 }

 render() {
   const { display } = this.state;
   const { getFieldDecorator } = this.props.form;
   return (
     <Form onSubmit={this.handleSearch}>
       <Row gutter={30}>
         <Col span={8}>
           <FormItem label={`单号`} {...formItemLayout}>
             {getFieldDecorator('assetCode', {})(
              <Input placeholder='入库单/配送单/订单号'/>
             )}
           </FormItem>
         </Col>
         <Col span={8} >
           <FormItem label={`供应商`} {...formItemLayout}>
             {getFieldDecorator('spec')(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                <Option key="" value="">全部</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`入库时间`} {...formItemLayout}>
             {getFieldDecorator('assetName', {})(
              <RangePicker/>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`入库分类`} {...formItemLayout}>
             {getFieldDecorator('useDeptGuid')(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                <Option key="" value="">全部</Option>
                <Option key="01" value="01">采购入库</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{ textAlign: 'right', marginTop: 4,float:'right'}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
           <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
             {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
           </a>
         </Col>
       </Row>
     </Form>
   )
 }
}
const SearchForm = Form.create()(SearchFormWrapper);