/*
 * @Author: gaofengjiao 
 * @Date: 2018-08-06
 * @Last Modified by: wwb
 * @Last Modified time: 2018-10-26 17:03:21
 */
/* 
  @file  药库 - 入库--配送单验收-详情
*/
import React, { PureComponent } from 'react';
import {Row, Col, Tooltip, Input, InputNumber, DatePicker, Button, Tabs, message,} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import { replenishmentPlan } from '../../../../api/replenishment/replenishmentPlan';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect/index';
import wareHouse from '../../../../api/drugStorage/wareHouse';
import querystring from 'querystring';
import {difference} from 'lodash';

const TabPane = Tabs.TabPane;

const columns = [
  {
    title: '药品名称',
    width:350,
    dataIndex: 'ctmmTradeName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc'
  },
  {
    title: '包装规格',
    width: 148,
    dataIndex: 'packageSpecification'
  },
  {
    title: '单位',
    width: 90,
    dataIndex: 'replanUnit'
  },
  {
    title: '需求数量',
    dataIndex: 'demandQuantity',
    width: 90
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
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 100
  },
  {
    title: '金额',
    dataIndex: 'amount',
    width: 100,
    render: (text, record) => (record.price * record.demandQuantity).toFixed(4)
  },
  {
    title: '批准文号',
    width: 200,
    dataIndex: 'approvalNo'
  },
    {
        title: '药品编码',
        dataIndex: 'hisDrugCode',
        width: 200,
    },
];

