/*
 * @Author: yuwei  配货 /picking
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Icon, Select , Input , DatePicker} from 'antd';
import { Link } from 'react-router-dom'
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import { outStorage } from '../../../../api/drugStorage/outStorage';
import { connect } from 'dva';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
    title: '申领号',
    dataIndex: 'applyCode',
    width: 280,
    render:(text,record)=>
    <span>
      <Link to={{pathname: `/drugStorage/outStorage/acceptDistribution/details/${record.applyCode}`}}>{text}</Link>
    </span>  
  },
  {
   title: '申领部门',
   dataIndex: 'applyDeptName',
   width: 168,
  },
  {
    title: '状态',
    dataIndex: 'applyStatusName',
    width: 112,
  },
  {
    title: '类型',
    dataIndex: 'applyTypeName',
    width: 168
  },
  {
    title: '发起人',
    dataIndex: 'createUserName',
    width: 112,
  },
  {
    title: '发起时间',
    dataIndex: 'createDate',
    width: 224  ,
  }
];
/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
  state = {
    deptOption: [], // 申领部门
    apply_type_options: [], //配货类别
    common_distribute_status: [] // 配货状态
  }
  componentDidMount = () =>{
    const { dispatch } = this.props.formProps;
    // 查询已经申领过的部门
    dispatch({
      type: 'outStorage/genDeptList',
      payload: { },
      callback: (data) =>{
        this.setState({ deptOption: data || [] });
      }
    });

    // 配货类别
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: { type : 'apply_type' },
      callback: (data) =>{
        this.setState({ apply_type_options: data })
      }
    });
    // 配货状态
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: { type : 'common_distribute_status' },
      callback: (data) =>{
        this.setState({ common_distribute_status: data })
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
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const Time = values.Time === undefined || values.Time === null ? "" : values.Time;
        if(Time.length > 0) {
          values.startTime = values.Time[0].format('YYYY-MM-DD');
          values.endTime = values.Time[1].format('YYYY-MM-DD');
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
 
  render() {
    const { deptOption, apply_type_options, common_distribute_status } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`申领部门`} {...formItemLayout}>
              {getFieldDecorator('applyDeptCode', {})(
               <Select 
                 showSearch
                 placeholder={'请选择'}
                 optionFilterProp="children"
                 filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                 >
                  <Option key="" value="">全部</Option>
                  {
                    deptOption.map((item,index)=> <Option key={index} value={item.id} depttype={item.deptType}>{ item.deptName }</Option>)
                  }
               </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`状态`} {...formItemLayout}>
              {getFieldDecorator('applyStatus', {
                initialValue: ''
              })(
               <Select 
                 showSearch
                 placeholder={'请选择'}
                 optionFilterProp="children"
                 filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                 >
                {
                  common_distribute_status.map((item,index)=> <Option key={index} value={item.value}>{ item.label }</Option>)
                }
               </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`类型`} {...formItemLayout}>
              {getFieldDecorator('applyType',{
                initialValue: ''
              })(
               <Select 
                 showSearch
                 placeholder={'请选择'}
                 optionFilterProp="children"
                 filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                 >
                 {
                   apply_type_options.map((item,index)=> <Option key={index} value={item.value}>{ item.label }</Option>)
                 }
               </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`单据号`} {...formItemLayout}>
              {getFieldDecorator('applyCode',{
                initialValue: ''
              })(
               <Input placeholder='申领单'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`发起时间`} {...formItemLayout}>
              {getFieldDecorator('Time')(
               <RangePicker format={'YYYY-MM-DD'}/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ textAlign: 'right', marginTop: 4}} >
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
class Picking extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      query:{
        queryType: '2'
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
    query = {
      ...query,
      ...this.state.query
    }
    delete query.Time;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <SearchForm 
          formProps={{...this.props}}
        />
        <RemoteTable
          onChange={this._tableChange}
          bordered
          ref='table'
          query={query}
          url={outStorage.FINDDISTRIBUTE_LIST}
          scroll={{x: 1064}}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 20}}
        />
      </div>
    )
  }
}
export default connect(state => state)(Picking);

