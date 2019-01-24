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
import { Form, Row, Col, Button, DatePicker, Select, message, Tooltip } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {statisticAnalysis} from '../../../../api/purchase/purchase';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
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
  state = {
    supplierList: []
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
    let { queryConditons } = this.props.formProps.base;
    queryConditons = {...queryConditons};
    queryConditons.supplierCodeList = queryConditons.supplierCodeList ? queryConditons.supplierCodeList[0] : "";
    //找出表单的name 然后set
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
    dispatch({
      type: 'statistics/supplierAll',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            supplierList: data
          });
        }else {
          message.error(msg);
        }
      }
    });
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
        values.supplierCodeList = values.supplierCodeList ? [values.supplierCodeList] : [];
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
    const { supplierList } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCodeList`)(
                  <Select
                    style={{width: '100%'}}
                    placeholder="请选择供应商名称检索"
                  >
                    <Option key="" value="">全部</Option>
                    {
                      supplierList.map(item => (
                        <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`订单发送时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker style={{width: '100%'}}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
         </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class SupplierSupply extends PureComponent {
  state = {
    tableFooter: {}
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
      type: 'statistics/exportSupplierAnalyze',
      payload: queryConditons
    });
  }
  _tableCallback = () => {
   const {supplierCodeList} = this.props.base.queryConditons;
   const {endTime} = this.props.base.queryConditons;
   const {startTime} = this.props.base.queryConditons;
    console.log(this.props.base.queryConditons);
    if(supplierCodeList !== undefined&&supplierCodeList.length > 0) {
      this.props.dispatch({
        type: 'statistics/supplierAnalyze',
        payload: {
          supplierCodeList,
          endTime,
          startTime
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
    }else {
      this.setState({
        tableFooter: {}
      });
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
        title: '供应商',
        dataIndex: 'supplierName',
        width: 168,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '订单号',
        dataIndex: 'orderCode',
        width: 168,
      }, {
        title: '订单发送时间',
        dataIndex: 'sendTime',
        width: 168,
      }, {
        title: '平均到货天数',
        dataIndex: 'arriveDay',
        width: 168,
        sorter: () => false
      }, {
        title: '采购品种数',
        dataIndex: 'purchaseVariety',
        width: 168,
        sorter: () => false
      }, {
        title: '配送品种数',
        dataIndex: 'deliverVariety',
        width: 168,
        sorter: () => false
      }, {
        title: '采购数量',
        dataIndex: 'purchaseNum',
        width: 112,
        sorter: () => false
      }, {
        title: '实际到货数量',
        dataIndex: 'actualNum',
        width: 168,
        sorter: () => false
      }, {
        title: '到货比',
        dataIndex: 'arrivalRatio',
        width: 112,
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
          _handlQuery={this.handlQuery}
        />
        <div>
          <Button onClick={this.export}>导出</Button>
        </div>
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          isJson
          columns={columns}
          scroll={{x: '100%'}}
          isDetail={true}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'orderCode'}
          url={statisticAnalysis.SUPPLIER_ANALYZE}
          cb={this._tableCallback}
          footer={() => (
            <Row>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-10">
                  <label style={{fontWeight: 600}}>供应商订单总数量</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
                  <div style={{color: 'red'}} className='ant-form-item-control'>{tableFooter.orderCount || 0}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-10">
                  <label style={{fontWeight: 600}}>供应商总配送品种数</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
                  <div style={{color: 'red'}} className='ant-form-item-control'>{tableFooter.totalDrugType || 0}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-10">
                  <label style={{fontWeight: 600}}>供应商实际到货总数量</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
                  <div style={{color: 'red'}} className='ant-form-item-control'>{tableFooter.actualNum || 0}</div>
                </div>
              </Col>
            </Row>
          )}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(SupplierSupply));