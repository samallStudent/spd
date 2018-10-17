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
  {
    title: '货位',
    width: 112,
    dataIndex: 'locName'
  },
  {
    title: '货位类型',
    width: 168,
    dataIndex: 'positionTypeName'
  },
  {
    title: '通用名',
    width: 168,
    dataIndex: 'ctmmGenericName'
  },
  {
    title: '商品名',
    width: 168,
    dataIndex: 'ctmmTradeName'
  },
  {
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '生产厂家',
    width: 224,
    dataIndex: 'ctmmManufacturerName',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'unit'
  },
  {
    title: '生产批号',
    width: 168,
    dataIndex: 'lot'
  },
  {
    title: 'productDate',
    width: 168,
    dataIndex: 'scrq'
  },
  {
    title: '有效期止',
    width: 168,
    dataIndex: 'validEndTime'
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification'
  },
  {
    title: '剂型',
    width: 168,
    dataIndex: 'ctmmDosageFormDesc'
  },
  {
    title: '供应商',
    width: 168,
    dataIndex: 'supplierName'
  },
  {
    title: '药品编码',
    width: 168,
    dataIndex: 'hisDrugCode'
  },
  {
    title: '批准文号',
    width: 224,
    dataIndex: 'approvalNo'
  },
  {
    title: '账面库存',
    dataIndex: 'accountStoreNum',
    width: 112
  },
  {
    title: '实际库存',
    width: 112,
    dataIndex: 'practicalRepertory'
  },
  {
    title: '损益数量',
    width: 112,
    dataIndex: 'checkNum'
  },
  {
    title: '价格',
    width: 112,
    dataIndex: 'referencePrice'
  },
  {
    title: '实际损益金额',
    width: 168,
    dataIndex: 'excessiveMoney'
  },
];

class Detail extends PureComponent{
  state = {
    detailsData: {},
    query: {
      checkBillNo: this.props.match.params.id
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
        type: 'statistics/profitLossDetailHead',
        payload: {
          causticExcessiveNo: id
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
                <label>部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.deptName}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                <label>损益单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.causticExcessiveNo}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                <label>账面总库存</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.accountTotalAmount}</div>
              </div>
            </Col>
            <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
              <label>实际总库存</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
              <div className='ant-form-item-control'>{detailsData.realTotalAmount}</div>
            </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                <label>损益总数量</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.excessiveTotalAmount}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                  <label>实际总损益金额</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.excessiveTotalMoney}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                  <label>生成时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.createDate}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <h3>损益信息</h3>
          <hr className="hr" />
          <RemoteTable
            query={query}
            scroll={{x: 3168}}
            columns={columns}
            rowKey={'id'}
            url={statisticAnalysis.PROFIT_LOSS_DETAIL_LIST}
          />
        </div>
      </div>
    )
  }
}
export default connect(state => state)(Detail);
