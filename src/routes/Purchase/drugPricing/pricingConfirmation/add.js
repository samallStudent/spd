/*
 * @Author: wwb 
 * @Date: 2018-07-24 18:49:01 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-09-01 13:09:02
 */
/**
 * @file 全院管理 - 药品调价--调价确认--新建调价
 */
import React, { PureComponent } from 'react';
import { Row, Col, Button, Modal, Icon, Tooltip, message, Table  } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import {drugPricing, common} from '../../../../api/purchase/purchase';
import FetchSelect from '../../../../components/FetchSelect/index';
import _ from 'lodash';
import { connect } from 'dva';
class NewAdd extends PureComponent{
  state = {
    query: {},
    dataSource: [],// 添加的产品
    visible: false,
    selected: [],
    selectedRows: [],
    modalSelected: [],
    modalSelectedRows: [],
    value: undefined,
    loading: false,
  }
  handleOk = () => {
    let { modalSelectedRows, dataSource } = this.state;
    if(modalSelectedRows.length === 0) {
      return message.warning('至少选择一条信息');
    };
    dataSource = [...dataSource, ...modalSelectedRows];
    this.setState({
      dataSource,
      visible: false,
      modalSelectedRows: [],
      modalSelected: []
    });
  }
  addProduct = () =>{
    let { dataSource } = this.state;
    let existIds = [];
    dataSource.map(item => existIds.push(item.id));
    this.setState({ 
      visible: true,
      query: { 
        hisDrugCodeList: [], 
        existIds 
      },
      value: undefined,
    });
  }
  delete = () => {  //删除
    let {selectedRows, dataSource, query} = this.state;
    dataSource = _.difference(dataSource, selectedRows);
    let existIds = dataSource.map((item) => item.id)
    this.setState({
      dataSource,
      selected: [],
      selectedRows: [],
      query: {
        ...query,
        existIds
      }
    });
  }
  //保存
  submitPricing = () => {  
    const {dataSource} = this.state;
    let detailList;
    detailList = dataSource.map(item => ({
      ctmmGenericName: item.ctmmGenericName,
      ctmmValuationUnit: item.ctmmValuationUnit,
      fromDate: item.fromDate,
      hisDrugCode: item.hisDrugCode,
      price: item.newPrice,
      supplierCode: item.supplierCode,
      supplierGoodFlowId: item.id,
      toDate: item.toDate,
      unitCode: item.unitCode
    }));
    this.setState({
      loading : true
    })
    this.props.dispatch({
      type: 'base/checkpriceDetaiConfrim',
      payload: {
        detailList
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          message.success('操作成功');
          this.props.history.push('/purchase/drugPricing/pricingConfirmation');
        }
        this.setState({
          loading : false
        })
      }
    })
  }
  render(){
    const { visible, query, dataSource, value } = this.state;
    const columns = [
    /*  {
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },*/{
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width:350,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },{
        title: '供应商',
        dataIndex: 'supplierName',
        width: 200,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '单位',
        dataIndex: 'ctmmValuationUnit',
        width: 112,
      }, {
        title: '调整后价格',
        dataIndex: 'newPrice',
        width: 148,
      }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 148,
      }
    ];
    return (
      <div className='fullCol' style={{ padding: 24, background: '#f0f2f5'  }}>
        <div className="fullCol-fullChild" style={{margin: '-9px -24px 0'}}>
          <Row style={{borderBottom: '1px solid rgba(0, 0, 0, .1)', marginBottom: 10}}>
            <Col span={8}>
              <h2>新建调价</h2>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => this.props.history.go(-1)}><Icon type="close" style={{ fontSize: 26, marginTop: 8 }} /></span>
            </Col>
          </Row>
          <Row>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Button type='primary' style={{marginRight: 8}} icon='plus' onClick={this.addProduct}>添加产品</Button>
            <Button type='default' onClick={this.delete}>删除</Button>
          </Row>
        </div>
        <Modal
          title={'添加产品'}
          visible={visible}
          width={1100}
          style={{ top: 20 }}
          onCancel={()=>this.setState({ visible: false })}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>确认</Button>,
            <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>
          ]}
        >
          <Row>
            <Col span={7} style={{marginLeft: 4}}>
              <FetchSelect
                allowClear
                value={value}
                style={{ width: 496 }}
                placeholder='药品名称'
                url={common.QUERY_DRUG_BY_LIST}
                cb={(value, option) => {
                  let {query} = this.state;
                  query = {
                    ...query,
                    hisDrugCodeList: value ? [value] : []
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
              ref='table'
              bordered
              query={query}
              isJson={true}
              columns={columns}
              url={drugPricing.SELECT_DRUG_CODE}
              scroll={{ x: '100%' }}
              rowKey='id'
              rowSelection={{
                selectedRowKeys: this.state.modalSelected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({modalSelected: selectedRowKeys, modalSelectedRows: selectedRows})
                }
              }}
            />
          </div>
        </Modal>
        <div className='detailCard' style={{margin: '-12px -8px 0px -8px', minHeight: 'calc(100vh - 168px)'}}>
          <Table 
            title={()=>'产品信息'}
            columns={columns}
            bordered
            rowKey='id'
            dataSource={dataSource}
            scroll={{ x: '100%' }}
            pagination={false}
            rowSelection={{
              selectedRowKeys: this.state.selected,
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
              }
            }}
          />
          {
            dataSource.length > 0 ? 
            <Row>
              <Col style={{ textAlign:'right', padding: '20px' }}>
                <Button type='primary' onClick={this.submitPricing} loading={this.state.loading}>提交调价</Button>
              </Col>
            </Row>
            : null
          }
        </div>
      </div>
    )
  }
}
export default connect(state => state)(NewAdd);