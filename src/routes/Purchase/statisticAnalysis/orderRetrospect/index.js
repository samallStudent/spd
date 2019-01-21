/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 统计分析--损益分析
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, Icon, Select, DatePicker, message, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {statisticAnalysis} from '../../../../api/purchase/purchase';
const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
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
    storeHouseList: []
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
    dispatch({
      type: 'statistics/getDeptByParam',
      payload: {
        deptType: 3
      },
      callback: ({data, code ,msg}) => {
        if(code === 200) {
          this.setState({
            storeHouseList: data
          });
        }else {
          message.error(msg);
        };
      }
    })
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
    const { supplierList, orderStatusList, storeHouseList } = this.state;
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
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
            <FormItem {...formItemLayout} label={`补货库房`}>
              {
                getFieldDecorator(`deptCode`)(
                  <Select
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                  >
                    <Option key="全部" value="">全部</Option>
                    {
                      storeHouseList.map(item => (
                        <Option key={item.id} value={item.id}>{item.deptName}</Option>
                      ))
                    }
                  </Select>
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
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`下单时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker/>
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

class OrderRetrospect extends PureComponent {
  state = {
    query: {},
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  exort = () => {
    let {queryConditons} = this.props.base;
    queryConditons = {...queryConditons};
    delete queryConditons.closeDate;
    delete queryConditons.key;
    delete queryConditons.pageNo;
    delete queryConditons.pageSize;
    delete queryConditons.sortField;
    delete queryConditons.sortOrder;
    this.props.dispatch({
      type: 'statistics/exportTrace',
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
        title: '补货库房',
        dataIndex: 'deptName',
        width: 168
      }, {
        title: '下单人',
        dataIndex: 'createUserName',
        width: 112,
      }, {
        title: '下单日期',
        dataIndex: 'createDate',
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
        <div>
          <Button onClick={this.exort}>导出</Button>
        </div>
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          scroll={{x: '100%'}}
          isDetail={true}
          isJson
          columns={columns}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={statisticAnalysis.TRACE_LIST}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(OrderRetrospect));