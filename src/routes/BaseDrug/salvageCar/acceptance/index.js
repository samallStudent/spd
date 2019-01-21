/*
 * @Author: yuwei  验收 /acceptance
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import {Form, Row, Col, Button, Icon, Select , Input , DatePicker, message } from 'antd';
import RemoteTable from '../../../../components/TableGrid/index';
import salvageCar from '../../../../api/baseDrug/salvageCar';
import { Link } from 'react-router-dom';
import {connect} from 'dva';
//import { formItemLayout } from '../../../../utils/commonStyles';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
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

class Acceptance extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      query:{
        checkType: 4
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
    const {match} = this.props;
    const columns = [
      {
        title: '出库单',
        dataIndex: 'distributeCode',
        width: 168,
        render:(text, record)=>(<Link to={{pathname: `${match.path}/details/${record.distributeCode}`}}>{text}</Link>)
      },
      {
        title: '申领单',
        width: 168,
        dataIndex: 'applyCode',
      },
      {
        title: '申领抢救车',
        width: 168,
        dataIndex: 'deptName'
      },
      {
        title: '状态',
        width: 112,
        dataIndex: 'statusName',
      },
      {
        title: '出库人',
        width: 112,
        dataIndex: 'createName'
      },
      {
        title: '发起时间',
        dataIndex: 'createDate',
        width: 168
      },
      {
      title: '验收时间',
      width: 168,
      dataIndex: 'receptionTime'
      }
    ];
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
            <Link to={{pathname:`${match.path}/add`}}>新建验收</Link>
          </Button>
        </Row>
        <RemoteTable
          onChange={this._tableChange}
          isJson
          query={query}
          ref="tab"
          url={salvageCar.CHECK_RESCUECAR_LIST}
          scroll={{x: '100%'}}
          isDetail={true}
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
    statusList: [],
    applyRescuecarList: []
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'acceptance_checkVo'
      },
      callback: (data) => {
        this.setState({statusList: data});
      }
    });
    dispatch({
      type: 'base/applyRescuecarList',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            applyRescuecarList: data
          });
        }else {
          message.error(msg);
        };
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
        values.startCreateTime = initTime[0].format('YYYY-MM-DD');
        values.endCreateTime = initTime[1].format('YYYY-MM-DD');
      }else {
        values.startCreateTime = '';
        values.endCreateTime = '';
      };
      if(checkTime && checkTime.length !== 0){
        values.receptionStartTime = checkTime[0].format('YYYY-MM-DD');
        values.receptionEndTime = checkTime[1].format('YYYY-MM-DD');
      }else {
        values.receptionStartTime = '';
        values.receptionEndTime = '';
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
    let {statusList, applyRescuecarList} = this.state;
    const { getFieldDecorator } = this.props.form;
    statusList = statusList.map(item=>{
      return <Option key={item.value} value={item.value}>{item.label}</Option>
    });
    applyRescuecarList = applyRescuecarList.map(item => (
      <Option key={item.id} value={item.id}>{item.deptName}</Option>
    ));
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`申领抢救车`} {...formItemLayout}>
              {getFieldDecorator('deptCode')(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                  {applyRescuecarList}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`单据`} {...formItemLayout}>
              {getFieldDecorator('distributeCode')(
                <Input placeholder='出库单/申领单'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`状态`} {...formItemLayout}>
              {getFieldDecorator('auditStatus')(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                  <Option key="" value="">全部</Option>
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