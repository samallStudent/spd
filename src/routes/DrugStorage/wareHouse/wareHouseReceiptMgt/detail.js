/*
 * @Author: gaofengjiao 
 * @Date: 2018-08-06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-27 15:11:46
 */
/* 
  @file 入库 详情
*/
import React, { PureComponent } from 'react';

import { Table ,Row, Col,Tooltip, Button, message } from 'antd';

import {connect} from 'dva';
import wareHouse from '../../../../api/drugStorage/wareHouse';

const columns = [
  {
    title: '通用名',
    width: 168,
    dataIndex: 'ctmmGenericName'
  },
  {
    title: '商品名',
    width: 224,
    dataIndex: 'ctmmTradeName',
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
    dataIndex: 'ctmmDosageFormDesc',
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification',
  },
  {
    title: '单位',
    width: 60,
    dataIndex: 'replanUnit',
  },
  {
    title: '入库数量',
    dataIndex: 'inQuantity',
    width: 112,
  },
  {
    title: '生产批号',
    width: 168,
    dataIndex: 'lot',
  },
  {
    title: '生产日期',
    width: 168,
    dataIndex: 'productDate',
  },
  {
    title: '有效期至',
    width: 168,
    dataIndex: 'validEndDate',
  },
  {
    title: '货位',
    width: 112,
    dataIndex: 'storeLocName',
  },
  {
    title: '批准文号',
    width: 224,
    dataIndex: 'approvalNo',
  },
  {
    title: '生产厂家',
    width: 224,
    dataIndex: 'ctmmManufacturerName',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  }
];

class ReplenishmentDetail extends PureComponent{
  state = {
    data: {}
  }
  componentDidMount = () => {
    this.props.dispatch({
      type: 'wareHouse/getPutStorageInfo',
      payload: {
        inStoreCode: this.props.match.params.id,
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            data
          });
        }else {
          message.error(msg);
        }
      }
    })
  }
  //打印
  print = () => {//printInstoreDetail
    const {id} = this.props.match.params;
    window.open(`${wareHouse.PRINT_INSTORE_DETAIL}?inStoreCode=${id}`);
  }
  render(){
    let {data} = this.state;
    let {list} = data;
    return (
      <div  className="fullCol fadeIn">
        <div className='fullCol-fullChild'>
          <Row>
            <Col span={12}>
              <h3>单据信息</h3>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <Button onClick={this.print}>打印</Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                <label>部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{data.deptName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
              <label>入库分类</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{data.inStoreTypeName || ''}</div>
            </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                <label>供应商</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{data.ctmaSupplierName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                  <label>入库单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{data.inStoreCode || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                  <label>配送单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{data.distributeCode || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                  <label>订单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{data.orderCode || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                  <label>入库时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{data.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                  <label>上架时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{data.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                  <label>备注</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{data.remarks || ''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <h3 style={{margin: '0 0 20px 0', paddingBottom: 10, borderBottom: '1px solid #e8e8e8'}}>产品信息</h3>
          <Table
            bordered
            dataSource={list}
            scroll={{x: 2132}}
            columns={columns}
            rowKey={'batchNo'}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
export default connect(state=>state.wareHouse)(ReplenishmentDetail);
