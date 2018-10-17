/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 20:23:41
 */

/**
 * @file 药库 - 补货管理--计划订单
 */
import React, { PureComponent } from 'react';
import { Form, Button, message, Tooltip, DatePicker, Select, Row, Col, Input, Icon  } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { replenishmentPlan } from '../../../../api/replenishment/replenishmentPlan';
import { connect } from 'dva';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
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
class SearchForm extends PureComponent{
  state = {
    supplierList: [],
    orderStatus: [], // 订单状态
    orderTypeOptions: [] // 订单类型
  }
  componentDidMount = () =>{
    let { dispatch } = this.props;
    // 供应商
    dispatch({
      type: 'replenish/supplierList',
      payload: {},
      callback: (data) =>{
        this.setState({ supplierList: data })
      }
    });
    //订单状态
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'order_status'
      },
      callback: (data) =>{
        this.setState({ orderStatus: data })
      }
    });
    //订单类型
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'order_type'
      },
      callback: (data) =>{
        this.setState({ orderTypeOptions: data })
      }
    });
    let { queryConditons } = this.props.formProps.base;
    queryConditons = {...queryConditons}; //如果queryConditons 里面包含对象 那么必须深拷贝;
    if(queryConditons.supplierCodeList) {
      queryConditons.supplierCodeList = queryConditons.supplierCodeList[0];
    };
    //找出表单的name 然后set
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
  }
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const orderTime = values.orderTime === undefined ? '' : values.orderTime;
        if(orderTime.length){
          values.startTime = values.orderTime[0].format('YYYY-MM-DD');
          values.endTime = values.orderTime[1].format('YYYY-MM-DD');
        }else {
          values.startTime = '';
          values.endTime = '';
        };
        if(!values.supplierCodeList){
          values.supplierCodeList = [];
        }else {
          values.supplierCodeList = [values.supplierCodeList];
        };
        this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
        });
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { supplierList, orderStatus, orderTypeOptions } = this.state;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`订单号`}>
              {
                getFieldDecorator(`orderCode`)(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCodeList`)(
                  <Select
                    placeholder='请输入'
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                    <Option key={-1} value=''>全部</Option>
                    {
                      supplierList.map((item,index) => <Option key={index} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`下单时间`}>
              {
                getFieldDecorator(`orderTime`)(
                  <RangePicker format={'YYYY-MM-DD'}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`订单状态`}>
              {
                getFieldDecorator(`orderStatus`,{
                  initialValue: ''
                })(
                  <Select>

                    {
                      orderStatus.map((item,index) => <Option key={index} value={item.value}>{item.label}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`订单类型`}>
              {
                getFieldDecorator('orderType',{
                  initialValue: ''
                })(
                  <Select>
                    {
                      orderTypeOptions.map((item,index) => <Option key={index} value={item.value}>{item.label}</Option>)
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
class PlanOrder extends PureComponent{
  state = {
    selected: [],
    selectedRows: [],
    loading: false,
  }
  //关闭订单
  closeOrder = () =>{
    let { selectedRows,query } = this.state;
    if(selectedRows.length === 0){
      return message.warning('请至少选择一条数据')
    }
    let orderCodeList = [];
    selectedRows.map(item =>{
      if(item.orderStatus === '3'){
        orderCodeList.push(item.orderCode)
      }
      return null
    });
    if(orderCodeList.length === 0){
      return message.warning('选中的数据中暂无可关闭的订单,请重新勾选');
    }else{
      this.setState({ loading: true });
      this.props.dispatch({
        type: 'replenish/closeOrder',
        payload: { orderCodeList },
        callback: () =>{
          this.setState({ loading: false });
          this.refs.table.fetch(query);
        }
      })
    }
  }
  sendOrder = () =>{
    let { selected,selectedRows } = this.state;
    if (selected.length === 0) {
     return message.warn('请至少选择一条数据')
    }
    let orderLength =  selectedRows.filter(item => item.orderStatus === '1')[0].length;
    if(orderLength === selectedRows.length){
      this.setState({ loading: true });
      this.props.dispatch({
        type: 'replenish/sendOrder',
        payload: {}
      })
    }else{
      return message.warning('选中的数据中存在状态非待审核的单据,请检查重新提交')
    }
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    })
  }
  render(){
    const { loading } = this.state;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderCode',
        width: 280,
        render: (text,record) =>{
          return <span>
            <Link to={{pathname: `/purchase/replenishment/planOrder/detail/${record.orderCode}`}}>{text}</Link>
          </span>  
        }
      },{
        title: '计划单号',
        dataIndex: 'planCode',
        width: 168,
      },{
        title: '订单状态',
        dataIndex: 'orderStatusName',
        width: 112,
      },{
        title: '订单类型',
        dataIndex: 'orderTypeName',
        width: 168
      },{
        title: '供应商',
        dataIndex: 'supplierName',
        width: 168,
      },{
        title: '下单人',
        dataIndex: 'createUserName',
        width: 168
      },{
        title: '下单时间',
        dataIndex: 'createDate',
        width: 224,
      },{
        title: '收货地址',
        dataIndex: 'receiveAddress',
        width: 280,
        className: 'ellipsis',
          render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
          )
      },
    ];
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.orderTime;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
         <WrapperForm 
            dispatch={this.props.dispatch}
            formProps={{...this.props}}
          />
         <div className='ant-row-bottom'>
            <Button type='primary' onClick={this.sendOrder} disabled >发送订单</Button>
            <Button type='default' onClick={this.closeOrder} loading={loading} style={{ marginLeft: 8 }}>取消订单</Button>
         </div>
         <RemoteTable 
            onChange={this._tableChange}
            columns={columns}
            bordered
            isJson={true}
            query={query}
            ref='table'
            scroll={{ x: 1500 }}
            rowKey={'id'}
            url={replenishmentPlan.PURCHASEORDERLIST}
            rowSelection={{
              selectedRowKeys: this.state.selected,
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
              }
            }}
         />
      </div>
    )
  }
}
export default connect(state => state)(PlanOrder)