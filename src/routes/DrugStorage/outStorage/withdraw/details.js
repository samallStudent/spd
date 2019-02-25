/*
 * @Author: yuwei  出库管理详情 /output/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table, Row, Col, Button, Tooltip, message} from 'antd';
import {connect} from 'dva';
import querystring from 'querystring';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect/index';
import { replenishmentPlan } from '../../../../api/replenishment/replenishmentPlan';
const columns = [
 /* {
    title: '通用名',
    width: 224,
    dataIndex: 'ctmmGenericName',
    className: 'ellipsis',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },*/
  {
    title: '药品名称',
    width: 350,
    dataIndex: 'ctmmTradeName',
    className: 'ellipsis',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  /*{
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },*/
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc',
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification'
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'replanUnit'
  },
  {
    title: '出库数量',
    width: 112,
    dataIndex: 'backNum'
  },
  {
    title: '生产批号',
    width: 168,
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
    dataIndex: 'validEndDate'
    
  },
  {
    title: '批准文号',
    width: 200,
    dataIndex: 'approvalNo',
  },
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
    title: '供应商',
    width: 200,
    dataIndex: 'supplierName',
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  }
];

class DetailsOutput extends PureComponent{

  constructor(props){
    super(props)
    let info = this.props.match.params.id;
    info = querystring.parse(info);
    this.state={
      info: {},
      loading: false,
      id: info.id,
      status: null,
      successLoading: false,
      failLoading: false,
      query: {
        medDrugType: '1',
        purchaseType: 1,
        planCode:"PA190220000003",
        deptCode:"24C69445D19C4625960DA3F1E58A6A1F"
      },
      deptModules: [],// 补货部门
      visible: false,
    }
  }
  componentDidMount() {
    this.getDatail();
    if(this.props.match.path === "/purchase/replenishment/replenishmentPlan/edit/:planCode") {
      let { planCode } = this.props.match.params;
      this.setState({loading: true})
      this.props.dispatch({
        type:'base/ReplenishDetails',
        payload: { planCode },
        callback:({data, code, msg})=>{
          if(code === 200) {
            let deptCode;
            let {deptModules, query} = this.state;
            deptModules.map(item=>{
              if(data.deptCode === item.id) {
                deptCode = item.id
              };
              return item;
            });
            console.log(2)
            let existDrugCodeList = data.list.map(item => item.drugCode);
            this.setState({ 
              info: data, 
              isEdit: true, 
              dataSource: data.list,
              loading: false,
              query: {
                ...query,
                deptCode,
                existDrugCodeList
              },
              spinLoading: false
            });
          }else {
            message.error(msg);
          };
        }
      });
    }else {
      this.setState({spinLoading: false})
    }
  }
  showModalLogic = (addDrugType) => {
    let {query, dataSource} = this.state;
    if(!query.deptCode) {
      message.warning('请选择部门');
      return;
    };
    let existDrugCodeList = dataSource.map((item) => item.drugCode);
    this.setState({ 
      visible: true,
      addDrugType: 1,
      modalSelected: [],
      modalSelectedRows: [],
      query: {
        ...query,
        id:1,
        existDrugCodeList,
        hisDrugCodeList: [],
        filterThreeMonthFlag: false
      },
      value: undefined
    });
  }
  //不通过
  onBan = () =>{
    this.setState({
      failLoading: true
    });
    this.props.dispatch({
      type: 'outStorage/rejectOutStore',
      payload: {
        backNo: this.state.id
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          message.success('操作成功');
          this.getDatail();
        }else {
          message.error(msg);
        };
        this.setState({
          failLoading: false
        });
      }
    })
  }
  getDatail = () => {
    this.setState({loading: true});
    this.props.dispatch({
      type: 'outStorage/outStoreDetailInfo',
      payload: {
        backNo: this.state.id
      },
      callback: (data) => {
        this.setState({
          info: data, 
          loading: false,
          status: data.status
        });
      }
    })
  }
  //确认
  onSubmit = () =>{
    this.setState({
      successLoading: true
    });
    let {info} = this.state
    let {backNo, deptCode, detailVo} = info;
    let outStoreDetail = detailVo.map(item => {
      return {
        backSumNum: item.backNum,
        batchNo: item.batchNo,
        drugCode: item.drugCode
      }
    });
    this.props.dispatch({
      type: 'outStorage/checkOutStore',
      payload: {
        backNo,
        deptCode,
        outStoreDetail
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          message.success('操作成功');
          this.getDatail();
        }else {
          message.error(msg);
        };
        this.setState({
          successLoading: false
        });
      }
    })
  }

  render(){
    let {info, loading, status, successLoading, failLoading,query,modalLoading} = this.state;
    let {detailVo} = info;
    return (
      <div className='fullCol fadeIn'>
        <div className="fullCol-fullChild">
          <Row>
            <Col span={6}>
              <h2>
                单据信息
              </h2>
            </Col>
            {
              status === 1? (
                <Col style={{textAlign:'right', float: 'right'}} span={6}>
                  <Button 
                    type='primary' 
                    className='button-gap' 
                    style={{marginRight: 8}} 
                    onClick={this.onSubmit}
                    loading={successLoading}
                  >
                    复核通过
                  </Button>
                  <Button loading={failLoading} onClick={this.onBan} >不通过</Button>
                </Col>
              ) : null
            }
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>出库单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.backNo || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.statusName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>申领药房</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.deptName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>发起人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>发起时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>联系电话</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.phone || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>药房地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.deptAddress || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>复核人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>复核时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkDate || ''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <Row style={{display: 'flex', alignItems: 'center'}}>
              <Col span={12} style={{ marginLeft: 4 }}>
                <FetchSelect
                  allowClear
                  value={this.state.value}
                  style={{ width: '100%' }}
                  placeholder='药品名称'
                  //url={replenishmentPlan.QUERY_DRUG_BY_LISTXG+'?'+'depotplanID='+this.props.match.params.planCode+'&'+'drugCommonName='+this.state.value}
                  url={replenishmentPlan.QUERY_DRUG_BY_LIST}
                  cb={(value, option) => {
                    let {query} = this.state;
                    query = {
                      ...query,
                      hisDrugCodeList: value ? [value] : [],
                    };
                    this.setState({
                      query,
                      value
                    });
                  }}
                />
              </Col>
            </Row>
            <div className='detailCard'>
              <RemoteTable
                title={()=>'查询产品信息'}
                scroll={{x: '100%'}}
                query={query}
                url={replenishmentPlan.QUERYDRUGBYDEPT}
                isJson={true}
                ref="table"
                modalLoading={modalLoading}
                columns={columns}
                scroll={{ x: '100%' }}
                rowKey='drugCode'
                pagination={false}
              />
            </div>
        <div className="detailCard" style={{display:'none'}}>
          <Table
            bordered
            loading={loading}
            dataSource={detailVo || []}
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'batchNo'}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(DetailsOutput);