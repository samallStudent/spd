/*
 * @Author: yuwei  出库管理详情 /newLibrary/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Row, Col, Tabs, Button, Spin, Tooltip, message, Icon, Input } from 'antd';
import { wareHouse } from '../../../../api/pharmacy/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import {connect} from 'dva';
const columns = [
  {
    title: '实到数量',
    width: 112,
    dataIndex: 'realReceiveQuantiry'
  },
  {
    title: '需求数量',
    width: 112,
    dataIndex: 'realDeliveryQuantiry'
  },
  {
    title: '单位',
    width: 60,
    dataIndex: '单位'
  },
  {
    title: '通用名',
    width: 224,
    dataIndex: 'ctmmGenericName'
  },
  {
    title: '商品名',
    width: 224,
    dataIndex: 'ctmmTradeName',
  },
  {
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
    className:'ellipsis',
    render: (text)=>(
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
    dataIndex: 'packageSpecification',
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
    render: (text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '生产批号',
    width: 168,
    dataIndex: 'productBatchNo',
  },
  {
    title: '生产日期',
    width: 168,
    dataIndex: 'realProductTime',
  },
  {
    title: '有效期至',
    width: 168,
    dataIndex: 'realValidEndDate'
  },
  {
    title: '供应商',
    width: 224,
    dataIndex: 'supplierName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  }
];

const Search = Input.Search;
const {TabPane} = Tabs;
class AddNewAcceptance extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      checkLoading: false,
      activeKey: '1',
      loading: false,
      info: {},
      selected: [],
      acceptanceCode: '',
      unacceptedQuery: {    //未验收请求体
        distributeCode: null,
        status: 1
      },    
      acceptedQuery: {     //验收请求体
        distributeCode: null,
        status: 2
      }
    }
  }

  queryDetail() {
    this.setState({loading: true});
    this.props.dispatch({
      type: 'base/checkDetailHead',
      payload: {
        distributeCode: this.state.acceptanceCode,
      },
      callback: ({data, msg, code}) => {
        this.setState({ loading: false });
        if(code !== 200) return message.error(msg);
        this.setState({
          info: data,
          activeKey: data.auditStatus + ''
        })
      }
    })
  }

  rowChange = (selectedRowKeys, selectedRows) => {
    this.setState({selected: selectedRowKeys});
  }

  //确认验收
  saveCheck = () => {
    let {selected, info} = this.state;
    if(selected.length === 0) {
      message.error('至少选择一条数据');
      return;
    };
    this.setState({
      checkLoading: true
    });
    let detailList = selected.map(item => ({id: item}));
    this.props.dispatch({
      type: 'base/commonConfirmCheck',
      payload: {
        detailList,
        distributeCode: info.distributeCode,
        checkType: 4
      },
      callback: ({data, code, msg}) => {
        this.setState({
          checkLoading: false
        });
        if(code !== 200) return message.error(msg);
        message.success('确认验收成功');
        this.queryDetail();
        this.unacceptedTable.fetch();
        this.acceptedTable && this.acceptedTable.fetch();
        this.setState({
          selected: []
        });
      }
    })
  }

  search = (value) => {
    this.setState({
      loading: true,
      acceptanceCode: value,
      unacceptedQuery: {    //未验收请求体
        distributeCode: value,
        status: 1
      },    
      acceptedQuery: {     //验收请求体
        distributeCode: value,
        status: 2
      }
    }, () => {
      this.queryDetail();
    });
  }
 
  tabsChange = (activeKey) =>{
    this.setState({ activeKey });
  }

  tableOnChange = () => {
    this.setState({
      selected: []
    });
  }

  render(){
    let { 
      loading, 
      info, 
      checkLoading, 
      activeKey,
      unacceptedQuery,
      acceptedQuery,
      acceptanceCode
    } = this.state;
    return (
      <div className='fullCol' style={{padding: '0 24px 24px', background: 'rgb(240, 242, 245)'}}>
        <div className='fullCol-fullChild' style={{margin: '0 -24px'}}>
          <Row style={{margin: '0 -32px', borderBottom: '1px solid rgba(0, 0, 0, .2)'}}>
            <Col span={8}>
              <h3 style={{padding: '0 0 15px 32px', fontSize: '20px'}}>
                新建验收
              </h3>
            </Col>
            <Col span={16} style={{textAlign: 'right', paddingRight: 32}}>
              <Icon 
                onClick={()=>{
                  this.props.history.go(-1);
                }} 
                style={{cursor: 'pointer', fontSize: '32px'}} 
                type="close" 
                theme="outlined" 
              />
            </Col>
          </Row>
          <Row style={{marginTop: 10}}>
            <Col span={6}>
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                <label>
                  <Icon type="barcode" theme="outlined" />
                </label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>
                  <Search onSearch={this.search} placeholder="使用条码枪扫描"/>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                <label>
                  备注
                </label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>
                  <Input placeholder="请输入"/>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard' style={{margin: '-10px -6px'}}>
          <Spin spinning={loading}>
            <h3>单据信息</h3>
            <Row>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>出库单</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.distributeCode || ''}</div>
                </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>申领单</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{info.applyCode || ''}</div>
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
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>配货部门</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{info.deptName || ''}</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>发起人</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{info.createName || ''}</div>
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
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>验收时间</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{info.receptionTime || ''}</div>
                  </div>
              </Col>
            </Row>
          </Spin>
        </div>
        <div className='detailCard' style={{margin: '30px -6px -4px', minHeight: 'calc(100vh - 363px)'}}>
          <Tabs 
            activeKey={activeKey} 
            onChange={this.tabsChange} 
            tabBarExtraContent={ 
              activeKey === '1' && info.auditStatus === 1 ? 
              <Button loading={checkLoading} type='primary' onClick={this.saveCheck}>确认验收</Button> : 
              null
            }
          >
            <TabPane tab="待验收" key="1">
              {/* <Table
                bordered
                loading={loading}
                scroll={{x: '100%'}}
                columns={columns}
                dataSource={unVerfiyList || []}
                pagination={false}
                rowKey={'id'}
                rowSelection={{
                  selectedRowKeys: this.state.selected,
                  onChange: this.rowChange
                }}
              /> */}
              <RemoteTable 
                ref={(node) => this.unacceptedTable = node}
                hasInitRequest={false}
                query={unacceptedQuery}
                columns={columns}
                scroll={{ x: '100%' }}
                url={wareHouse.CHECK_EXAM_DETAIL}
                rowSelection={{
                  selectedRowKeys: this.state.selected,
                  onChange: this.rowChange
                }}
                rowKey='id'
                pagination={{
                  onChange: this.tableOnChange
                }}
              />
            </TabPane>
            <TabPane tab="已验收" key="3">
              {/* <Table
                loading={loading}
                bordered
                scroll={{x: '100%'}}
                rowKey={'id'}
                columns={columns}
                dataSource={verifyList || []}
                pagination={false}
              /> */}
              <RemoteTable
                ref={(node) => this.acceptedTable = node}
                hasInitRequest={acceptanceCode !== ''}
                query={acceptedQuery}
                columns={columns}
                scroll={{ x: '100%' }}
                url={wareHouse.CHECK_EXAM_DETAIL}
                rowKey='id'
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(AddNewAcceptance);