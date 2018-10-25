import React , {PureComponent} from 'react';
import { Form, Row, Col, Button, Input, Select, Icon, Tooltip, message, Modal, Radio  } from 'antd';
// import { configMgt } from '../../../api/drugStorage/configMgt';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../components/TableGrid';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },//5
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 }
  },
};

class SearchForm extends PureComponent{
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  componentDidMount() {
    let { queryConditons } = this.props.formProps.base;
    //找出表单的name 然后set
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
  }
  handleSearch = (e) => {
    e.preventDefault();
    console.log(this.props.formProps)
    this.props.form.validateFields((err,values)=>{
      this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
      })
    })
  } 
  handleReset = ()=>{
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`deptCode`,{
                  initialValue: ''
                })(
                  <Select placeholder="请选择">
                    <Option key='' value=''>全部</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`采购方式`}>
              {
                getFieldDecorator('medDrugType',{
                  initialValue: ''
                })(
                  <Select placeholder="请选择">
                    <Option key='' value=''>全部</Option>
                    <Option key='2' value='2'>是</Option>
                    <Option key='1' value='1'>否</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`名称`}>
              {
                getFieldDecorator(`ctmmTradeName`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`生产厂家`}>
              {
                getFieldDecorator(`ctmmDosageFormDesc`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
           <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
             {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
           </a>
         </Col>
        </Row>
      </Form>
    )
  }
}
const WrappSearchForm = Form.create()(SearchForm);

const columns = [
  {
    title: '供应商',
    dataIndex: 'ctmmGenericName',
    width: 168,
  },
  {
    title: '通用名',
    dataIndex: 'ctmmTradeName',
    width: 224,
  },
  {
    title: '通用名',
    dataIndex: 'spm',
    width: 224,
  },
  {
    title: '生产厂家',
    dataIndex: 'sccj',
    width: 224,
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '规格',
    dataIndex: 'ctmmSpecification',
    width: 224,
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '采购方式',
    dataIndex: 'ctmmDosageFormDesc',
    width: 168,
  },
  {
    title: '采购单位',
    dataIndex: 'packageSpecification',
    width: 112,
  },
  {
    title: '价格',
    dataIndex: 'replanUnit',
    width: 112
  },
  {
    title: '批准文号',
    dataIndex: 'approvalNo',
    width: 224,
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 68,
    render: (text, record)=>{
      return (
        <span>
          <Link to={{pathname: `/sys/drugDirectory/supplierDrugs/edit`}}>{'编辑'}</Link>
        </span>
      )
    }
  },
]

class DrugDirectory extends PureComponent{
  state = {
    selected: [],
    selectedRows: [],
    visible: false,
    loading: false,
    deptList: [],
    modalQuery: {}
  }
  componentDidMount() {

  }
  // 批量设置上下限
  bitchEdit = () =>{
    const { selected } = this.state;
    if(selected.length === 0){
      return message.warning('请至少选中一条数据')
    }
    this.setState({ visible: true })
  }
  bitchEditConfirm = () =>{
    this.props.form.validateFields( (err,values) =>{
      if(!err){
        
      }
    })
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    })
  }
  render(){
    const { visible, loading, deptList } = this.state;
    const { getFieldDecorator } = this.props.form;
    let query = {...this.props.base.queryConditons};
    delete query.key;
    return (
    <div className='ysynet-main-content'>
      <WrappSearchForm deptList={deptList} formProps={{...this.props}}/>
      <Row className='ant-row-bottom'>
        <Col>
          <Button type='primary' onClick={this.bitchEdit}>批量设置采购方式</Button>
        </Col>
      </Row>
      <Modal
        title={'批量编辑'}
        width={488}
        visible={visible}
        onCancel={()=>this.setState({ visible: false })}
        footer={[
          <Button key="submit" type='primary' loading={loading} onClick={this.bitchEditConfirm}>
              确认
          </Button>,
          <Button key="back"  type='default' onClick={()=>this.setState({ visible: false })}>取消</Button>
        ]}
        >
        <Form>
          <FormItem {...formItemLayout} label={`采购方式`}>
            {
              getFieldDecorator(`upperQuantity`,{
                rules:[{
                  required:true,message:"请选择采购方式！"
                }]
              })(
                <RadioGroup>
                  <Radio value={1}>零库存</Radio>
                  <Radio value={2}>采购</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
        </Form>
      </Modal>
      <RemoteTable
        ref='table'
        query={query}
        style={{marginTop: 20}}
        columns={columns}
        scroll={{ x: 1748 }}
        rowSelection={{
          selectedRowKeys: this.state.selected,
          onChange: (selectedRowKeys, selectedRows) => {
            this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
          }
        }}
        rowKey='detailId'
        onChange={this._tableChange}
      />
    </div>
    )
  }
}
export default connect (state=>state)( Form.create()(DrugDirectory) );