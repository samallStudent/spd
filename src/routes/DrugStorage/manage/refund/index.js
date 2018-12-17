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
    title: '出库单',
    dataIndex: 'medicinalCode',
    width:150,
    fixed: 'left',
    render: (text, record) => 
    <span>
      <Link to={{pathname: `/drugStorage/drugStorageManage/refund/details`}}>{text}</Link>
    </span>
   },
  {
    title: '退货单',
    width:150,
    dataIndex: 'productName',
  },
  {
    title: '配货单',
    dataIndex: 'medicinalCode2  ',
    width:150,
    render: (text, record, index) => '1000000000000' + index
   },
  {
    title: '库房',
    dataIndex: 'spec1',
    render:(text)=>'药库'
    
  },
  {
    title: '出库分类',
    dataIndex: 'fmodal2',
    render:(text)=>'退货出库'
  },
  {
    title: '状态',
    width:100,
    dataIndex: 'spec21',
    render:(text)=>'待复核'
  },
  {
    title: '供应商',
    width:100,
    dataIndex: 'custodian',
    render: (text, record, index) => 'PHXL'
  },
  {
    title: '制单人',
    width:100,
    dataIndex: 'bDept',
    render: (text, record, index) => 'wang' + index
  },
  {
   title: '制单时间',
   width:150,
   dataIndex: 'useDept',
   render: (text, record, index) => '2018-7-25 21:47'
  },
 {
  title: '复核人',
  width:100,
  dataIndex: 'useDept1',
  render: (text, record, index) => 'wang' + index
 },
 {
  title: '复核时间',
  width:150,
  dataIndex: 'useDept123',
  render: (text, record, index) => '2018-7-25 21:47'
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
      <div className='ysynet-main-content'>
        <SearchForm query={this.queryHandler} />
        <Row>
          <Button type='primary'>
            <Link to={{pathname:`/drugStorage/drugStorageManage/refund/add`}}>新建退货</Link>
          </Button>
        </Row>
        <Table
          dataSource={createData()}
          bordered
          loading={ this.state.loading}
          scroll={{x: '120%'}}
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
         <Col span={8} style={{display: display}}>
           <FormItem label={`供应商`} {...formItemLayout}>
             {getFieldDecorator('manageDeptGuid')(
              <Input/>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{ textAlign: 'right', marginTop: 4}} >
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