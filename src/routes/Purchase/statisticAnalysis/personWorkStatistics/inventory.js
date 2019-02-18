/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 统计分析--人员统计及追溯
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, message, Button, Input, Icon, DatePicker,Tooltip,Select } from 'antd';
import { Link } from 'react-router-dom'; 
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';
import moment from 'moment';
class OrderRetrospect extends PureComponent {
  state = {  
    detailsData: {},
    query: {
      userid: this.props.match.params.userid, 
    }
  } 

  render() { 
    const { detailsData, query } = this.state;
    const columns = [
      {
        title: '单据号',
        dataIndex: 'checkbillno',
        width:156,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
    
      {
        title: '操作时间',
        width:118,
        dataIndex: 'checktime',
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip>
                {moment(text).format('YYYY-MM-DD')}
            </Tooltip>
        )
      },
      {
        title: '商品名称',
        dataIndex: 'ctmmtradename',
        width: 250,
      },
      {
        title: '规格',
        dataIndex: 'ctmmspecification',
        width: 168,
      },
      {
        title: '生产厂商',
        dataIndex: 'ctmmmanufacturername',
        width: 200,
      },
      {
        title: '单位',
        dataIndex: 'ctmmvaluationunit',
        width: 112,
      },
      {
        title: '操作前库存',
        dataIndex: 'checknum',
        width: 90,
      },
      {
        title: '操作数量',
        dataIndex: 'accountstorenum',
        width: 90,
      }, 
      {
        title: '操作后结存',
        dataIndex: 'practicalrepertory',
        width: 90,
      }, 
      {
        title: '货位',
        dataIndex: 'positionname',
        width: 166,
      }, 
    ];
      const {userno,username} = this.props.match.params;
    return (
      <div className="fullCol">
              <div className="fullCol-fullChild">
                <h3>基本信息</h3>
                  <Row>
                      <Col span={8}>
                          <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                              <label>工号</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                              <div className='ant-form-item-control'>{userno&&userno!='undefined'?userno:''}</div>
                          </div>
                      </Col>
                      <Col span={8}>
                          <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                              <label>姓名</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                              <div className='ant-form-item-control'>{username?username:''}</div>
                          </div>
                      </Col>
                  </Row>
              </div>
      <div className='ysynet-main-content'>
      <h3 style={{marginBottom: 16}}>盘点信息</h3>
        <RemoteTable
          query={query}
          scroll={{x: '100%', y: 300}}
          isJson
          columns={columns}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={tracingTotalList.CHECK_BILL}
        />
      </div>
      </div>
    )
  }
}
export default connect(state => state)(OrderRetrospect);