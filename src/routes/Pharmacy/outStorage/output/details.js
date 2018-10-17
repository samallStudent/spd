/*
 * @Author: yuwei  发药出库详情 /output/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Row, Col, message, Tooltip } from 'antd';
import RetomeTable from '../../../../components/TableGrid';
import outStorage from '../../../../api/pharmacy/outStorage';
import {connect} from 'dva';
const columns = [
  {
    title: '通用名称',
    width: 168,
    dataIndex: 'ctmmGenericName'
  },
  {
    title: '商品名称',
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
    title: '发药单位',
    width: 112,
    dataIndex: 'replanUnit'
  },
  {
    title: '发药数量',
    width: 112,
    dataIndex: 'oEORIDispDrugQuantity'
  },
  {
    title: '出库数量',
    width: 112,
    dataIndex: 'backSumNum'
  },
  {
    title: '货位类别',
    width: 168,
    dataIndex: 'outStoreName'
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
  }
];

class DetailsOutput extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      query: {
        backNo: this.props.match.params.id
      },
      info: {}
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'outStorage/billoutsotreDetail',
      payload: {
        backNo: this.props.match.params.id
      },
      callback: (data) => {
        if(data.msg === 'success') {
          this.setState({
            info: data.data
          });
        }else {
          message.error(data.msg);
        }
      }
    })
  }
  
  render(){
    let {query, info} = this.state;
    return (
      <div  className='ysynet-main-content' >
          <h3>单据信息</h3>
          <Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>发药单</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.dispensingCode || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>内部药房</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.innerDeptName || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>外部药房</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.outDeptName || ''}</div>
                </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>出库分类</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.backTypeName || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>发药时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.dispensingDate || ''}</div>
                </div>
            </Col>
          </Row>
          <hr className='hr'/>
          <h3>产品信息</h3>
          <RetomeTable
            query={query}
            url={outStorage.DETAIL_LIST}
            scroll={{x: 2352}}
            columns={columns}
            rowKey={'id'}
            style={{marginTop: 24}}
          />
      </div>
    )
  }
}
export default connect()(DetailsOutput);