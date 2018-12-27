/**
 * @file 药库 - 盘点损益 - 新建盘点 - 详情(已确认)
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Input, Tooltip } from 'antd';
import { createData } from '../../../../common/data';

class DetailsConfirm extends PureComponent {
  render() {
    const columns = [
      {
        title: '通用名称',
        dataIndex: 'productName1',
        render:(text,record)=>record.productName,
          width: 200
      },
      {
        title: '商品名',
        dataIndex: 'productName',
          width: 200
      },
      {
        title: '规格',
        dataIndex: 'spec',
        className: 'ellipsis',
          width: 140,
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '剂型',
        dataIndex: 'fmodal',
          width: 90
      },
      {
        title: '包装单位',
        dataIndex: 'unit',
        render:(text)=>'g',
          width: 148
      },
      {
        title: '批准文号',
        dataIndex: 'approvalNo',
          width: 128
      },
      {
        title: '生产厂家',
        dataIndex: 'productCompany',
          width: 168
      },
      {
        title: '库存数量',
        dataIndex: 'assetsRecord',
          width: 90
      },
      {
       title: '盘点数量',
       dataIndex: 'pdNumber',
          width: 90
      },
      {
        title: '盈亏数量',
        dataIndex: 'ykNumber',
          width: 90
      },
      {
        title: '货位',
        dataIndex: 'huow',
          width: 138
      },
      {
        title: '生产批号',
        dataIndex: 'shengcNumber',
          width: 128
      },
      {
        title: '生产日期',
        dataIndex: 'shengcDate',
          width: 118
      },
      {
        title: '有效期至',
        dataIndex: 'yxqz',
          width: 118
      },
      {
        title: '供应商',
        dataIndex: 'supplier',
          width: 168
      }
    ];
    return (
      <div className='fullCol'>
        <div className='fullCol-fullChild'>
          <h2>盘点单: <span>KP00221180700001CW</span></h2>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-4">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>已确认</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-4">
                <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>明盘全盘</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-4">
                <label>部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>药库</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-4">
                <label>制单人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>张三三</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-4">
                <label>制单时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>2018-7-24 16:45:15</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-4">
                <label>起始时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>2018-7-24 16:45:15</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-4">
                <label>备注</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>我是新建盘点列表</div>
              </div>
            </Col>
          </Row>
          <div style={{borderBottom: '1px dashed #d9d9d9', marginBottom: 10}}></div>
          <Row>
            <Col span={8}>
              <div className="ant-row">
                <div className="ant-col-4 ant-form-item-label-left-left" style={{ textAlign: 'right' }}>
                  <label>名称</label>
                </div>
                <div className="ant-col-18">
                  <div className="ant-form-item-control">
                    <Input />
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-row">
                <div className="ant-col-4 ant-form-item-label-left-left" style={{ textAlign: 'right' }}>
                  <label>供应商</label>
                </div>
                <div className="ant-col-18">
                  <div className="ant-form-item-control">
                    <Input />
                  </div>
                </div>
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
export default DetailsConfirm;