/*
 * @Author: yuwei  退库 /refund
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Icon, Select , Input ,DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import { outStorage } from '../../../../api/drugStorage/outStorage';
import { connect } from 'dva';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
    title: '退库单',
    dataIndex: 'backNo',
    width: 280,
    render: (text, record) => 
    <span>
      <Link to={{pathname: `/pharmacy/outStorage/refund/details/${text}`}}>{text}</Link>
    </span>
   },
  {
    title: '受理部门',
    dataIndex: 'backDpetName',
    width: 168,
  },
  {
    title: '退库原因  ',
    dataIndex: 'backCause',
    width: 280,
  },
  {
    title: '状态',
    width: 112,
    dataIndex: 'backStatusName',
  },
  {
    title: '退库人',
    width: 112,
    dataIndex: 'createUserName',
  },
  {
   title: '退库时间',
   width: 224,
   dataIndex: 'createDate',
  },
  {
    title: '复核人',
    width: 112,
    dataIndex: 'reviewUserName',
   },
   {
    title: '复核时间',
    width: 224,
    dataIndex: 'reviewDate',
   }
];
/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
  state = {
    back_status_options: [], // 状态
    backCause: []
  }
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  componentDidMount = () =>{
    const { dispatch } = this.props.formProps;
    // 状态下拉框
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: { type: 'back_status' },
      callback: (data) =>{
        this.setState({ back_status_options: data });
      }
    });
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'back_cause_room'
      },
      callback: (data) => {
        this.setState({
          backCause: data
        });
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
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const backTime = values.backTime === undefined || values.backTime === null ? "" : values.backTime;
        if(backTime.length > 0) {
          values.startTime = values.backTime[0].format('YYYY-MM-DD');
          values.endTime = values.backTime[1].format('YYYY-MM-DD');
        }else {
          values.startTime = '';
          values.endTime = '';
        }
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
  render() {
    const { back_status_options, backCause } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block'; 
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`退库单号`} {...formItemLayout}>
              {getFieldDecorator('backNo', {
                initialValue: ''
              })(
               <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`退库原因`} {...formItemLayout}>
              {getFieldDecorator('backCause')(
                <Select
                  placeholder="请选择退库原因"
                  style={{width: '100%'}}
                >
                  {
                    backCause.map(item => (
                      <Option key={item.value} value={item.value}>{item.label}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
             <FormItem label={`状态`} {...formItemLayout}>
               {getFieldDecorator('backStatus',{
                 initialValue: ''
               })(
                 <Select 
                   showSearch
                   placeholder={'请选择'}
                   optionFilterProp="children"
                   filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                   >
                   {
                     back_status_options.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                   }
                 </Select>
               )}
             </FormItem>
           </Col>
          <Col span={8}  style={{display: display}}>
            <FormItem label={`退库时间`} {...formItemLayout}>
              {getFieldDecorator('backTime', {})(
               <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
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
class Refund extends PureComponent{
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  };
  render(){
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.key;
    delete query.backTime;
    return (
      <div className='ysynet-main-content'>
        <SearchForm 
          formProps={{...this.props}} 
        />
        <Row>
          <Button type='primary'>
            <Link to={{pathname:`/AddNewBackStoragePlan`}}>新建退库</Link>
          </Button>
        </Row>
        <RemoteTable
          onChange={this._tableChange}
          ref='table'
          query={query}
          bordered
          url={outStorage.FINDCOMMONBACK_LIST}
          scroll={{x: 1512}}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 20}}
        /> 
      </div>
    )
  }
}
export default connect(state => state)(Refund) ;
