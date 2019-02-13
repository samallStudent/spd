/*
 * @Author: wwb 
 * @Date: 2018-07-24 20:15:54 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 20:22:21
 */
/* 
  @file 补货计划  计划审核 -- 详情
*/
import React, { PureComponent } from 'react';
import { Table ,Row, Col,Tooltip, Button, Modal, Input, message, Spin } from 'antd';
import { connect } from 'dva';
const { TextArea } = Input;
const columns = [
  /*{
    title: '通用名称',
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
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
  },
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc',
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
    title: '需求数量',
    dataIndex: 'demandQuantity',
    width: 112,
  },
  /*{
    title: '价格',
    dataIndex: 'drugPrice',
    width: 112,
    render: (text,reocrd) =>{
      return text === undefined || text === null ? '0': text
    }
  },
  {
    title: '金额',
    dataIndex: 'totalPrice',
    width: 148,
  },*/
  {
    title: '生产厂家',
    width: 200,
    dataIndex: 'ctmmManufacturerName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '供应商',
    width: 200,
    dataIndex: 'supplierName',
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '批准文号',
    width: 200,
    dataIndex: 'approvalNo',
  },
];
class PlanCheckDetail extends PureComponent{
  state = {
    detailsData: {},
    loading: false,
    visible: false,
    value: undefined,
  }
  componentDidMount = () => {
    this.getDetail();
  }
  getDetail = () => {
    let { planCode } = this.props.match.params;
    this.setState({ loading: true });
    this.props.dispatch({
      type:'base/ReplenishDetails',
      payload: { planCode },
      callback:({data, code, msg})=>{ 
        if(code === 200) {
          this.setState({ 
            detailsData: data, 
            loading: false 
          });
        }else {
          this.setState({ 
            loading: false 
          });
          message.error(msg);
        };
      }
    });
  }
  // 审核通过
  pass = () =>{
    const that = this;
    Modal.confirm({
      title: '通过',
      content: '是否确认通过',
      onOk(){
        let values = {}
        values.opType = '4'// 审核通过
        that.update(values);
      }
    })
  }
  // 审核驳回
  reject = () =>{
    this.setState({
      visible: true
    });
  }
  //驳回输入框
  rejectInput = (e) => {
    this.setState({
      value: e.target.value
    });
  }
  //确认驳回
  handleOk = () => {
    let {value} = this.state;
    if(!value || !value.trim()) {
      return message.warning('驳回原因不能为空!');
    };
    let values = {};
    values.opType = '3'// 审核驳回
    values.note = value;
    this.update(values);
    this.setState({
      visible: false,
      value: ''
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      value: ''
    });
  }
  // 通过 驳回交互
  update = (values) =>{
    let list = [ this.state.detailsData.planCode ];
    values.list = list;
    values.purchaseType = 2;
    let { dispatch } = this.props;
    dispatch({
      type: 'replenish/updateStatus',
      payload: { ...values },
      callback: () =>{
        message.success('操作成功');
        this.getDetail();
      } 
    })

  }
  render(){
    const { detailsData, loading, visible, value } = this.state;
    return (
      <Spin spinning={loading}>
        <div className='fullCol fadeIn'>
          <div className='fullCol-fullChild'>
            <div style={{ display: 'flex',justifyContent: 'space-between' }}>
              <h3>单据信息</h3>
              {
                detailsData.auditStatus === 2
                &&
                <div>
                  <Button type='primary' onClick={this.pass}>通过</Button>
                  <Button type='danger' onClick={this.reject} style={{ marginLeft: 8 }} ghost>驳回</Button>
                </div>
              }
            </div>
            <Row>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>计划单</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{ detailsData.planCode }</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>类型</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{ detailsData.planTypeName }</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>状态</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{ detailsData.statusName }</div>
                </div>
              </Col>
              </Row>
              <Row>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>发起人</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{detailsData.createUserName}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                    <label>发起时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{detailsData.createDate}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                    <label>联系电话</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{detailsData.mobile}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                    <label>收货地址</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{detailsData.receiveAddress}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>审核人</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{detailsData.sheveUserName}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                    <label>审核时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{detailsData.sheveDate}</div>
                </div>
              </Col>
            </Row>
          </div>
          <div className='detailCard'>
            <Table
              bordered
              title={()=>'产品信息'}
              scroll={{x: '100%'}}
              columns={columns}
              dataSource={detailsData ? detailsData.list : []}
              rowKey={'drugCode'}
              pagination={{
                size: 'small',
                showQuickJumper: true,
                showSizeChanger: true
              }}
            />
          </div>
          <Modal
            title="驳回说明"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            maskClosable={false}
          >
            <Row>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-3">
                <label>说明</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-21">
                <div className='ant-form-item-control'>
                  <TextArea value={value} onChange={this.rejectInput} rows={3} placeholder="输入驳回说明" />
                </div>
              </div>
            </Row>
          </Modal>
        </div>
      </Spin>
    )
  }
}
export default connect(state => state)(PlanCheckDetail);
