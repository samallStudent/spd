/*
 * @Author: yuwei  出库管理详情 /output/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table, Row, Col, Button, Tooltip, message} from 'antd';
import {connect} from 'dva';
import {outStorage} from '../../../../api/drugStorage/outStorage';
import querystring from 'querystring';
const columns = [
  /*{
    title: '通用名',
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
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc',
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification'
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'replanUnit'
  },
  {
    title: '出库数量',
    width: 112,
    dataIndex: 'backNum'
  },
  {
    title: '生产批号',
    width: 148,
    dataIndex: 'lot',
  },
  {
    title: '生产日期',
    width: 118,
    dataIndex: 'productDate',
  },
  {
    title: '有效期至',
    width: 118,
    dataIndex: 'validEndDate'
    
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
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '采购方式',
    dataIndex: 'purchaseType',
    width: 112,
    render: (text) => text === 1 ? '零库存' : '自采'
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 112
  },
  {
    title: '供应商',
    width: 224,
    dataIndex: 'supplierName',
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
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
      status: null,
      checkLoading: false,
      rejectLoading: false
    }
  }
  componentDidMount() {
    this.getDatail();
  }
  //不通过
  onBan = () =>{
    this.setState({
      rejectLoading: true
    })
    this.props.dispatch({
      type: 'outStorage/rejectOutStore',
      payload: {
        backNo: this.state.id
      },
      callback: (data) => {
        if(data.msg === 'success') {
          message.success('操作成功');
          this.getDatail();
        }else {
          message.error(data.msg);
        };
        this.setState({
          rejectLoading: false
        });
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
    this.setState({
      checkLoading: true
    });
    this.props.dispatch({
      type: 'outStorage/checkOutStore',
      payload: {
        backNo,
        deptCode,
        outStoreDetail
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          message.success('操作成功');
          this.getDatail();
        }else {
          message.error(msg);
        };
        this.setState({
          checkLoading: false
        });
      }
    })
  }
  //打印
  print = () => {
    const {id} = this.state;
    window.open(`${outStorage.PRINT_DETAIL}?backNo=${id}`, '_blank');
  }

  render(){
    let {info, loading, status, checkLoading, rejectLoading} = this.state;
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
              <Col style={{textAlign:'right', float: 'right'}} span={6}>
                {
                  status === 1 ? (
                    [<Button type='primary' key="1" loading={checkLoading} className='button-gap' onClick={this.onSubmit}>复核通过</Button>,
                    <Button style={{margin: '0 8px'}} key="2" onClick={this.onBan} loading={rejectLoading}>不通过</Button>]
                  ) : null
                }
                {
                  status === 2 ? (
                    <Button icon='printer' onClick={this.print} >打印</Button>
                  ) : null
                }
              </Col>
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
            scroll={{x: '100%'}}
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