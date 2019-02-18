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
    const columns = [
      {
        title: '退药类型',
        dataIndex: 'ctmmTradeName',
        width:200,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
    
      {
        title: '患者姓名',
        width:150,
        dataIndex: 'patpatientname',
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '药房操作人',
        dataIndex: 'userno',
        width: 112, 
      },
      {
        title: '药房操作人',
        dataIndex: 'userno',
        width: 112, 
      },
      {
        title: '退药单号',
        dataIndex: 'baskno',
        width: 112, 
      },
      {
        title: '操作时间',
        dataIndex: 'backdate',
        width: 112,
      },
      {
        title: '品规数',
        dataIndex: 'drugtotal',
        width: 112,
      },
      {
        title: '单据状态',
        dataIndex: 'delflag',
        width: 112,
      },
      {
        title: '操作',
        dataIndex: '',
        width: 112,
        render: (text,record) =>(
          <span> 
            <Link to={{ pathname: `/purchase/statisticAnalysis/statisticsTraceability/details/${record.baskid}` }}>详情</Link>
          </span> 
        )
      }
    ];   

class OrderRetrospect extends PureComponent { 
  state = {   
    detailsData: {},
    query: {
      ctdid: this.props.match.params.ctdid,
      deptid: this.props.match.params.deptid
    }
  } 

  render() { 
    const { detailsData, query } = this.state;
    return ( 
      <div className="fullCol">
      <div className='ysynet-main-content'>
      <h3 style={{marginBottom: 16}}>库存信息</h3>
        <RemoteTable
          query={query}
          scroll={{x: '100%', y: 300}}
          isJson
          columns={columns}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={tracingTotalList.HIS_BACK}
        />
      </div>
      </div>
    )
  }
}
export default connect(state => state)(OrderRetrospect);