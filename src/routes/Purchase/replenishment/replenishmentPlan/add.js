/*
 * @Author: wwb 
 * @Date: 2018-07-24 18:49:01 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-09-06 23:47:54
 */
/**
 * @file 药库 - 补货管理--补货计划--新建计划
 */
import React, { PureComponent } from 'react';
import { Row, Col, Button, Table, Modal, Icon, Tooltip, message, Select, Spin, InputNumber } from 'antd';
import {replenishmentPlan} from '../../../../api/replenishment/replenishmentPlan';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect/index';
import _ from 'lodash';
import {validAmount} from '../../../../utils/utils';
import {connect} from 'dva';

const { Option } = Select;

class NewAdd extends PureComponent {
  state = {
    modalLoading: false,
    spinLoading: true,
    isShow: false,
    visible: false,
    loading: false,
    deptModules: [],// 补货部门
    query: {
      medDrugType: '1'
    },
    selected: [],
    selectedRows: [],
    modalSelected: [],
    modalSelectedRows: [],
    info: {},
    isEdit: false,
    dataSource: [],
    btnLoading: false,
    saveLoading: false
  }
  componentWillMount = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'base/getModule',
      payload: { deptType : '3' },
      callback: (data) =>{
        this.setState({ deptModules: data })
      }
    });
  };
  componentDidMount = () => {
    if(this.props.match.path === "/editReplenishment/:planCode") {
      let { planCode } = this.props.match.params;
      this.setState({loading: true})
      this.props.dispatch({
        type:'base/ReplenishDetails',
        payload: { planCode },
        callback:(data)=>{
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
            spinLoading: false
          });
        }
      });
    }else {
      this.setState({spinLoading: false})
    }
  }
  handleOk = () => {
    let {modalSelectedRows, query, dataSource} = this.state;
    if(modalSelectedRows.length === 0) {
      message.warning('至少选择一条信息');
      return;
    }
    this.setState({btnLoading: true});
    modalSelectedRows = modalSelectedRows.map(item=>item.drugCode);
    this.props.dispatch({
      type: 'base/addDrug',
      payload: {
        deptCode: query.deptCode,
        drugCodeList: modalSelectedRows
      },
      callback: (data) => {
        dataSource.push(...data);
        dataSource = dataSource.map((item) => {
          if(!item.id) {
            item.supplierCode = item.supplierList[0].ctmaSupplierCode;
          };
          return item;
        });
        let existDrugCodeList = dataSource.map((item) => item.drugCode);
        this.setState({
          dataSource: [...dataSource],
          btnLoading: false,
          visible: false,
          modalSelected: [],
          query: {
            ...query,
            existDrugCodeList
          }
        })
      }
    })
  }
  showModal = () => {
    let {query} = this.state;
    if(!query.deptCode) {
      message.warning('请选择部门');
      return;
    };
    this.setState({ visible: true });
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
  submit = (auditStatus) => {   //提交  保存
    let {isEdit, info, dataSource} = this.state;
    let isNull = dataSource.every(item => {
      if(!item.supplierCode) {
        message.warning('供应商不能为空');
        return false;
      };
      if(!item.demandQuantity) {
        message.warning('需求数量不能为空');
        return false;
      }
      return true
    });
    if(!isNull) return;
    dataSource = dataSource.map(item => {
      return {
        bigDrugCode: item.bigDrugCode,
        demandQuantity: item.demandQuantity,
        drugCode: item.drugCode,
        drugPrice: item.drugPrice,
        supplierCode: item.supplierCode
      }
    })
    if(auditStatus === 1){
      this.setState({ submitLoading: true  })
    }else{
      this.setState({ saveLoading: true });
    }
    this.props.dispatch({
      type: 'base/submit',
      payload: {
        auditStatus: auditStatus,
        id: isEdit? info.id : '',
        planType: '1',
        list: dataSource,
        deptCode: this.state.query.deptCode
      },
      callback: (data)=>{
        message.success(`${auditStatus === 1? '保存' : '提交'}成功`);
        if(auditStatus === 1){
          this.setState({ submitLoading: false  })
        }else{
          this.setState({ saveLoading: false });
        }
        this.props.history.go(-1);
      }
    })
  }
  setRowInput = (val, record, i) => {
    let {dataSource} = this.state;
    dataSource = JSON.parse(JSON.stringify(dataSource));
    let validResult = validAmount(val);
    if(val === "") {
      dataSource[i].demandQuantity = val;
      this.setState({dataSource});
    }
    if(validResult) {
      dataSource[i].demandQuantity = val;
      dataSource[i].totalPrice = Number(val * dataSource[i].drugPrice).toFixed(4);
      this.setState({dataSource});
    }else {
      this.setState({dataSource});
    }
  }
  render() {
    let { 
      visible, 
      deptModules, 
      query,  
      isEdit, 
      dataSource, 
      loading, 
      modalLoading,
      spinLoading,
      btnLoading,
      saveLoading,
      value
    } = this.state;
    const columns = [
      {
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        width: 168
      }, {
        title: '商品名',
        dataIndex: 'ctmmTradeName',
        width: 224
      }, {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
        className: 'ellipsis',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 168
      }, {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 224,
        className: 'ellipsis',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '供应商',
        dataIndex: 'supplierCode',
        width: 224,
        render: (text, record, i) => {
          let {supplierList} = record;
          let supplier = supplierList.map(item=>{
            return <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
          });
          return (
            <Select
              style={{width: '100%'}}
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
                dataSource[i].supplierCode = value;
                dataSource[i].drugPrice = referencePrice;
                dataSource[i].totalPrice = referencePrice * record.demandQuantity;
                
                this.setState({dataSource});
                
              }} 
              defaultValue={text} 
            >
              {supplier}
            </Select>
          )
        }
      }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168,
      }, {
        title: '单位',
        dataIndex: 'replanUnit',
        width: 60,
      }, {
        title: '需求数量',
        dataIndex: 'demandQuantity',
        width: 130,
        render: (text, record, i) => {
          return <InputNumber
                    defaultValue={text}
                    min={1}
                    precision={0}
                    onChange={(value)=>{
                      this.setRowInput(value, record, i);
                    }} 
                 />
        }
      }, {
        title: '当前库存',
        dataIndex: 'usableQuantity',
        width: 112
      }, {
        title: '库存上限',
        dataIndex: 'upperQuantity',
        width: 112
      }, {
        title: '库存下限',
        dataIndex: 'downQuantity',
        width: 112
      }, {
        title: '参考价格',
        dataIndex: 'drugPrice',
        width: 112
      }, {
        title: '金额',
        dataIndex: 'totalPrice',
        width: 168
      }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 224,
      }
    ];
    const modalColumns = [
      {
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        width: 168
      }, {
        title: '商品名',
        dataIndex: 'ctmmTradeName',
        width: 224
      }, {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168
      }, {
        title: '当前库存',
        dataIndex: 'totalStoreNum',
        width: 112,
      }, {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 168
      }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168
      }, {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 224,
        className: 'ellipsis',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 224,
      },
    ];
    return (
      <Spin spinning={spinLoading} size="large">
        <div className="fullCol" style={{ padding: 24, background: '#f0f2f5' }}>
          <div className="fullCol-fullChild" style={{margin: '-9px -24px 0'}}>
            <Row style={{borderBottom: '1px solid rgba(0, 0, 0, .1)', marginBottom: 10}}>
              <Col span={8}>
                <h2>{isEdit? '编辑计划' : '新建计划'}</h2>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => this.props.history.go(-1)}><Icon type="close" style={{ fontSize: 26, marginTop: 8 }} /></span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>补货部门</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                  <div className='ant-form-item-control'>
                    <Select
                      disabled={dataSource.length === 0? false : true}
                      showSearch
                      value={query.deptCode}
                      onChange={(value) => {
                        let {query} = this.state;
                        this.setState({
                          query: {
                            ...query,
                            deptCode: value
                          }
                        });
                      }}
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.indexOf(input) >= 0} 
                      style={{ width: '100%' }}
                      placeholder="请选择"
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
              <Button type='primary' icon='plus' onClick={this.showModal}>添加产品</Button>
              <Button type='default' style={{ margin: '0 8px' }}>一键添加低库存产品</Button>
              <Button onClick={this.delete} type='default'>删除</Button>
            </Row>
          </div>
          <Modal
            bordered
            title={'添加产品'}
            visible={visible}
            width={1100}
            style={{height: 630, top: 20 }}
            onCancel={() => this.setState({ visible: false, modalSelected: [] })}
            footer={[
              <Button key="submit" type="primary" loading={btnLoading} onClick={this.handleOk}>确认</Button>,
              <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>
            ]}
          >
            <Row>
              <Col span={7} style={{ marginLeft: 4 }}>
                <FetchSelect
                  allowClear
                  value={value}
                  style={{ width: 248 }}
                  placeholder='通用名/商品名'
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
            </Row>
            <div className='detailCard'>
              <RemoteTable
                query={query}
                url={replenishmentPlan.QUERYDRUGBYDEPT}
                isJson={true}
                ref="table"
                modalLoading={modalLoading}
                columns={modalColumns}
                scroll={{ x: 1504 }}
                rowKey='drugCode'
                rowSelection={{
                  selectedRowKeys: this.state.modalSelected,
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ modalSelected: selectedRowKeys, modalSelectedRows: selectedRows })
                  }
                }}
                pagination={false}
              />
            </div>
          </Modal>
          <div className='detailCard' style={{margin: '-12px -8px 0px -8px'}}>
            <Table
              title={()=>'产品信息'}
              loading={loading}
              bordered
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: 2404 }}
              rowKey='drugCode'
              rowSelection={{
                selectedRowKeys: this.state.selected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({ 
                    selected: selectedRowKeys, 
                    selectedRows: selectedRows
                  })
                }
              }}
              pagination={false}
            />
          </div>
          {
            dataSource.length === 0 ? null : 
            <div className="detailCard" style={{margin: '-12px -8px 0px -8px'}}>
              <Row>
                <Col style={{ textAlign: 'right', padding: '10px' }}>
                  <Button loading={saveLoading} onClick={()=>{this.submit('2')}} type='primary'>提交</Button>
                  <Button loading={saveLoading} onClick={()=>{this.submit('1')}} type='danger' style={{ marginLeft: 8 }} ghost>保存</Button>
                </Col>
              </Row>
            </div>
          }
        </div>
      </Spin>
    )
  }
}
export default connect(state=>state)(NewAdd);