/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 统计分析--订单执行情况
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, Icon, Select, message, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {statisticAnalysis} from '../../../../api/purchase/purchase';
const FormItem = Form.Item;
const {Option} = Select;
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
    supplierList: [],
    orderStatusList: [],
  }
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  componentDidMount() {
    let { queryConditons } = this.props.formProps.base;
    queryConditons = {...queryConditons};
    queryConditons.supplierCodeList = queryConditons.supplierCodeList ? queryConditons.supplierCodeList[0] : "";
    const { dispatch } = this.props.formProps;
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
      callback: ({code, msg, data}) => {
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
        type: 'order_status'
      },
      callback: (data) => {
        this.setState({
          orderStatusList: data
        });
      }
    });
  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.supplierCodeList = values.supplierCodeList ? [values.supplierCodeList] : [];
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
    const { supplierList, orderStatusList } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCodeList`)(
                  <Select
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                  >
                    <Option key="全部" value="">全部</Option>
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
            <FormItem {...formItemLayout} label={`订单单号`}>
              {
                getFieldDecorator(`orderCode`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`订单状态`}>
              {
                getFieldDecorator(`orderStatus`)(
                  <Select
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                  >
                    {
                      orderStatusList.map(item => (
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

class OrderFulfillment extends PureComponent {
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  exort = () => {
    let {queryConditons} = this.props.base;
    queryConditons = {...queryConditons};
    delete queryConditons.key;
    delete queryConditons.pageNo;
    delete queryConditons.pageSize;
    delete queryConditons.sortField;
    delete queryConditons.sortOrder;
    this.props.dispatch({
      type: 'statistics/orderExecuteExport',
      payload: queryConditons
    });
  }
  render() {
    const {match} = this.props;
    const columns = [
      {
        title: '订单单号',
        dataIndex: 'orderCode',
        width: 168,
        render: (text, record) => {
          return <span>
                  <Link to={{ pathname: `${match.path}/details/${text}`}}>{text}</Link>
                 </span>
        }
      }, {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 168,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '订单状态',
        dataIndex: 'orderStatusName',
        width: 112,
      }, {
        title: '采购品种数',
        dataIndex: 'purchaseTypeNum',
        width: 112
      }, {
        title: '实到品种数',
        dataIndex: 'actualTypeNum',
        width: 112,
      }, {
        title: '采购数量',
        dataIndex: 'purchaseCount',
        width: 112,
      }, {
        title: '实际到货数量',
        dataIndex: 'actualCount',
        width: 168,
      }
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...query,
    }
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
        />
        <div>
          <Button onClick={this.exort}>导出</Button>
        </div>
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          isDetail={true}
          scroll={{x: '100%' , }}
          isJson
          columns={columns}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'orderCode'}
          url={statisticAnalysis.ORDER_EXECUTE}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(OrderFulfillment));