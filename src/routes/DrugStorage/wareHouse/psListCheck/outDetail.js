/*
 * @Author: gaofengjiao 
 * @Date: 2018-08-06
 * @Last Modified by: wwb
 * @Last Modified time: 2018-10-26 17:22:36
 */
/* 
  @file  药库 - 入库--出库单验收-详情
*/
import React, { PureComponent } from 'react';
import {Row, Col, Tooltip,  Button, Tabs, message} from 'antd';
import {connect} from 'dva';
import wareHouse from '../../../../api/drugStorage/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import querystring from 'querystring';
const TabPane = Tabs.TabPane;

class PslistCheck extends PureComponent{
  constructor(props) {
    super(props);
    let info = querystring.parse(this.props.match.params.id);
    this.state = {
      selected: [],
      selectedRows: [],
      loading: true,
      defaultActiveKey: '1',
      id: info.id,
      detailInfo: {},
      checkLoading: false,
      unacceptedQuery: {
        distributeCode: info.id,
        status: 1
      },
      acceptedQuery: {
        distributeCode: info.id,
        status: 2
      },
    }
  }
  componentDidMount = () => {
    this.queryDetail();
  }
  //tabs切换
  tabsChange = (key) =>{
    this.setState({
      defaultActiveKey: key
    });
  }
  //选中rows
  changeSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ 
      selectedRows: selectedRows,
      selected: selectedRowKeys
    });
  }
  //验收
  saveCheck = () => {
    let {selectedRows, detailInfo} = this.state;
    if(selectedRows.length === 0) {
      message.error('至少选择一条数据');
      return;
    };
    this.setState({checkLoading: true});
    let detailList = selectedRows.map(item=>{
      let i = {
        realReceiveQuantiry: item.realReceiveQuantiry,
        productBatchNo: item.productBatchNo,
        realValidEndDate: item.realValidEndDate,
        realProductTime: item.realProductTime,
        drugCode: item.drugCode,
        id: item.id,
        parentId: item.parentId
      };
      if(detailInfo.isShowTemprature === 1) {
        i.realAcceptanceTemperature = item.realAcceptanceTemperature;
      }
      return i;
    });
    this.props.dispatch({
      type: 'base/commonConfirmCheck',
      payload: {
        detailList,
        distributeCode: this.state.id,
        checkType: 1
      },
      callback: ({data, code, msg}) => {
        this.setState({checkLoading: false});
        if(code !== 200) return message.error(msg);
        message.success('确认验收成功');
        this.queryDetail();
        this.unacceptedTable.fetch();
        this.acceptedTable && this.acceptedTable.fetch();
        this.tableOnChange();
      }
    })
  }
  //获取详情
  queryDetail = () => {
    this.setState({loading: true});
    this.props.dispatch({ 
      type: 'base/deliverRequest',
      payload: {
        distributeCode: this.state.id,
      },
      callback: (data) => {
        this.setState({
          detailInfo: data,
          defaultActiveKey: data.auditStatus === 1? '1' : '2',
        });
      }
    })
  }
  //打印
  print = () => {
    const {distributeCode} = this.state.detailInfo;
    const {defaultActiveKey} = this.state;
    window.open(`${wareHouse.PRINT_DETAIL}?distributeCode=${distributeCode}&status=${defaultActiveKey}`, '_blank');
  }
    //导出
    outFile = () => {
      this.props.dispatch({
        type: 'base/outFile',
        payload: {
          distributeCode:this.state.detailInfo.distributeCode,
          status:this.state.defaultActiveKey
        },
      })
    }
  //未验收Table回调
  unVerfiyTableCallBack = (data) => {
    if(data.length) {
      data = data.map(item => {
        item.realReceiveQuantiry = item.realDeliveryQuantiry;
        return item;
      });
      this.setState({
        unVerfiyList: data,
      });
    };
    this.setState({
      loading: false
    });
  }
  render(){
    let {
      loading, 
      defaultActiveKey, 
      detailInfo, 
      checkLoading,
      unacceptedQuery,
      acceptedQuery,
      unVerfiyList
    } = this.state;
    
    let columns = [
      {
        title: '发起数量',
        dataIndex: 'realDeliveryQuantiry',
        width: 120,
      },
      {
        title: '实到数量',
        dataIndex: 'realReceiveQuantiry',
        width: 120,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 112
      },
      /*{
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },*/
      {
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width: 350,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      /*{
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      },*/
      {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90
      },
      {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168
      },
      {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 168
      },
      {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ),
        width: 200
      },
      {
        title: '生产批号',
        dataIndex: 'productBatchNo',
        width: 168
      },
      {
        title: '生产日期',
        dataIndex: 'realProductTime',
        width: 118
      },
      {
        title: '有效期至',
        dataIndex: 'realValidEndDate',
        width: 118
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }
      ];
    if(detailInfo.isShowTemprature === 1) {
      columns.splice(10, 0, {
        title: '验收温度',
        dataIndex: 'realAcceptanceTemperature',
        width: 112,
      });
    };
    
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <Row>
            <Col span={12}>
              <h3>单据信息</h3>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <Button onClick={this.print}>打印</Button>
              <Button onClick={this.outFile} style={{marginLeft:'12px'}}>导出excel</Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                <label>配送单/验收单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{detailInfo.distributeCode || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{detailInfo.statusName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                <label>来源部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{detailInfo.originDeptName || ''}</div>
              </div>
            </Col>
            </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                <label>出库人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{detailInfo.createName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                <label>出库时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{detailInfo.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                <label>验收人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{detailInfo.receptionUserName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                <label>验收时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{detailInfo.receptionTime || ''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <Tabs 
            activeKey={defaultActiveKey} 
            onChange={this.tabsChange} 
            tabBarExtraContent={ 
              defaultActiveKey === '1' && detailInfo.auditStatus === 1 ? 
              <Button loading={checkLoading} type='primary' onClick={this.saveCheck}>确认验收</Button> 
              : null
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
                rowKey={'key'}
                rowSelection={{
                  selectedRowKeys: this.state.selected,
                  onChange: this.changeSelectRow
                }}
              /> */}
              <RemoteTable 
                ref={(node) => this.unacceptedTable = node}
                query={unacceptedQuery}
                columns={columns}
                dataSource={unVerfiyList}
                loading={loading}
                scroll={{ x: '100%' }}
                url={wareHouse.CHECK_EXAM_DETAIL}
                rowKey='key'
                pagination={{
                  onChange: this.tableOnChange
                }}
                cb={this.unVerfiyTableCallBack}
                rowSelection={{
                  selectedRowKeys: this.state.selected,
                  onChange: this.changeSelectRow
                }}
              />
            </TabPane>
            <TabPane tab="已验收" key="2">
              {/* <Table
                loading={loading}
                bordered
                scroll={{x: '100%'}}
                columns={columns || []}
                dataSource={verifyList}
                rowKey={'key'}
                pagination={false}
              /> */}
              <RemoteTable
                ref={(node) => this.acceptedTable = node}
                query={acceptedQuery}
                columns={columns}
                scroll={{ x: '100%' }}
                url={wareHouse.CHECK_EXAM_DETAIL}
                rowKey='key'
              />
            </TabPane>
          </Tabs>
         
        </div>
      </div>
    )
  }
}
export default connect(state=>state.wareHouse)(PslistCheck);
