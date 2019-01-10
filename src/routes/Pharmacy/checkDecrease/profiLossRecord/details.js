/**
 * @file 药库 - 盘点损益 - 新建盘点 - 详情(待确认)
 */
import React, { PureComponent } from 'react';
import {Row, Col, message, Tooltip, Button} from 'antd';
import {profiLossRecord, common} from '../../../../api/checkDecrease';
import RetomeTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect/index';
import {connect} from 'dva';
import querystring from 'querystring';
class Details extends PureComponent {
  constructor(props) {
    super(props);
    let info = this.props.match.params.id;
    info = querystring.parse(info);
    this.state = {
      info: {},
      query: {
        checkBillNo: info.checkBillNo
      },
      causticExcessiveNo: info.causticExcessiveNo
    }
  }
  
  componentDidMount() {
    this.getDetail();
  }
  getDetail = () => {
    this.props.dispatch({
      type: 'checkDecrease/getCausticexcessive',
      payload: {
        causticExcessiveNo: this.state.causticExcessiveNo
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
  //打印
  print = () => {
    const {causticExcessiveNo} = this.state;
    window.open(`${profiLossRecord.CAUSTIC_EXCESSIVE_PRINT}?causticExcessiveNo=${causticExcessiveNo}`, '_blank')
  }
  //改变盘点类型列表
  changeCheck = (e) => {
    const {query} = this.state;
    this.setState({
      query: {
        ...query,
        causticType: e.target.value
      }
    });
  }
  render() {//causticExcessivePrint
    let {info, query} = this.state;
    let columns = [
      {
        title: '货位',
        dataIndex: 'locName',
        fixed: 'left',
        width: 148,
      },
      {
        title: '货位类型',
        dataIndex: 'positionTypeName',
        fixed: 'left',
        width: 138,
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
     /* {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 148,
      },*/
      {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 148,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 100,
      },
      {
        title: '账面库存',
        dataIndex: 'accountStoreNum',
        width: 100,
      },
      {
        title: '实际数量',
        dataIndex: 'practicalRepertory',
        width: 100,
      },
      {
        title: '盈亏数量',
        dataIndex: 'checkNum', 
        width: 100,
      },
      {
        title: '账面批号',
        dataIndex: 'accountBatchNo',
        width: 158,
      },
      {
        title: '实际批号',
        dataIndex: 'practicalBatch',
        width: 158,
      },
      {
        title: '生产日期',
        dataIndex: 'accountProductTime',
        width: 118,
      },
      {
        title: '实际生产日期',
        dataIndex: 'realProductTime',
        width: 118,
      },
      {
        title: '有效期至',
        dataIndex: 'accountEndTime',
        width: 118,
      },
      {
        title: '实际有效期至',
        dataIndex: 'validEndTime',
        width: 118,
      },
      {
        title: '单价',
        dataIndex: 'referencePrice',
        width: 100,
      },
      {
        title: '盈亏金额',
        dataIndex: 'mount',
        width: 100,
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
              <h2>损益单: <span>{info.causticExcessiveNo || ''}</span></h2>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button icon="printer" onClick={this.print}>打印</Button>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>盘点单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkBillNo || ''}</div>
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
                <div className='ant-form-item-control'>{info.deptName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>生成人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>生成时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createDate || ''}</div>
              </div>
            </Col>
          </Row>
          <div style={{borderBottom: '1px dashed #d9d9d9', marginBottom: 10}}></div>
          <Row gutter={30}>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-md-24 ant-col-lg-8 ant-col-xl-6">
                <label>名称</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-md-24 ant-col-lg-16 ant-col-xl-18" style={{ marginLeft: -30 }}>
                <div className='ant-form-item-control'>
                  <FetchSelect
                    style={{width: '100%'}}
                    allowClear
                    placeholder='药品名称'
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
            isJson
            query={query}
            url={profiLossRecord.GET_LIST_BY_BILLNO}
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'id'}
          />
        </div>
      </div>
    )
  }
}
export default connect()(Details);