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
import { Table, Row, Col, message } from 'antd';
import { connect } from 'dva';
const columns = [
  {
    title: '配送单号',
    width: 168,
    dataIndex: 'ctmmGenericName'
  },
  {
    title: '配送日期',
    width: 168,
    dataIndex: 'goodsName'
  },
  {
    title: '上架日期',
    width: 168,
    dataIndex: 'goodsSpec',
  },
];

class Detail extends PureComponent{
  state = {
    detailsData: {}
  }
  componentDidMount = () => {
    this.getDetail();
  }
  //详情
  getDetail = () => {
    if (this.props.match.params.id) {
      let { id } = this.props.match.params;
      this.props.dispatch({
        type: 'statistics/invoiceDetail',
        payload: {
          invoiceNo: id
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
    const { detailsData } = this.state;
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
              <div className='ant-form-item-control'>{detailsData.invoiceCode}</div>
            </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                  <label>订单状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.settleDate}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                  <label>下单日期</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{detailsData.settleDate}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <Table
            title={()=>'订单信息'}
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'id'}
            bordered
            dataSource={detailsData.billdetaillist ? detailsData.billdetaillist : []}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
export default connect(state => state)(Detail);
