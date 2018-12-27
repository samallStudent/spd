/*
 * @Author: yuwei  退货详情 /refund/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Button, Modal, Tooltip, Spin, message } from 'antd';
import {Link} from 'react-router-dom';
//import { outStorage } from '../../../../api/drugStorage/outStorage';
import { connect } from 'dva';
const Conform = Modal.confirm;
const columns = [
  {
    title: '通用名称',
    width: 224,
    dataIndex: 'ctmmGenericName',
    className: 'ellipsis',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
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
    title: '入库单号',
    width: 280,
    dataIndex: 'inStoreCode',
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification',
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'replanUnit',
  },
  {
    title: '出库数量',
    width: 112,
    dataIndex: 'backNum',
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
    title: '生产厂家',
    dataIndex: 'ctmmManufacturerName',
    width: 224,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '批准文号',
    dataIndex: 'approvalNo',
    width: 224
  }
];

class DetailsRefund extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      visible: false,
      spinning: false,
      detailsData: {},
      dataSource: [],
    }
  }
  componentDidMount = () =>{
    console.log('12');
    if (this.props.match.params.id) {
      let backNo = this.props.match.params.id;
      console.log(backNo);
      this.setState({ spinning: true });
        this.props.dispatch({
          type:'base/getBackStorageDetail',
          payload: { backNo },
          callback:(data)=>{
            this.setState({ detailsData: data,dataSource: data.list, spinning: false });
          }
        });
      }
  }
  // 确认退货
  backStroage = () => {
    Conform({
      content:"是否确认退货？",
      onOk:()=>{
        const { dispatch, history } = this.props;
        const {  dataSource, detailsData } = this.state;
        let postData = {}, backDrugList = [];
        dataSource.map(item => backDrugList.push({ backNum: item.backNum, drugCode: item.drugCode }));
        postData.backDrugList = backDrugList;
        postData.backcause = detailsData.backCause;
        console.log(postData,'postData')
        dispatch({
          type: 'base/submitBackStorage',
          payload: { ...postData },
          callback: () => {
            message.success('退货成功');
            history.push({pathname:"/drugStorage/outStorage/backStorage"})
          }
        })
      },
      onCancel:()=>{}
    })
  }
  //打印
  // print = () => {
  //   const {backNo} = this.props.match.params;//printBackDetail
  //   window.open(`${outStorage.PRINT_BACK_DETAIL}?backNo=${backNo}`, '_blank');
  // }
  pass = () =>{
    let backNo = this.props.match.params.id;
    console.log(backNo);
    this.props.dispatch({
      type:'base/depotBackSubmit',
      payload: { 
        "type": 1 ,
        backdetailList:[
          {
            backNo
          }
        ]
       },
      callback:(data)=>{
        message.success('审批通过成功！');
      }
    });
  }

  reject = () => {
    let backNo = this.props.match.params.id;
    this.props.dispatch({
      type:'base/depotBackSubmit',
      payload: { 
        "type": 2 ,
        backdetailList:[
          {
            backNo
          }
        ]
       },
      callback:(data)=>{
        message.success('审批驳回成功！');
      }
    });
  }

  render(){
    const { detailsData, dataSource, spinning } = this.state;
    let {path} = this.props.match;
    path = path.split('/');
    path.length = 4;
    path = path.join('/');
    return (
      <div className='fadeIn ysynet-content'>
        <Spin spinning={spinning}>
          <div style={{padding: '0 16px'}}>
            <div className='ysynet-details-flex-header'>
              <h3>单据信息</h3>
              <div style={{ textAlign: 'right' }}>
                {
                  detailsData.backStatus === 3 && 
                  <Link to={{pathname: `${path}/edit/${this.props.match.params.backNo}`}}>
                    <Button type='default'>编辑</Button>
                  </Link>
                }
                {/* <Button style={{marginLeft: 8}} onClick={this.print}>打印</Button> */}
                <Button style={{marginLeft: 8}} type='primary' onClick={this.pass}>通过</Button>
                <Button style={{marginLeft: 8}}  type='danger' onClick={this.reject}>驳回</Button>
                </div>
            </div>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退货单</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.backNo }</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>状态</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.backStatusName }</div>
                  </div>
              </Col>
              {/* <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>来源部门</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.backDpetName }</div>
                  </div>
              </Col> */}
            </Row>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退货人</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.createUserName }</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退货时间</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.createDate }
                    </div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>供应商</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.supplierName }</div>
                  </div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>审核人</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.updateUserName }</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>审核时间</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.updateDate }</div>
                  </div>
              </Col>
            </Row>
            <hr className='hr'/>
            <h3>产品信息</h3>
            <Table  
              bordered
              dataSource={dataSource}
              scroll={{x: '100%'}}
              columns={columns}
              rowKey={'drugCode'}
              pagination={{
                size: 'small',
                showQuickJumper: true,
                showSizeChanger: true
              }}
            />
          </div>
        </Spin>
      </div>
    )
  }
}
export default  connect(state => state)(DetailsRefund) ;
