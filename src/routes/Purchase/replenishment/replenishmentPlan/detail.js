/*
 * @Author: wwb 
 * @Date: 2018-07-24 20:15:54 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 00:16:10
 */
/* 
  @file 补货计划 详情
*/
import React, { PureComponent } from 'react';
import { Table ,Row, Col,Tooltip, Button, message } from 'antd';
import { connect } from 'dva';
import {Link} from 'react-router-dom';
const columns = [
  {
    title: '通用名',
    width: 168,
    dataIndex: 'ctmmGenericName'
  },
  {
    title: '商品名',
    width: 224,
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
    title: '剂型',
    width: 168,
    dataIndex: 'ctmmDosageFormDesc'
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification'
  },
  {
    title: '单位',
    width: 60,
    dataIndex: 'replanUnit'
  },
  {
    title: '需求数量',
    dataIndex: 'demandQuantity',
    width: 112
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
    title: '供应商',
    width: 224,
    dataIndex: 'supplierName'
  },
  {
    title: '批准文号',
    width: 224,
    dataIndex: 'approvalNo'
  }
];

class ReplenishmentDetail extends PureComponent{
  state = {
    detailsData: {}
  }
  componentDidMount = () => {
    this.getDetail();
  }
  //详情
  getDetail = () => {
    if (this.props.match.params.planCode) {
      let { planCode } = this.props.match.params;
      this.props.dispatch({
        type:'base/ReplenishDetails',
        payload: { planCode },
        callback:(data)=>{
          console.log(data, '详情数据');
          this.setState({ detailsData: data });
        }
      });
    }
  }
  //提交
  submit = () => {
    let {detailsData} = this.state;
    let dataSource = detailsData.list.map(item => {
      return {
        bigDrugCode: item.bigDrugCode,
        demandQuantity: item.demandQuantity,
        drugCode: item.drugCode,
        drugPrice: item.drugPrice,
        supplierCode: item.supplierCode
      }
    });
    this.props.dispatch({
      type: 'base/submit',
      payload: {
        auditStatus: 2,
        id: detailsData.id,
        planType: detailsData.planType,
        list: dataSource,
        deptCode: detailsData.deptCode
      },
      callback: (data) => {
        message.success('提交成功');
        this.getDetail();
      }
    })
  }
  render(){
    const { detailsData } = this.state;
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <div style={{ display: 'flex',justifyContent: 'space-between' }}>
            <h3>单据信息</h3>
            {
              (detailsData.auditStatus === 1 && detailsData.auditStatus === 3) &&
              <div>
                <Link to={{pathname: `/editReplenishment/${this.props.match.params.planCode}`}}><Button type='default'>编辑</Button></Link>
                <Button type='primary' onClick={this.submit} style={{ marginLeft: 8 }}>提交</Button>
              </div>
            }
          </div>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>计划单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.planCode}</div>
              </div>
            </Col>
            <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>类型</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{detailsData.planTypeName}</div>
            </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.statusName}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>发起人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.createUserName}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>发起时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.createDate}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>联系电话</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.mobile}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>收货地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.receiveAddress}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>审核人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.sheveUserName}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>审核时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.sheveDate}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>驳回说明</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.note}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <Table
            title={()=>'产品信息'}
            scroll={{x: 1740}}
            columns={columns}
            rowKey={'drugCode'}
            bordered
            dataSource={detailsData ? detailsData.list : []}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
export default connect(state => state)(ReplenishmentDetail);
