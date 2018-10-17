/*
 * @Author: yuwei  退货 /refund
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import { Table , Form, Row, Col, Button, Icon, Select , Input ,DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import { createData } from '../../../../common/data';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
    title: '退库单',
    width:150,
    dataIndex: 'applyNo',
    render:(text)=>(
      <Link to={{pathname:`/pharmacy/manage/refund/details`}}>{text}</Link>
    )
  },
  {
   title: '库房',
   dataIndex: 'medicinalCode',
   width:150,
   render:(text)=>'药库'
  },
  {
    title: '药房',
    dataIndex: 'medicinalCode2  ',
    width:150,
    render:(text)=>'中心药房'
   },
  {
    title: '出库分类',
    width:100,
    dataIndex: 'fmodal2',
    render:(text)=>'退货出库'
  },
  {
    title: '状态',
    width:100,
    dataIndex: 'spec21',
    render:(text)=>'待确认'
  },
  {
    title: '制单人',
    width:100,
    dataIndex: 'bDept',
    render: (text, record, index) => '王文斌'
  },
  {
   title: '制单时间',
   width:100,
   dataIndex: 'useDept',
   render: (text, record, index) => '2018-7-25 21:57'
  },
 {
  title: '确认人',
  width:100,
  dataIndex: 'useDept1',
  render: (text, record, index) => '花花'
 },
 {
  title: '确认时间',
  width:100,
  dataIndex: 'useDept123',
  render: (text, record, index) => '2018-7-25 21:58'
 }
];

class Refund extends PureComponent{

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
      <div>
        <SearchForm query={this.queryHandler} />
        <Row>
          <Button type='primary'>
            <Link to={{pathname:`/pharmacy/manage/refund/add`}}>新建退库</Link>
          </Button>
        </Row>
        <Table
          dataSource={createData()}
          bordered
          loading={ this.state.loading}
          scroll={{x: '120%'}}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 20}}
        /> 
      </div>
    )
  }
}
export default Refund;
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
           <FormItem label={`单据号`} {...formItemLayout}>
             {getFieldDecorator('assetCode', {})(
              <Input/>
             )}
           </FormItem>
         </Col>
         <Col span={8}>
           <FormItem label={`出库分类`} {...formItemLayout}>
             {getFieldDecorator('spec')(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                <Option key="" value="">全部</Option>
                <Option key="01" value="01">退货出库</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
            <FormItem label={`状态`} {...formItemLayout}>
              {getFieldDecorator('useDeptGuid')(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                  <Option key="" value="">全部</Option>
                  <Option key="01" value="01">待复核</Option>
                </Select>
              )}
            </FormItem>
          </Col>
         <Col span={8}  style={{display: display}}>
           <FormItem label={`制单时间`} {...formItemLayout}>
             {getFieldDecorator('assetName', {})(
              <RangePicker/>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{ textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button style={{marginLeft: 30}} onClick={this.handleReset}>重置</Button>
           <a style={{marginLeft: 30, fontSize: 14}} onClick={this.toggle}>
             {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
           </a>
         </Col>
       </Row>
     </Form>
   )
 }
}
const SearchForm = Form.create()(SearchFormWrapper);