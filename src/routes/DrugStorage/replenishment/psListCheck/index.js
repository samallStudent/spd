/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-07-30 14:22:36
 */

/**
 * @file 药库 - 补货管理--配送单验收
 */
import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Select, Button, Table, Tooltip, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { createData } from '../../../../common/data';
const FormItem = Form.Item;
const { Option } = Select;
let data = createData();
let dataSource =  data.map(item=> {
  item.checkUser = '高晓松'
  item.checkTime = '2018-07-22 18:33';
  return item
});
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },//5
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 }
  },
};
const columns = [
  {
   title: '配送单号',
   width:150,
   dataIndex: 'medicinalCode',
   render: (text,record) =>{
     return <span>
        <Link to={{pathname: `/drugStorage/replenishment/psListCheck/detail`}}>{text}</Link>
      </span>
   }
  },
  {
    title: '订单号',
    width:140,
    dataIndex: 'planNo',
  },
  {
    title: '供应商',
    width:120,
    dataIndex: 'fOrgName',
  },
  {
    title: '状态',
    width:100,
    dataIndex: 'fstate',
    render: (text,record) =>{
      if(text === '00'){
        return '待确认'
      }else if( text === '01' ){
        return '采购中'
      }else if(text === '09'){
        return '已驳回'
      }else{
        return ''
      }
    }
  },
  {
    title: '类型',
    width: 100,
    dataIndex: 'planType',
  },
  {
    title: '收货地址',
    dataIndex: 'tfAddress',
    width: 270,
    className: 'ellipsis',
      render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      )
  },
  {
    title: '制单人',
    width: 150,
    dataIndex: 'createUser',
  },
  {
    title: '制单时间',
    width: 150,
    dataIndex: 'planTime',
  },
  {
    title: '验收人',
    width: 120,
    dataIndex: 'checkUser',
  },
  {
    title: '验收时间',
    width:150,
    dataIndex: 'checkTime',
  }
];

class SearchForm extends PureComponent{
  state = {
    display: 'none'
  }
  toggle = () => {
    const { display, expand } = this.state;
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { display, expand } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`配送单号`}>
              {
                getFieldDecorator(`planNo`,{
                  initialValue: ''
                })(
                  <Input placeholder='扫描配送单二维码或输入配送单号' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`fOrgName`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`状态`}>
              {
                getFieldDecorator(`fstate`,{
                  initialValue: ''
                })(
                  <Select >
                    <Option key={-1} value=''>请选择</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`类型`}>
              {
                getFieldDecorator('type',{
                  initialValue: ''
                })(
                  <Select >
                    <Option key={-1} value=''>全部</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={expand ? 16: 8} style={{ textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
           <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
             {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
           </a>
         </Col>
         {/*  <Col span={15} style={{ textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
         </Col> */}
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);
class DistributionCheck extends PureComponent{
  state = {
    dataSource: dataSource
  }
  
  render(){
    return (
      <div className='ysynet-main-content'>
         <WrapperForm />
         <div className='ant-row-bottom'>
            <Button type='primary' onClick={()=>this.props.history.push({ pathname: `/drugStorage/replenishment/psListCheck/add` })}>新建验收</Button>
         </div>
         <Table 
          columns={columns}
          bordered
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          scroll={{ x: '150%' }}
          rowKey={'id'}
          pagination={{
            size: "small",
            showQuickJumper: true,
            showSizeChanger: true
          }}
         />
      </div>
    )
  }
}
export default DistributionCheck;