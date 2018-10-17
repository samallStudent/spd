/*
 * @Author: yuwei  拣货下架 /pickSoldOut
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import { Table , Form, Row, Col, Button, Icon, Select , Input , DatePicker ,} from 'antd';
import { Link } from 'react-router-dom'
import { formItemLayout } from '../../../../utils/commonStyles';
import { createData } from '../../../../common/data';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
    title: '配货单',
    dataIndex: 'medicinalCode',
    fixed: 'left',
    width: 180,
    render:(text)=>(
      <span>
        <Link to={{pathname: `/drugStorage/drugStorageManage/pickSoldOut/details`}}>{text}</Link>
      </span> 
    )
  },
  {
   title: '申领药房',
   dataIndex: 'index',
   render: (text, record, index) => '药库'
  },
  {
    title: '申领单',
    dataIndex: 'medicinalCode123',
    width:150,
    render: (text, record, index) => '单据'+index
  },
  {
    title: '状态',
    dataIndex: 'fstate',
    width:120,
    render: (text, record, index) => text === '00' ? '已申领' : '未申领'
  },
  {
    title: '类型',
    dataIndex: 'equipmfmodalentStandardName',
    render: (text, record, index) => '类型' + index
  },
  {
    title: '制单人',
    dataIndex: 'spec123',
    width:120,
    render: (text, record, index) => '王文斌' + index
  },
  {
    title: '制单时间',
    dataIndex: 'custodian',
    width:150,
    render: (text, record, index) => '2018-7-25 21:17'
  },
  {
    title: '拣货人',
    dataIndex: 'bDept',
    width:150,
    render: (text, record, index) => 'cheng'
  },
  {
    title: '拣货时间',
    dataIndex: 'time',
    width: 180,
    render: (text, record, index) => '2018-7-25 21:17'
  }
];

class PickSoldOut extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query:{},
      messageError:"",
      selectedRowKeys:[]
    }
  }

  queryHandler = (query) => {
    this.setState({ query:query })
  }

  render(){
    return (
      <div className='ysynet-main-content'>
        <SearchForm query={this.queryHandler} />
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
export default PickSoldOut;

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
           <FormItem label={`申领药房`} {...formItemLayout}>
             {getFieldDecorator('assetCode', {})(
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
         <Col span={8}>
           <FormItem label={`状态`} {...formItemLayout}>
             {getFieldDecorator('fstate', {})(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    <Option key="" value="">全部</Option>
                    <Option key="01" value="01">待确认</Option>
                    <Option key="02" value="02">已确认</Option> 
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`类型`} {...formItemLayout}>
             {getFieldDecorator('spec')(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                <Option key="" value="">全部</Option>
                <Option key="01" value="02">申领</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`单据号`} {...formItemLayout}>
             {getFieldDecorator('danjuhao')(
              <Input/>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`制单时间`} {...formItemLayout}>
             {getFieldDecorator('time')(
              <RangePicker/>
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