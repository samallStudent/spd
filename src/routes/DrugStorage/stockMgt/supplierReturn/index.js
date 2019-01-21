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
import { Form, Row, Col, Button, DatePicker, Select, message } from 'antd';
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
    md: {span: 8}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: {span: 16}
  },
};

class SearchForm extends PureComponent{
  state = {
    supplierList: []
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
    let { queryConditons } = this.props.formProps.base;
    //找出表单的name 然后set
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
    dispatch({
      type: 'statistics/supplierAll',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            supplierList: data
          });
        }else {
          message.error(msg);
        }
      }
    });
  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const closeDate = values.closeDate === undefined ? '' : values.closeDate;
        if (closeDate.length > 0) {
          values.startTime = closeDate[0].format('YYYY-MM-DD');
          values.endTime = closeDate[1].format('YYYY-MM-DD');
        }else {
          values.startTime = '';
          values.endTime = '';
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
    const { supplierList } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCode`)(
                  <Select
                    style={{width: '100%'}}
                    placeholder="请选择供应商名称检索"
                  >
                    <Option key="" value="">全部</Option>
                    {
                      supplierList.map(item => (
                        <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`退货时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker style={{width: '100%'}}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
         </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class SupplierReturn extends PureComponent {
  state = {
    query: {},
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  export = () => {
    const {query} = this.state;
    this.props.dispatch({
      type: 'statistics/supplierReturnExport',
      payload: query,
    });
  }
  render() {
    const columns = [
      {
        title: '供应商',
        dataIndex: 'ctmaSupplierName',
        width: 168,
      }, {
        title: '退货总单数',
        dataIndex: 'backCount',
        width: 168,
        sorter: () => false
      }, {
        title: '退货总金额(万元)',
        dataIndex: 'backPrice',
        width: 168,
        sorter: () => false
      }, {
        title: '采购总单数',
        dataIndex: 'orderCount',
        width: 168,
        sorter: () => false
      }, {
        title: '采购品类数',
        dataIndex: 'orderdetailDrugCount',
        width: 168,
        sorter: () => false
      }, {
        title: '采购总金额(万元)',
        dataIndex: 'orderPrice',
        width: 168,
        sorter: () => false
      }, {
        title: '退货金额占比(%)',
        dataIndex: 'backProportion',
        width: 168
      }
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...query,
    };
    delete query.closeDate;
    delete query.key;
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
          isDetail={true}
          scroll={{x: '100%' , }}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={statisticAnalysis.SUPPLIER_RETURN_LIST}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(SupplierReturn));