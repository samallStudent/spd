/*
 * @Author: yuwei  出库管理详情 /output/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table, Row, Col, Button, Tooltip, message} from 'antd';
import {connect} from 'dva';
import querystring from 'querystring';
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
    dataIndex: 'packageSpecification'
  },
  {
    title: '单位',
    width: 60,
    dataIndex: 'replanUnit'
  },
  {
    title: '出库数量',
    width: 112,
    dataIndex: 'backNum'
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
    dataIndex: 'validEndDate'
    
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
  },
  {
    title: '供应商',
    width: 224,
    dataIndex: 'supplierName',
  }
];

class DetailsOutput extends PureComponent{

  constructor(props){
    super(props)
    let info = this.props.match.params.id;
    info = querystring.parse(info);
    this.state={
      info: {},
      loading: false,
      id: info.id,
      status: null
    }
  }
  componentDidMount() {
    this.getDatail();
  }
  //不通过
  onBan = () =>{
    this.props.dispatch({
      type: 'outStorage/rejectOutStore',
      payload: {
        backNo: this.state.id
      },
      callback: (data) => {
        if(data.msg === 'success') {
          message.success('操作成功');
          this.getDatail();
        }
      }
    })
  }
  getDatail = () => {
    this.setState({loading: true});
    this.props.dispatch({
      type: 'outStorage/outStoreDetailInfo',
      payload: {
        backNo: this.state.id
      },
      callback: (data) => {
        this.setState({
          info: data, 
          loading: false,
          status: data.status
        });
      }
    })
  }
  //确认
  onSubmit = () =>{
    let {info} = this.state
    let {backNo, deptCode, detailVo} = info;
    let outStoreDetail = detailVo.map(item => {
      return {
        backSumNum: item.backNum,
        batchNo: item.batchNo,
        drugCode: item.drugCode
      }
    });
    this.props.dispatch({
      type: 'outStorage/checkOutStore',
      payload: {
        backNo,
        deptCode,
        outStoreDetail
      },
      callback: (data) => {
        message.success('操作成功');
        this.getDatail();
      }
    })
  }

  render(){
    let {info, loading, status} = this.state;
    let {detailVo} = info;
    return (
      <div className='fullCol fadeIn'>
        <div className="fullCol-fullChild">
          <Row>
            <Col span={6}>
              <h2>
                单据信息
              </h2>
            </Col>
            {
              status === 1? (
                <Col style={{textAlign:'right', float: 'right'}} span={6}>
                  <Button type='primary' className='button-gap' style={{marginRight: 8}} onClick={()=>this.onSubmit()}>复核通过</Button>
                  <Button onClick={()=>this.onBan()} >不通过</Button>
                </Col>
              ) : null
            }
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>出库单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.backNo || ''}</div>
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
                  <label>申领药房</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.deptName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>发起人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>发起时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>联系电话</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.phone || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>药房地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.deptAddress || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>复核人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>复核时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkDate || ''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="detailCard">
          <Table
            bordered
            loading={loading}
            dataSource={detailVo || []}
            scroll={{x: 2244}}
            columns={columns}
            rowKey={'batchNo'}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(DetailsOutput);