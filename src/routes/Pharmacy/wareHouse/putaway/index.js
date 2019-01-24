/*
 * @Author: yuwei  上架 /putaway
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import {Form, Input , Icon , DatePicker , Row, Col, Button, Select } from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid/index';
import {wareHouse} from '../../../../api/pharmacy/wareHouse';
import {connect} from 'dva';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class Putaway extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  render(){
    const columns = [
      {
        title: '验收单',
        dataIndex: 'distributeCode',
        width: 168,
        render:(text, record)=>(<Link to={{pathname: `/pharmacy/wareHouse/putaway/details/code=${text}&status=${record.auditStatus}`}}>{text}</Link>)
       },
      {
        title: '状态',
        width: 112,
        dataIndex: 'statusName',
      },
      {
        title: '类型',
        width: 168,
        dataIndex: 'typeName',
      },
      {
        title: '验收时间',
        width: 224,
        dataIndex: 'receptionTime'
      },
      {
        title: '上架时间',
        width: 224,
        dataIndex: 'upUserDate'
      }
    ];
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.key;
    delete query.time;
    return (
      <div className='ysynet-main-content'>
        <SearchForm formProps={{...this.props}} />
        <RemoteTable
          onChange={this._tableChange}
          url={wareHouse.ROOMACCEPTANCE}
          query={query}
          scroll={{x: '100%'}}
          isDetail={true}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 24}}
        />
      </div>
    )
  }
}
export default connect(state=>state)(Putaway);

/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
  state = {
    status: [],
    type: []
  }
  componentDidMount() {
    this.props.formProps.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'acceptance_status'
      },
      callback: (data) => {
        this.setState({status: data});
      }
    });
    this.props.formProps.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'room_in_store_type'
      },
      callback: (data) => {
        this.setState({type: data});
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
      if(time && time.length > 0) {
        values.receptionStartTime = time[0].format('YYYY-MM-DD');
        values.receptionEndTime = time[1].format('YYYY-MM-DD');
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

  renderList = (list) => {
    return list.map(item => {
      return <Option key={item.value} value={item.value}>{item.label}</Option>
    })
  }

  render() {
    let {type, status} = this.state;
    type = this.renderList(type);
    status = this.renderList(status);
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`单据号`} {...formItemLayout}>
              {getFieldDecorator('distributeCode', {})(
              <Input placeholder='验收单'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} >
            <FormItem label={`状态`} {...formItemLayout}>
              {getFieldDecorator('auditStatus')(
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
          <Col span={8} style={{display: display}} >
            <FormItem label={`类型`} {...formItemLayout}>
              {getFieldDecorator('type')(
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
            <FormItem label={`验收时间`} {...formItemLayout}>
              {getFieldDecorator('time', {})(
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