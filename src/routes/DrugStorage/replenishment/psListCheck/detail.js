/*
 * @Author: wwb 
 * @Date: 2018-07-24 20:15:54 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-07-31 14:02:26
 */
/* 
  @file 补货计划 详情
*/
import React, { PureComponent } from 'react';
import { Table ,Row, Col,Tooltip } from 'antd';
import { createData } from '../../../../common/data';
const columns = [
  {
    title: '通用名称',
    dataIndex: 'geName',
    width:200,
  },
  {
    title: '商品名',
    width:220,
    dataIndex: 'productName'
  },
  {
    title: '规格',
    dataIndex: 'spec',
    width: 180,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '剂型',
    dataIndex: 'fmodel',
    width: 180,
  },
  {
    title: '包装单位',
    dataIndex: 'unit',
    width:120,
  },
  {
    title: '生产厂家',
    width:180,
    dataIndex: 'productCompany'
  },
  {
    title: '批准文号',
    width:180,
    dataIndex: 'approvalNo',
  },
  {
    title: '生产日期',
    dataIndex: 'produceTime',
    width: 180,
    render: (text,record,index)=> `2017-11-24 15:00`
  },
  {
    title: '有效日期',
    dataIndex: 'UserfulDate',
    width: 180,
    render: (text,record,index)=> `2021-11-25 14:00`
  },
  {
    title: '价格',
    dataIndex: 'price',
    render: (text,record,index)=> `10`
  },
  {
    title: '配送金额',
    dataIndex: 'total',
    render: (text,record,index)=> `1200.00`
  },
  {
    title: '供应商',
    dataIndex: 'fOrgName',
    render: (text,record)=> `武汉供应商`
  }
];

class PslistCheck extends PureComponent{
  render(){
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <h3>单据信息</h3>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>配送单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>PA002211807000086U</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>订单号</label>
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
                <div className='ant-form-item-control'>订单完成</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>药品配送单</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>供应商</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>国药药业集团</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>制单人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>制单人</div>
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
                <label>验收人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>高晓松
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>验收时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>2018-07-12 17:09:15</div>
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
          </Row>
        </div>
        <div className='detailCard'>
         <Table
            dataSource={createData()}
            bordered
            title={()=>'产品信息'}
            scroll={{x: '160%'}}
            columns={columns}
            pagination={{
              size: 'small',
              showQuickJumper: true,
              showSizeChanger: true
            }}
            rowKey={'id'}
          />
        </div>
      </div>
    )
  }
}
export default PslistCheck;
