/*
 * @Author: yuwei  新建出库新建 /output/add
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import {Table, Col, Button, Modal, Icon, message, Input, InputNumber, Select, Row, Tooltip} from 'antd';
import {connect} from 'dva';
import RemoteTable from '../../../../components/TableGrid/index';
import {outStorage} from '../../../../api/drugStorage/outStorage';
import _ from 'lodash';
const Option = Select.Option;
const {Search} = Input;

const modalColumns = [
  /*{
    title: '通用名',
    width: 200,
    dataIndex: 'ctmmGenericName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },*/
  {
    title: '药品名称',
    width: 200,
    dataIndex: 'ctmmTradeName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
 /* {
    title: '规格',
    width: 148,
    dataIndex: 'ctmmSpecification',
  },*/
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc',
  },
  {
    title: '包装规格',
    width: 148,
    dataIndex: 'packageSpecification',
  },
  {
    title: '生产批号',
    width: 138,
    dataIndex: 'lot',
  },
  {
    title: '生产日期',
    width: 118,
    dataIndex: 'productDate'
  },
  {
    title: '有效期至',
    width: 118,
    dataIndex: 'validEndDate'
  },
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
    title: '批准文号',
    width: 200,
    dataIndex: 'approvalNo',
  }
];
class AddOutput extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      selectedRowKeyModal: [],
      selectedRowModal: [],
      selectedRow: [],
      visible: false,
      dataSource: [],
      dept: [],
      query: {},
      submitLoading: false,
      deptCode: undefined
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'base/findAllDeptsAndType',
      callback: (data) => {
        data = data.filter(item => item.key === 2);
        this.setState({
          dept: data,
        });
      }
    })
  }

  //移除
  delete = () =>{
    let {selectedRow, dataSource} = this.state;
    if(selectedRow.length === 0) {
      message.warning('请选择产品');
      return;
    };
    dataSource = _.difference(dataSource, selectedRow);
    this.setState({dataSource, selectedRowKeys: []});
  }

  //提交该出库单
  onSubmit = () =>{
    let {dataSource, deptCode} = this.state;
    if(deptCode === undefined) {
      message.warning('请选择部门和类型');
      return;
    };
    let isNull = dataSource.every(item => {
      if(!item.outStoreNum) {
        message.warning('请输入数量');
        return false;
      }
      return true;
    });
    if(!isNull) return;
    this.setState({submitLoading: true});
    let listDetail = dataSource.map(item=>{
      return {
        batchNo: item.batchNo,
        drugCode: item.drugCode,
        outStoreNum: item.outStoreNum
      }
    })
    this.props.dispatch({
      type: 'base/confirmOutStore',
      payload: {
        detail: {
          deptCode,
          outStoreType: '2',
          listDetail
        }
      },
      callback: () => {
        this.setState({
          submitLoading: false
        });
        this.props.history.push('/pharmacy/outStorage/baseReplen');
      }
    })
  }

  showModal = () => {
    let {dataSource, deptCode} = this.state;
    if(deptCode === undefined || deptCode === '') {
      return message.warning('请选择接收部门');
    };
    let listDetail = dataSource.map(item=>{
      return {
        lot: item.lot,
        drugCode: item.drugCode
      }
    });
    this.setState({
      visible: true, 
      query: {
        detail: {
          listDetail,
          paramName: '',
          deptCode
        }
      }
    });
  }

  //添加产品 到 主表
  addToMain = () => {
    let { selectedRowModal, dataSource } =this.state;
    console.log(selectedRowModal);
    
    if(selectedRowModal.length === 0){
      message.warn('最少选择一个产品添加！')
      return;      
    }
    selectedRowModal = selectedRowModal.map((item)=>{
      return {
        ...item,
        outStoreNum: item.usableQuantity,
      };
    })
    dataSource = [...dataSource, ...selectedRowModal];
    this.setState({
      visible:false, 
      selectedRowModal:[],
      dataSource,
      selectedRowKeyModal:[]
    })
  }

  deptChange = (value) => {
    this.setState({
      deptCode: value
    });
  }
  
  render(){
    const columns = [
      {
        title: '数量',
        width: 120,
        dataIndex: 'outStoreNum',
        render:(text, record, i)=>(
          <InputNumber 
            defaultValue={text}
            min={1}
            max={record.usableQuantity}
            precision={0}
            onChange={(value)=>{
              let {dataSource} = this.state;
              dataSource = JSON.parse(JSON.stringify(dataSource));
              dataSource[i].outStoreNum = value;
              this.setState({dataSource});
            }}
          />
        )
      },
      {
        title: '当前库存',
        width: 100,
        dataIndex: 'usableQuantity',
      },
      {
        title: '基数药库存',
        width: 100,
        dataIndex: 'baseStoreNum',
      },
      {
        title: '库存基数',
        width: 100,
        dataIndex: 'baseNum',
      },
      {
        title: '单位',
        width: 100,
        dataIndex: 'replanUnit',
      },
     /* {
        title: '通用名',
        width: 168,
        dataIndex: 'ctmmGenericName'
      },*/
      {
        title: '药品名称',
        width: 350,
        dataIndex: 'ctmmTradeName',
      },
     /* {
        title: '规格',
        width: 148,
        dataIndex: 'ctmmSpecification',
      },*/
      {
        title: '剂型',
        width: 90,
        dataIndex: 'ctmmDosageFormDesc',
      },
      {
        title: '包装规格',
        width: 148,
        dataIndex: 'packageSpecification',
      },
      {
        title: '生产批号',
        width: 138,
        dataIndex: 'lot',
      },
      {
        title: '生产日期',
        width: 118,
        dataIndex: 'productDate'
      },
      {
        title: '有效期至',
        width: 118,
        dataIndex: 'validEndDate'
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
        title: '批准文号',
        width: 200,
        dataIndex: 'approvalNo',
      }
    ];
    let {visible, selectedRowKeyModal, dataSource, dept, query, submitLoading, selectedRowKeys} = this.state; 
    dept = dept.map((item, i) => {
      return <Option key={i} value={item.id}>{item.deptName}</Option>
    });
    return (
      <div className='fullCol' style={{padding: '0 24px 24px', background: 'rgb(240, 242, 245)'}}>
        <div className='fullCol-fullChild' style={{marginLeft: '-24px', marginRight: '-24px', marginTop: 0}}>
          <Row style={{margin: '0 -32px', borderBottom: '1px solid rgba(0, 0, 0, .2)'}}>
            <Col span={8}>
              <h3 style={{padding: '0 0 15px 32px', fontSize: '20px'}}>
                新建出库单
              </h3>
            </Col>
            <Col span={16} style={{textAlign: 'right', paddingRight: 32}}>
              <Icon 
                onClick={()=>{
                  this.props.history.go(-1);
                }} 
                style={{cursor: 'pointer', transform: 'scale(2)'}} 
                type="close" 
                theme="outlined" 
              />
            </Col>
          </Row>
          <Row style={{margin: '10px -32px 0', paddingBottom: 10}}>
            <Col span={4} style={{paddingLeft: 32}}>
              <Button type='primary' className='button-gap' onClick={this.showModal}><Icon type="plus" theme="outlined" />添加产品</Button>
              <Button onClick={()=>this.delete()} >移除</Button>
            </Col>
            <Col span={6}>
                接收部门：
                <Select
                  disabled={dataSource.length !== 0}
                  onChange={this.deptChange}
                  style={{width:'70%'}}
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                  {dept}
                </Select>
            </Col>
            {/* <Col span={6}>
              出库类型：
                <Select
                  disabled
                  value={outStoreType}
                  style={{width:'70%'}}
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                  {type}
                </Select>
            </Col> */}
          </Row>
        </div>
        <div className='detailCard' style={{margin: '-10px -6px -6px'}}>
          <h3 style={{paddingBottom: 10, borderBottom: '1px solid rgba(0, 0, 0, .1)'}}>产品信息</h3>
          <Table
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              onChange:(selectedRowKey, selectedRow)=>{
                this.setState({selectedRow, selectedRowKeys: selectedRowKey})
              }
            }}
            bordered
            dataSource={dataSource}
            pagination={{size: 'small'}}
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'batchNo'}
            style={{
              marginTop: 24,
              minHeight: `calc(100vh - ${dataSource.length ? 300 : 252}px)`
            }}
          />
          {
            dataSource.length > 0? 
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 16
              }}
            >
              <span>共{dataSource.length}种产品</span>
              <div>
                <Button 
                  loading={submitLoading} 
                  type="primary" 
                  className='button-gap' 
                  onClick={this.onSubmit}
                >
                  确定
                </Button>
                <Button 
                  loading={submitLoading}
                  onClick={() => {
                    this.props.history.go(-1);
                  }}
                >
                  取消
                </Button>
              </div>
            </div> : null
          }
        </div>
        {/*选择产品-弹窗*/}
        <Modal title='选择页面' visible={visible} width={980}
          onOk={()=>this.addToMain()}
          onCancel={()=>this.setState({visible:false, selectedRowKeyModal:[], selectedRowModal: []})}>
          <Row style={{marginBottom: 10}}>
            <Search 
              onSearch={(value) => {
                let {query} = this.state;
                query = JSON.parse(JSON.stringify(query));
                query.detail.paramName = value;
                this.setState({query});
              }}  
              placeholder='药品名称'
              style={{width:200}}
            />
          </Row>
          <RemoteTable
            isJson={true}
            query={query}
            url={outStorage.GETFILTERDRUGINFO}
            rowSelection={{
              selectedRowKeys: selectedRowKeyModal,
              onChange:(selectedRowKeyModal, selectedRowModal)=>{
                this.setState({selectedRowKeyModal, selectedRowModal});
              }
            }}
            scroll={{x: '100%'}}
            columns={modalColumns}
            rowKey={'batchNo'}
          />
        </Modal>
      </div>
    )
  }
}
export default connect(state=>state)(AddOutput);