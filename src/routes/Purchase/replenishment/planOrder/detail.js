/*
 * @Author: wwb 
 * @Date: 2018-07-24 20:15:54 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 14:23:49
 */
/* 
  @file 补货计划 详情
*/
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Tooltip, Button } from 'antd';
import { connect } from 'dva';
import { replenishmentPlan } from '../../../../api/replenishment/replenishmentPlan';
const columns = [
  /*{
    title: '通用名称',
    width: 224,
    dataIndex: 'ctmmGenericName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },*/
  {
    title: '药品名称',
    width: 350,
    dataIndex: 'ctmmTradeName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  /*{
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
  },*/
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc',
  },
  {
    title: '批准文号',
    width: 200,
    dataIndex: 'approvalNo',
  },
  {
    title: '生产厂家',
    width: 200,
    dataIndex: 'ctmmManufacturerName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification',
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'replanUnit',
  },
  {
    title: '需求数量',
    dataIndex: 'demandQuantity',
    width: 112
  },
  {
    title: '配送数量',
    dataIndex: 'distributeQuantity', 
    width: 112,
    render: (text,reocrd) =>{
      return text === undefined || text === null ? '0': text
    }
  },
  /*{
    title: '价格',
    width: 112,
    dataIndex: 'drugPrice',
    render: (text,reocrd) =>{
      return text === undefined || text === null ? '0': text
    }
  },
  {
    title: '金额',
    width: 168,
    dataIndex: 'totalPrice',
  },*/
  {
    title: '供应商',
    width: 200,
    dataIndex: 'supplierName',
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '计划单号',
    dataIndex: 'planCode',
    width: 168,
  }
];
const sendColumns = [
  {
    title: '配送单号',
    width: 168,
    dataIndex: 'distributeCode',
  },{
    title: '订单号',
    width: 168,
    dataIndex: 'orderCode',
  },{
    title: '验收时间',
    width: 224,
    dataIndex: 'receptionTime',
  },{
    title: '验收人',
    width: 168,
    dataIndex: 'receptionUserName'
  },{
    title: '供应商',
    width: 224,
    dataIndex: 'supplierName',
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  }
];

class PlanOrderDetail extends PureComponent{
  state = {
    detailsData: {},
    loading: false
  }
  componentWillMount = () =>{
    let { orderCode } = this.props.match.params;
    if (this.props.match.params) {
      this.setState({ loading: true })
      this.props.dispatch({
        type:'replenish/planOrderDetail',
        payload: { orderCode },
        callback:(data)=>{
          this.setState({ detailsData: data, loading: false });
        }
      });
    }
  }
  //打印
  print = () => {
    let { orderCode } = this.props.match.params;
    window.open(`${replenishmentPlan.PRINT_DETAIL}?orderCode=${orderCode}`, '_blank');
  }
  render(){
    const { detailsData, loading } = this.state;
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <div style={{ display: 'flex',justifyContent: 'space-between' }}>
            <h3>单据信息</h3>
            <Button onClick={this.print}>打印</Button>
          </div>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>订单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.orderCode }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>计划单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.planCode }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.orderStatusName }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.orderTypeName }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>供应商</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.supplierName }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>下单人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.createUserName }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>下单时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.createDate }
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>收货地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.receiveAddress }</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <Table
            bordered
            title={()=>'产品信息'}
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'id'}
            loading={loading}
            dataSource={detailsData ? detailsData.list : []}
            pagination={false}
          />
        </div>
        <div className='detailCard'>
          <Table
            bordered
            title={()=>'配送单信息'}
            scroll={{x: '100%'}}
            columns={sendColumns}
            dataSource={detailsData ? detailsData.acceptCheckList : []}
            loading={loading}
            rowKey={'id'}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
export default connect(state => state)(PlanOrderDetail);
