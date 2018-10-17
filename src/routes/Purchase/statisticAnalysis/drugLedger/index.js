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
import { Form, Row, Col, Button, Input, DatePicker, Icon, Select, Tooltip } from 'antd';
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
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  },
};


class SearchForm extends PureComponent{
  state = {
    supplierList: [],
    deptList: [],
    typeList: []
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
    dispatch({
      type: 'statistics/supplierAll',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            supplierList: data
          });
        }
      }
    });
    dispatch({
      type: 'statistics/getDeptByParam',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            deptList: data
          });
        }
      }
    });
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: "medicine_standing"
      },
      callback: (data) => {
        this.setState({
          typeList: data
        });
      }
    })
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
        const closeDate = values.closeDate === undefined ? '' : values.closeDate;
        if (closeDate.length > 0) {
          values.startTime = closeDate[0].format('YYYY-MM-DD HH:mm');
          values.endTime = closeDate[1].format('YYYY-MM-DD HH:mm');
        }else {
          values.startTime = '';
          values.endTime = '';
        };
        this.props._handlQuery(values);
      }
    })
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    const { supplierList, deptList, typeList } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCode`)(
                  <Select
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option key={''} value={''}>全部</Option>
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
            <FormItem {...formItemLayout} label={'商品名/通用名'}>
              {
                getFieldDecorator(`paramsName`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`部门`}>
              {
                getFieldDecorator(`deptCode`)(
                  <Select
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option key={''} value={''}>全部</Option>
                    {
                      deptList.map(item => (
                        <Option key={item.id} value={item.id}>{item.deptName}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`统计时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker showTime style={{width: '100%'}}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`类型`}>
              {
                getFieldDecorator(`secondType`)(
                  <Select 
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      typeList.map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))
                    }
                  </Select>
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

class DrugLedger extends PureComponent {
  state = {
    query: {},
  }
  handlQuery = (query) => {
    this.setState({query});
  }
  export = () => {
    this.props.dispatch({
      type: 'statistics/medicineStandingExport',
      payload: {
        ...this.state.query
      }
    })
  }
  render() {
    const columns = [
      {
        title: '部门',
        dataIndex: 'deptName',
        width: 168,
      }, {
        title: '类型',
        dataIndex: 'type',
        width: 168,
      }, {
        title: '时间',
        dataIndex: 'createDate',
        width: 224,
      }, {
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 224,
      }, {
        title: '商品名',
        dataIndex: 'ctmmTradeName',
        width: 168
      }, {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      }, {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 224,
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '单位',
        dataIndex: 'unit',
        width: 112,
      }, {
        title: '生产批号',
        dataIndex: 'lot',
        width: 168,
      }, {
        title: '生产日期',
        dataIndex: 'productDate',
        width: 168,
      }, {
        title: '有效期止',
        dataIndex: 'validEndDate',
        width: 168,
      }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168,
      }, {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 168,
      }, {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 168,
      }, {
        title: '药品编号',
        dataIndex: 'hisDrugCode',
        width: 168,
      }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 168,
      }, {
        title: '库存数量',
        dataIndex: 'stockNum',
        width: 112,
      }, {
        title: '入库数量',
        dataIndex: 'inStockNum',
        width: 112,
      }, {
        title: '出库数量',
        dataIndex: 'outStockNum',
        width: 112,
      }, {
        title: '结存数量',
        dataIndex: 'balanceNum',
        width: 112,
      }
    ];
    const {query} = this.state;
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
          columns={columns}
          scroll={{x: 3248}}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={statisticAnalysis.DRUG_LEDGER}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(DrugLedger));