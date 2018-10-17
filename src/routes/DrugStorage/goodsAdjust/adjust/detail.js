/*
 * @Author: gaofengjiao 
 * @Date: 2018-08-06
 * @Last Modified by: gaofengjiao
 * @Last Modified time: 2018-08-06
 */
/* 
  @file 货位调整 详情
*/
import React, { PureComponent } from 'react';
import {Table ,Row, Col, Tooltip} from 'antd';
import {connect} from 'dva';
const columns = [
  {
    title: '通用名',
    dataIndex: 'ctmmGenericName',
		width: 168,
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
    dataIndex: 'ctmmManufacturerName',
		width: 224,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '移动数量',
		width: 112,
    dataIndex: 'adjustNum'
  },
  {
    title: '移动单位',
		width: 112,
    dataIndex: 'originalUnitName'
  },
  {
    title: '原库存',
		width: 112,
    dataIndex: 'originalStore'
  },
  {
    title: '原货位',
		width: 112,
    dataIndex: 'originalGoodsName'
  },
  {
    title: '原货位类型',
		width: 168,
    dataIndex: 'originalLocTypeName',
  },
  {
    title: '目的货位',
    dataIndex: 'goalGoodsName',
		width: 112,
  },
  {
    title: '目的货位单位',
    dataIndex: 'goalUnitName',
		width: 168,
  },
  {
    title: '目的货位类型',
		width: 168,
    dataIndex: 'goalLocTypeName'
  },
  {
    title: '转换系数',
		width: 112,
    dataIndex: 'conversionRate'
  },
  {
    title: '包装规格',
		width: 168,
    dataIndex: 'packageSpecification'
  },
  {
    title: '生产批号',
		width: 168,
    dataIndex: 'lot'
  },
];

class ReplenishmentDetail extends PureComponent{
  state = {
    info: {},
    loading: true
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'goodsAdjust/goodsDetail',
      payload: {
        locAdjustNo: this.props.match.params.id
      },
      callback: (data) => {
        this.setState({info: data, loading: false});
      }
    })
  }
  render(){
    let {info, loading} = this.state;
    let {roomLocAdjustDetailVoList} = info;
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <h3>单据信息</h3>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>移库单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.locAdjustNo || ''}</div>
              </div>
            </Col>
            <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>状态</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{info.statusName || ''}</div>
            </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>移库人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>移库时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createDate || ''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <h3 style={{marginBottom: 15}}>产品信息</h3>
          <Table
            loading={loading}
            dataSource={roomLocAdjustDetailVoList || []}
            bordered
            scroll={{x: 2072}}
            columns={columns}
            rowKey={'drugCode'}
          />
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(ReplenishmentDetail);
