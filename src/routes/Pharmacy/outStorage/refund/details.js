/*
 * @Author: yuwei  退库详情 /refund/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Button, Modal, Tooltip, Spin, message } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
const Conform = Modal.confirm;
const columns = [
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
    width: 168,
    dataIndex: 'ctmmSpecification',
  },*/
  {
    title: '入库单号',
    width: 168,
    dataIndex: 'inStoreCode',
  },
  {
    title: '包装规格',
    width: 148,
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
    dataIndex: 'validEndDate',
  },
  {
    title: '生产厂家',
    dataIndex: 'ctmmManufacturerName',
    width: 200,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '批准文号',
    dataIndex: 'approvalNo',
    width: 200
  }
];

class DetailsRefund extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      visible: false,
      spinning: false,
      loading: false,
      detailsData: {},
      dataSource: []
    }
  }
  componentDidMount = () =>{
    if (this.props.match.params.backNo) {
      let { backNo } = this.props.match.params;
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
  backStroage = () =>{
    Conform({
      content:"是否确认退货？",
      onOk:()=>{
        this.setState({ loading: true });
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
            this.setState({ loading: false });
            history.push({pathname:"/drugStorage/outStorage/backStorage"})
          }
        })
      },
      onCancel:()=>{}
    })
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
          <div style={{margin: '0 16px'}}>
            <div className='ysynet-details-flex-header'>
              <h3>单据信息</h3>
              {
                detailsData.backStatus === 3 &&
                <div style={{ textAlign: 'right' }}>
                  <Link to={{pathname: `${path}/edit/${this.props.match.params.backNo}`}}><Button type='default'>编辑</Button></Link>
                </div>
              }
            </div>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退库单</label>
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
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>受理部门</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.backDpetName }</div>
                  </div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退库人</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.createUserName }</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退库时间</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.createDate }
                    </div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>复核人</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.reviewUserName }</div>
                  </div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>复核时间</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.reviewDate }</div>
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
            pagination={false}
          />
          </div>
        </Spin>
      </div>
    )
  }
}
export default  connect(state => state)(DetailsRefund) ;
