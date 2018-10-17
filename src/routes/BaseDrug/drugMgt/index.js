import React , {PureComponent} from 'react';
import { Form, Row, Col, Button, Input, Select, InputNumber, Icon, Tooltip, message, Modal  } from 'antd';
import { drugMgt } from '../../../api/baseDrug/drugMgt';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../components/TableGrid';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;

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
    this.props.form.validateFields((err,values)=>{
      this.props.formProps.dispatch({
        type:'base/updateConditions',
        payload: values
      });
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
          <Col span={8}>
            <FormItem {...formItemLayout} label={`剂型`}>
              {
                getFieldDecorator(`ctmmDosageFormDesc`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`规格`}>
              {
                getFieldDecorator(`ctmmSpecification`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`状态`}>
              {
                getFieldDecorator(`ctmmStatusCode`,{
                  initialValue: ''
                })(
                  <Select>
                    <Option key='' value=''>全部</Option>
                    <Option key='0' value='0'>启用</Option>
                    <Option key='1' value='1'>停用</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          {/* <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`是否报告药`}>
              {
                getFieldDecorator('medDrugType',{
                  initialValue: ''
                })(
                  <Select>
                    <Option key='' value=''>全部</Option>
                    <Option key='2' value='2'>是</Option>
                    <Option key='1' value='1'>否</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col> */}
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
    title: '通用名称',
    dataIndex: 'genericName',
    width: 168,
    fixed: 'left',
    render: (text, record) => (
      <Link to={{pathname: `/baseDrug/drugMgt/drugCatalog/edit/bCode=${record.bigDrugCode}&dCode=${record.drugCode}&id=${record.id}`}}>{text}</Link>
    )
  },
  {
    title: '商品名称',
    dataIndex: 'tradeName',
    width: 224
  },
  {
    title: '规格',
    dataIndex: 'specification',
    width: 168,
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '剂型',
    dataIndex: 'dosageDesc',
    width: 168
  },
  {
    title: '包装规格',
    dataIndex: 'packageSpecification',
    width: 112
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 60
  },
  {
    title: '药品编码',
    dataIndex: 'hisDrugCode',
    width: 224
  },
  {
    title: '批准文号',
    dataIndex: 'approvalNo',
    width: 224
  }
]

class DrugDirectory extends PureComponent{
  state = {
    selected: [],
    selectedRows: [],
    visible: false,
    loading: false,
    min: 0,
    max: 9999999
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
        this.setState({
          loading: true
        });
        const { selectedRows } = this.state;
        let ids = selectedRows.map(item => item.id);
        values.purchaseQuantity = values.purchaseQuantity || '';
        values.ids = ids;
        this.props.dispatch({
          type: 'drugMgt/batchEditingMedicine',
          payload: values,
          callback: () => {
            message.success('编辑成功');
            this.setState({
              loading: false,
              visible: false,
              selected: []
            });
            this.refs.table.fetch();
          }
        })
      }
    })
  }
  //限制上下限输入
  changeQuantity = (value, stateName) => {
    let {min, max} = this.state;
    if(stateName === 'min' && value > max) {
      return message.warning('库存下限不能超过库存上限！');
    }
    if(stateName === 'max' && value < min) {
      return message.warning('库存上限不能低于库存下限！');
    }
    this.setState({
      [stateName]: value? value : 0
    });
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  //导出
  export = () => {
    let {queryConditons} = this.props.base;
    queryConditons = {...queryConditons};
    delete queryConditons.pageSize;
    delete queryConditons.pageNo;
    delete queryConditons.sortField;
    delete queryConditons.sortOrder;
    delete queryConditons.key;
    this.props.dispatch({
      type: 'base/deptExport',
      payload: queryConditons,
    });
  }
  render(){
    const {visible, loading, min, max} = this.state;
    const { getFieldDecorator } = this.props.form;
    const IndexColumns = [
      ...columns,
      {
        title: '生产厂家',
        dataIndex: 'manufactureName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '库存基数',
        dataIndex: 'stockBase',
        width: 112
      },
    ];
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.key;
    return (
    <div className='ysynet-main-content'>
      <WrappSearchForm formProps={{...this.props}}/>
      <Row className='ant-row-bottom'>
        <Col>
          {/* <Button type='primary' onClick={this.bitchEdit}>批量设置上下限</Button> */}
          <Button type='default' onClick={this.export}>导出</Button>
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
          <FormItem {...formItemLayout} label={`库存上限`}>
            {
              getFieldDecorator(`upperQuantity`,{
                initialValue: '',
                rules:[{
                  required:true,message:"请输入库存上限！"
                }]
              })(
                <InputNumber
                  onChange={(value) => {this.changeQuantity(value, 'max')}}
                  min={min}
                  precision={0}
                  style={{width: '100%'}}
                  placeholder='请输入'
                />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label={`库存下限`}>
            {
              getFieldDecorator(`downQuantity`,{
                initialValue: '',
                rules:[{
                  required:true,message:"请输入库存下限！"
                }]
              })(
                <InputNumber
                  onChange={(value) => {this.changeQuantity(value, 'min')}}
                  min={0}
                  max={max}
                  precision={0}
                  style={{width: '100%'}}
                  placeholder='请输入'
                />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label={`采购量`}>
            {
              getFieldDecorator(`purchaseQuantity`,{
                initialValue: '',
              })(
                <InputNumber
                  min={0}
                  precision={0}
                  style={{width: '100%'}} 
                  placeholder='请输入'
                />
              )
            }
          </FormItem>
        </Form>
      </Modal>
      <RemoteTable 
        onChange={this._tableChange}
        ref='table'
        query={query}
        style={{marginTop: 20}}
        columns={IndexColumns}
        scroll={{ x: 1176 }}
        url={drugMgt.FIND_MEDICINE_CATALOG}
        // rowSelection={{
        //   selectedRowKeys: this.state.selected,
        //   onChange: (selectedRowKeys, selectedRows) => {
        //     this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
        //   }
        // }}
        rowKey='id'
      />
    </div>
    )
  }
}
export default connect(state=>state)( Form.create()(DrugDirectory) );