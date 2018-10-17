/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 补货管理--补货计划
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, DatePicker, Select, Icon, message, Tooltip } from 'antd';
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
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 }
  },
};


class SearchForm extends PureComponent{
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  componentDidMount() {
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
        const createDate = values.createDate === undefined ? '' : values.createDate;
        if (createDate.length > 0) {
          values.startTime = createDate[0].format('YYYY-MM-DD');
          values.endTime = createDate[1].format('YYYY-MM-DD');
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
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`计划单号`}>
              {
                getFieldDecorator(`planCode`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' className={'ysynet-formItem-width'}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`状态`}>
              {
                getFieldDecorator(`auditStatus`,{
                  initialValue: ''
                })(
                  <Select
                    placeholder="请选择"
                    className={'ysynet-formItem-width'}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                    {
                      this.props.typeListDate.map((item, index) => <Option value={item.value} key={index}>{item.label}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`发起时间`}>
              {
                getFieldDecorator(`createDate`)(
                  <RangePicker className={'ysynet-formItem-width'}/>
                )
              }
            </FormItem>
          </Col>
          {/* <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`类型`}>
              {
                getFieldDecorator('type',{
                  initialValue: ''
                })(
                  <Select className={'ysynet-formItem-width'}>
                    <Option key={-1} value=''>全部</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col> */}
          <Col span={expand ? 24: 8} style={{ textAlign: 'right', marginTop: 4}} >
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

class ReplenishmentPlan extends PureComponent {
  state = {
    loading: false,
    query: { planType: '1' },
    selectedRowKeys: [],
    selectedRows: [],
    typeListDate: []
  }
  componentDidMount = () => {
    // 状态下拉框
    this.props.dispatch({
      type:'base/orderStatusOrorderType',
      payload: { type: 'plan_status' },
      callback:(data)=>{
        this.setState({ typeListDate: data });
      }
    });
  }
  delete = () => {
    if (this.state.selectedRows.length > 0) {
      const planCode = [];
      this.state.selectedRows.map((item, index) => planCode.push(item.planCode));
      console.log('计划单号：', planCode);
      if (planCode) {
        this.props.dispatch({
          type:'replenish/ReplenishDelete',
          payload: {list: planCode, opType: '1'},
          callback:(data)=>{
            this.refs.table.fetch();
          }
        });
      }
    } else {
      message.warn("请至少添加一条数据！");
    }
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  render() {
    const columns = [
      {
        title: '计划单号',
        dataIndex: 'planCode',
        width: 280,
        render: (text, record) => {
          return <span>
            <Link to={{ pathname: `/purchase/replenishment/replenishmentPlan/detail/${record.planCode}` }}>{text}</Link>
          </span>
        }
      }, {
        title: '状态',
        dataIndex: 'statusName',
        width: 112,
      }, {
        title: '类型',
        dataIndex: 'planTypeName',
        width: 168,
      }, {
        title: '发起人',
        dataIndex: 'createUserName',
        width: 168,
      }, {
        title: '发起时间',
        dataIndex: 'createDate',
        width: 224
      }, {
        title: '收货地址',
        dataIndex: 'receiveAddress',
        width: 280,
        className: 'ellipsis',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '驳回原因',
        dataIndex: 'note',
        width: 280,
      }
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...query,
      ...this.state.query
    }
    delete query.createDate;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          typeListDate={this.state.typeListDate} 
          formProps={{...this.props}}
        />
        <div className='ant-row-bottom'>
          <Button type='primary' onClick={() => this.props.history.push({ pathname: `/createReplenishment` })}>新建补货计划</Button>
          <Button type='default' onClick={this.delete} style={{ marginLeft: 8 }}>删除</Button>
        </div>
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          columns={columns}
          scroll={{x: 1560}}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={replenishmentPlan.PLANLIST}
          rowSelection={{
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({ selectedRowKeys, selectedRows })
            },
            getCheckboxProps: record => ({
              disabled: record.auditStatus !== 1
            }),
          }}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(ReplenishmentPlan));