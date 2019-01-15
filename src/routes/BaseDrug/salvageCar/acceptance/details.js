/*
 * @Author: yuwei  出库管理详情 /newLibrary/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Row, Col, Tabs, Tooltip, Button, message, Spin } from 'antd';
import { wareHouse } from '../../../../api/pharmacy/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import {_local} from '../../../../api/local';
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
    width: 80,
    dataIndex: 'replanUnit'
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
const {TabPane} = Tabs;
class DetailsNewLibrary extends PureComponent{
  constructor(props){
    super(props);
    const { id } = this.props.match.params;
    this.state={
      checkLoading: false,
      detailInfo: {},
      activeKey: '1',
      btnShow: false,
      loading: false,
      id,
      info: {},
      selected: [],
      unacceptedQuery: {    //未验收请求体
        distributeCode: id,
        status: 1
      },    
      acceptedQuery: {     //验收请求体
        distributeCode: id,
        status: 2
      }
    };
  }

  componentDidMount() {
    this.queryDetail()
  }

  queryDetail() {
    this.setState({loading: true});
    this.props.dispatch({
      type: 'base/checkDetailHead',
      payload: {
        distributeCode: this.state.id,
      },
      callback: ({data, code, msg}) => {
        this.setState({ loading: false });
        if(code !== 200) return message.error(msg);
        this.setState({
          info: data,
          activeKey: data.auditStatus === 1 ? '1' : '3',
        })
      }
    })
  }

  rowChange = (selectedRowKeys) => {
    this.setState({selected: selectedRowKeys})
  }
  //确认验收
  saveCheck = () => {
    let {selected, id} = this.state;
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
        distributeCode: id,
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

  tabsChange = (activeKey) =>{
    this.setState({ activeKey });
  }

  //打印
  print = () => {
    const { distributeCode } = this.state.info;
    let {activeKey} = this.state;
    activeKey = activeKey === "1" ? "1" : "2";
    window.open(`${_local}/a/deliver/print/rescuecarprint?distributeCode=${distributeCode}&status=${activeKey}`, '_blank');
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
      acceptedQuery
    } = this.state;
    return (
      <div className='fullCol'>
        <div  className='fullCol-fullChild'>
          <Spin spinning={loading}>
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
                    <div className='ant-form-item-control'>{info.originDeptName || ''}</div>
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
        <div className='detailCard'>
          <Tabs 
            activeKey={activeKey} 
            onChange={this.tabsChange} 
            tabBarExtraContent={ 
              activeKey === '1' && info.auditStatus === 1 ? 
              <Button loading={checkLoading} type='primary' onClick={this.saveCheck}>确认验收</Button> : 
              null
            }>
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
export default connect(state=>state)(DetailsNewLibrary);