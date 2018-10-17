/*
 * @Author: yuwei  退货新建 /refund/add
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table , Col, Button, Icon, Modal , message, Input , Row , Tooltip, Spin, Form, Select } from 'antd';
import { outStorage } from '../../../../api/drugStorage/outStorage';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import _ from 'lodash';
import { connect } from 'dva';
const FormItem = Form.Item;
const Conform = Modal.confirm;
const {Option} = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },//5
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },//17
  },
}
const formRemarkLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },//5
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },//17
  },
}
const columns = [
  {
   title: '部门',
   width: 168,
   dataIndex: 'deptName',
  },
  {
    title: '库存数量',
    width: 112,
    dataIndex: 'usableQuantity',
  },
  {
    title: '单位',
    width: 60,
    dataIndex: 'unit',
  },
  {
    title: '通用名称',
    width: 168,
    dataIndex: 'ctmmGenericName',
  },
  {
    title: '商品名称',
    width: 224,
    dataIndex: 'ctmmTradeName',
  },
  {
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
  },
  {
    title: '剂型',
    width: 168,
    dataIndex: 'ctmmDosageFormDesc',
	},
	{
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '生产批号',
    dataIndex: 'lot',
    width: 168,
  },
  {
    title: '生产日期',
    dataIndex: 'productDate',
    width: 168,
  },
  {
    title: '有效期至',
    dataIndex: 'validEndDate',
    width: 168,
  },
  {
    title: '批准文号',
    dataIndex: 'approvalNo',
    width: 224,
  },
  {
    title: '生产厂家',
    dataIndex: 'ctmmManufacturerName',
    width: 224,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '供应商',
    width: 224,
    dataIndex: 'supplierName',
  }
];
const modalColumns = [
  
  {
    title: '通用名称',
    dataIndex: 'ctmmGenericName',
    width: 168,
  },
  {
    title: '规格',
    dataIndex: 'ctmmSpecification',
    width: 168,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '入库单号',
    width: 280,
    dataIndex: 'inStoreCode',
  },
  {
    title: '生产批号',
    dataIndex: 'lot',
    width: 168,
  },
  {
    title: '生产日期',
    dataIndex: 'productDate',
    width: 168,
  },
  {
    title: '有效期至',
    dataIndex: 'validEndDate',
    width: 168,
  },
  {
    title: '剂型',
    dataIndex: 'ctmmDosageFormDesc',
    width: 168,
  },
  {
    title: '包装单位',
    width: 168,
    dataIndex: 'packageSpecification',
  },
  {
    title: '批准文号',
    dataIndex: 'approvalNo',
    width: 224,
  },
  {
    title: '生产厂家',
    dataIndex: 'ctmmManufacturerName',
    width: 224,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '供应商',
    dataIndex: 'supplierName',
    width: 224,
  }
];
class RemarksForm extends PureComponent{
  state = {
    recallReason: [],
    remarks: ''
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'recall_reason'
      },
      callback: (data) => {
        data = data.filter(item => item.value !== '');
        this.setState({
          recallReason: data
        });
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let {recallReason, remarks} = this.state;
    recallReason = recallReason.map(item => (
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ));
    return (
      <Form>
        <Row gutter={30}>
          <Col span={12}>
            <FormItem label={`召回原因`} {...formRemarkLayout}>
              {getFieldDecorator('recallReasonType', {
                rules: [{
                  required: true, message: '请选择召回原因',
                }]
              })(
                <Select
                  placeholder="请选择召回原因"
                  onChange={(value) => {
                    this.setState({
                      remarks: value
                    })
                  }}
                  style={{width: '100%'}}
                >
                  {recallReason}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            {
              remarks === '4' ? 
                <FormItem label={`原因`} {...formRemarkLayout}>
                  {getFieldDecorator('remarks',{
                    rules: [{
                        required: true, message: '请输入原因',
                    }]
                  })(
                  <Input placeholder='请输入原因'/>
                  )}
                </FormItem>
              : null
            }
          </Col>
        </Row>
      </Form>
    )
  }
}
const RemarksFormWarp = Form.create()(RemarksForm);
class AddRefund extends PureComponent{
  constructor(props){
    super(props)
    this.state={
      display: 'none',
			query: {
        existDrugList: []
      },
      selectedRowKey: [],
      spinLoading: false,
      visible: false,
      isRecall: true,
      btnLoading: false, // 添加产品modal 确认
      detailsData: {}, // 详情
      dataSource: [],
      selected: [],  // 新建, 编辑 table 勾选
      selectedRows: [],
      modalSelectedRows: [], // 模态框内勾选
      modalSelected: []
    }
  }
  toggle = () => {
    const { display, expand } = this.state;
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
  }
  componentDidMount = () =>{
		let { type } = this.props.match.params;
		this.setState({ isRecall: type === 'recall'? true : false });
    
  }
  // 模态框表单搜索
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values, '查询条件');  
        let { query } = this.state;
        this.refs.table.fetch({ ...query, ...values });
        this.setState({ query: { ...query, ...values } })
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
    let values = this.props.form.getFieldsValue();
    let { query } = this.state;
    this.refs.table.fetch({ ...query, ...values });
  }
  
  //提交该出库单
  backStroage = () =>{
    const {  dataSource, isRecall } = this.state;
    this.refs.remarksForm.validateFields((err, values) => {
      if(!err) {
        Conform({
          content: isRecall ? "是否确认召回": "是否确认锁定",
          onOk:()=>{
            const { dispatch, history } = this.props;
            let postData = {}, detailList = [];
            dataSource.map(item => detailList.push({ 
              drugCode: item.drugCode,
              lot: item.lot,
              recallNum: item.totalQuantity,
              refrigerateType: item.refrigerateType,
              supplierCode: item.supplierCode,
            }));
            postData.detailList = detailList;
            postData.recallType = isRecall ? '1': '2';
            postData.recallReasonType = values.recallReasonType;
            if(values.remarksValue) {
              postData.remarks = `其他(${values.remarksValue})`;
            };
            console.log(postData,'postData')
            dispatch({
              type: 'base/createRecallOrLocked',
              payload: { ...postData },
              callback: () => {
                message.success(`${isRecall ? '召回': '锁定'}成功`);
                history.push({pathname:"/drugStorage/outStorage/recallAndLocked"});
              }
            })
          },
          onCancel:()=>{}
        })
      }
    })
        
  }

  //添加产品 到 主表
  handleOk = () => {
    let { modalSelectedRows } = this.state;
    if(modalSelectedRows.length === 0) {
      message.warning('至少选择一条信息');
      return;
    }
    let { dataSource } = this.state;
    modalSelectedRows.map(item => item.backNum = 1);
    let newDataSource = [];
    newDataSource = [ ...dataSource, ...modalSelectedRows ];
    this.setState({ dataSource: newDataSource, visible: false, modalSelected: [], modalSelectedRows: [] }) 
  }
  delete = () => {  //删除
    let { selectedRows, dataSource, query } = this.state;
    dataSource = _.difference(dataSource, selectedRows);
    let existDrugList = dataSource.map((item) => ({
      drugCode: item.drugCode,
      lot: item.lot
    }))
    this.setState({
      dataSource,
      selected: [],
      selectedRows: [],
      query: {
        ...query,
        existDrugList
      }
    });
  }
  render(){
    let { visible, isRecall, dataSource, query, spinLoading, display } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
    <Spin spinning={spinLoading} size="large">
      <div className="fullCol" style={{ padding: 24, background: '#f0f2f5' }}>
        <div className="fullCol-fullChild" style={{margin: '-9px -24px 0'}}>
          <Row style={{borderBottom: '1px solid rgba(0, 0, 0, .1)', marginBottom: 10}}>
            <Col span={8}>
              <h2>{isRecall? '新建召回' : '新建锁定'}</h2>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => this.props.history.go(-1)}><Icon type="close" style={{ fontSize: 26, marginTop: 8 }} /></span>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col  span={4}>
              <Button type='primary' className='button-gap' onClick={()=>{
                if(this.refs.table){
                  let existDrugList = [];
                  dataSource.map(item => existDrugList.push({
                    drugCode: item.drugCode,
                    lot: item.lot
                  }));
                  this.refs.table.fetch({ ...query, existDrugList });
                }
                this.setState({visible:true});
              }}>
                添加产品
                </Button>
              <Button onClick={this.delete} >移除</Button>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col span={12}>
              <RemarksFormWarp
                dispatch={this.props.dispatch}
                ref="remarksForm"
              />
            </Col>
          </Row>
          
        </div>
        <div className='detailCard' style={{margin: '-12px -8px 0px -8px'}}>
          <Table
            pagination={false}
            dataSource={dataSource}
            title={()=>'产品信息'}
            bordered
            scroll={{x: 2460}}
            columns={columns}
            rowKey={'uuid'}
            style={{marginTop: 24}}
            rowSelection={{
              selectedRowKeys: this.state.selected,
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selected: selectedRowKeys, selectedRows })
              }
            }}
          />
        </div>
          {
            dataSource.length === 0 ? null : 
            <div className="detailCard" style={{margin: '-12px -8px 0px -8px'}}>
              <Row>
                <Col span={12}>
                </Col>
                <Col span={12} style={{ textAlign: 'right', padding: '10px' }}>
                  <Button onClick={this.backStroage} type='primary' style={{ marginRight: 8 }}>确定</Button>
                  <Button type='primary' ghost>
                    <Link to={{pathname:`/drugStorage/outStorage/backStorage`}}>取消</Link>
                  </Button>
                </Col>
              </Row>
            </div>
          }
          {/*选择产品-弹窗*/}
          <Modal 
            bordered
            title={'添加产品'}
            visible={visible}
            width={1200}
            style={{ top: 20 }}
            onCancel={() => this.setState({ visible: false, modalSelected: [] })}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleOk}>确认</Button>,
              <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>
            ]}
          >
            <Form onSubmit={this.handleSearch}>
              <Row gutter={30}>
                <Col span={8}>
                  <FormItem label={`通用名/商品名`} {...formItemLayout}>
                    {getFieldDecorator('paramName', {
                      initialValue: ''
                    })(
                      <Input placeholder='通用名/商品名'/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label={`生产批号`} {...formItemLayout}>
                    {getFieldDecorator('lot',{
                      initialValue: ''
                    })(
                    <Input placeholder='生产批号'/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{display: display}}>
                  <FormItem label={`供应商`} {...formItemLayout}>
                    {getFieldDecorator('supplierName',{
                      initialValue: ''
                    })(
                      <Input placeholder='供应商'/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{display: display}}>
                  <FormItem label={`入库单号`} {...formItemLayout}>
                    {getFieldDecorator('inStoreCode', {
                      initialValue: ''
                    })(
                      <Input placeholder='入库单号'/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                  <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                    {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
                  </a>
                </Col>
              </Row>
            </Form>
            <RemoteTable
              query={query}
              ref="table"
              bordered
              isJson={true}
              url={outStorage.RECALLORLOCKADDPRODUCT_LIST}
              scroll={{x: 2128}}
              columns={modalColumns}
              rowKey={'uuid'}
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
export default connect(state => state)(Form.create()(AddRefund));