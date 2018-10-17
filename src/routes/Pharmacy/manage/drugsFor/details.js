/*
 * @Author: yuwei  /applyAccept/details 申请受理详情
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col , Tooltip  } from 'antd';
import { createData } from '../../../../common/data';
const columns = [
  {
   title: '需求数量',
   width:150,
   dataIndex: 'medicinalCode',
  },
  {
    title: '通用名称',
    width:100,
    dataIndex: 'productName1',
    render:(text,record)=>record.productName
  },
  {
    title: '商品名称',
    width:150,
    dataIndex: 'productName',
  },
  {
    title: '规格',
    width:150,
    dataIndex: 'spec',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '剂型',
    width:150,
    dataIndex: 'fmodal',
  },
  {
    title: '包装单位',
    width:150,
    dataIndex: 'unit',
    render:(text)=>'g'
  },
  {
    title: '批准文号',
    width:150,
    dataIndex: 'approvalNo',
  },
  {
    title: '生产厂家',
    width:150,
    dataIndex: 'productCompany',
  }
];

class DetailsApplyAccept extends PureComponent{

  render(){
    return (
      <div className='fullCol'>
        <div className='fullCol-fullChild'>
          <h3>单据信息</h3>
          <Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>申领单</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>PA002211807000086U</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>状态</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>待确认</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>申领药房</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>门诊药房</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>制单人</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>张三三</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>制单时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>2015-09-03 15:00:02
                  </div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>联系电话</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>13020082008</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>药房地址</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>这是一个药房的地址</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>受理人</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'></div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>受理时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'></div>
                </div>
            </Col>
          </Row>
        </div>
          <Table
            dataSource={createData()}
            bordered
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'id'}
            style={{marginTop: 24}}
          />
      </div>
    )
  }
}
export default DetailsApplyAccept;