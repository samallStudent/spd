/*
 * @Author: yuwei  
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
  基数药 - 申领 - 详情
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col , Tooltip, message } from 'antd';
import {connect} from 'dva';
const columns = [
  {
   title: '申领数量',
   width: 112,
   dataIndex: 'applyNum',
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'replanUnit'
  },
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
    title: '商品名称',
    width: 224,
    dataIndex: 'ctmmTradeName',
    className: 'ellipsis',
    render: (text) => (
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
    width: 168,
    dataIndex: 'ctmmDosageFormDesc',
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification'
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
  }
];
class DetailsApplyAccept extends PureComponent{
  state = {
    drugsForInfo: {},
    loading: true
  }
  componentDidMount() {
    let applyCode = this.props.match.params.id;
    this.props.dispatch({
      type: 'salvageCar/rescuecarApplyDetail',
      payload: { applyCode },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            drugsForInfo: data,
            loading: false
          });
        }else {
          message.error(msg);
        };
      }
    })
  }
  render(){
    let {drugsForInfo, loading} = this.state;
    let dataSource = drugsForInfo.detailList || [];
    return (
      <div className='fullCol'>
        <div className='fullCol-fullChild'>
          <h3>单据信息</h3>
          <Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>申领单</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{drugsForInfo.applyCode || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>状态</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{drugsForInfo.applyStatusName}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>申领部门</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{drugsForInfo.applyDeptName || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>入库人</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{drugsForInfo.createUserName || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>发起时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{drugsForInfo.createDate || ''}</div>
                </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <Table
            loading={loading}
            title={()=>'产品信息'}
            dataSource={dataSource}
            bordered
            pagination={false}
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'drugCode'}
          />
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(DetailsApplyAccept);