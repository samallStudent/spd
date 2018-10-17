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
import { Form, Row, Col, Button, DatePicker, Select } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {statisticAnalysis} from '../../../../api/purchase/purchase';
import moment from 'moment';

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
const dateFormat = 'YYYY-MM-DD';


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
  //重置
  handleReset = () => {
    this.props.form.resetFields();
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`出库时间`}>
              {
                getFieldDecorator(`closeDate`, {
                  initialValue: [moment(), moment().subtract(-1, 'months')]
                })(
                  <RangePicker style={{width: '100%'}}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`排序`}>
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
         </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class SupplierRank extends PureComponent {
  state = {
    query: {
      startTime: moment().format(dateFormat),
      endTime: moment().subtract(-1, 'months').format(dateFormat)
    },
  }
  handlQuery = (query) => {
    this.setState({query});
  }
  export = () => {
    
  }
  render() {
    const columns = [
      {
        title: '排行',
        dataIndex: 'invoiceNo',
        width: 60,
      }, {
        title: '供应商',
        dataIndex: 'invoiceCode',
        width: 168,
      }, {
        title: '出库品类数',
        dataIndex: 'settleBillNo',
        width: 168,
      }, {
        title: '出库数量',
        dataIndex: 'invoiceTime',
        width: 168,
      }, {
        title: '出库总金额(万元)',
        dataIndex: 'invoiceAmount',
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
          scroll={{x: '100%'}}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={statisticAnalysis.INVOICE_LIST}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(SupplierRank));