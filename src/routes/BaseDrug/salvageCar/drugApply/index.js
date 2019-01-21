/*
 * @Author: yuwei  药品申领  /drugsFor
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import {Form, Input , Row, Col, Button, Icon, Select, DatePicker, message } from 'antd';
import {Link} from 'react-router-dom';
import {formItemLayout} from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid/index';
import salvageCar from '../../../../api/baseDrug/salvageCar';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class DrugsFor extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query:{
        queryType: 1
      },
      messageError: "",
      selectedRowKeys: [],
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
        title: '申领单',
        width: 168,
        dataIndex: 'applyCode',
        render:(text, record)=>(<Link to={{pathname: `${match.path}/details/${record.applyCode}`}}>{text}</Link>)
      },
      {
        title: '申领抢救车',
        width: 168,
        dataIndex: 'applyDeptName',
      },
      {
        title: '状态',
        width: 112,
        dataIndex: 'applyStatusName'
      },
      {
        title: '入库人',
        width: 112,
        dataIndex: 'createUserName',
      },
      {
        title: '发起时间',
        width: 168,
        dataIndex: 'createDate'
      },
    ];
    let query = this.props.base.queryConditons;
    query = {...query, ...this.state.query};
    delete query.key;
    delete query.time;
    return (
      <div className='ysynet-main-content'>
        <SearchForm formProps={{...this.props}} />
        <Row>
          <Button type='primary' className='button-gap'>
            <Link to={{pathname:`${match.path}/add`}}>新建申领</Link>
          </Button>
        </Row>
        <RemoteTable
          onChange={this._tableChange}
          ref="tab"
          query={query}
          url={salvageCar.GET_RESCUECAR_APPLY_LIST}
          scroll={{x: '100%'}}
          isDetail={true}
          columns={columns}
          rowKey={'applyCode'}
          style={{marginTop: 24}}
        />
      </div>
    )
  }
}
export default connect(state=>state)(DrugsFor);

/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
  state = {
    status: [],
    applyRescuecarList: []
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'apply_status'
      },
      callback: (data) => {
        this.setState({
          status: data
        });
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
      if(values.time && values.time.length !== 0) {
        values.startTime = values.time[0].format('YYYY-MM-DD');
        values.endTime = values.time[1].format('YYYY-MM-DD');
      }else {
        values.startTime = '';
        values.endTime = '';
      }
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
    let { status, applyRescuecarList } = this.state;
    const { getFieldDecorator } = this.props.form;
    status = status.map(item=>(
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ));
    applyRescuecarList = applyRescuecarList.map(item => (
      <Option key={item.id} value={item.id}>{item.deptName}</Option>
    ));
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`抢救车`} {...formItemLayout}>
              {getFieldDecorator('applyDeptCode', {})(
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
            <FormItem label={`申领单`} {...formItemLayout}>
              {getFieldDecorator('applyCode', {})(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`状态`} {...formItemLayout}>
              {getFieldDecorator('applyStatus', {})(
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
          <Col span={8} style={{display: display}}>
            <FormItem label={`发起时间`} {...formItemLayout}>
              {getFieldDecorator('time')(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ float:'right',textAlign: 'right', marginTop: 4}} >
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