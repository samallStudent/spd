/**
 * @file 药库 - 盘点损益 - 新建盘点 - 详情(待确认)
 */
import React, { PureComponent } from 'react';
import {Row, Col, Input, Button, message, Tooltip, DatePicker, InputNumber} from 'antd';
import {checkDecrease} from '../../../../api/checkDecrease';
import RetomeTable from '../../../../components/TableGrid';
import {connect} from 'dva';
import moment from 'moment';
import {difference} from 'loadsh';
const {Search} = Input;
const monthFormat = 'YYYY-MM-DD';
class Details extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      query: {
        checkBillNo: this.props.match.params.id,
      },
      tableLoading: false,
      checkLoading: false,
      dataSource: [],   
      selected: [],
      selectedRows: [],
      submitLoading: false,
      expandedRowKeys: [],    //展开key
      first: true,    //是否第一次渲染
    }
  }
  componentDidMount() {
    this.getDetail();
  }
  //获取详情表头
  getDetail = (cb) => {
    this.props.dispatch({
      type: 'checkDecrease/getCheckbill',
      payload: {
        checkBillNo: this.props.match.params.id
      },
      callback: (data) => {
        if(data.msg === 'success') {
          this.setState({
            info: data.data
          }, cb);
        }else {
          message.error(data.msg);
          message.error('获取详情头部失败！');
        }
      }
    });
  }
  //校验
  onCheck = () => {
    let {selectedRows} = this.state;
    selectedRows = this.seekChildren(selectedRows).realSelectedRows;  //包含children的二维数组
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
    let isNull = includeChildren.every(item => {   //是否为空
      if(!item.practicalRepertory) {
        if(item.practicalRepertory === 0) {
          return true;
        };
        message.error('实际库存不能为空');
        return false;
      };
      if(!item.practicalBatch) {
        message.error('实际批号不能为空');
        return false;
      };
      if(!item.realProductTime) {
        message.error('实际生产日期不能为空');
        return false;
      };
      if(!item.validEndTime) {
        message.error('实际有效期至不能为空');
        return false;
      };
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
    b = a.map(item=>item.practicalBatch);
    b = [...new Set(b)];
    var c = [];
    for (let i = 0; i < b.length; i++) {
      c[i] = a.filter(item => item.practicalBatch === b[i]);
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
      if(list[i].realProductTime === list[i + 1].realProductTime && list[i].validEndTime === list[i + 1].validEndTime) {
        return true;
      };
      return false;
    });
    return a;
  }
  // 提交
  confirm = () => {
    let {selectedRows} = this.state;
    if(selectedRows.length === 0) {
      return message.warning('至少选择一条数据');
    };
    
    if(!this.onCheck()) return;
    this.setState({
      submitLoading: true
    });
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
    let detailList = includeChildren.map(item => {
      return {
        accountBatchNo: item.accountBatchNo,
        accountEndTime: item.accountEndTime,
        accountProductTime: item.accountProductTime,
        accountStoreNum: item.accountStoreNum,
        bigDrugCode: item.bigDrugCode,
        drugCode: item.drugCode,
        id: item.id,
        locCode: item.locCode,
        pId: item.pId,
        practicalBatch: item.practicalBatch,
        practicalRepertory: item.practicalRepertory,
        realProductTime: item.realProductTime,
        referencePrice: item.referencePrice,
        unitCode: item.unitCode,
        validEndTime: item.validEndTime,
        supplierCode: item.supplierCode
      }
    });
    this.props.dispatch({
      type: 'checkDecrease/submitCheck',
      payload: {
        detailList,
        checkBillNo: this.props.match.params.id,
      },
      callback: (data) => {
        if(data.msg === 'success') {
          message.success('提交成功');
          this.getDetail();
          this.refs.table.fetch(this.state.query);
        }else {
          message.error('提交失败');
          message.error(data.msg);
        };
        this.setState({
          submitLoading: false
        });
      }
    })
  }
  // 盘点
  check = () => {
    this.setState({checkLoading: true});
    this.props.dispatch({
      type: 'checkDecrease/beginCheck',
      payload: {
        checkBillNo: this.props.match.params.id
      },
      callback: (data) => {
        if(data.msg === 'success') {
          message.success('盘点成功');
          this.getDetail();
          this.refs.table.fetch(this.state.query);
        }else {
          message.warning('盘点失败');
          message.error(data.msg);
        };
        this.setState({
          checkLoading: false
        });
      }
    })
  }
  //新增批号 - 后端
  createBatchNo = (record) => {
    this.props.dispatch({
      type: 'checkDecrease/createBatchNo',
      payload: {
        id: record.id
      },
      callback: (data) => {
        if(data.msg === 'success') {
          this.refs.table.fetch(this.state.query);
        }else {
          message.warning('新增失败');
          message.error(data.msg);
        };
      }
    })
  }
  //新增批号 - 前端
  addBatch = (record, i) => {
    let {dataSource, expandedRowKeys, selected} = this.state;
    dataSource[i].children = dataSource[i].children || [];
    let uuid = new Date().getTime()
    dataSource[i].children.push({
      ...record,
      uuid,
      children: null,
      pId: record.id,
      accountBatchNo: null,
      id: null,
      accountProductTime: null,
      accountEndTime: null,
      accountStoreNum: 0,
      practicalRepertory: 0
    });
    expandedRowKeys.push(record.uuid); //添加默认展开
    expandedRowKeys = [...new Set(expandedRowKeys)];    //展开去重
    let isSelect = selected.some(item => {
      if(item === record.uuid) {
        return true;
      };
      return false;
    });
    if(isSelect) {
      selected.push(uuid);
    }
    this.setState({
      dataSource: [...dataSource],
      expandedRowKeys: [...expandedRowKeys],
      selected: [...selected]
    })
  }
  //删除批号
  removeBatch = (record, i) => {
    let {dataSource} = this.state;
    let index;
    dataSource.map((item, totalNum)=>{
      if(record.pId === item.id) {
        index = totalNum;
      };
      return item;
    });
    dataSource[index].children = dataSource[index].children.filter(item => item.uuid !== record.uuid);
    this.setState({
      dataSource: [...dataSource]
    });
  }
  onSearch = (value) => {
    let {query} = this.state;
    query.paramName = value;
    this.setState({
      query: {...query}
    });
  }
  //table回调
  tableCallBack = (data) => {
    this.setTableData(data);
  }
  setTableData = (data) => {
    let {info} = this.state;
    if(info.checkStatus === 2) {
      data = data.map((item, i)=>{
        item.practicalRepertory = item.accountStoreNum;
        item.validEndTime = item.accountEndTime;
        item.realProductTime = item.accountProductTime;
        item.practicalBatch = item.accountBatchNo;
        return item;
      })
    };
    this.setState({
      dataSource: data,
      tableLoading: false,
      first: false
    });
  }
  //更改日期
  changeDataSource = (value, i, key, record) => {
    let {dataSource} = this.state;
    if(!record.id) {
      let index;
      dataSource.map((item, pIndex)=>{
        if(item.id === record.pId) {
          index = pIndex
        };
        return item;
      });
      dataSource[index].children[i][key] = value;
    }else {
      dataSource[i][key] = value;
    };
    
    this.setState({
      dataSource: [...dataSource]
    });
  }
  //更改批号
  changePracticalBatch = (e, i, key, record) => {
    let {dataSource} = this.state;
    if(!record.id) {
      let index;
      dataSource.map((item, pIndex)=>{
        if(item.id === record.pId) {
          index = pIndex
        };
        return item;
      });
      dataSource[index].children[i][key] = e.target.value;
    }else {
      dataSource[i][key] = e.target.value;
    };
    this.setState({
      dataSource: [...dataSource]
    });
  }
  //更改实际数量
  changePracticalRepertory = (value, i, record) => {
    let {dataSource} = this.state;
    if(!record.id) {
      let index;
      dataSource.map((item, pIndex)=>{
        if(item.id === record.pId) {
          index = pIndex
        };
        return item;
      });
      dataSource[index].children[i].practicalRepertory = value;
      if(typeof value === 'number') {
        let checkNum = value - dataSource[index].children[i].accountStoreNum;
        let mount = checkNum * dataSource[index].children[i].referencePrice
        dataSource[index].children[i].checkNum = checkNum;
        dataSource[index].children[i].mount = mount.toFixed(4);
      };
      this.setState({
        dataSource: [...dataSource]
      });
    }else {
      dataSource[i].practicalRepertory = value;
      if(typeof value === 'number') {
        let checkNum = value - dataSource[i].accountStoreNum;
        let mount = checkNum * dataSource[i].referencePrice
        dataSource[i].checkNum = checkNum;
        dataSource[i].mount = mount.toFixed(4);
      };
      this.setState({
        dataSource: [...dataSource]
      });
    }
  }
  //展开
  onExpandedRowsChange = (expandedRows) => {
    this.setState({expandedRowKeys: expandedRows});
  }
  //选中
  changeSelect = (selectedRows, isSelect) => {
    let {selected} = this.state;
    let children = selectedRows.children;
    if(isSelect) {  //选中
      selected.push(selectedRows.uuid);
      if(children && children.length) {
        children.map(item=>{
          selected.push(item.uuid);
          return item;
        });
      }
    }else {
      selected = difference(selected, [selectedRows.uuid]);
      if(children && children.length) {
        let childrenSelect = children.map(item=>item.uuid);
        selected = difference(selected, childrenSelect);
      }
    };
    this.setState({
      selected: [...selected]
    })
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
  //寻找全选时的children
  seekChildren = (selectedRows) => {
    let {dataSource} = this.state;
    let realSelectedRowsKey = selectedRows.map(item=>item.uuid);
    let realSelectedRows = [];
    for (let i = 0; i < selectedRows.length; i++) {
      for (let j = 0; j < dataSource.length; j++) {
        if(dataSource[j].uuid === selectedRows[i].uuid) {
          realSelectedRows.push(dataSource[j]);
          if(dataSource[j].children && dataSource[j].children.length) {
            let childrenUuid = dataSource[j].children.map(childItem=>childItem.uuid)
            realSelectedRowsKey = [...realSelectedRowsKey, ...childrenUuid]
          }
        }
      }
    };
    return {
      realSelectedRowsKey,
      realSelectedRows
    };
  }
  //表格渲染
  tableRender = (columns) => {
    let {info, tableLoading, query, dataSource, expandedRowKeys} = this.state;
    if(info.checkStatus && info.checkStatus === 2) {
      return <RetomeTable
              loading={tableLoading}
              fetchBefore={()=>{
                this.setState({
                  tableLoading: true
                });
              }}
              ref={'table'}
              query={query}
              data={dataSource}
              url={checkDecrease.GET_LIST_BY_BILLNO}
              scroll={{x: 2800}}
              columns={columns}
              rowKey={'uuid'}
              expandedRowKeys={expandedRowKeys}
              cb={this.tableCallBack}
              onExpandedRowsChange={this.onExpandedRowsChange}
              rowSelection={{
                selectedRowKeys: this.state.selected,
                onChange: this.changeSelectRow,
                onSelect: this.changeSelect,
                onSelectAll: this.selectAll,
                getCheckboxProps: record => ({
                  disabled: record.id === null || record.checkDetailStatus === 2
                })
              }}
            />
    };
    if(info.checkStatus && info.checkStatus !== 2) {
      return <RetomeTable
              ref={'table'}
              query={query}
              url={checkDecrease.GET_LIST_BY_BILLNO}
              scroll={{x: 2800}}
              columns={columns}
              rowKey={'uuid'}
             />
    };
    return null;
  }
  //打印
  print = () => {
    const {checkBillNo} = this.state.query;
    window.open(`${checkDecrease.CHECK_BILL_PRINT}?checkBillNo=${checkBillNo}`)
  }
  render() {
    let {info, submitLoading, checkLoading} = this.state;
    let columns = [
      {
        title: '货位',
        dataIndex: 'locName',
        width: 112
      },
      {
        title: '货位类型',
        dataIndex: 'positionTypeName',
        width: 168
      },
      {
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        width: 168
      },
      {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 60
      },
      {
        title: '账面库存',
        dataIndex: 'accountStoreNum',
        width: 112
      },
      {
        title: '实际数量',
        dataIndex: 'practicalRepertory',
        width: 140,
        render:(text, record, i)=>{
          return info.checkStatus === 2 && record.checkDetailStatus === 1?
                 <InputNumber
                  style={{width: '100%'}}
                  onChange={(value) => {
                    this.changePracticalRepertory(value, i, record);
                  }}
                  min={0}
                  defaultValue={text} 
                  placeholder="请输入实际数量"
                  precision={0}
                 /> : text
        },
      },
      {
        title: '盈亏数量',
        dataIndex: 'checkNum', 
        render: (text, record) => text? text : 0,
        width: 112
      },
      {
        title: '账面批号',
        dataIndex: 'accountBatchNo',
        width: 168
      },
      {
        title: '实际批号',
        dataIndex: 'practicalBatch',
        render: (text, record, i) => {
          return info.checkStatus === 2 && record.checkDetailStatus === 1? 
                 <Input
                  onChange={(value) => {
                    this.changePracticalBatch(value, i, 'practicalBatch', record);
                  }}
                  defaultValue={text}
                  placeholder="请输入实际批号" 
                 /> : text
        },
        width: 180
      },
      {
        title: '生产日期',
        dataIndex: 'accountProductTime',
        width: 168
      },
      {
        title: '实际生产日期',
        dataIndex: 'realProductTime',
        render: (text, record, i) => {
          return info.checkStatus === 2 && record.checkDetailStatus === 1? 
                 <DatePicker
                  disabledDate={(stareTime)=>{
                    return stareTime.valueOf() > moment(record.validEndTime).valueOf();
                  }}
                  onChange={(moment, value) => {
                    this.changeDataSource(value, i, 'realProductTime', record);
                  }}
                  defaultValue={moment(text, monthFormat)}
                  placeholder="请输入实际生产日期" 
                 /> : text
        },
        width: 200
      },
      {
        title: '有效期至',
        dataIndex: 'accountEndTime',
        width: 168
      },
      {
        title: '实际有效期至',
        dataIndex: 'validEndTime',
        render: (text, record, i) => {
          return info.checkStatus === 2 && record.checkDetailStatus === 1? 
                 <DatePicker
                  disabledDate={(endTime)=>{
                    return endTime.valueOf() <= moment(record.realProductTime).valueOf();
                  }}
                  onChange={(Moment, value) => {
                    this.changeDataSource(value, i, 'validEndTime', record);
                  }}
                  defaultValue={moment(text, monthFormat)} 
                  placeholder="请输入实际有效期至" 
                 /> : text
        },
        width: 200
      },
      {
        title: '单价',
        dataIndex: 'referencePrice',
        width: 112
      },
      {
        title: '盈亏金额',
        dataIndex: 'mount',
        width: 112
      },
    ];
    if(info.checkStatus === 2) {
      columns.push({
        title: '操作',
        dataIndex: 'action', 
        width: 100,
        render: (text, record, i) => {
          if(record.id && record.checkDetailStatus === 1) {
            return <a onClick={()=>{
                      this.addBatch(record, i)
                    }}>新增批号
                   </a>
          }else if(record.checkDetailStatus === 1){
            return <a onClick={()=>{
                        this.removeBatch(record, i);
                      }}>删除
                   </a>
          };
          return null;
        }
      })
    };
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <Row>
            <Col span={12}>
              <h2>盘点单: <span>{info.checkBillNo || ''}</span></h2>
            </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                {
                  info.checkStatus === 1 ?
                  <Button loading={checkLoading} type='primary' style={{marginRight: 10}} onClick={this.check}>盘点</Button> : null
                }
                {
                  info.checkStatus === 5 ?
                  <Button icon='printer' style={{marginRight: 10}} onClick={this.print}>打印</Button> : null
                }
              </Col> 
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkStatusName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkBillTypeName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkBillDeptName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>制单人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>制单时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>起始时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkStartTime || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>盘点时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkTime || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>提交时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkEndTime || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>备注</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.remarks || ''}</div>
              </div>
            </Col>
          </Row>
           <div style={{borderBottom: '1px dashed #d9d9d9', marginBottom: 10}}></div>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-4">
                <label>名称</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18" style={{ marginLeft: -30 }}>
                <div className='ant-form-item-control'>
                  <Search onSearch={this.onSearch} placeholder={'通用名称/商品名称'} />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <Row>
            <Col span={12}>
              <span style={{margin: 0, fontSize: 16, lineHeight: '32px'}}>产品信息</span>
            </Col>
            {
              info.checkStatus === 2 ? 
              <Col style={{textAlign: 'right'}} span={12}>
                <Button loading={submitLoading} className='button-gap' onClick={this.confirm} >提交</Button>
              </Col> : null
            }
          </Row>
          <hr className="hr"/>
          {this.tableRender(columns)}
        </div>
      </div>
    )
  }
}
export default connect()(Details);