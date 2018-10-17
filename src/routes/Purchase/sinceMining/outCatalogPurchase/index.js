/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 20:18:36
 */

/**
 * @file 药库 - 补货管理--目录外采购
 */
import React, { PureComponent } from 'react';
import { Form, Button, message, Tooltip, DatePicker, Select, Row, Col, Input, Icon  } from 'antd';
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
    sm: { span: 5 },//5
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 }
  },
};

class SearchForm extends PureComponent{
  state = {
    fstateOptions: [],// 状态下拉框
  }
  componentDidMount = () =>{
    this.genFstate();
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
  genFstate = () =>{
    const { dispatch } = this.props.formProps;
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: { type : 'plan_status' },
      callback: (data) =>{
        this.setState({ fstateOptions: data })
      }
    })
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
  render(){
    const { getFieldDecorator } = this.props.form;
    const { fstateOptions } = this.state;
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
                getFieldDecorator(`auditStatus`)(
                  <Select
                    placeholder="请选择"
                    allowClear={true}
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      fstateOptions.map((item,index)=> <Option key={index} value={item.value}>{ item.label }</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem {...formItemLayout} label={`发起时间`}>
              {
                getFieldDecorator(`orderTime`,{
                  initialValue: ''
                })(
                  <RangePicker />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{margin: '0 8px'}} onClick={this.handleReset}>重置</Button>
           <a style={{fontSize: 14}} onClick={this.toggle}>
             {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
           </a>
         </Col>
        </Row>
      </Form>
    )
  }
}

const WrapperForm = Form.create()(SearchForm);
class OutCatalogPurchase extends PureComponent{
  state = {
    selected: [],
    selectedRows: [],
    loading: false,
    query: {
      queryType: '1',
      planType: '2'
    },
  }
  delete = () =>{
    let {selectedRows} = this.state;
    if(selectedRows.length === 0) {
      message.warn('请至少选择一条数据')
    };
    let list = selectedRows.map(item => item.planCode);
    this.props.dispatch({
      type:'replenish/ReplenishDelete',
      payload: {list, opType: '1'},
      callback:(data)=>{
        this.refs.table.fetch();
      }
    });
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    })
  }
  render(){
    const columns = [
      {
        title: '计划单号',
        dataIndex: 'planCode',
        width: 280,
        render: (text,record) =>{
          return <span>
            <Link to={{pathname: `/purchase/replenishment/outCatalogPurchase/detail/${record.planCode}`}}>{text}</Link>
          </span>  
        }
      },{
        title: '状态',
        dataIndex: 'statusName',
        width: 112,
      },{
        title: '类型',
        dataIndex: 'planTypeName',
        width: 168,
      },{
        title: '发起人',
        dataIndex: 'createUserName',
        width: 112,
      },{
        title: '发起时间',
        dataIndex: 'createDate',
        width: 224,
      },{
        title: '收货地址',
        dataIndex: 'receiveAddress',
        width: 280,
        className: 'ellipsis',
          render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
          )
      },
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...query,
      ...this.state.query
    };
    delete query.key;
    delete query.orderTime;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm 
          dispatch={this.props.dispatch}
          formProps={{...this.props}}
        />
        <div className='ant-row-bottom'>
          <Button type='primary' onClick={()=>this.props.history.push({ pathname: `/createSinceOutCatalog` })}>新建目录外采购计划</Button>
          <Button type='default' onClick={this.delete} style={{ marginLeft: 8 }}>删除</Button>
        </div>
        <RemoteTable
          ref='table'
          query={query}
          onChange={this._tableChange}
          url={replenishmentPlan.PLANLIST}
          columns={columns}
          scroll={{ x: 1176 }}
          rowKey={'id'}
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
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
export default connect(state =>state)(OutCatalogPurchase)