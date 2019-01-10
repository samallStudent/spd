/*
 * @Author: wwb 
 * @Date: 2018-07-24 20:15:54 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 00:16:10
 */
/* 
  @file 损益分析 详情
*/
import React, { PureComponent } from 'react';
import { Row, Col, Tooltip, message } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import {statisticAnalysis} from '../../../../api/purchase/purchase';
import { connect } from 'dva';
const columns = [
 /* {
    title: '通用名',
    width: 224,
    dataIndex: 'ctmmGenericName',
    className: 'ellipsis',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },*/
  {
    title: '药品名称',
    width: 350,
    dataIndex: 'ctmmTradeName',
    className: 'ellipsis',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  /*{
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification'
  },*/
  {
    title: '生产厂家',
    width: 200,
    dataIndex: 'ctmmManufacturerName',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'replanUnit'
  },
  {
    title: '需求数量',
    width: 112,
    dataIndex: 'demandQuantity'
  },{
    title: '实到数量',
    width: 112,
    dataIndex: 'distributeQuantity'
  },
  {
    title: '生产批号',
    width: 148,
    dataIndex: 'lot'
  },
  {
    title: '生产日期',
    width: 118,
    dataIndex: 'productDate'
  },
  {
    title: '有效期至',
    width: 118,
    dataIndex: 'validEndDate'
  },
  {
    title: '包装规格',
    width: 148,
    dataIndex: 'packageSpecification'
  },
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc'
  },

  {
    title: '批准文号',
    width: 200,
    dataIndex: 'approvalNo'
  },
    {
        title: '药品编码',
        width: 168,
        dataIndex: 'hisDrugCode'
    },
];

class Detail extends PureComponent{
  state = {
    detailsData: {},
    query: {
      orderCode: this.props.match.params.id
    }
  }
  componentDidMount = () => {
    this.getDetail();
  }
  //详情
  getDetail = () => {
    if (this.props.match.params.id) {
      let { id } = this.props.match.params;
      this.props.dispatch({
        type: 'statistics/orderExecuteDetail',
        payload: {
          orderCode: id
        },
        callback: (data) => {
          if(data.code === 200 && data.msg === 'success') {
            this.setState({
              detailsData: data.data
            })
          };
          if(data.msg !== 'success') {
            message.error(data.msg)
          };
        }
      })
    }
  }
  render(){
    const { detailsData, query } = this.state;
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <Row>
            <Col span={8} style={{fontSize: '18px', fontWeight: 500}}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                <label>供应商</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.supplierName}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                <label>补货库房</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.deptName}</div>
              </div>
            </Col>
            <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
              <label>订单单号</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
              <div className='ant-form-item-control'>{detailsData.orderCode}</div>
            </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                <label>采购品种数</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.purchaseTypeNum}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                  <label>实到品种数</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.actualTypeNum}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                  <label>采购数量</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.purchaseCount}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                  <label>实际到货数量</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.actualCount}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                  <label>订单状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.orderStatusName}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                  <label>订单日期</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.orderDate}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <RemoteTable
            query={query}
            url={statisticAnalysis.EXECUTE_DETAIL_LIST}
            title={()=>'订单信息'}
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'id'}
          />
        </div>
      </div>
    )
  }
}
export default connect(state => state)(Detail);
