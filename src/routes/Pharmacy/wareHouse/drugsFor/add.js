/*
 * @Author: wwb 
 * @Date: 2018-07-24 18:49:01 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 00:06:02
 */
/**
 * @file 药房 - 申领 - 新建
 */
import React, { PureComponent } from 'react';
import { Row, Form , Spin, Col, Button, Table, Modal, Icon, Tooltip, message, Select, InputNumber } from 'antd';
import {wareHouse} from '../../../../api/pharmacy/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect/index';
import _ from 'lodash';
import {connect} from 'dva';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: {span: 8},
    lg: {span: 6},
    xl: {span: 6},
    xxl: {span: 4},
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
    md: {span: 16},
    lg: {span: 18},
    xl: {span: 18},
    xxl: {span: 20},
  },
};
const { Option } = Select;
const FormItem = Form.Item;
class NewAdd extends PureComponent {
  state = {
    modalLoading: false,
    spinLoading: true,
    isShow: false,
    visible: false,
    loading: false,
    deptModules: [],// 补货部门
    query: {
      deptCode: undefined,
      applyFlag: true,
      existDrugCodeList: [],
      hisDrugCodeList: []
    },
    selected: [],
    selectedRows: [],
    modalSelected: [],
    modalSelectedRows: [],
    info: {},
    dataSource: [],
    btnLoading: false,
    saveLoading: false,
    applyType: undefined,        //补货方式
    addDrugType: 1,
    applyTypeList: []
  }
  componentDidMount = () =>{
    this.getReplenishList('1');
    this.props.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        filterAllFlag: true,
        type: 'apply_type'
      },
      callback: (data) => {
        this.setState({
          applyTypeList: data,
          applyType: '1',        //补货方式
        });
      }
    });
  };
  getReplenishList = (type) => {
    const { dispatch } = this.props;
    let {query} = this.state;
    this.setState({
      deptModules: [],
      query: {
        ...query,
        deptCode: undefined
      },
    })
    dispatch({
      type: 'base/selectApplyDept',
      payload: { applyType : type },
      callback: (data) =>{
        this.setState({ 
          deptModules: data,
          query: {
            ...query,
            deptCode: type === '1' ? data[0].id : undefined
          },
        })
      }
    });
  }
  handleOk = () => {
    let {modalSelectedRows, query, addDrugType} = this.state;
    if(modalSelectedRows.length === 0) {
      message.warning('至少选择一条信息');
      return;
    }
    this.setState({btnLoading: true});
    modalSelectedRows = modalSelectedRows.map(item=>item.drugCode);
    this.props.dispatch({
      type: 'base/applyAddDrug',
      payload: {
        deptCode: query.deptCode,
        drugCodeList: modalSelectedRows,
        addDrugType
      },
      callback: (data) => {
        this.setState({
          dataSource: [...this.state.dataSource, ...data],
          btnLoading: false,
          visible: false,
          modalSelected: [],
          modalSelectedRows: []
        })
      }
    })
  }
  showModal = () => { //普通添加
    let {query, dataSource} = this.state;
    if(!query.deptCode) {
      message.warning('请选择部门');
      return;
    };
    query = {
      ...query,
      existDrugCodeList: dataSource.map(item=>item.drugCode),
      hisDrugCodeList: []
    };
    this.setState({
      visible: true, 
      addDrugType: 1,
      query: {
        ...query,
        hisDrugCodeList: []
      }
    });
  }
  autoShowModal = () => { //一键添加零库存
    let {query, dataSource} = this.state;
    if(!query.deptCode) {
      message.warning('请选择部门');
      return;
    };
    query = {
      ...query,
      existDrugCodeList: dataSource.map(item=>item.drugCode),
      hisDrugCodeList: []
    };
    this.setState({
      visible: true, 
      addDrugType: 2,
      query: {...query}
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
  submit = (applyStatus) => {   //提交  保存
    let {dataSource, applyType, query} = this.state;
    let isNull = dataSource.every(item => {
      if(!item.applyNum) {
        message.warning('申领数量不能为空');
        return false;
      };
      return true
    });
    if(!isNull) return;
    dataSource = dataSource.map(item => {
      return {
        applyNum: item.applyNum,
        drugCode: item.drugCode,
      }
    });
    this.setState({
      saveLoading: true
    });
    let body = {
      applyStatus,
      applyType,
      distributeDeptCode: query.deptCode,
      detaiList: dataSource
    };
    
    this.props.dispatch({
      type: 'base/applySubmit',
      payload: body,
      callback: ()=>{
        message.success(`${applyStatus === '0'? '保存' : '提交'}成功`);
        this.props.history.go(-1);
      }
    });
  }
  onCancel = () => {
    this.setState({
      visible: false, 
      modalSelected: [],
      modalSelectedRows: []
    });
  }
  render() {
    let { 
      visible, 
      deptModules, 
      query,  
      dataSource, 
      loading, 
      modalLoading,
      btnLoading,
      saveLoading,
      applyTypeList,
      applyType,
      modalSelected, 
      modalSelectedRows
    } = this.state;
    let columns = [
    /*  {
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        fixed: 'left',
        width: 200,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, */{
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width: 350,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },/* {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 128,
        className: 'ellipsis',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, */{
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className: 'ellipsis',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '库存上限',
        dataIndex: 'locaUpperQuantity',
        width: 100,
      }, {
        title: '库存下限',
        dataIndex: 'localDownQuantity',
        width: 100,
      }, {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90
      },{
            title: '申领数量',
            dataIndex: 'applyNum',
            width: 120,
            render: (text, record, i) => {
                return <InputNumber
                    value={text}
                    min={1}
                    precision={0}
                    onChange={(value)=>{
                        if(value > record.usableQuantity) {
                            return message.warning('申领数量不得大于配货部门可用库存!');
                        };
                        if((value + record.localUsableQuantity) > record.locaUpperQuantity) {
                            return message.warning('申领数量加上药房可用库存不得大于库存上限!');
                        }
                        dataSource = JSON.parse(JSON.stringify(dataSource));
                        dataSource[i].applyNum = value;
                        this.setState({dataSource});
                    }}
                />
            }
        }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 148
      }, {
        title: '单位',
        dataIndex: 'replanUnit',
        width: 100,
      },  {
        title: (
          <Tooltip title="配货部门可用库存">
            <span>配货部门库存</span>
          </Tooltip>
        ),
        dataIndex: 'usableQuantity',
        width: 112,
        render: (text) => text ? text : 0
      }, {
        title: (
          <Tooltip title="当前部门可用库存">
            <span>药房可用库存</span>
          </Tooltip>
        ),
        dataIndex: 'localUsableQuantity',
        width: 112,
        render: (text) => text ? text : 0
      }, {
        title: (
          <Tooltip title="当前部门近7天的药品发药量">
            <span>7天使用量</span>
          </Tooltip>
        ),
        dataIndex: 'recentlyUseNum',
        width: 148,
      }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 180,
      }
    ];
    const modalColumns = [
     /* {
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 200,
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
      }, {
            title: '生产厂家',
            dataIndex: 'ctmmManufacturerName',
            width: 200,
            className: 'ellipsis',
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            )
        }, /*{
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 128,
      }, */{
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90
      }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 148
      }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 160,
      }
    ];
    
    return (
      <div className="fullCol" style={{ padding: 24, background: '#f0f2f5' }}>
        <div className="fullCol-fullChild" style={{margin: '-9px -24px 0'}}>
          <Row style={{borderBottom: '1px solid rgba(0, 0, 0, .1)', marginBottom: 10}}>
            <Col span={8}>
              <h2>新建申领</h2>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => this.props.history.go(-1)}><Icon type="close" style={{ fontSize: 26, marginTop: 8 }} /></span>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col md={12} lg={8} xl={6}>
              <FormItem {...formItemLayout} label="补货方式">
                <Select
                  showSearch
                  disabled={dataSource.length === 0? false : true}
                  style={{width: "100%"}}
                  onChange={(value) => {
                    this.setState({
                      applyType: value
                    });
                    this.getReplenishList(value);
                  }}
                  value={applyType}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  placeholder="请选择"
                >
                    {
                      applyTypeList.map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))
                    }
                  </Select>
              </FormItem>
            </Col>
            <Col md={12} lg={8} xl={6}>
              <FormItem {...formItemLayout} label="补货部门">
                <Select
                  showSearch
                  disabled={dataSource.length === 0? false : true}
                  style={{width: "100%"}}
                  value={query.deptCode}
                  onChange={(value) => {
                    let {query} = this.state;
                    query = {
                      ...query,
                      deptCode: value
                    };
                    this.setState({query});
                  }}
                  notFoundContent={<Spin size="small" />}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0} 
                  placeholder="请选择"
                >
                  {
                    deptModules.map((item,index)=> <Option key={index} value={item.id}>{ item.deptName }</Option>)
                  }
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Button type='primary' icon='plus' onClick={this.showModal}>添加产品</Button>
            <Button type='default' onClick={this.autoShowModal} style={{ margin: '0 8px' }}>一键添加低库存产品</Button>
            <Button onClick={this.delete} type='default'>删除</Button>
          </Row>
        </div>
        <Modal
          bordered
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
          <Row>
            <Col span={7} style={{ marginLeft: 4 }}>
              <FetchSelect
                value={query.hisDrugCodeList[0]}
                style={{ width: 496 }}
                allowClear={true}
                placeholder='药品名称'
                url={wareHouse.QUERY_DRUG_BY_LIST}
                cb={(value, option) => {
                  let {query} = this.state;
                  query = {
                    ...query,
                    hisDrugCodeList: value ? [value] : []
                  };
                  this.setState({query});
                }}
              />
            </Col>
          </Row>
          <div className='detailCard'>
            <RemoteTable
              query={query}
              url={wareHouse.QUERYDRUGBYDEPT_PHARMACY}
              isJson={true}
              ref="table"
              modalLoading={modalLoading}
              columns={modalColumns}
              scroll={{ x: '100%' }}
              rowKey='drugCode'
              rowSelection={{
                selectedRowKeys: modalSelected,
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
              pagination={false}
            />
          </div>
        </Modal>
        <div 
          className='detailCard' 
          style={{
            margin: '-12px -8px -6px',
            minHeight: 'calc(100vh - 226px)'
          }}
        >
          <Table
            title={()=>'产品信息'}
            loading={loading}
            bordered
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: '100%' }}
            rowKey='drugCode'
            rowSelection={{
              selectedRowKeys: this.state.selected,
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ 
                  selected: selectedRowKeys, 
                  selectedRows: selectedRows
                });
              }
            }}
            pagination={false}
          />
          {
            dataSource.length === 0? null : 
            <Col style={{ textAlign: 'right', marginTop: '10px' }}>
              <Button loading={saveLoading} onClick={()=>{this.submit('1')}} type='primary'>提交</Button>
            </Col>
          }
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(NewAdd);