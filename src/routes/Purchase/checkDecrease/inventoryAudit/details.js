/**
 * @file 药库 - 盘点损益 - 新建盘点 - 详情(待确认)
 */
import React, { PureComponent } from 'react';
import {Row, Col, Button, message, Tooltip} from 'antd';
import {checkDecrease, common} from '../../../../api/checkDecrease';
import RetomeTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect/index';
import {connect} from 'dva';
class Details extends PureComponent {
  state = {
    info: {},
    query: {
      checkBillNo: this.props.match.params.id
    },
    noPassLoading: false,
    passLoading: false
  }
  componentDidMount() {
    this.getDetail();
  }
  getDetail = () => {
    this.props.dispatch({
      type: 'checkDecrease/getCheckbill',
      payload: {
        checkBillNo: this.props.match.params.id,
        sheveType: 1
      },
      callback: (data) => {
        if(data.msg === 'success') {
          this.setState({
            info: data.data
          });
        }else {
          message.error(data.msg);
          message.error('获取详情头部失败！');
        }
      }
    });
  }
  //搜索
  onSearch = (value) => {
    let {query} = this.state;
    this.setState({
      query: {
        ...query,
        hisDrugCodeList: value ? [value] : []
      }
    });
  }
  //通过 不通过
  auditPass = (type) => {
    const {passLoading, noPassLoading} = this.state;
    if(noPassLoading || passLoading) return;
    if(type === '0') {
      this.setState({
        noPassLoading: true
      });
    };
    if(type === '1') {
      this.setState({
        passLoading: true
      });
    };
    this.props.dispatch({
      type: 'checkDecrease/auditPassOrNo',
      payload: {
        checkBillNo: this.props.match.params.id,
        sheveType: 1,
        type
      },
      callback: (data) => {
        if(data.msg === 'success') {
          message.success('操作成功');
          this.props.history.push('/purchase/checkDecrease/inventoryAudit');
        }else {
          message.warning('操作失败');
          message.error(data.msg);
          this.setState({
            passLoading: false,
            noPassLoading: false
          });
        };
      }
    });
  }
  //打印
  print = () => {
    const {checkBillNo} = this.state.query;
    window.open(`${checkDecrease.CHECK_BILL_SHEVE_PRINT}?checkBillNo=${checkBillNo}`, '_blank');
  }
  render() {
    let {info, query, passLoading, noPassLoading} = this.state;
    let columns = [
      {
        title: '货位',
        dataIndex: 'locName',
        width: 112
      },
      {
        title: '货位类型',
        dataIndex: 'positionTypeName',
        width: 168
      },
      {
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
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
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 112,
      },
      {
        title: '账面库存',
        dataIndex: 'accountStoreNum',
        width: 112,
      },
      {
        title: '实际数量',
        dataIndex: 'practicalRepertory',
        width: 112,
      },
      {
        title: '盈亏数量',
        dataIndex: 'checkNum', 
        width: 112,
      },
      {
        title: '账面批号',
        width: 168,
        dataIndex: 'accountBatchNo',
      },
      {
        title: '实际批号',
        dataIndex: 'practicalBatch',
        width: 168,
      },
      {
        title: '生产日期',
        dataIndex: 'accountProductTime',
        width: 168,
      },
      {
        title: '实际生产日期',
        dataIndex: 'realProductTime',
        width: 168,
      },
      {
        title: '有效期至',
        dataIndex: 'accountEndTime',
        width: 168,
      },
      {
        title: '实际有效期至',
        dataIndex: 'validEndTime',
        width: 168,
      },
      {
        title: '单价',
        dataIndex: 'referencePrice',
        width: 112,
      },
      {
        title: '盈亏金额',
        dataIndex: 'mount',
        width: 112,
        render: (text, record) => {
          return (Number(record.referencePrice) * Number(record.checkNum)).toFixed(4);
        }
      }
    ];
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <Row>
            <Col span={12}>
              <h2>盘点单: <span>{info.checkBillNo || ''}</span></h2>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              {
                info.checkStatus === 3 ? 
                  [
                    <Button key="1" loading={passLoading} type='primary' style={{marginRight: 8}} onClick={this.auditPass.bind(this, '1')}>审核通过</Button>,
                    <Button key="2" loading={noPassLoading} onClick={this.auditPass.bind(this, '0')}>不通过</Button>
                  ]
                : null
              }
              {
                info.checkStatus === 4 ? 
                    <Button icon="printer" onClick={this.print}>打印</Button>
                : null
              }
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkStatusName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkBillTypeName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkBillDeptName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>制单人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>制单时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>起始时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkStartTime || ''}</div>
              </div>
            </Col>
          </Row>
          <Row> 
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>采购方式</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.purchaseTypeName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>盘点时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkTime || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>提交时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkEndTime || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>备注</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.remarks || ''}</div>
              </div>
            </Col>
          </Row>
            <div style={{borderBottom: '1px dashed #d9d9d9', marginBottom: 10}}></div>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-md-24 ant-col-lg-8 ant-col-xl-6">
                <label>名称</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-md-24 ant-col-lg-16 ant-col-xl-18" style={{ marginLeft: -30 }}>
                <div className='ant-form-item-control'>
                  <FetchSelect
                    style={{width: '100%'}}
                    allowClear
                    placeholder='通用名/商品名'
                    url={common.QUERY_DRUG_BY_LIST}
                    cb={this.onSearch}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <Row>
            <Col span={12}>
              <span style={{margin: 0, fontSize: 16, lineHeight: '32px'}}>产品信息</span>
            </Col>
          </Row>
          <hr className="hr"/>
          <RetomeTable
            query={query}
            url={checkDecrease.GET_LIST_BY_BILLNO}
            scroll={{x: '100%'}}
            isJson
            columns={columns}
            pagination={{size: 'small'}}
            rowKey={'id'}
          />
        </div>
      </div>
    )
  }
}
export default connect()(Details);