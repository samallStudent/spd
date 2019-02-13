/*
 * @Author: wwb 
 * @Date: 2018-07-24 20:15:54 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 20:21:38
 */
/* 
  @file 补货计划 详情
*/
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Tooltip, Button, message } from 'antd';
import {Link} from 'react-router-dom';
import { connect } from 'dva';
const columns = [
 /* {
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

  /*{
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
  },*/
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
    title: '报告药申请单号',
    dataIndex: 'reportApplicationCode',
    width: 168,
  },
  {
    title: '需求数量',
    dataIndex: 'demandQuantity',
    width: 112,
  },
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
 /* {
    title: '价格',
    dataIndex: 'price',
    width: 112
  },
  {
    title: '金额',
    dataIndex: 'amount',
    width: 112,
    render: (text, record) => (record.price * record.demandQuantity).toFixed(4)
  },*/
  {
    title: '批准文号',
    width: 200,
    dataIndex: 'approvalNo',
  },
    {
        title: '药品编码',
        dataIndex: 'hisDrugCode',
        width: 200,
    }
];

class OutCatalogPurchase extends PureComponent{
  state = {
    detailsData: {},
    submitLoading: false
  }
  componentDidMount = () => {
    this.getDetail();
  }
  getDetail = () => {
    let { planCode } = this.props.match.params;
    this.props.dispatch({
      type:'base/ReplenishDetails',
      payload: { planCode },
      callback:({data, code, msg})=>{
        if(code === 200) {
          this.setState({ detailsData: data });
        }else {
          message.error(msg);
        };
      }
    });
  }
  submit = () => {
    this.setState({
      submitLoading: true
    });
    let {detailsData} = this.state;
    let dataSource = detailsData.list.map(item => {
      return {
        bigDrugCode: item.bigDrugCode,
        demandQuantity: item.demandQuantity,
        drugCode: item.drugCode,
        drugPrice: item.drugPrice,
        hisDrugCode: item.hisDrugCode,
        supplierCode: item.supplierCode
      }
    });
    this.props.dispatch({
      type: 'base/submit',
      payload: {
        auditStatus: 2,
        id: detailsData.id,
        planType: detailsData.planType,
        list: dataSource,
        deptCode: detailsData.deptCode
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          message.success('提交成功');
          this.setState({
            submitLoading: false
          });
          this.getDetail();
        }else {
          this.setState({
            submitLoading: false
          });
          message.error(msg);
        };
      }
    });
  }
  render(){
    const { detailsData, submitLoading } = this.state;
    let {path} = this.props.match;
    path = path.split('/');
    path.length = 4;
    path = path.join('/');
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <div style={{ display: 'flex',justifyContent: 'space-between' }}>
            <h3>单据信息</h3>
            {
              (detailsData.auditStatus === 1 || detailsData.auditStatus === 3) &&
              <div>
                <Link to={{pathname: `${path}/edit/${this.props.match.params.planCode}`}}><Button type='default'>编辑</Button></Link>
                <Button type='primary' loading={submitLoading} onClick={this.submit} style={{ marginLeft: 8 }}>提交</Button>
              </div>
            }
          </div>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>计划单号</label>
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
                <div className='ant-form-item-control'>{detailsData.statusName}</div>
              </div>
            </Col>
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
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>驳回说明</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.remarks}</div>
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
            rowKey={'id'}
            dataSource={detailsData ? detailsData.list : []}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
export default connect(state => state)(OutCatalogPurchase);