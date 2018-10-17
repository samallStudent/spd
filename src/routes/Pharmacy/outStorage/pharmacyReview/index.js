/*
 * @Author: yuwei  新建出库 /output
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import {Form, Row, Col, Button, Icon, Select, Input, DatePicker} from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid/index';
import {outStorage} from '../../../../api/drugStorage/outStorage';
import {connect} from 'dva';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
   title: '出库单',
   dataIndex: 'backNo',
   width: 280,
   render:(text, record)=>
   <span>
      <Link to={{pathname: `/pharmacy/outStorage/pharmacyReview/details/id=${record.backNo}&state=${record.outStoreStatus}`}}>{text}</Link>
    </span>
  },
  {
    title: '拣货单',
    width: 280,
    dataIndex: 'pickingNo',
  },
  {
    title: '出库分类',
    width: 112,
    dataIndex: 'backType',
  },
  {
    title: '状态',
    width: 112,
    dataIndex: 'status',
  },
  {
    title: '申领部门',
    width: 168,
    dataIndex: 'deptName'
  },
  {
    title: '发起人',
    width: 112,
    dataIndex: 'createUserName'
  },
  {
   title: '发起时间',
   dataIndex: 'createDate',
   width: 224
  },
 {
  title: '复核人',
  width: 112,
  dataIndex: 'checkUserName'
 },
 {
  title: '复核时间',
  width: 224,
  dataIndex: 'checkDate'
 }
];

class Output extends PureComponent{
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  render(){
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.key;
    delete query.Time;
    return (
      <div className='ysynet-main-content'>
        <SearchForm formProps={{...this.props}} />
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          url={outStorage.OUTSTORELIST}
          ref="tab"
          scroll={{x: 1624}}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 20}}
        /> 
      </div>
    )
  }
}
export default connect(state=>state)(Output);
/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
  state = {
    status: [],
    dept: [],
    type: []
  }
  componentDidMount() {
    this.props.formProps.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'out_store_status'
      },
      callback: (data) => {
        this.setState({status: data});
      }
    });
    this.props.formProps.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'room_out_store_type'
      },
      callback: (data) => {
        this.setState({type: data});
      }
    });
    this.props.formProps.dispatch({
      type: 'base/findAllDepts',
      callback: (data) => {
        this.setState({
          dept: data
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
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let {time} = values;
      if(time.length > 0) {
        values.startTime = time[0].format('YYYY-MM-DD');
        values.endTime = time[1].format('YYYY-MM-DD');
      }else {
        values.startTime = '';
        values.endTime = '';
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

  dataRender = (data) => {
    return data.map((item, i)=>{
      return <Option key={i} value={item.value}>{item.label}</Option>
    })
  }

  render() {
    let {status, dept, type} = this.state;
    const { getFieldDecorator } = this.props.form;
    type = this.dataRender(type);
    status = this.dataRender(status);
    dept = dept.map((item, i) => {
      return <Option key={i} value={item.id}>{item.deptName}</Option>
    });
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`申领部门`} {...formItemLayout}>
              {getFieldDecorator('deptCode', {})(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                  {dept}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`出库时间`} {...formItemLayout}>
              {getFieldDecorator('time', {})(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`出库分类`} {...formItemLayout}>
              {getFieldDecorator('backType')(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                  {type}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`单据号`} {...formItemLayout}>
              {getFieldDecorator('orderNo')(
                <Input placeholder='出库单/拣货单'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`状态`} {...formItemLayout}>
              {getFieldDecorator('backStatus')(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                  {status}
                </Select>
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