/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 统计分析--损益分析
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, DatePicker, Icon, Select, message } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {statisticAnalysis} from '../../../../api/purchase/purchase';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const {Option} = Select;
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
        const closeDate = values.closeDate === undefined ? '' : values.closeDate;
        if (closeDate.length > 0) {
          values.startTime = closeDate[0].format('YYYY-MM-DD');
          values.endTime = closeDate[1].format('YYYY-MM-DD');
        }else {
          values.startTime = '';
          values.endTime = '';
        };
        this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: { ...values }
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
            <FormItem {...formItemLayout} label={`损益单号`}>
              {
                getFieldDecorator(`causticExcessiveNo`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`损益类型`}>
              {
                getFieldDecorator(`causticExcessiveType`)(
                  <Select
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                  >
                    <Option key="全部" value="">全部</Option>
                    <Option key="2" value="2">损</Option>
                    <Option key="1" value="1">益</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`生成时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
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

class ProfitLoss extends PureComponent {
  state = {
    query: {},
    tableFooter: {}
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  _tableCallback = () => {
    const {deptId} = this.props.users.currentDept;
    
    this.props.dispatch({
      type: 'statistics/getStatics',
      payload: {
        deptCode: deptId,
        type: 1
      },
      callback: ({code, data, msg}) => {
        if(code === 200) {
          this.setState({
            tableFooter: data
          });
        }else {
          message.error(msg);
        };
      }
    });
  }
  export = () => {
    let {queryConditons} = this.props.base;
    queryConditons = {...queryConditons};
    delete queryConditons.key;
    delete queryConditons.pageNo;
    delete queryConditons.pageSize;
    delete queryConditons.sortField;
    delete queryConditons.sortOrder;
    this.props.dispatch({
      type: 'statistics/profitLossExport',
      payload: queryConditons
    });
  }
  render() {
    const {match} = this.props;
    const columns = [
      {
        title: '损益单号',
        dataIndex: 'causticExcessiveNo',
        width: 168,
        render: (text, record) => {
          return <span>
                  <Link to={{ pathname: `${match.path}/details/${text}/${record.checkBillNo}`}}>{text}</Link>
                 </span>
        }
      }, {
        title: '账面总库存',
        dataIndex: 'accountTotalAmount',
        width: 112,
      }, {
        title: '实际总库存',
        dataIndex: 'realTotalAmount',
        width: 112,
      }, {
        title: '损益总数量',
        dataIndex: 'excessiveTotalAmount',
        width: 168
      }, {
        title: '实际总损益金额(元)',
        dataIndex: 'excessiveTotalMoney',
        width: 168,
      }
    ];
    const {tableFooter} = this.state;
    let query = this.props.base.queryConditons;
    query = {
      ...query,
    };
    delete query.closeDate;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
        />
        <Row>
          <Button onClick={this.export}>导出</Button>
        </Row>
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          scroll={{x: '100%'}}
          isDetail={true}
          columns={columns}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'causticExcessiveNo'}
          cb={this._tableCallback}
          url={statisticAnalysis.EXCESSIVE_LIST}
          footer={() => (
            <Row>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                  <label style={{fontWeight: 600}}>部门损益总数量</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                  <div style={{color: 'red'}} className='ant-form-item-control'>{tableFooter.excessiveTotalAmount || 0}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-10">
                  <label style={{fontWeight: 600}}> 部门实际总损益金额(元)</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
                  <div style={{color: 'red'}} className='ant-form-item-control'>{tableFooter.excessiveTotalMoney || 0}</div>
                </div>
              </Col>
            </Row>
          )}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(ProfitLoss));