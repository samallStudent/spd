/*
 * @Author: wwb 
 * @Date: 2018-07-24 18:49:01 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-09-01 13:09:02
 */
/**
 * @file 药库 - 补货管理--补货计划--新建计划
 */
import React, { PureComponent } from 'react';
import { Row, Col, Button, Input, Modal, Icon, Select, Tooltip, message, Table, InputNumber, Checkbox } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import { replenishmentPlan } from '../../../../api/replenishment/replenishmentPlan';
import {validAmount} from '../../../../utils/utils';
import FetchSelect from '../../../../components/FetchSelect/index';
import _ from 'lodash';
import { connect } from 'dva';
const { Option } = Select;
class NewAdd extends PureComponent{
  state = {
    isShow: false,
    info: {},
    query: {
      medDrugType: '2',
      purchaseType: 1
    },
    isEdit: false, 
    dataSource: [],// 添加的产品
    deptModules: [],// 采购部门
    visible: false,
    btnLoading: false,
    selected: [],
    loading: false,
    selectedRows: [],
    modalSelected: [],
    modalSelectedRows: [],
    value: undefined,
    saveLoading: false,
    submitLoading: false
  }
  componentWillMount = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'base/getModule',
      payload: { deptType : '3' },
      callback: (data) =>{
        this.setState({ deptModules: data })
      }
    })
  }
  componentDidMount = () => {
    if(this.props.match.path === "/purchase/replenishment/outCatalogPurchase/edit/:planCode") {
      let { planCode } = this.props.match.params;
      this.setState({loading: true});
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
            });
          }else {
            message.error(msg);
          }
        }
      });
    }
  }
  handleOk = () => {
    let { modalSelectedRows, query, dataSource } = this.state;
    if(modalSelectedRows.length === 0) {
      return message.warning('至少选择一条信息');
    }
    this.setState({ btnLoading: true });
    let drugCodeList = [];
    modalSelectedRows.map(item => drugCodeList.push(item.drugCode))
    this.props.dispatch({
      type: 'base/addDrug',
      payload: {
        deptCode: query.deptCode,
        drugCodeList
      },
      callback: (data) => {
        
        this.setState({
          dataSource: [...dataSource, ...data],
          btnLoading: false,
          visible: false,
          modalSelected: [],
          modalSelectedRows: [],
        })
      }
    })
  }
  setRowInput = (val, record, i) => {
    let {usableQuantity} = record;
    let {dataSource} = this.state;
    dataSource = JSON.parse(JSON.stringify(dataSource));
    let validResult = validAmount(val, usableQuantity);
    if(val === "") {
      dataSource[i].demandQuantity = val;
      this.setState({dataSource});
    }
    if(validResult) {
      dataSource[i].demandQuantity = val;
      // dataSource[i].totalPrice = val * dataSource[i].drugPrice;
      this.setState({dataSource});
    }else {
      this.setState({dataSource});
    }
  }
  addProduct = () =>{
    if(!this.state.query.deptCode){
      return message.warning('请选择部门');
    };
    const {query, dataSource} = this.state;
    let existDrugCodeList = dataSource.map((item) => item.drugCode);
    this.setState({ 
      visible: true,
      query: {
        ...query,
        existDrugCodeList,
        hisDrugCodeList: [],
        filterThreeMonthFlag: false
      },
      value: undefined
    });
  }
  delete = () => {  //删除
    let {selectedRows, dataSource, query} = this.state;
    dataSource = _.difference(dataSource, selectedRows);
    let existDrugCodeList = dataSource.map((item) => item.drugCode)
    this.setState({
      dataSource,
      selected: [],
      selectedRows: [],
      query: {
        ...query,
        existDrugCodeList
      }
    });
  }
  //提交
  submit = () => {   
    let { dataSource } = this.state;
   
    if(dataSource.length === 0) {
      message.warning('请添加产品');
      return;
    }
    this.updateFstate('2')
  }
  //保存
  save = () => {    
    let { dataSource } = this.state;
    if(dataSource.length === 0) {
      message.warning('请添加产品');
      return;
    }
    this.updateFstate('1')
  }
  updateFstate = (auditStatus) =>{
    let { dataSource, query, info, isEdit, saveLoading, submitLoading } = this.state;
    let isNull = dataSource.every(item => {
      if(!item.supplierCode) {
        message.warning('供应商不能为空');
        return false;
      };
      if(!item.demandQuantity) {
        message.warning('需求数量不能为空');
        return false;
      };
      if(!item.reportApplicationCode) {
        message.warning('报告药申请单号不能为空');
        return false;
      }
      return true
    });
    if(!isNull) return;
    if(saveLoading || submitLoading) return;
    if(auditStatus === '1') {
      this.setState({
        saveLoading: true
      });
    }else {
      this.setState({
        submitLoading: true
      });
    };
    let { dispatch, history } = this.props;
    let list = [], postData = {};
    dataSource.map(item => list.push({
      bigDrugCode: item.bigDrugCode,
      demandQuantity: item.demandQuantity,
      drugCode: item.drugCode,
      drugPrice: item.drugPrice,
      supplierCode: item.supplierCode,
      hisDrugCode: item.hisDrugCode,
      reportApplicationCode: item.reportApplicationCode
    }));
    postData.list = list;
    postData.auditStatus = auditStatus;
    postData.planType = '2';
    postData.purchaseType = 1;
    postData.deptCode = query.deptCode;
    postData.id = isEdit ? info.id : '';
    dispatch({
      type: 'base/submit',
      payload: { ...postData },
      callback: ({code, msg, data}) =>{
        if(code === 200) {
          message.success(`${auditStatus === "1" ? '保存' : '提交'}成功!`);
          history.push({ pathname: '/purchase/replenishment/outCatalogPurchase' });
        }else {
          this.setState({
            saveLoading: false,
            submitLoading: false
          });
          message.error(msg);
        };
      }
    })
  }
  changeQuery = (e) => {
    const {query} = this.state;
    this.setState({
      query: {
        ...query,
        filterThreeMonthFlag: e.target.checked
      }
    });
  }
  onCancel = () => {
    this.setState({ 
      visible: false, 
      modalSelected: [],
      modalSelectedRows: [],
    });
  }
  render(){
    const { 
      visible, 
      deptModules, 
      query, 
      btnLoading, 
      dataSource, 
      value, 
      loading, 
      saveLoading, 
      submitLoading,
      isEdit,
      modalSelected,
      modalSelectedRows
    } = this.state;
    const columns = [
      /*{
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },*/{
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width: 350,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },/*{
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      },*/{
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90
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
        dataIndex: 'supplierCode',
        width: 200,
        render: (text, record, i) => {
          let {supplierList} = record;
          let supplier = supplierList.map(item=>{
            return <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
          });
          return (
            <Select 
              onSelect={(value)=>{
                let {dataSource} = this.state;
                dataSource = JSON.parse(JSON.stringify(dataSource));
                let referencePrice;
                supplierList.map(item=>{
                  if(item.ctmaSupplierCode === value) {
                    referencePrice = item.referencePrice;
                  };
                  return item;
                });
                dataSource[i].drugPrice = referencePrice;
                dataSource[i].totalPrice = referencePrice * record.demandQuantity;
                this.setState({dataSource});
                
              }} 
              defaultValue={text} 
              style={{ width: '100%' }}
            >
              {supplier}
            </Select>
          )
        }
      },{
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168,
      }, {
        title: '报告药申请单号',
        dataIndex: 'reportApplicationCode',
        width: 168,
        render: (text,record) =>{
          return (
            <Input onChange={(e) => {
              record.reportApplicationCode = e.target.value;
            }}/>
          )
        }
      },{
        title: '需求数量',
        dataIndex: 'demandQuantity',
        width: 112,
        render: (text,record,index)=>{
          return <InputNumber
                    defaultValue={text}
                    min={1}
                    precision={0}
                    onChange={(value)=>{
                      this.setRowInput(value, record, index);
                    }} 
                />
        }
      },/*{
        title: '单价',
        dataIndex: 'drugPrice',
        width: 112,
      },{
        title: '金额',
        dataIndex: 'totalPrice',
        width: 168,
        render: (text,record)=>{
          let amount = record.demandQuantity ? record.demandQuantity: 1;
          return (amount * record.drugPrice).toFixed(4)
        }
      },*/{
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 168,
      },{
            title: '药品编码',
            dataIndex: 'hisDrugCode',
            width: 168,
        }
    ];
    const modalColumns = [
      /*{
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },*/ {
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width: 350,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, /*{
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      }, */{
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90
      }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 112
      }, {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '批准文号',
        width: 200,
        dataIndex: 'approvalNo',
      }, {
            title: '药品编码',
            dataIndex: 'hisDrugCode',
            width: 200,
        }
    ];
    
    return (
      <div className='fullCol' style={{ padding: 24, background: '#f0f2f5' }}>
        <div className="fullCol-fullChild" style={{margin: '-9px -24px 0'}}>
          <Row style={{borderBottom: '1px solid rgba(0, 0, 0, .1)', marginBottom: 10}}>
            <Col span={8}>
              <h2>{!isEdit ? '新建计划' : '编辑计划'}</h2>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => this.props.history.go(-1)}><Icon type="close" style={{ fontSize: 26, marginTop: 8 }} /></span>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-lg-8 ant-col-xl-6">
                <label>补货部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-lg-16 ant-col-xl-18">
                <div className='ant-form-item-control'>
                  <Select
                    style={{ width: '100%' }}
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    disabled={dataSource.length ? true: false}
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                    onSelect={(value) => this.setState({ query: {...query, deptCode: value} })}
                    value={query.deptCode}
                  >
                    {
                      deptModules.map((item,index)=> <Option key={index} value={item.id}>{ item.deptName }</Option>)
                    }
                  </Select>
                </div>
              </div>
            </Col>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Button type='primary' icon='plus' onClick={this.addProduct}>添加产品</Button>
            <Button type='default' onClick={this.delete} style={{ marginLeft: 8 }}>删除</Button>
          </Row>
        </div>
        <Modal
          title={'添加产品'}
          visible={visible}
          width={1100}
          style={{ top: 20 }}
          onCancel={this.onCancel}
          footer={[
            <Button key="submit" type="primary" loading={btnLoading} onClick={this.handleOk}>确认</Button>,
            <Button key="back" onClick={this.onCancel}>取消</Button>
          ]}
        >
        <Row style={{display: 'flex', alignItems: 'center'}}>
          <Col span={12} style={{marginLeft: 4}}>
            <FetchSelect
              allowClear
              value={value}
              style={{ width: '100%' }}
              placeholder='药品名称'
              url={replenishmentPlan.QUERY_DRUG_BY_LIST}
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
          <Col span={7} style={{ marginLeft: 4 }}>
            <Checkbox checked={query.filterThreeMonthFlag} onChange={this.changeQuery}>
              不显示三个月内无采购的药品
            </Checkbox>
          </Col>
        </Row>
        <div className='detailCard'>
          <RemoteTable
            ref='table'
            bordered
            query={query}
            isJson={true}
            columns={modalColumns}
            url={replenishmentPlan.QUERYDRUGBYDEPT}
            scroll={{ x: '100%' }}
            rowKey='bigDrugCode'
            rowSelection={{
              selectedRowKeys: this.state.modalSelected,
              onChange: (selectedRowKeys, selectedRows) => {
                if(selectedRowKeys.length > modalSelected.length) {
                  this.setState({ 
                    modalSelected: selectedRowKeys, 
                    modalSelectedRows: [...new Set([...modalSelectedRows, ...selectedRows])] 
                  });
                }else {
                  selectedRows = modalSelectedRows.filter(item => {
                    for (let i = 0; i < selectedRowKeys.length; i++) {
                      if(item.drugCode === selectedRowKeys[i]) {
                        return true;
                      };
                    };
                    return false;
                  });
                  this.setState({ 
                    modalSelected: selectedRowKeys, 
                    modalSelectedRows: selectedRows
                  });
                };
              }
            }}
          />
        </div>
        </Modal>
        <div className='detailCard' style={{margin: '-12px -8px 0px -8px'}}>
          <Table 
            title={()=>'产品信息'}
            columns={columns}
            bordered
            loading={loading}
            rowKey='drugCode'
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
                <Button type='primary' onClick={this.submit} loading={submitLoading}>提交</Button>
                <Button type='danger' loading={saveLoading} onClick={this.save} style={{ marginLeft: 8 }} ghost>保存</Button>
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