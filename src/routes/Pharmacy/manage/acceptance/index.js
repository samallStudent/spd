/*
 * @Author: yuwei  验收 /acceptance
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
   title: '申领单',
   dataIndex: 'medicinalCode',
   width:150,
   render:(text)=>(<Link to={{pathname: `/pharmacy/manage/acceptance/details`}}>{text}</Link>)
  },
  {
    title: '药库出库单',
    width:150,
    dataIndex: 'productName',
  },
  {
    title: '药库',
    width:100,
    dataIndex: 'productName1',
    render:()=>`药库`
  },
  {
    title: '状态',
    width:150,
    dataIndex: 'productName123',
    render:()=>`待验收`
  },
  {
    title: '制单人',
    width:100,
    dataIndex: 'fmodal2',
    render: () => '墨瞳'
  },
  {
    title: '制单时间',
    dataIndex: 'spec1',
    width:120,
    render: () => '2018-7-25 21:42'
  },
  {
    title: '验收人',
    width:100,
    dataIndex: 'custodian',
    render: () => '墨瞳'
  },
  {
   title: '验收时间',
   width:120,
   dataIndex: 'useDept',
   render: () => '2018-7-25 21:42'
  }
];

class Acceptance extends PureComponent{

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
          <Button type='primary' className='button-gap'>
            <Link to={{pathname:`/pharmacy/manage/acceptance/add`}}>新建验收</Link>
          </Button>
        </Row>
        <Table
          dataSource={createData()}
          bordered
          loading={ this.state.loading}
          scroll={{x: '100%'}}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 20}}
        /> 
      </div>
    )
  }
}
export default Acceptance;
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
           <FormItem label={`单据`} {...formItemLayout}>
             {getFieldDecorator('assetCode', {})(
              <Input placeholder='入库单/配送单/订单号'/>
             )}
           </FormItem>
         </Col>
         <Col span={8} >
           <FormItem label={`状态`} {...formItemLayout}>
             {getFieldDecorator('useDeptGuid123')(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                <Option key="" value="">全部</Option>
                <Option key="01" value="01">待验收</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`制单时间`} {...formItemLayout}>
             {getFieldDecorator('assetName', {})(
              <RangePicker/>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`验收时间`} {...formItemLayout}>
             {getFieldDecorator('assetName123', {})(
              <RangePicker/>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{ textAlign: 'right', marginTop: 4,float:'right'}} >
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