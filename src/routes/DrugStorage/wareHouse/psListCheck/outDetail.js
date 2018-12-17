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
import {Row, Col, Tooltip,  Button, Tabs, Table, message} from 'antd';
import {connect} from 'dva';
import wareHouse from '../../../../api/drugStorage/wareHouse';
import querystring from 'querystring';
import {difference} from 'lodash';

const TabPane = Tabs.TabPane;

class PslistCheck extends PureComponent{
  constructor(props) {
    super(props);
    let info = querystring.parse(this.props.match.params.id);
    this.state = {
      selected: [],
      selectedRows: [],
      loading: true,
      btnShow: false,
      defaultActiveKey: '1',
      id: info.id,
      detailInfo: {},
      checkLoading: false,
      expandedRowKeys: []
    }
  }
  //增加批号
  /* addBatch = (record, i) => {
    let {detailInfo, expandedRowKeys, selected} = this.state;
    let {unVerfiyList} = detailInfo;
    
    unVerfiyList[i].children = unVerfiyList[i].children || [];
    record = {...record};
    delete record.children;
    let key = new Date().getTime();
    unVerfiyList[i].children.push({
      ...record,
      parentId: record.id,
      id: null,
      key,
      realReceiveQuantity: ''
    });
    detailInfo.unVerfiyList = unVerfiyList;
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
      detailInfo: {...detailInfo},
      expandedRowKeys,
      selected: [...selected]
    });
  } */
  //删除
  /* removeBatch = (record, i) =>{
    let {detailInfo, expandedRowKeys} = this.state;
    let {unVerfiyList} = detailInfo;
    let index;
    unVerfiyList.map((item, totalNum)=>{
      if(record.parentId === item.id) {
        index = totalNum;
      };
      return item;
    });
    
    unVerfiyList[index].children = unVerfiyList[index].children.filter(item => item.key !== record.key);
    if(!unVerfiyList[index].children.length) {
      expandedRowKeys = expandedRowKeys.filter(item=>item !== unVerfiyList[index].key);
    };
    
    detailInfo.unVerfiyList = unVerfiyList;
    this.setState({
      detailInfo: {...detailInfo},
      expandedRowKeys
    });
  } */
  //tabs切换
  tabsChange = (key) =>{
    if(key === '2') {
      this.setState({
        btnShow: false,
        defaultActiveKey: key
      });
    };
    if(key === '1') {
      this.setState({
        btnShow: true,
        defaultActiveKey: key
      });
    };
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
    let {detailInfo} = this.state;
    let dataSource = detailInfo.unVerfiyList;
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
  componentDidMount = () => {
    this.queryDetail();
  }
  //验收
  saveCheck = () => {
    let {selectedRows, detailInfo} = this.state;
    if(selectedRows.length === 0) {
      message.error('至少选择一条数据');
      return;
    };
    // if(!this.onCheck()) return;
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
        realReceiveQuantiry: item.realReceiveQuantity,
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
    console.log(detailList,this.state.id)
    this.props.dispatch({
      type: 'base/drugStorageSaveCheck',
      payload: {
        detailList,
        distributeCode: this.state.id
      },
      callback: (data) => {
        if(data.code === 200) {
          message.success('确认验收成功');
          this.queryDetail();
        }else {
          message.error(data.msg);
          message.warning('验收失败');
        };
        this.setState({checkLoading: false});
      }
    })
  }
  //校验
  /* onCheck = () => {
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
      if(!item.realReceiveQuantity){
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
  } */
  //日期批号校验
  /* valueCheck = (list) => {
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
  } */
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
      type: 'base/deliverRequest',
      payload: {
        distributeCode: this.state.id
      },
      callback: (data) => {
        if(data.unVerfiyList.length) {
          data.unVerfiyList = data.unVerfiyList.map(item => {
            item.realReceiveQuantity = item.realDeliveryQuantiry;
            return item;
          })
        };
        this.setState({
          detailInfo: data,
          loading: false,
          btnShow: data.auditStatus === 1? true : false,
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
  render(){
    let {loading, defaultActiveKey, expandedRowKeys, btnShow, detailInfo, checkLoading} = this.state;
    let {unVerfiyList, verifyList} = detailInfo;
    
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
      {
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '商品名',
        dataIndex: 'ctmmTradeName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      },
      {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 168
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
        width: 224
      },
      {
        title: '生产批号',
        dataIndex: 'productBatchNo',
        width: 168
      },
      {
        title: '生产日期',
        dataIndex: 'realProductTime',
        width: 168
      },
      {
        title: '有效期至',
        dataIndex: 'realValidEndDate',
        width: 168
      },
      {
        title: '采购方式',
        dataIndex: 'purchaseType',
        width: 112,
        render: (text) => text === 1 ? '零库存' : '自采'
      },
      {
        title: '价格',
        dataIndex: 'price',
        width: 112
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
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>配送单/验收单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.distributeCode || ''}</div>
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
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>来源部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.originDeptName || ''}</div>
              </div>
            </Col>
            </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>出库人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.createName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>出库时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>验收人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.receptionUserName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>验收时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailInfo.receptionTime || ''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <Tabs activeKey={defaultActiveKey} onChange={this.tabsChange} tabBarExtraContent={ btnShow && unVerfiyList && unVerfiyList.length? <Button loading={checkLoading} type='primary' onClick={this.saveCheck}>确认验收</Button> : null}>
            <TabPane tab="待验收" key="1">
              <Table
                bordered
                loading={loading}
                scroll={{x: '100%'}}
                columns={columns}
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
              />
            </TabPane>
            <TabPane tab="已验收" key="2">
              <Table
                loading={loading}
                bordered
                scroll={{x: '100%'}}
                columns={columns || []}
                dataSource={verifyList}
                rowKey={'key'}
                pagination={false}
              />
            </TabPane>
          </Tabs>
         
        </div>
      </div>
    )
  }
}
export default connect(state=>state.wareHouse)(PslistCheck);
