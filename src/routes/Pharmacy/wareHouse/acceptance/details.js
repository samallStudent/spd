/*
 * @Author: yuwei  出库管理详情 /newLibrary/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Tabs, Tooltip, Button, message } from 'antd';
import querystring from 'querystring';
import {wareHouse} from '../../../../api/pharmacy/wareHouse';
import {connect} from 'dva';
const columns = [
  {
    title: '通用名',
    width: 168,
    fixed: 'left',
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
    title: '生产批号',
    width: 168,
    dataIndex: 'productBatchNo',
  },
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
const {TabPane} = Tabs;
class DetailsNewLibrary extends PureComponent{
  constructor(props){
    super(props)
    let info = querystring.parse(this.props.match.params.id);
    this.state={
      checkLoading: false,
      detailInfo: {},
      defaultActiveKey: null,
      btnShow: false,
      loading: false,
      id: info.id,
      info: {},
      selected: []
    }
  }

  componentDidMount() {
    this.queryDetail()
  }

  queryDetail() {
    this.setState({loading: true});
    this.props.dispatch({
      type: 'base/deliverRequest',
      payload: {
        distributeCode: this.state.id
      },
      callback: (data) => {
        this.setState({
          loading: false,
          info: data,
          defaultActiveKey: data.auditStatus === 1 ? '1' : '2',
          btnShow: data.auditStatus === 1 ? true : false,
        })
      }
    })
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
    this.setState({
      checkLoading: true
    });
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
        this.setState({
          checkLoading: false
        });
        this.queryDetail();
      }
    })
  }

  tabsChange = (key) =>{
    this.setState({
      btnShow: key === '1', 
      defaultActiveKey: key
    });
  }

  //打印
  print = () => {
    const { auditStatus, distributeCode } = this.state.info;
    window.open(`${wareHouse.PRINT_ROOM_DETAIL}?distributeCode=${distributeCode}&status=${auditStatus}`);
  }

  render(){
    let {defaultActiveKey, btnShow, loading, info, checkLoading } = this.state;
    let {verifyList, unVerfiyList} = info;
    return (
      <div className='fullCol'>
          <div className='fullCol-fullChild'>
            <Row>
              <Col span={12}>
                <h3>单据信息</h3>
              </Col>
              <Col span={12} style={{textAlign: 'right'}}>
                <Button onClick={this.print}>打印</Button>
              </Col>
            </Row>
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
        <div className='detailCard'>
          <Tabs activeKey={defaultActiveKey} onChange={this.tabsChange} tabBarExtraContent={ btnShow && unVerfiyList && unVerfiyList.length > 0? <Button loading={checkLoading} type='primary' onClick={this.saveCheck}>确认验收</Button> : null}>
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
                scroll={{x: 2408}}
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
export default connect(state=>state)(DetailsNewLibrary);