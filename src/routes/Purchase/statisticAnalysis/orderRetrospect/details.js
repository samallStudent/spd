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
import { Row, Col, message } from 'antd';
import { connect } from 'dva';
import {statisticAnalysis} from '../../../../api/purchase/purchase';
import RemoteTable from '../../../../components/TableGrid';
const columns = [
  {
    title: '配送单号',
    width: 168,
    dataIndex: 'distributeCode'
  },
  {
    title: '配送日期',
    width: 168,
    dataIndex: 'createDate'
  },
  {
    title: '上架日期',
    width: 168,
    dataIndex: 'upUserDate',
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
        type: 'statistics/traceDetail',
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
              <label>订单单号</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
              <div className='ant-form-item-control'>{detailsData.orderCode}</div>
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
                  <label>下单日期</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.orderDate}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <RemoteTable
            title={()=>'订单信息'}
            scroll={{x: '100%'}}
            isJson
            columns={columns}
            rowKey={'id'}
            query={query}
            url={statisticAnalysis.ORDER_DETAIL_TRACE}
          />
        </div>
      </div>
    )
  }
}
export default connect(state => state)(Detail);
