/*
 * @Author: yuwei  补登单据 - 新建入库单
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table , Select , Col, Button, Icon, Modal , InputNumber, message, Input , Row , Tooltip, Spin, Form ,DatePicker  } from 'antd';
import { Link } from 'react-router-dom';
import { supplementDoc } from '../../../../api/pharmacy/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
const Conform = Modal.confirm;
const { Option } = Select;
const { Search } = Input;
const modalColumns = [
  {
    title: '货位',
    dataIndex: 'goodsName',
    width: 112
  },
  {
    title: '货位类型',
    dataIndex: 'storeTypeName',
    width: 148
  },
  /*{
    title: '通用名称',
    dataIndex: 'ctmmGenericName',
    width: 200,
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
    width: 148,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },*/
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc',
  },
  {
    title: '包装规格',
    width: 100,
    dataIndex: 'packageSpecification',
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
    title: '批准文号',
    width: 180,
    dataIndex: 'approvalNo',
  }
]
const abnormalModalColumns = [
  {
    title: '退药入库单编号',
    dataIndex: 'hisBackNo',
    width: 170
  },
  {
    title: '退药时间',
    dataIndex: 'backDate',
    width: 200
  },
  {
    title: '药品品类数',
    dataIndex: 'drugTotal',
    width: 138
  },
  {
    title: '退药总数量',
    dataIndex: 'backTotal',
    width: 138
  },
]
class AddSupplementDocuments extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      display: 'none',
      query: {},
      selectedRowKey: [],
      spinLoading: false,
      visible: false,
      btnLoading: false, // 添加产品modal 确认
      dataSource: [],
      selected: [],  // 新建, 编辑 table 勾选
      selectedRows: [],
      modalSelectedRows: [], // 模态框内勾选
      modalSelected: [],
      data: [],//远程搜索下拉框数据内容
      fetching: false,//远程fetch搜索状态
      typeList: [],
      typeValue: '',
      addBtn: false,
      abnormalVisible: false,
      abnormalQuery: {},
      makeupCause: ''   //补登原因
    }

    this.fetchSelect = _.debounce(this.fetchSelect, 800);
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'makeup_type_in'
      },
      callback: (data) => {
        this.setState({
          typeList: data
        });
      }
    })
  }
  // 模态框表单搜索
  fetchSelect = (value) => {
    console.log('fetching user', value);
    this.setState({ data: [], fetching: true });

    this.props.dispatch({
      type:'base/SearchProductSelect',
      payload:{
        paramName:value,
        queryType:3
      },
      callback:(data)=>{
        const dataList = data.map(item => ({
           value: `${item.bigDrugCode}`,
           text: item.ctmmParam,
        }));
        this.setState({ data:dataList, fetching: false });
      }
    })
  }
  handleChange = (value) => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  }
  //模态框 - 下拉框选择后搜索
  searchTable = (value) => {
    let a = this.state.dataSource.map(item=>item.drugCode?item.drugCode:null)
    this.refs.table.fetch({
      hisDrugCodeList:[value],
      existDrugCodeList:a,//外部datasourch的drugCode
    })
  }
  //提交
  onSubmit = () => {
    const { dataSource, typeValue, makeupCause } = this.state;
    if(!makeupCause.trim()) {
      return message.warning('请输入补登原因');
    };
    let isNull = dataSource.every(item => {
      if(!item.totalQuantity) {
        message.warning('数量不能为空！');
        return false;
      };
      if(!item.lot) {
        message.warning('生产批号不能为空！');
        return false;
      };
      if(!item.productDate) {
        message.warning('生产日期不能为空！');
        return false;
      };
      if(!item.validEndDate) {
        message.warning('有效期至不能为空！');
        return false;
      };
      if(!item.supplierCode) {
        message.warning('供应商不能为空！');
        return false;
      };
      if(!item.purchaseType) {
        message.warning('采购类型不能为空！');
        return false;
      };
      return true;
    });
    if(!isNull) return;
    Conform({
      content:"是否补登入库单",
      onOk:()=>{
        const { dispatch, history } = this.props;
        let postData = {}, List = [];
        postData.makeupType = typeValue;
        dataSource.map(item =>List.push({ 
          lot: item.lot,
          productDate: item.productDate,
          totalQuantity: item.totalQuantity,
          validEndDate: item.validEndDate,
          drugCode: item.drugCode,
          purchaseType: item.purchaseType,
          supplierCode: item.supplierCode
        }));
        postData.makeupinsertlist = List;
        postData.makeupCause = makeupCause;
        console.log(postData,'postData')
        dispatch({
          type: 'base/InsertMakeup',
          payload: { ...postData },
          callback: () => {
            message.success('补登入库单成功');
            history.push({pathname:"/pharmacy/supplementDoc/supplementDocuments"})
          }
        })
      },
      onCancel:()=>{}
    })
  }
  //异常入库单提交
  onAbnormalSubmit = () => {
    const { dataSource, makeupCause } = this.state;
    if( dataSource.length === 0 ){
      return message.warning('请至少添加一条数据');
    };
    let isNull = dataSource.every(item => {
      if(!item.backDrugQty) {
        message.warning('数量不能为空！');
        return false;
      };
      if(!item.lot) {
        message.warning('生产批号不能为空！');
        return false;
      };
      if(!item.productDate) {
        message.warning('生产日期不能为空！');
        return false;
      };
      if(!item.expireDate) {
        message.warning('有效期至不能为空！');
        return false;
      };
      if(!item.locCode) {
        message.warning('货位不能为空！');
        return false;
      };
      return true;
    });
    if(makeupCause.trim() === "") {
      isNull = false;
      message.warning('请输入补登原因!');
    }
    if(!isNull) return;
    Conform({
      content:"是否补登入库单",
      onOk:()=>{
        const { dispatch, history } = this.props;
        let postData = {}, List = [];
        postData.makeupCause = makeupCause;
        dataSource.map(item =>List.push({ 
          backDrugQty: item.backDrugQty,
          backNo: item.backNo,
          dispensingNo: item.dispensingNo,
          drugCode: item.drugCode,
          expireDate: item.expireDate,
          hisDrugCode: item.hisDrugCode,
          id: item.id,
          locCode: item.locCode,
          lot: item.lot,
          productDate: item.productDate,
          supplierCode: item.supplierCode,
          unit: item.unit,
          unitCode: item.unitCode
        }));
        postData.detailList = List;
        console.log(postData,'postData')
        dispatch({
          type: 'base/confrimList',
          payload: { ...postData },
          callback: ({code, msg}) => {
            if(code === 200) {
              message.success('补登入库单成功');
              history.push({pathname:"/pharmacy/supplementDoc/supplementDocuments"});
            }else {
              message.error(msg);
            };
          }
        })
      },
      onCancel:()=>{}
    })
  }
  //补登原因
  changeMakeupCause = (e) => {
    this.setState({
      makeupCause: e.target.value
    });
  }
  //添加产品 到 主表
  handleOk = () => {
    let { modalSelectedRows } = this.state;
    if(modalSelectedRows.length === 0) {
      return message.warning('至少选择一条信息');
    }
    let { dataSource } = this.state;
    const drugCodeList = modalSelectedRows.map(item => item.drugCode);
    this.setState({
      addBtn: true
    });
    this.props.dispatch({
      type: 'base/roomMakeupDetail',
      payload: {
        drugCodeList
      },
      callback: ({code, msg, data}) => {
        if(code === 200) {
          data = data.map(item => {
            item.purchaseType = item.dictVos[0].value;
            item.supplierCode = item.supplierDataVos[0].ctmaSupplierCode;
            item.totalQuantity = 1;
            return item;
          });
          dataSource = [...dataSource, ...data];
          const existDrugCodeList = dataSource.map(item => item.drugCode);
          this.setState({ 
            dataSource, 
            visible: false, 
            modalSelected: [], 
            modalSelectedRows: [],
            addBtn: false,
            query: {
              existDrugCodeList
            }
          });
        }else {
          this.setState({
            addBtn: false,
          });
          message.error(msg);
        };
      }
    });
    // modalSelectedRows.map(item => item.totalQuantity = 1);
  }
  //添加异常入库单到主表
  handleAbnormalOk = () => {
    const { modalSelectedRows, dataSource, abnormalQuery } = this.state;
    if(modalSelectedRows.length === 0) {
      return message.warning('至少选择一条信息');
    };
    const backNoList = modalSelectedRows.map(item => item.backNo);
    console.log(backNoList);
    
    this.props.dispatch({
      type: 'base/addAbnormalDataSource',
      payload: {
        backNoList
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          let newDataSource = [];
          newDataSource = [ ...dataSource, ...data ];
          this.setState({ 
            dataSource: newDataSource, 
            abnormalVisible: false,
            abnormalQuery: {
              ...abnormalQuery,
              hisBackNo: ''
            },
            modalSelected: [], 
            modalSelectedRows: [] 
          });
        }else {
          message.error(msg);
        }
      }
    });
  }
  delete = () => {  //删除
    let { selectedRows, dataSource, query, abnormalQuery } = this.state;
    dataSource = _.difference(dataSource, selectedRows);
    let existDrugCodeList = dataSource.map((item) => item.drugCode)
    let existListNo = dataSource.map((item) => item.drugCode)
    this.setState({
      dataSource,
      selected: [],
      selectedRows: [],
      query: {
        ...query,
        existDrugCodeList
      },
      abnormalQuery: {
        ...abnormalQuery,
        existListNo
      }
    });
  }
  //单行设置datasource
  setRowInput = (val,field,index,isDate)=>{
    let ds = [...this.state.dataSource];
    if(!isDate){
      ds[index][field]=val
    }else{
      ds[index][field]=val
    }
    this.setState({dataSource:ds});
  }
  //状态下拉
  typeChange = (value) => {
    this.setState({
      typeValue: value
    });
  }
  //报溢单弹窗取消
  normalCancel = () => {
    this.setState({ 
      visible: false, 
      modalSelected: [],
      modalSelectedRows: [],
      query: {
        ...this.state.query,
        hisDrugCodeList: []
      }
    });
  }
  //异常单弹窗取消
  abnormalCancel = () => {
    this.setState({ 
      abnormalVisible: false, 
      modalSelected: [],
      modalSelectedRows: [],
      abnormalQuery: {
        ...this.state.abnormalQuery,
        hisBackNo: ''
      },
    });
  }
  //显示异常弹窗
  showAbnormalModal = () => {
    const {abnormalQuery, dataSource} = this.state;
    let existListNo = [];
    dataSource.map(item => existListNo.push(item.backNo));
    this.setState({
      abnormalVisible: true,
      abnormalQuery: {
        ...abnormalQuery,
        existListNo
      }
    });
  }
  //选择货位
  changeLoc = (locList, i, value) => {
    let index;
    locList.forEach((item, locIndex) => {
      if(value === item.locCode) {
        index = locIndex;
      };
    });
    let {dataSource} = this.state;
    dataSource = [...dataSource];
    dataSource[i].locType = locList[index].positionTypeName;
    dataSource[i].locCode = value;
    this.setState({
      dataSource
    });
  }
  render(){
    const { 
      visible, 
      dataSource, 
      query, 
      spinLoading, 
      fetching, 
      data, 
      typeList, 
      typeValue, 
      abnormalVisible, 
      abnormalQuery,
      addBtn
    } = this.state; 
    const columns = [
      {
        title: '数量',
        width: 120,
        dataIndex: 'totalQuantity',
        render:(text, record, index) =>{
          return <InputNumber
                  min={1}
                  precision={0}
                  defaultValue={text} 
                  onChange={(e)=>this.setRowInput(e, 'totalQuantity', index)}
                />
          }
      },
      {
        title: '单位',
        width: 112,
        dataIndex: 'replanUnit',
      },
      {
        title: '货位',
        width: 112,
        dataIndex: 'goodsName',
      },
      {
        title: '货位类型',
        width: 112,
        dataIndex: 'storeTypeName',
      },
      {
          title: '药品名称',
          dataIndex: 'ctmmTradeName',
          width: 350,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
    /*  {
        title: '规格',
        width: 168,
        dataIndex: 'ctmmSpecification',
      },*/
      {
        title: '生产厂家',
        width: 200,
        dataIndex: 'ctmmManufacturerName',
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '包装规格',
        width: 148,
        dataIndex: 'packageSpecification',
      },
      {
        title: '生产批号',
        width: 148,
        dataIndex: 'lot',
        render:(text,record,index) =>{
          return <Input defaultValue={text} onChange={(e)=>this.setRowInput(e.target.value,'lot',index)}/>
        }
      },
      {
        title: '生产日期',
        width: 168,
        dataIndex: 'productDate',
        render:(text,record,index) =>{
          return <DatePicker
                  allowClear={false}
                  format={'YYYY-MM-DD'}
                  disabledDate={(startValue) => {
                    if(!startValue || !record.validEndDate) {
                      return false;
                    };
                    return startValue.valueOf() > moment(record.validEndDate, 'YYYY-MM-DD').valueOf();
                  }}
                  defaultValue={text?moment(text,'YYYY-MM-DD'):null} 
                  onChange={(date,datestr)=>this.setRowInput(datestr,'productDate',index,'isDate')}
                />
        }
      },
      {
        title: '有效期至',
        width: 168,
        dataIndex: 'validEndDate',
        render:(text,record,index) =>{
          return <DatePicker
                  allowClear={false}
                  disabledDate={(endValue) => {
                    if(!endValue || !record.productDate) {
                      return false;
                    };
                    return endValue.valueOf() <= moment(record.productDate, 'YYYY-MM-DD').valueOf();
                  }}
                  format={'YYYY-MM-DD'} 
                  defaultValue={text?moment(text,'YYYY-MM-DD'):null} 
                  onChange={(date,datestr)=>this.setRowInput(datestr,'validEndDate',index,'isDate')}
                 />
        }
      },
      {
        title: '供应商',
        width: 200,
        dataIndex: 'supplierCode',
        render: (text, record) => {
          return (
            <Select
              defaultValue={text}
              placeholder="请选择"
              style={{width: '100%'}}
              onChange={value => {
                record.supplierCode = value;
              }}
            >
              {
                record.supplierDataVos.length ? record.supplierDataVos.map(item => (
                  <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                )) : null
              }
            </Select>
          )
        }
      },
      {
        title: '采购方式',
        width: 168,
        dataIndex: 'purchaseType',
        render: (text, record) => {
          return (
            <Select
              placeholder="请选择"
              style={{width: '100%'}}
              defaultValue={text}
              onChange={value => {
                record.purchaseType = value;
              }}
            >
              {
                record.dictVos.length ? record.dictVos.map(item => (
                  <Option key={item.value} value={item.value}>{item.label}</Option>
                )) : null
              }
            </Select>
          )
        }
      },
    ];
    const abnormalColumns = [
      {
        title: '数量',
        width: 120,
        dataIndex: 'backDrugQty',
        render:(text, record, index) =>{
          return <InputNumber
                  min={1}
                  precision={0}
                  defaultValue={text} 
                  onChange={(value) => {
                    record.backDrugQty = value;
                  }}
                />
          }
      },
      {
        title: '单位',
        width: 112,
        dataIndex: 'unit',
      },
      {
        title: '货位',
        width: 168,
        dataIndex: 'targLocList',
        render: (text, record, i) => (
          <Select
            style={{width: '100%'}}
            onChange={this.changeLoc.bind(this, text, i)}
          >
            {
              text.map(item => (
                <Option key={item.locCode} value={item.locCode}>{item.locName}</Option>
              ))
            }
          </Select>
        )
      },
      {
        title: '货位类型',
        width: 168,
        dataIndex: 'locType',
      },
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
        width: 168,
        dataIndex: 'ctmmSpecification',
      },*/
      {
        title: '生产厂家',
        width: 200,
        dataIndex: 'ctmmManufacturerName',
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '生产批号',
        width: 148,
        dataIndex: 'lot',
        render:(text,record,index) =>{
          return <Input defaultValue={text} onChange={(e)=>this.setRowInput(e.target.value,'lot',index)}/>
        }
      },
      {
        title: '生产日期',
        width: 168,
        dataIndex: 'productDate',
        render:(text,record,index) =>{
          return <DatePicker 
                  format={'YYYY-MM-DD'}
                  disabledDate={(startValue) => {
                    if(!startValue || !record.expireDate) {
                      return false;
                    };
                    return startValue.valueOf() > moment(record.expireDate, 'YYYY-MM-DD').valueOf();
                  }}
                  defaultValue={text?moment(text,'YYYY-MM-DD'):null} 
                  onChange={(date,datestr)=>this.setRowInput(datestr,'productDate',index,'isDate')}
                />
        }
      },
      {
        title: '有效期至',
        width: 168,
        dataIndex: 'expireDate',
        render:(text,record,index) =>{
          return <DatePicker
                  disabledDate={(endValue) => {
                    if(!endValue || !record.productDate) {
                      return false;
                    };
                    return endValue.valueOf() <= moment(record.productDate, 'YYYY-MM-DD').valueOf();
                  }}
                  format={'YYYY-MM-DD'} 
                  defaultValue={text?moment(text,'YYYY-MM-DD'):null} 
                  onChange={(date,datestr)=>this.setRowInput(datestr,'expireDate',index,'isDate')}
                 />
        }
      },
      {
        title: '供应商',
        width: 168,
        dataIndex: 'supplierName',
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
    ];
    let rowKey = "";
    if(typeValue === "1") {
      rowKey = "drugCode";
    };
    if(typeValue === "4") {
      rowKey = "backNo";
    };
    return (
    <Spin spinning={spinLoading} size="large">
      <div className="fullCol" style={{ padding: 24, background: '#f0f2f5' }}>
        <div className="fullCol-fullChild" style={{margin: '-9px -24px 0'}}>
          <Row style={{borderBottom: '1px solid rgba(0, 0, 0, .1)', marginBottom: 10}}>
            <Col span={8}>
              <h2>补登入库单</h2>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => this.props.history.go(-1)}><Icon type="close" style={{ fontSize: 26, marginTop: 8 }} /></span>
            </Col>
          </Row>
          <Row gutter={30} style={{ marginTop: 10 }}>
            <Col span={6}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>
                  <Select 
                    style={{width: '100%'}}
                    placeholder="请选择类型"
                    onChange={this.typeChange}
                    disabled = {dataSource.length > 0}
                  >
                    {
                      typeList.filter(item => item.value !== "").map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
            </Col>
            <Col 
              style={{
                height: 40,
                lineHeight: '40px'
              }}
              span={6}
            >
              <Input onChange={this.changeMakeupCause} placeholder="请输入补登原因"/>
            </Col>
            <Col 
              style={{
                height: 40,
                lineHeight: '40px'
              }}
              span={6}
            >
              {
                typeValue === "1" ? 
                [
                  <Button key={1} type='primary' className='button-gap' onClick={()=>{
                    if(this.refs.table){
                      let existDrugCodeList = [];
                      dataSource.map(item => existDrugCodeList.push(item.drugCode));
                      this.refs.table.fetch({ ...query, existDrugCodeList });
                    }
                    this.setState({visible: true});
                  }}>
                    添加产品
                  </Button>,
                  <Button key={2} onClick={this.delete} >移除</Button>
                ] : null
              }
              {
                typeValue === "4" ? 
                [
                  <Button
                    key={1}
                    type='primary' 
                    className='button-gap' 
                    onClick={this.showAbnormalModal}
                  >
                    选择异常退药入库单
                  </Button>,
                  <Button key={2} onClick={this.delete} >移除</Button>
                ]
                 : null
              }
            </Col>
          </Row>
          </div>
          <div className='detailCard' style={{margin: '-12px -8px -5px', minHeight: 'calc(100vh - 160px)'}}>
            <Table
              pagination={false}
              dataSource={dataSource}
              title={()=>'产品信息'}
              bordered
              scroll={{x: '100%'}}
              columns={typeValue === "1" ? columns : abnormalColumns}
              rowKey={rowKey}
              style={{marginTop: 24}}
              rowSelection={{
                selectedRowKeys: this.state.selected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({ selected: selectedRowKeys, selectedRows })
                }
              }}
            />
            {
              dataSource.length === 0 ? null : 
              <Row>
                <Col style={{ textAlign: 'right', padding: '10px' }}>
                  <Button 
                    onClick={typeValue === "1" ? this.onSubmit : this.onAbnormalSubmit}
                    type='primary' 
                    style={{ marginRight: 8 }}
                  >
                    确定
                  </Button>
                  <Button type='primary' ghost>
                    <Link to={{pathname:`/pharmacy/supplementDoc/supplementDocuments`}}>取消</Link>
                  </Button>
                </Col>
              </Row>
            }
          </div>
          {/*选择产品-弹窗*/}
          <Modal 
            bordered
            title={'添加产品'}
            visible={visible}
            width={1200}
            destroyOnClose
            style={{ top: 20 }}
            onCancel={this.normalCancel}
            footer={[
              <Button loading={addBtn} key="submit" type="primary" onClick={this.handleOk}>确认</Button>,
              <Button key="back" onClick={this.normalCancel}>取消</Button>
            ]}
          >
            <Row gutter={30}>
              <Col span={8}>
                <Select
                  showSearch
                  showArrow={false}
                  placeholder="药品名称"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchSelect}
                  onChange={this.handleChange}
                  onSelect={this.searchTable}
                  style={{ width: '100%'}}
                >
                  {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                </Select>
              </Col>  
            </Row>
            <RemoteTable
              query={query}
              ref="table"
              isJson={true}
              style={{marginTop: 20}}
              url={supplementDoc.addlist}
              scroll={{x: '100%'}}
              columns={modalColumns}
              rowKey={'drugCode'}
              rowSelection={{
                selectedRowKeys: this.state.modalSelected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({ modalSelected: selectedRowKeys, modalSelectedRows: selectedRows })
                }
              }}
            />
          </Modal>
          {/*选择异常退药入库单 - 弹窗*/}
          <Modal 
            bordered
            title={'异常退药入库单号'}
            visible={abnormalVisible}
            width={1200}
            style={{ top: 20 }}
            destroyOnClose
            onCancel={this.abnormalCancel}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleAbnormalOk}>确认</Button>,
              <Button key="back" onClick={this.abnormalCancel}>取消</Button>
            ]}
          >
            <Row gutter={30}>
              <Col span={8}>
                <Search 
                  placeholder="请输入退药入库单号搜索"
                  onSearch={(value) => {
                    this.setState({
                      abnormalQuery: {
                        ...this.state.abnormalQuery,
                        hisBackNo: value
                      }
                    });
                  }}
                />
              </Col>  
            </Row>
            <RemoteTable
              query={abnormalQuery}
              isJson={true}
              url={supplementDoc.addMedHisBackList}
              scroll={{x: '100%'}}
              style={{marginTop: 20}}
              columns={abnormalModalColumns}
              rowKey={'backNo'}
              rowSelection={{
                selectedRowKeys: this.state.modalSelected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({ modalSelected: selectedRowKeys, modalSelectedRows: selectedRows })
                }
              }}
            />
          </Modal>
      </div>
    </Spin>
    )
  }
}
export default connect(state => state)(Form.create()(AddSupplementDocuments));