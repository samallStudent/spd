/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 18:10:57
 */

/**
 * @file 药库 - 补货管理--补货计划
 */
import React, { PureComponent } from 'react';
import { Form, Button, message, Tooltip, DatePicker, Select, Row, Col, Input,Icon  } from 'antd';
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
    plan_type: [],// 类型
    audit_plan_status: [] // 状态
  }
  componentDidMount = () =>{
    const { dispatch } = this.props;
    //类型
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: { type : 'plan_type' },
      callback: (data) =>{
        this.setState({ plan_type: data })
      }
    });
    //状态
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: { type : 'audit_plan_status' },
      callback: (data) =>{
        this.setState({ audit_plan_status: data })
      }
    });
    //回显搜索条件
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
    const { plan_type, audit_plan_status } = this.state;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`计划单号`}>
              {
                getFieldDecorator(`planCode`)(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`状态`}>
              {
                getFieldDecorator(`auditStatus`)(
                  <Select
                    placeholder='请输入'
                    allowClear={true}
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      audit_plan_status.map((item,index)=> <Option key={index} value={item.value}>{ item.label }</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`发起时间`}>
              {
                getFieldDecorator(`orderTime`)(
                  <RangePicker format={'YYYY-MM-DD'}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`类型`}>
              {
                getFieldDecorator('planType')(
                  <Select
                    placeholder='请输入'
                    allowClear={true}
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      plan_type.map((item,index)=> <Option key={index} value={item.value}>{ item.label }</Option>)
                    }
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
        </Row>
      </Form>
    )
  }
}

const WrapperForm = Form.create()(SearchForm);
class PlanCheck extends PureComponent{
  state = {
    selected: [],
    selectedRows: [],
    loading: false,
    query: {
      queryType: '2'
    },
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  bitchPass = () =>{
    let { selected, selectedRows,query } = this.state;
    if(selected.length === 0){
      return message.warning('请至少选择一条数据');
    }
    let list = [],values = {};
    selectedRows.map(item => list.push(item.planCode));
    values.opType = '4' // 审核通过;
    values.list = list;
    this.setState({ loading: true });
    this.props.dispatch({
      type: 'replenish/updateStatus',
      payload: { ...values },
      callback: () =>{
        this.setState({ loading: false, selected: [], selectedRows: [] });
        this.refs.table.fetch({ ...query, queryType: '2' });
      }
    })
  }
  render(){
    const { loading } = this.state;
    const columns = [
      {
        title: '计划单号',
        dataIndex: 'planCode',
        width: 280,
        render: (text,record) =>{
          return <span>
            <Link to={{pathname: `/purchase/replenishment/planCheck/detail/${record.planCode}/${record.auditStatus}`}}>{text}</Link>
          </span>  
        }
      },{
        title: '状态',
        dataIndex: 'statusName',
        width: 112,
      },{
        title: '类型',
        dataIndex: 'planTypeName',
        width: 168,
      },{
        title: '发起人',
        dataIndex: 'createUserName',
        width: 168,
        },{
        title: '发起时间',
        dataIndex: 'createDate',
        width: 224,
      },{
        title: '审核人',
        dataIndex: 'sheveUserName',
        width: 112,
      },{
        title: '审核时间',
        dataIndex: 'sheveDate',
        width: 224,
      },{
        title: '收货地址',
        dataIndex: 'receiveAddress',
        width: 280,
        className: 'ellipsis',
          render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
          )
      }
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...query,
      ...this.state.query
    }
    delete query.orderTime;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
         <WrapperForm 
          dispatch={this.props.dispatch}
          formProps={{...this.props}}
        />
         <div className='ant-row-bottom'>
            <Button type='primary' onClick={this.bitchPass} loading={loading} style={{ marginLeft: 8 }}>批量通过</Button>
         </div>
         <RemoteTable 
            ref='table'
            query={query}
            columns={columns}
            url={replenishmentPlan.PLANLIST}
            bordered
            scroll={{ x: 1568 }}
            rowKey={'id'}
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
export default connect(state => state)(PlanCheck);