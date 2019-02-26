/*
 * @Author: gaofengjiao 
 * @Date: 2018-08-06
 * @Last Modified by: wwb
 * @Last Modified time: 2018-10-26 16:34:53
 */
/**
 * @file 药库 - 入库--配送单验收--列表
 */
import React, { PureComponent } from 'react';
import { Form, Input, Row, message, Col, Select, Button, Tooltip, Icon ,Badge,DatePicker} from 'antd';
import { Link } from 'react-router-dom';
import wareHouse from '../../../../api/drugStorage/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import {connect} from 'dva';
const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },//5
    md: {span: 8}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: {span: 16}
  },
};
const columns = [
  {
   title: '配送单/验收单',
   dataIndex: 'distributeCode',
   width: 248,
   render: (text,record) =>{
     return <span>
        <Badge count={record.checkAcceptDetailsItemsCount} overflowCount={999} style={{right:'-27px',zIndex:'0'}} showZero>
       {
         record.type === 100 || 
         record.type === 102 || 
         record.type === 101 ?  // 100, 102, 101 配送单详情
         <Link to={{pathname: `/drugStorage/wareHouse/psListCheck/detail/id=${record.distributeCode}&state=${record.auditStatus}`}}>{text}</Link>
         :
         <Link to={{pathname: `/drugStorage/wareHouse/psListCheck/outDetail/id=${record.distributeCode}&state=${record.auditStatus}`}}>{text}</Link>
       }
       </Badge>
      </span>
   }
  },
  {
    title: '订单号',
    dataIndex: 'orderCode',
    width: 154,
  },
  {
    title: '供应商/来源部门',
    dataIndex: 'supplierName',
    width: 140,
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    width: 90,
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    width: 100,
  },
  {
    title: '验收人',
    width: 128,
    dataIndex: 'receptionUserName',
  },
  {
    title: '验收时间',
    width: 168,
    dataIndex: 'receptionTime',
  },
  {
    title: '收货地址',
    dataIndex: 'deptAddress',
    width: 160,
    className: 'ellipsis',
      render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      )
  },
];

class SearchForm extends PureComponent{
  state = {
    type: [],
    status: [],
    supplierList: [],
    originDeptList: []
  }
  componentDidMount = () => {
    const {dispatch} = this.props.formProps;
    const {deptId} = this.props.formProps.users.currentDept;
    
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'acceptance_checkVo'
      },
      callback: (data)=>{
        this.setState({status: data})
      }
    });
    dispatch({
      type: 'wareHouse/getsupplierList',
      callback: (data)=>{
        this.setState({supplierList: data})
      }
    });
    dispatch({
      type: 'wareHouse/findOriginDept',
      payload: {
        deptCode: deptId
      },
      callback: ({data, code, msg})=>{
        if(code === 200) {
          this.setState({
            originDeptList: data
          });
        }else {
          message.error(`wareHouse/findOriginDept: ${msg}`);
        };
      }
    });
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'depot_type'
      },
      callback: (data)=>{
        this.setState({type: data})
      }
    });
    let { queryConditons } = this.props.formProps.base;
    queryConditons = {...queryConditons};
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
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        values.supplierCodeList = values.supplierCodeList? [values.supplierCodeList] : [];
        this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
        });
      };
      if(values.shelfTime && values.shelfTime.length) {
        values.receptionStartTime = values.shelfTime[0].format('YYYY-MM-DD');
        values.receptionEndTime = values.shelfTime[1].format('YYYY-MM-DD');
      }else {
        values.receptionStartTime = "";
        values.receptionEndTime = "";
      };
      this.props.formProps.dispatch({
        type:'base/updateConditions',
        payload: values
      });
    });
  }
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
  listRender = (list) => {
    return list.map(item => {
      return (<Option key={item.value} value={item.value}>{item.label}</Option>)
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    let { type, status, supplierList, originDeptList } = this.state;
    type = this.listRender(type);
    status = this.listRender(status);
    supplierList = supplierList.map(item=>{
      return <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
    });
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`单号`}>
              {
                getFieldDecorator(`distributeCode`)(
                  <Input placeholder='请输入单号' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
                {
                  getFieldDecorator(`supplierCodeList`)(
                    <Select 
                      allowClear
                      showSearch
                      placeholder={'请选择'}
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                    >
                      <Option value="">全部</Option>
                      {supplierList}
                    </Select>
                  )
                }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`状态`}>
              {
                getFieldDecorator(`acceptanceType`)(
                  <Select 
                    allowClear
                    showSearch
                    placeholder={'请选择'}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                    {status}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`类型`}>
              {
                getFieldDecorator('type')(
                  <Select 
                    allowClear
                    showSearch
                    placeholder={'请选择'}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                    {type}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`来源部门`}>
                {
                  getFieldDecorator(`originDeptCode`)(
                    <Select 
                      allowClear
                      showSearch
                      placeholder={'请选择'}
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                    >
                      <Option value="">全部</Option>
                      {
                        originDeptList.map(item =>(
                          <Option key={item.id} value={item.id}>{item.deptName}</Option>
                        ))
                      }
                    </Select>
                  )
                }
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`验收时间`} {...formItemLayout}>
              {getFieldDecorator('shelfTime', {})(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col style={{float:'right', textAlign: 'right', marginTop: 4}} >
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

class DistributionCheck extends PureComponent{
  state = {
    query: {
      checkType: 1
    },
    data: []
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  render(){
    let query = this.props.base.queryConditons;
    query = {
      ...query,
      ...this.state.query
    }
    delete query.key;
    const {match} = this.props;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm formProps={{...this.props}} query={this.queryHandler} />
        <div className='ant-row-bottom'>
          <Button type='primary' onClick={()=>this.props.history.push({ pathname: `${match.path}/add` })}>新建验收</Button>
        </div>
        <RemoteTable
          isJson={true}
          query={query}
          ref="tab"
          url={wareHouse.depotdistributeList}
          onChange={this._tableChange}
          columns={columns}
          isDetail={true}
          scroll={{ x: '100%', }}
          rowKey={'id'}
        />
      </div>
    )
  }
}
export default connect(state=>state)(DistributionCheck);