import React , {PureComponent} from 'react';
import { Form, Row, Col, Button, Input, Select, Icon, Tooltip, message, Modal, Radio  } from 'antd';
import { supplierDurs } from '../../../api/drugStorage/supplierDrugs';
import {common} from '../../../api/purchase/purchase';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../components/TableGrid';
import FetchSelect from '../../../components/FetchSelect';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },//5
    md: {span: 8}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
    md: {span: 16}
  },
};

class SearchForm extends PureComponent{
  state = {
    typeList: []
  }
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  componentDidMount() {
    let { queryConditons } = this.props.formProps.base;
    //找出表单的name 然后set
    queryConditons = {...queryConditons};
    if(queryConditons.supplierCodeList) {
      queryConditons.supplierCodeList = queryConditons.supplierCodeList[0];
    };
    queryConditons.hisDrugCodeList = undefined;
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
    this.props.formProps.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'his_purchase_type'
      },
      callback: (data) => {
        this.setState({
          typeList: data
        });
      }
    })
  }
  handleSearch = (e) => {
    e.preventDefault();
    console.log(this.props.formProps)
    this.props.form.validateFields((err,values)=>{
      values.hisDrugCodeList = values.hisDrugCodeList ? [values.hisDrugCodeList] : [];
      values.supplierCodeList = values.supplierCodeList ? [values.supplierCodeList] : [];
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
    const { deptList } = this.props;
    const {typeList} = this.state;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCodeList`,{
                  initialValue: ''
                })(
                  <Select placeholder="请选择">
                    <Option key='' value=''>全部</Option>
                    {
                      deptList.map(item => (
                        <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`采购方式`}>
              {
                getFieldDecorator('purchaseType',{
                  initialValue: ''
                })(
                  <Select placeholder="请选择">
                    {
                      typeList.map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`名称`}>
              {
                getFieldDecorator(`hisDrugCodeList`,{
                  initialValue: ''
                })(
                  <FetchSelect
                    allowClear={true}
                    placeholder='药品名称'
                    query={{queryType: 3}}
                    url={common.QUERY_DRUG_BY_LIST}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`生产厂家`}>
              {
                getFieldDecorator(`ctmmManufacturerName`,{
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
    dataIndex: 'supplierName',
    width: 168,
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
 /* {
    title: '通用名',
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
  {
    title: '生产厂家',
    dataIndex: 'ctmmManufacturerName',
    width: 200,
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  /*{
    title: '规格',
    dataIndex: 'ctmmSpecification',
    width: 224,
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },*/
  {
    title: '采购方式',
    dataIndex: 'purchaseTypeName',
    width: 168,
  },
  {
    title: '采购单位',
    dataIndex: 'replanUnit',
    width: 100,
  },
  {
    title: '价格',
    dataIndex: 'drugPrice',
    width: 100,
    render: (text,record) =>{
      return text === undefined || text == null ? '0.00': text.toFixed(2);
    }
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
          <Link to={{pathname: `/sys/drugDirectory/supplierDrugs/edit/${record.id}/${record.hisDrugCode}`}}>{'编辑'}</Link>
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
    this.props.dispatch({
      type: 'supplierDrugs/genSupplier',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            deptList: data,
            modalQuery: {
              deptCode: data[0].id
            }
          });
        }else {
          message.error(msg);
        }
      }
    });
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
      console.log(values);
      
      if(!err){
        const {selectedRows} = this.state;
        const id = selectedRows.map(item => item.id);
          this.props.dispatch({
            type: 'supplierDrugs/updateSupplierRefPrice',
            payload: {
              id,
              purchaseType: values.purchaseType
            },
            callback: ({data, code, msg}) => {
              if(code === 200) {
                message.success('操作成功');
                this.props.form.resetFields();
                this.setState({
                  selectedRows: [],
                  selected: [],
                  visible: false
                });
                this.refs.table.fetch();
              }else {
                message.error(msg)
              };
            }
          })
      }
    })
  }
  onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false
    });
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
          {/* <Button type='primary' onClick={this.bitchEdit}>批量设置采购方式</Button> */}
        </Col>
      </Row>
      <Modal
        title={'批量编辑'}
        width={488}
        visible={visible}
        onCancel={this.onCancel}
        footer={[
          <Button key="submit" type='primary' loading={loading} onClick={this.bitchEditConfirm}>
              确认
          </Button>,
          <Button key="back"  type='default' onClick={this.onCancel}>取消</Button>
        ]}
        >
        <Form>
          <FormItem {...formItemLayout} label={`采购方式`}>
            {
              getFieldDecorator(`purchaseType`,{
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
        isJson={true}
        style={{marginTop: 20}}
        columns={columns}
        isDetail={true}
        scroll={{ x: '100%',  }}
        url={supplierDurs.findDrugsList}
        // rowSelection={{
        //   selectedRowKeys: this.state.selected,
        //   onChange: (selectedRowKeys, selectedRows) => {
        //     this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
        //   }
        // }}
        rowKey='id'
        onChange={this._tableChange}
      />
    </div>
    )
  }
}
export default connect (state=>state)( Form.create()(DrugDirectory) );