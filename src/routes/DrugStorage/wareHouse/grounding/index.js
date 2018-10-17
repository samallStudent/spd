/*
 * @Author: yuwei  上架 /putaway
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import {DatePicker, Form, Input, Row, Col, Button, Icon, Select, message, Popconfirm } from 'antd';
import {Link} from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import {wareHouse} from '../../../../api/pharmacy/wareHouse';
import { formItemLayout } from '../../../../utils/commonStyles';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class Putaway extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      messageError:"",
      selectedRowKeys:[],
    }
  }

  //单行确认 
  confirmOk = () => {
    message.success('操作成功')
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
       title: '配送单',
       width: 280,
       dataIndex: 'distributeCode',
       render: (text, record) => 
       <span>
        <Link 
          to={{ pathname: `/drugStorage/wareHouse/grounding/detail/${record.distributeCode}`}}>
          {text}
        </Link>
       </span>
      },
      {
        title: '状态',
        width: 112,
        dataIndex: 'statusName'
      },
      {
        title: '类型',
        width: 168,
        dataIndex: 'typeName'
      },
      {
        title: '验收时间',
        width: 224,
        dataIndex: 'receptionTime',
      },
      {
        title: '上架时间',
        width: 224,
        dataIndex: 'upUserDate',
      },
      {
        title: '操作',
        width: 60,
        dataIndex: 'RN',
        render: (text, record) => 
          <span>
            <Popconfirm title="确定打印吗？" okText="是" cancelText="否"  onConfirm={()=>this.confirmOk(record)}>
              <a>打印</a>
            </Popconfirm>
          </span>  
      }
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...query,
    };
    delete query.shelfTime;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <SearchForm formProps={{...this.props}} />
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          ref="tab"
          url={wareHouse.ROOMACCEPTANCE}
          scroll={{x: 1068}}
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
    type: [],
    status: []
  }
  componentDidMount() {
      this.props.formProps.dispatch({
        type: 'base/orderStatusOrorderType',
        payload: {
          type: "audit_status"
        },
        callback: (data) => {
          this.setState({status: data});
        }
      });
      this.props.formProps.dispatch({
        type: 'base/orderStatusOrorderType',
        payload: {
          type: "in_store_type"
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
 //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
  render() {
    let { status, type } = this.state;
    const { getFieldDecorator } = this.props.form;
    type = type.map(item => {
      return (<Option key={item.value} value={item.value}>{item.label}</Option>)
    });
    status = status.filter(item => item.value !== "1").map(item => {
      return (<Option key={item.value} value={item.value}>{item.label}</Option>)
    });
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
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
          <Col span={8} style={{display: display}}>
            <FormItem label={`类型`} {...formItemLayout}>
              {getFieldDecorator('type', {})(
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
              {getFieldDecorator('shelfTime', {})(
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