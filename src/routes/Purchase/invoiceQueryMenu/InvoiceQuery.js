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
import { Form, Row, Col, Button, Input, DatePicker, Icon } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../components/TableGrid';
import { connect } from 'dva';
import {invoiceQueryMenu} from '../../../api/purchase/purchase';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  componentDidMount() {
    let { queryConditons } = this.props.formProps.base;
    //找出表单的name 然后set
    console.log(queryConditons);
    
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const invoiceDate = values.invoiceDate === undefined ? '' : values.invoiceDate;
        if (invoiceDate.length > 0) {
          values.invoiceStartTime = invoiceDate[0].format('YYYY-MM-DD');
          values.invoiceEndTime = invoiceDate[1].format('YYYY-MM-DD');
        }else {
          values.invoiceStartTime = '';
          values.invoiceEndTime = '';
        };
        const closeDate = values.closeDate === undefined ? '' : values.closeDate;
        if (closeDate.length > 0) {
          values.settleStartTime = closeDate[0].format('YYYY-MM-DD');
          values.settleEndTime = closeDate[1].format('YYYY-MM-DD');
        }else {
          values.settleStartTime = '';
          values.settleEndTime = '';
        };
        this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
        });
      }
    })
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
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
                getFieldDecorator(`supplierName`)(
                  <Input placeholder='请输入' className={'ysynet-formItem-width'}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`结算单号`}>
              {
                getFieldDecorator(`settleBillNo`)(
                  <Input placeholder='请输入' className={'ysynet-formItem-width'}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`发票代码/号码`}>
              {
                getFieldDecorator(`invoiceParam`)(
                  <Input placeholder='请输入' className={'ysynet-formItem-width'}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`结算单日期`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker className={'ysynet-formItem-width'}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`发票日期`}>
              {
                getFieldDecorator(`invoiceDate`)(
                  <RangePicker className={'ysynet-formItem-width'}/>
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

class ReplenishmentPlan extends PureComponent {
  state = {
    query: {},
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  render() {
    const columns = [
      {
        title: '发票号码',
        dataIndex: 'invoiceNo',
        width: 168,
        render: (text, record) => {
          return <span>
                  <Link to={{ pathname: `/purchase/invoiceQueryMenu/InvoiceQuery/details/${text}`}}>{text}</Link>
                 </span>
        }
      }, {
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width: 168,
      }, {
        title: '结算单号',
        dataIndex: 'settleBillNo',
        width: 168,
      }, {
        title: '发票日期',
        dataIndex: 'invoiceTime',
        width: 168,
      }, {
        title: '发票金额(元)',
        dataIndex: 'invoiceAmount',
        width: 168
      }, {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 168,
      }, {
        title: '结算金额(元)',
        dataIndex: 'settleAmount',
        width: 168,
      }, {
        title: '结算单日期',
        dataIndex: 'settleDate',
        width: 168,
      }
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...query,
    }
    delete query.invoiceDate;
    delete query.closeDate;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
        />
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          isJson
          columns={columns}
          scroll={{x: 1344}}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={invoiceQueryMenu.INVOICE_LIST}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(ReplenishmentPlan));