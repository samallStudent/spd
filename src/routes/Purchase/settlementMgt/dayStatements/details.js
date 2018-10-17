/**
 * @file 药房 - 日对账单 - 详情
 */
import React, { PureComponent } from 'react';
import { Row, Col, Input, Tooltip, message, Button } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect';
import {dayStatements, common} from '../../../../api/purchase/purchase';
import {connect} from 'dva';

const {Search} = Input;

class Details extends PureComponent {
  state = {
    value: undefined,
    query: {
      balanceCode: this.props.match.params.id,
      hisDrugCodeList: [],
      dispensingNo: ""
    },
    info: {}
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'settlementMgt/dailyDetail',
      payload: {
        balanceCode: this.props.match.params.id
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
  changeSelect = (value) => {
    let {query} = this.state;
    query = {
      ...query,
      dispensingNo: value
    };
    this.setState({
      query
    });
  }
  changeFetchSelect = (value) => {
    let {query} = this.state;
    query = {
      ...query,
      hisDrugCodeList: value? [value] : []
    };
    this.setState({
      query,
      value
    });
  }
  //打印
  print = () => {
    const {id} = this.props.match.params;
    window.open(`${dayStatements.PRINT_DELIVERY_DETAIL}?sendId=${id}`);
  }
  render() {
    let {query, value, info} = this.state;
    const columns = [
      {
        title: '对账反馈',
        dataIndex: 'feedBackRemark',
        width: 112
      },{
        title: '发药确认单',
        dataIndex: 'dispensingNo',
        width: 168
      },
      {
        title: '出库单',
        dataIndex: 'backNo',
        width: 168
      },
      {
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 168
      },
      {
        title: '商品名',
        dataIndex: 'ctmmTradeName',
        width: 224
      },
      {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
        className:'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 224
      },
      {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168
      },
      {
        title: '发药单位',
        dataIndex: 'replanUnit',
        width: 112
      },
      {
        title: '发药数量',
        dataIndex: 'oEORIDispDrugQuantity',
        width: 112
      },
      {
        title: '出库数量',
        dataIndex: 'backSumNum',
        width: 112
      },
      {
        title: '出库货位类别',
        dataIndex: 'outStoreName',
        width: 168
      },
      {
        title: '生产批号',
        dataIndex: 'lot',
        width: 168
      },
      {
        title: '参考价格',
        dataIndex: 'drugPrice',
        width: 112
      },
      {
        title: '参考金额',
        dataIndex: 'totalAmount',
        width: 112
      },
      {
        title: '生产日期',
        dataIndex: 'productDate',
        width: 168
      },
      {
        title: '有效期至',
        dataIndex: 'validEndDate',
        width: 168
      },
      {
        title: '发药时间',
        dataIndex: 'dispensingDate',
        width: 168
      }, 
    ];
    return (
      <div className='fullCol'>
        <div className='fullCol-fullChild'>
          <Row>
            <Col span={12}>
              <h2>对账单: <span>KP00221180700001CW</span></h2>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <Button onClick={this.print}>打印</Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.confirmStatusName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>对账人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.balanceUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>对账完成时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.balanceEndTime || ''}</div>
              </div>
            </Col>
          </Row>
          <div style={{borderBottom: '1px dashed #d9d9d9', marginBottom: 10}}></div>
          <Row align="middle">
            <Col span={8}>
              <div className="ant-row">
                <div className="ant-col-4 ant-form-item-label-left">
                  <label>单号</label>
                </div>
                <div className="ant-col-18">
                  <div className="ant-form-item-control">
                    <Search 
                      placeholder='发药单/出库单'
                      onSearch={this.changeSelect}
                     />
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-row">
                <div className="ant-col-4 ant-form-item-label-left">
                  <label>名称</label>
                </div>
                <div className="ant-col-18">
                  <div className="ant-form-item-control">
                    <FetchSelect
                      allowClear
                      value={value}
                      style={{width: '100%'}}
                      url={common.QUERY_DRUG_BY_LIST}
                      placeholder='通用名/产品名/生产厂家/供应商'
                      cb={this.changeFetchSelect}
                     />
                  </div>
                </div>
              </div>
            </Col>
            {/* <Col span={8} style={{lineHeight: '39px'}}>
                <Checkbox>只显示异常</Checkbox>
            </Col> */}
          </Row>
        </div>
        <div className="detailCard">
          <Row>
              <Col span={24} style={{ paddingBottom: 10, borderBottom: '1px solid #f5f5f5' }} >产品信息</Col>
          </Row>
          <RemoteTable
            isJson={true}
            query={query}
            url={dayStatements.DAILY_DETAIL_LIST}
            scroll={{x: 3080}}
            columns={columns}
            rowKey={'id'}
            style={{marginTop: 24}}
          />
        </div>
      </div>
    )
  }
}
export default connect()(Details);