class PslistCheck extends PureComponent{
  constructor(props) {
    super(props);
    let info = querystring.parse(this.props.match.params.id);
    this.state = {
      query: {
        medDrugType: '1',
        purchaseType: 1,
        planCode:"PA190220000003",
        deptCode:"24C69445D19C4625960DA3F1E58A6A1F"
      },
      deptModules: [],// 补货部门
      visible: false,
      loading: false,
      selected: [],
      selectedRows: [],
      expandedRowKeys: [],
      loading: true,
      defaultActiveKey: '1',
      id: info.id,
      detailInfo: {},
      checkLoading: false,
      unVerfiyList: [],
      unacceptedQuery: {
        distributeCode: info.id,
        status: 1
      },
      acceptedQuery: {
        distributeCode: info.id,
        status: 2
      }
    }
  }
  componentDidMount = () => {
    this.queryDetail();
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
  //增加批号
  addBatch = (record, i) => {
    let { expandedRowKeys, selected, unVerfiyList} = this.state;
    
    unVerfiyList[i].children = unVerfiyList[i].children || [];
    record = {...record};
    delete record.children;
    let key = new Date().getTime();
    unVerfiyList[i].children.push({
      ...record,
      parentId: record.id,
      id: null,
      key,
      realNum: '',
        realReceiveQuantiry: 0
    });
    expandedRowKeys.push(record.key);
    expandedRowKeys = [...new Set(expandedRowKeys)];
    let isSelect = selected.some(item => {
      if(item === record.key) {
        return true;
      };
      return false;
    });
    if(isSelect) {
      selected.push(key);
    }
    this.setState({
      unVerfiyList,
      expandedRowKeys,
      selected: [...selected]
    });
  }
  //删除
  removeBatch = (record, i) =>{
    let {unVerfiyList, expandedRowKeys} = this.state;
    let index;
    unVerfiyList = unVerfiyList.map((item, totalNum)=>{
      if(record.parentId === item.id) {
        index = totalNum;
      };
      return item;
    });
    
    unVerfiyList[index].children = unVerfiyList[index].children.filter(item => item.key !== record.key);
    if(!unVerfiyList[index].children.length) {
      expandedRowKeys = expandedRowKeys.filter(item=>item !== unVerfiyList[index].key);
    };
    this.setState({
      unVerfiyList,
      expandedRowKeys
    });
  }
  //tabs切换
  tabsChange = (key) =>{
    this.setState({
      defaultActiveKey: key
    });
  }
  //选中rows
  changeSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows: selectedRows});
  }
  //全选
  selectAll = (selected, selectedRows) => {
    if(selected) {
      this.setState({
        selected: this.seekChildren(selectedRows).realSelectedRowsKey
      });
    }else {
      this.setState({ 
        selected: [],
        selectedRows: []
      });
    };
  }
  //展开
  onExpandedRowsChange = (expandedRows) => {
    this.setState({expandedRowKeys: expandedRows});
  }
  //选中
  changeSelect = (selectedRows, isSelect) => {
    let {selected} = this.state;
    let {children} = selectedRows;
    if(isSelect) {  //选中
      selected.push(selectedRows.key);
      if(children && children.length) {
        children.map(item=>{
          selected.push(item.key);
          return item;
        });
      }
    }else {
      selected = difference(selected, [selectedRows.key]);
      if(children && children.length) {
        let childrenSelect = children.map(item=>item.key);
        selected = difference(selected, childrenSelect);
      }
    };
    this.setState({
      selected: [...selected]
    })
  }
  //寻找全选时的children
  seekChildren = (selectedRows) => {
    let dataSource = this.state.unVerfiyList;
    let realSelectedRowsKey = selectedRows.map(item=>item.key);
    let realSelectedRows = [];
    for (let i = 0; i < selectedRows.length; i++) {
      for (let j = 0; j < dataSource.length; j++) {
        if(dataSource[j].key === selectedRows[i].key) {
          realSelectedRows.push(dataSource[j]);
          if(dataSource[j].children && dataSource[j].children.length) {
            let childrenKey = dataSource[j].children.map(childItem=>childItem.key)
            realSelectedRowsKey = [...realSelectedRowsKey, ...childrenKey]
          }
        }
      }
    };
    return {
      realSelectedRowsKey,
      realSelectedRows
    };
  }
  //验收
  saveCheck = () => {
    let {selectedRows, detailInfo} = this.state;
    if(selectedRows.length === 0) {
      return message.error('至少选择一条数据');
    };
    if(!this.onCheck()) return;
    this.setState({checkLoading: true});
    selectedRows = this.seekChildren(selectedRows).realSelectedRows; //包含children的二维数组
    let includeChildren = [...selectedRows];//包含children的一维数组
    selectedRows.map(item => {  
      if(item.children && item.children.length) {
        item.children.map(childItem => {
          includeChildren.push(childItem);
          return childItem;
        });
      };
      return item;
    });
    let detailList = includeChildren.map(item=>{
      let i = {
        realReceiveQuantiry: item.realNum,
        productBatchNo: item.productBatchNo,
        realValidEndDate: item.realValidEndDate,
        realProductTime: item.realProductTime,
        drugCode: item.drugCode,
        id: item.id,
        parentId: item.parentId,
        isUsual: item.isUsual
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
        this.setState({
          selected: []
        });
        this.queryDetail();
        this.unacceptedTable.fetch();
        this.acceptedTable && this.acceptedTable.fetch();
        this.tableOnChange();
      }
    })
  }
  //校验
  onCheck = () => {
    let {selectedRows, detailInfo} = this.state;
    selectedRows = [...selectedRows];
    selectedRows = this.seekChildren(selectedRows).realSelectedRows; //包含children的二维数组
    let includeChildren = [...selectedRows];//包含children的一维数组
    selectedRows.map(item => {  
      if(item.children && item.children.length) {
        item.children.map(childItem => {
          includeChildren.push(childItem);
          return childItem;
        });
      };
      return item;
    });
    let isNull = includeChildren.every(item => {
      if(
        item.realNum !== 0 &&
        !item.realNum
      ){
        console.log(item.realNum);
        
        message.error('实到数量不能为空');
        return false;
      };
      if(!item.realProductTime){
        message.error('生产日期不能为空');
        return false;
      };
      if(!item.realValidEndDate){
        message.error('有效期至不能为空');
        return false;
      };
      if(!item.productBatchNo){
        message.error('生产批号不能为空');
        return false;
      };
      if(detailInfo.isShowTemprature === 1) {
        if(!item.realAcceptanceTemperature){
          message.error('验收温度不能为空');
          return false;
        };
      }
      return true;
    });
    let isLike;
    isLike = selectedRows.map(item => this.valueCheck(item));
    isLike = isLike.every(item => item);
    if(!isLike) {
      message.warning('提交数据中存在药物批号一样，但是生产日期和有效期至不一样的数据');
    };
    return isNull && isLike;
  }
  //日期批号校验
  valueCheck = (list) => {
    let a = [];
    a.push(list);
    if(list.children && list.children.length) {
      list.children.map(item => {
        a.push(item);
        return item;
      });
    };
    var b = [];
    b = a.map(item=>item.productBatchNo);
    b = [...new Set(b)];
    var c = [];
    for (let i = 0; i < b.length; i++) {
      c[i] = a.filter(item => item.productBatchNo === b[i]);
    };
    var d = [];
    for (let i = 0; i < c.length; i++) {
      d[i] = this.checkChildren(c[i]);
    };
    d = d.every(item => item);
    return d;
  }
  checkChildren(list) {
    var a = list.every((item, i) => {
      if(i === list.length - 1) {
        return true;
      };
      if(list[i].realProductTime === list[i + 1].realProductTime && list[i].realValidEndDate === list[i + 1].realValidEndDate) {
        return true;
      };
      return false;
    });
    return a;
  }
  //获取详情
  queryDetail = () => {
    this.setState({loading: true});
    this.props.dispatch({ 
      type: 'base/checkDetailHead',
      payload: {
        distributeCode: this.state.id,
      },
      callback: ({data, code, msg}) => {
        if(code !== 200) return message.error(msg);
        this.setState({
          detailInfo: data,
          defaultActiveKey: data.auditStatus === 1? '1' : '2',
        });
      }
    })
  }
  //打印
  print = () => {
    const {distributeCode} = this.state.detailInfo;//printDetail
    const {defaultActiveKey} = this.state;
    window.open(`${wareHouse.PRINT_DETAIL}?distributeCode=${distributeCode}&status=${defaultActiveKey}`, '_blank');
  }
    //导出excel
    ExcelOut = () => {
      alert('导出excel')
     //const {distributeCode} = this.state.detailInfo;//printDetail
      //const {defaultActiveKey} = this.state;
      //window.open(`${wareHouse.PRINT_DETAIL}?distributeCode=${distributeCode}&status=${defaultActiveKey}`, '_blank');
    }
  //未验收Table回调
  unVerfiyTableCallBack = (data) => {
    if(data.length) {
      data = data.map(item => {
        if(item.isUsual === 0) {
          item.realNum = item.realReceiveQuantiry;
        }else {
          item.realNum = 0;
        };
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
  //翻页
  tableOnChange = () => {
    this.setState({
      selected: [],
      selectedRows: [],
      expandedRowKeys: [],
    });
  }
  //编辑时同步set selectedRows
  setSelectRow = (record, value, key) => {
    let { selectedRows } = this.state,
          rowKey = record.key,
          pIndex,
          index;
    for (let i = 0; i < selectedRows.length; i++) {
      const { children } = selectedRows;
      if(selectedRows[i].key === rowKey) {
        pIndex = i;
        break;
      };
      if(children && children.length) {
        for (let j = 0; j < children.length; j++) {
          if(children[j].key === rowKey) {
            index = j;
            pIndex = i;
            break;
          };
        };
      };
    };
    if(!pIndex && !index) return;
    
    if(pIndex && index) {
      selectedRows[pIndex].children[index][key] = value;
    };
    if(pIndex && !index) {
      selectedRows[pIndex][key] = value;
    };
    this.setState({
      selectedRows
    });
  }
  render(){
    let {
      detailsData, 
      submitLoading,
      query,  
      modalLoading,
      loading, 
      defaultActiveKey, 
      expandedRowKeys, 
      detailInfo, 
      checkLoading,
      unVerfiyList,
      unacceptedQuery,
      acceptedQuery
    } = this.state;
    let columnsUnVerfiy = [
     /* {
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
     /* {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      },*/
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
        title: '单位',
        dataIndex: 'unit',
        width: 112
      },
      {
        title: '配送数量',
        dataIndex: 'realReceiveQuantiry',
        width: 112
      },
      {
        title: '实到数量',
        dataIndex: 'realNum',
        render: (text, record, index)=>{
          return record.type == 103|| record.type == 104?
                  <InputNumber
                    min={0}
                    value={text}
                    precision={0}
                    onChange={(value)=>{
                      if(typeof value !== 'number') return;
                      let pIndex;
                      //找出当前单据的主单据
                      if(record.parentId) {
                        unVerfiyList.forEach((item, i) => {
                          if(item.id === record.parentId) {
                            pIndex = i;
                          };
                        });
                      }else {
                        pIndex = index;
                      };
                      //得到主单据配送数量
                      let countRealDeliveryQuantiry = unVerfiyList[pIndex].realReceiveQuantiry;
                      //得到主单据下的所有分单据
                      let branchBills = unVerfiyList[pIndex].children || [];
                      //得到主单据的实到数量
                      let allRealDeliveryQuantiry = unVerfiyList[pIndex].realNum ? unVerfiyList[pIndex].realNum : 0;
                      branchBills.forEach((item) => {//加上所有分单据的实到数量
                        if(item.realNum === "" || item.realNum === undefined) {
                          item.realNum = 0
                        };
                        allRealDeliveryQuantiry += item.realNum;
                      });
                      //得到当前单据上一次的实到数量
                      let lastRealReceiveQuantity = record.realNum ? record.realNum : 0;
                      //减去当前单据的上一次实到数量
                      allRealDeliveryQuantiry = allRealDeliveryQuantiry - lastRealReceiveQuantity;
                      //判断所有单据实到数量相加和配送数量的大小
                      if(value + allRealDeliveryQuantiry > countRealDeliveryQuantiry){
                        message.warning('请注意：实到数量比配送数量多');
                      };
                      record.realNum = value;
                      unVerfiyList = [...unVerfiyList];
                      this.setSelectRow(record, value, 'realNum');
                      this.setState({
                        unVerfiyList
                      });
                    }} 
                  /> : text;
        },
        width: 120
      },
      {
        title: '差额数量',
        dataIndex: 'balanceAmount',
        render: (text,record,index)=>{
          let balanceAmount;
          if(record.realNum || record.realNum === 0) {
            balanceAmount = record.realReceiveQuantiry - record.realNum;
          }else {
            balanceAmount = 0;
          };
          return <span>{balanceAmount}</span>
        },
        width: 120
      },
      {
        title: '生产批号',
        dataIndex: 'productBatchNo',
        render: (text,record,index)=>{
          return record.productBatchNo =='' ?
                  <Input 
                    onChange={(e)=>{
                      this.setSelectRow(record, e.target.value, 'productBatchNo');
                      record.productBatchNo = e.target.value;
                    }} 
                    defaultValue={text}
                  /> : text;
        },
        width: 168
      },
      {
        title: '生产日期',
        dataIndex: 'realProductTime',
        render: (text,record,index)=> {
          return record.type == 103|| record.type == 104 ?
                <DatePicker
                  disabledDate={(current) => current && current > moment(record.realValidEndDate)}
                  onChange={(dates, moment) => {
                    this.setSelectRow(record, moment, 'realProductTime');
                    record.realProductTime = moment;
                  }}
                  defaultValue={moment(text, 'YYYY-MM-DD')}
                /> : text;
        },
        width: 168
      },
      {
        title: '有效期至',
        dataIndex: 'realValidEndDate',
        render: (text,record,index)=> {
          return record.type == 103|| record.type == 104 ?
                <DatePicker
                  disabledDate={(current) => current && current < moment(record.realProductTime)}
                  onChange={(dates, moment) => {
                    this.setSelectRow(record, moment, 'realValidEndDate');
                    record.realValidEndDate = moment;
                  }}
                  defaultValue={moment(text, 'YYYY-MM-DD')}
                /> : text
        },
        width: 168
      },
      {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168
      },
      {
        title: '是否异常',
        dataIndex: 'isUsual',
        width: 112,
        render: (text, record) => {
          if(text === 0) {
            return <span>否</span>;
          };
          return <span>是</span>;
        }
      },
      {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 168
      },
      {
        title: '操作',
        dataIndex: 'RN',
        width: 112,
        render: (text, record, i)=>{
          if(record.isUsual === 1) {
            return "";
          };
          if(record.isUsual === 0) {
              return record.id ? 
                      <a onClick={this.addBatch.bind(this, record, i)}>增加验收批号</a>
                      : 
                      <a onClick={this.removeBatch.bind(this, record, i)}>删除</a>;
          };
        }
      }
    ];
    let columnsVerify = [
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
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ),
        width: 168
      },*/
      {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 224,
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ),
      },
      {
        title: '单位',
        dataIndex: 'replanUnit',
        width: 112,
      },
      {
        title: '配送数量',
        dataIndex: 'realReceiveQuantiry',
        width: 112,
      },  
      {
        title: '实到数量',
        dataIndex: 'realNum',
        width: 112,
      },
      {
        title: '生产批号',
        dataIndex: 'productBatchNo',
        width: 168,
      },
      {
        title: '生产日期',
        dataIndex: 'realProductTime',
        width: 118,
      },
      {
        title: '有效期至',
        dataIndex: 'realValidEndDate',
        width: 118,
      },
      {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168,
      },
      {
        title: '是否异常',
        dataIndex: 'isUsual',
        width: 112,
        render: (text, record) => {
          if(text === 0) {
            return <span>否</span>
          };
          return <span>是</span>
        }
      },
      {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90,
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 168,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 168,
      }
    ];
    if(detailInfo.isShowTemprature === 1) {
      columnsVerify.splice(10, 0, {
        title: '验收温度',
        dataIndex: 'realAcceptanceTemperature',
        width: 112,
      });
      columnsUnVerfiy.splice(10, 0, {
        title: '验收温度',
        dataIndex: 'realAcceptanceTemperature',
        render: (text,record,index)=> {
          return <Input 
                  type="number"
                  onChange={(e)=>{
                    record.realAcceptanceTemperature = e.target.value;
                    this.setSelectRow(record, e.target.value, 'realAcceptanceTemperature');
                  }}
                  defaultValue={text || '' } 
                  addonAfter={`℃`}
                />
        },
        width: 168,
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
              <Button onClick={this.ExcelOut}>导出execl</Button>
              <Button style={{marginLeft:'12px'}} onClick={this.print}>打印</Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>配送单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.distributeCode || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>订单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.orderCode || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.statusName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.typeName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>供应商</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.supplierName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>配送日期</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailInfo.createDate || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>验收人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.receptionUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>收货地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.deptAddress || ''}</div>
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
                title={()=>'查询产品信息'}
                scroll={{x: '100%'}}
                query={query}
                //url={'/medicinal-web/a/depot/depotplan/detailXG?planCode='+this.props.match.params.planCode}
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
                columns={columnsUnVerfiy}
                dataSource={unVerfiyList || []}
                pagination={false}
                rowKey={'key'}
                expandedRowKeys={expandedRowKeys}
                onExpandedRowsChange={this.onExpandedRowsChange}
                rowSelection={{
                  selectedRowKeys: this.state.selected,
                  onChange: this.changeSelectRow,
                  onSelect: this.changeSelect,
                  onSelectAll: this.selectAll,
                  getCheckboxProps: record => ({
                    disabled: record.id === null
                  })
                }}
              /> */}
              <RemoteTable 
                ref={(node) => this.unacceptedTable = node}
                query={unacceptedQuery}
                columns={columnsUnVerfiy}
                dataSource={unVerfiyList}
                loading={loading}
                scroll={{ x: '100%' }}
                url={wareHouse.CHECK_EXAM_DETAIL}
                rowKey='key'
                pagination={{
                  onChange: this.tableOnChange
                }}
                cb={this.unVerfiyTableCallBack}
                expandedRowKeys={expandedRowKeys}
                onExpandedRowsChange={this.onExpandedRowsChange}
                rowSelection={{
                  selectedRowKeys: this.state.selected,
                  onChange: this.changeSelectRow,
                  onSelect: this.changeSelect,
                  onSelectAll: this.selectAll,
                  getCheckboxProps: record => ({
                    disabled: record.id === null
                  })
                }}
              />
            </TabPane>
            <TabPane tab="已验收" key="2">
              {/* <Table
                loading={loading}
                bordered
                scroll={{x: '100%'}}
                columns={columnsVerify || []}
                dataSource={verifyList}
                rowKey={'key'}
                pagination={false}
              /> */}
              <RemoteTable
                ref={(node) => this.acceptedTable = node}
                query={acceptedQuery}
                columns={columnsVerify}
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
