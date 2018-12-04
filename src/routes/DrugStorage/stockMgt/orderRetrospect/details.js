/*
 * @Author: wwb 
 * @Date: 2018-07-24 20:15:54 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 00:16:10
 */
/* 
  @file 订单追溯 详情
*/
import React, { PureComponent } from 'react';
import { Row, Col, message, Timeline } from 'antd';
import { connect } from 'dva';
const TimelineItem = Timeline.Item;
class Detail extends PureComponent{
  state = {
    detailsData: {},
    timelineList: []
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
      });
      this.props.dispatch({
        type: 'statistics/orderFlow',
        payload: {orderCode: id},
        callback: ({code, msg, data}) => {
          if(code === 200) {
            this.setState({
              timelineList: data
            });
          }else {
            message.error(msg);
          };
        } 
      });
    }
  }
  render(){
    const { detailsData, timelineList } = this.state;
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
          <h3>订单信息</h3>
          <hr className="hr"/>
          <Timeline>
          {
            timelineList.length ? (
              timelineList.map((item, i) => (
                <TimelineItem>
                  <span style={{marginRight: 16}}>{item.orderFlowNo}</span>
                  <span>{item.orderStr}</span>
                </TimelineItem>
              ))
            ) : null
          }
          </Timeline>
        </div>
      </div>
    )
  }
}
export default connect(state => state)(Detail);
