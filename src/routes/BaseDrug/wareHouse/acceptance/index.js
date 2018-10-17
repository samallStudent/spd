/*
 * @Author: yuwei  验收 /acceptance
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import {Form, Row, Col, Button, Icon, Select , Input , DatePicker } from 'antd';
import RemoteTable from '../../../../components/TableGrid/index';
import {acceptance} from '../../../../api/baseDrug/wareHouse';
import { Link } from 'react-router-dom';
import {connect} from 'dva';
import { formItemLayout } from '../../../../utils/commonStyles';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
   title: '出库单',
   dataIndex: 'distributeCode',
   width:150,
   render:(text, record)=>(<Link to={{pathname: `/baseDrug/wareHouse/acceptance/details/${record.distributeCode}`}}>{text}</Link>)
  },
  {
    title: '申领单',
    width:150,
    dataIndex: 'supplierCode',
  },
  {
    title: '配货部门',
    width:100,
    dataIndex: 'deptName'
  },
  {
    title: '状态',
    width:150,
    dataIndex: 'statusName',
  },
  {
    title: '发起人',
    width:100,
    dataIndex: 'createName'
  },
  {
    title: '发起时间',
    dataIndex: 'createDate',
    width:120
  },
  {
   title: '验收时间',
   width:120,
   dataIndex: 'receptionTime'
  }
];

class Acceptance extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      query:{
        checkType: 3
      },
    }
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  
  render(){
    let query = this.props.base.queryConditons;
    query = {...query, ...this.state.query};
    delete query.key;
    delete query.checkTime;
    delete query.initTime;
    return (
      <div  className='ysynet-main-content'>
        <SearchForm formProps={{...this.props}} />
        <Row>
          <Button type='primary' className='button-gap'>
            <Link to={{pathname:`/baseAddNewAcceptance`}}>新建验收</Link>
          </Button>
        </Row>
        <RemoteTable
          onChange={this._tableChange}
          isJson
          query={query}
          ref="tab"
          url={acceptance.CHECKACCEPT_LIST}
          scroll={{x: '100%'}}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 20}}
        /> 
      </div>
    )
  }
}
export default connect(state=>state)(Acceptance);
/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
  state = {
    statusList: []
  }
  componentDidMount() {
      this.props.formProps.dispatch({
        type: 'base/orderStatusOrorderType',
        payload: {
          type: 'basemedic_check'
        },
        callback: (data) => {
          this.setState({statusList: data});
        }
      });
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
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
    let {initTime, checkTime} = values;
    if(initTime && initTime.length !== 0){
      values.launchStartTime = initTime[0].format('YYYY-MM-DD');
      values.launchEndTime = initTime[1].format('YYYY-MM-DD');
    }else {
      values.launchStartTime = '';
      values.launchEndTime = '';
    };
    if(checkTime && checkTime.length !== 0){
      values.checkStartTime = checkTime[0].format('YYYY-MM-DD');
      values.checkEndTime = checkTime[1].format('YYYY-MM-DD');
    }else {
      values.checkStartTime = '';
      values.checkEndTime = '';
    };
    this.props.formProps.dispatch({
      type:'base/updateConditions',
      payload: values
    });
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }

  render() {
    let {statusList} = this.state;
    const { getFieldDecorator } = this.props.form;
    statusList = statusList.map(item=>{
      return <Option key={item.value} value={item.value}>{item.label}</Option>
    });
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`单据`} {...formItemLayout}>
              {getFieldDecorator('bill', {})(
                <Input placeholder='入库单/配送单/订单号'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} >
            <FormItem label={`状态`} {...formItemLayout}>
              {getFieldDecorator('status')(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                  {statusList}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`发起时间`} {...formItemLayout}>
              {getFieldDecorator('initTime', {})(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`验收时间`} {...formItemLayout}>
              {getFieldDecorator('checkTime', {})(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ textAlign: 'right', marginTop: 4,float:'right'}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
              {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchForm = Form.create()(SearchFormWrapper);