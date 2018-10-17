/*
 * @Author: yuwei  出库管理详情 /newLibrary/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Tabs, Button, Tooltip, message, Icon, Input } from 'antd';
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
    width: 112,
    dataIndex: 'replanUnit'
  },
  {
    title: '通用名',
    width: 168,
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
    width: 168,
    dataIndex: 'approvalNo',
  },
  {
    title: '生产厂家',
    width: 224,
    dataIndex: 'ctmmManufacturerName',
    className: 'ellipsis',
    render:(text)=>(
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
    width: 224,
    dataIndex: 'realValidEndDate'
  },
  {
    title: '供应商',
    width: 224,
    dataIndex: 'supplierName',
  }
];

const Search = Input.Search;
const {TabPane} = Tabs;
class AddNewAcceptance extends PureComponent{
  constructor(props){
    super(props)
    this.state={
      detailInfo: {},
      btnShow: false,
      loading: false,
      info: {},
      selected: []
    }
  }

  rowChange = (selectedRowKeys, selectedRows) => {
    this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
  }

  saveCheck = () => {
    let {selected, info} = this.state;
    let {distributeCode} = info;
    if(selected.length === 0) {
      message.error('至少选择一条数据');
      return;
    };
    let detailList = selected.map(item=>{
      return {
        id: item
      }
    });
    this.props.dispatch({
      type: 'base/saveCheck',
      payload: {
        detailList,
        distributeCode
      },
      callback: (data) => {
        message.success('确认验收成功');
        this.props.history.go(1);
      }
    })
  }

  search = (value) => {
    this.setState({loading: true});
    this.props.dispatch({
      type: 'base/deliverRequest',
      payload: {
        distributeCode: value
      },
      callback: (data) => {
        this.setState({
          loading: false,
          info: data
        })
      }
    })
  }
 
  tabsChange = (key) =>{
    let {info} = this.state;
    let {listUnCheck} = info;
    
    if(key === '2') {
      this.setState({btnShow: false});
    };
    if(key === '1' && listUnCheck !== undefined && listUnCheck.length !== 0) {
      this.setState({btnShow: true});
    };
  }

  render(){
    let {btnShow, loading, info} = this.state;
    let {verifyList, unVerfiyList} = info;
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
                style={{cursor: 'pointer', transform: 'scale(2)'}} 
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
        </div>
        <div className='detailCard' style={{margin: '30px -6px'}}>
          <Tabs onChange={this.tabsChange} tabBarExtraContent={ btnShow && unVerfiyList && unVerfiyList.length > 0 ? <Button type='primary' onClick={this.saveCheck}>确认验收</Button> : null}>
            <TabPane tab="待验收" key="1">
              <Table
                bordered
                loading={loading}
                scroll={{x: 2456}}
                columns={columns}
                dataSource={unVerfiyList || []}
                pagination={false}
                rowKey={'id'}
                rowSelection={{
                  selectedRowKeys: this.state.selected,
                  onChange: this.rowChange
                }}
              />
            </TabPane>
            <TabPane tab="已验收" key="2">
              <Table
                loading={loading}
                bordered
                scroll={{x: 2456}}
                columns={columns}
                dataSource={verifyList || []}
                rowKey={'id'}
                pagination={false}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(AddNewAcceptance);