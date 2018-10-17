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
import { Form, Row, Col, Button, DatePicker, Select, Icon, message } from 'antd';
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
  state = {
    sortList: [],
    supplierList: []
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
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
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'order_by'
      },
      callback: (data) => {
        this.setState({
          sortList: data
        });
      }
    })
  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const closeDate = values.closeDate === undefined ? '' : values.invoiceDate;
        if (closeDate.length > 0) {
          values.startTime = closeDate[0].format('YYYY-MM-DD');
          values.endTime = closeDate[1].format('YYYY-MM-DD');
        }else {
          values.startTime = '';
          values.endTime = '';
        };
        delete values.closeDate;
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
    const { sortList, supplierList } = this.state;
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
          <Col span={8}>
            <FormItem {...formItemLayout} style={{display}} label={`排序`}>
              {
                getFieldDecorator(`orderBy`)(
                  <Select
                    style={{width: '100%'}}
                    placeholder="请选择排序方式搜索"
                  >
                    <Option key="" value="">全部</Option>
                    {
                      sortList.map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))
                    }
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

class SupplierReturn extends PureComponent {
  state = {
    query: {},
  }
  handlQuery = (query) => {
    this.setState({query});
  }
  export = () => {
    const {query} = this.state;
    this.props.dispatch({
      type: 'statistics/supplierReturnExport',
      payload: query,
    })
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
      }, {
        title: '退货品类数',
        dataIndex: 'backdetailDrugCount',
        width: 168,
      }, {
        title: '退货总金额(万元)',
        dataIndex: 'backPrice',
        width: 168,
      }, {
        title: '采购总单数',
        dataIndex: 'backCount	',
        width: 168
      }, {
        title: '采购品类数',
        dataIndex: 'orderdetailDrugCount',
        width: 168
      }, {
        title: '采购总金额(万元)',
        dataIndex: 'orderPrice',
        width: 168
      }, {
        title: '退货金额占比(%)',
        dataIndex: 'backProportion',
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
          scroll={{x: 1344}}
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