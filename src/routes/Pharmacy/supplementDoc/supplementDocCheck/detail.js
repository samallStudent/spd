/*
 * @Author: gaofengjiao 
 * @Date: 2018-08-06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-06 18:36:52
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col,Tooltip ,message , Button , Modal} from 'antd';
import { connect } from 'dva';
const Comfirm = Modal.confirm;
const columns = [
  {
    title: '数量',
    width: 90,
    dataIndex: 'makeipQuantity'
  },
  {
    title: '单位',
    width: 90,
    dataIndex: 'replanUnit',
  },
  {
    title: '包装规格',
    width: 148,
    dataIndex: 'packageSpecification',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '目的货位类型',
    width: 148,
    dataIndex: 'positionTypeName',
  },
  {
      title: '药品名称',
      dataIndex: 'ctmmTradeName',
      width: 350,
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  /*{
    title: '规格',
    width: 148,
    dataIndex: 'ctmmSpecification',
  },*/
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
    title: '生产批号',
    width: 138,
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
    dataIndex: 'validEndDate',
  }
];

class ReplenishmentDetail extends PureComponent{

  state ={
    baseInfo:{},
    checkLoading: false,
    rejectLoading: false
  }
  componentDidMount(){
    console.log(this.props.match.params.id)
    this.props.dispatch({
      type:'pharmacy/GETMakeupDetail',
      payload:{makeupCode:this.props.match.params.id},
      callback:(data)=>{
        console.log(data)
        this.setState({
          baseInfo:data
        })
      }
    })
    
  }
  onCheck = (state)=>{
    Comfirm({
      title:"确定执行此操作？",
      onOk:()=>{
        let postData = {
          makeuplist:[
            {
              makeupCode:this.props.match.params.id
            }
          ],
          type:state
        }
        if(state === 1){
          this.setState({
            checkLoading: true
          })
        }else if(state === 2){
          this.setState({
            checkLoading: true
          })
        }
        this.props.dispatch({
          type:'pharmacy/CheckMakeupDetail',
          payload:postData,
          callback:(data)=>{
            message.success('审核状态变更成功！');
            this.props.history.push({pathname:"/pharmacy/supplementDoc/supplementDocCheck"});
            if(state === 1){
              this.setState({
                checkLoading: false
              })
            }else if(state === 2){
              this.setState({
                checkLoading: false
              })
            }
          }
        })
      }
    })
  } 

  render(){
    const {  baseInfo,checkLoading,rejectLoading} = this.state;
    return ( 
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          {
            baseInfo && baseInfo.makeupStatus===2?
            <Row>
              <Col span={8}><h3>单据信息</h3></Col>
              <Col span={16} style={{textAlign:'right'}}>
                <Button type='primary' onClick={()=>this.onCheck(1)} loading={checkLoading}>审核通过</Button>
                <Button type='default' onClick={()=>this.onCheck(2)} style={{ marginLeft: 8 }} loading={rejectLoading}>不通过</Button>
              </Col>
            </Row>: <h3>单据信息</h3>
          }
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>补登单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.makeupCode:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>入库/出库单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.storeCode:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.makeupTypeName:''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.makeupStatusName:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>补登人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.createUserName:''}
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>补登时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.createDate:''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>审核人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.reviewUserName:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>审核时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.reviewDate:''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <Table
            title={()=>'产品信息'}
            style={{marginTop: 20}}
            bordered
            columns={columns}
            pagination={false}
            scroll={{ x: '100%' }}
            rowKey='drugCode'
            dataSource={baseInfo?baseInfo.list:[]}
          />
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(ReplenishmentDetail);
