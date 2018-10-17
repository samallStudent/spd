/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 补货管理--补货计划
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, DatePicker, Select, Input, Icon } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {statisticAnalysis} from '../../../../api/purchase/purchase';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  },
};

class SearchForm extends PureComponent{
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const closeDate = values.closeDate === undefined ? '' : values.invoiceDate;
        if (closeDate.length > 0) {
          values.invoiceStartTime = closeDate[0].format('YYYY-MM-DD');
          values.invoiceEndTime = closeDate[1].format('YYYY-MM-DD');
        }else {
          values.invoiceStartTime = '';
          values.invoiceEndTime = '';
        };
        this.props._handlQuery(values);
      }
    })
  }
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`closeDate`)(
                  <Input placeholder="请输入供应商名称检索"/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`订单发送时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker style={{width: '100%'}}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} style={{display}} label={`排序`}>
              {
                getFieldDecorator(`invoiceDate`)(
                  <Select 
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                  >
                    <Option value={""} key={""}>全部</Option>
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

class SupplierSupply extends PureComponent {
  state = {
    query: {},
  }
  handlQuery = (query) => {
    this.setState({query});
  }
  export = () => {
    
  }
  render() {
    const columns = [
      {
        title: '供应商',
        dataIndex: 'invoiceCode',
        width: 168,
      }, {
        title: '订单号',
        dataIndex: 'settleBillNo',
        width: 168,
      }, {
        title: '订单发送时间',
        dataIndex: 'invoiceTime',
        width: 168,
      }, {
        title: '平均到货天数',
        dataIndex: 'pjdhts',
        width: 168
      }, {
        title: '采购品种数',
        dataIndex: 'cgpzs',
        width: 168
      }, {
        title: '配送品种数',
        dataIndex: 'pspzs',
        width: 168
      }, {
        title: '采购数量',
        dataIndex: 'cgsl',
        width: 112
      }, {
        title: '实际到货数量',
        dataIndex: 'sjdhsl',
        width: 168
      }
    ];
    const {query} = this.state;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
          _handlQuery={this.handlQuery}
        />
        <div>
          <Button onClick={this.export}>导出</Button>
        </div>
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          isJson
          columns={columns}
          scroll={{x: 1288}}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={statisticAnalysis.INVOICE_LIST}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(SupplierSupply));