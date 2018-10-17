import React , {PureComponent} from 'react';
import { Form, Row, Col, Button, Input, Select, Icon, Tooltip, message, Modal, InputNumber  } from 'antd';
import { configMgt } from '../../../../api/drugStorage/configMgt';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

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
                  <Select placeholder="请选择">
                    <Option key='' value=''>全部</Option>
                    <Option key='0' value='0'>启用</Option>
                    <Option key='1' value='1'>停用</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`是否报告药`}>
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
    dataIndex: 'ctmmGenericName',
    width: 168,
  },
  {
    title: '商品名称',
    dataIndex: 'ctmmTradeName',
    width: 224,
  },
  {
    title: '规格',
    dataIndex: 'ctmmSpecification',
    width: 280,
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '剂型',
    dataIndex: 'ctmmDosageFormDesc',
    width: 168,
  },
  {
    title: '包装规格',
    dataIndex: 'packageSpecification',
    width: 168,
  },
  {
    title: '单位',
    dataIndex: 'replanUnit',
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
    width: 224,
  }
]

class DrugDirectory extends PureComponent{
  state = {
    selected: [],
    selectedRows: [],
    modalSelected: [],
    modalSelectedRows: [],
    visible: false,
    addVisible: false,
    loading: false,
    addLoading: false,
    upperQuantity: 999999,
    downQuantity: 0
  }


  //新增弹窗搜索
  searchModalInsert = (val) =>{
     this.refs.modalTableInsert.fetch({ctmmGenericName:val})
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
        const { selectedRows } = this.state;
        let postData=[]
        selectedRows.map(item=>{
          postData.push({
            bigDrugCode:item.bigDrugCode||'',
            medDrugTypes:item.medDrugType||'',
            hisDrugCode:item.hisDrugCode||'',
            upperQuantity:values.upperQuantity||'',
            downQuantity:values.downQuantity||'',
            purchaseQuantity:values.purchaseQuantity||'',
            id: item.detailId || ''
          })
          return item 
        })
        this.setState({ loading: true });
        console.log(postData,'postData');
        this.props.dispatch({
          type:'drugStorageConfigMgt/OperDeptDrug',
          payload:{"info":postData},
          callback:(data)=>{
          this.setState({ loading: false, visible: false, selected:[],selectedRows: [] })
            message.success('操作成功');
            this.refs.table.fetch();
          }
        })
      }
    })
  }
  remove = () =>{
    const { selected } = this.state;
    if(selected.length === 0){
      return message.warning('请至少选中一条数据')
    }
    Modal.confirm({
      title: '确认',
      content: '是否确认执行此操作',
      onOk:()=>{
        this.props.dispatch({
          type:'drugStorageConfigMgt/DeleteDeptDrug',
          payload:{drugCode:selected.join(",")},
          callback:(data)=>{
            message.success('操作成功');
            this.refs.table.fetch();
          }
        })
      },
      onCancel(){}
    })
  }
  add = () =>{
    this.setState({ addVisible: true })
  }
  addDrug = () =>{
    let { modalSelected , modalSelectedRows } = this.state;
    if(modalSelected.length === 0){
      return message.warning('请至少勾选一项')
    }
    let postData=[]
    modalSelectedRows.map(item=>{
      postData.push({
        bigDrugCode:item.bigDrugCode||'',
        medDrugTypes:item.medDrugType||'',
        hisDrugCode:item.hisDrugCode||'',
      })
      return item 
    })
    console.log(postData)
    this.props.dispatch({
      type:'drugStorageConfigMgt/OperDeptDrug',
      payload:{"info":postData},
      callback:(data)=>{
        console.log(data)
        message.success('添加成功');
        this.refs.table.fetch();
        this.setState({ addLoading: false, addVisible: false, modalSelected:[],modalSelectedRows: [] })
      }
    })
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    })
  }
  setQuantity = (key, value) => {
    const {upperQuantity, downQuantity} = this.state;
    if(typeof value === 'number') {
      if(key === 'downQuantity' && value > upperQuantity) return;
      if(key === 'upperQuantity' && value < downQuantity) return;
      this.setState({
        [key]: value
      });
    };
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
    })
  }
  render(){
    const { visible, loading, addVisible, addLoading, downQuantity, upperQuantity } = this.state;
    const { getFieldDecorator } = this.props.form;
    const IndexColumns = [
      ...columns,
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
        title: '库存上限',
        dataIndex: 'upperQuantity',
        width: 112
      },
      {
       title: '库存下限',
       dataIndex: 'downQuantity',
       width: 112
      },
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        width: 60,
        render: (text,record)=>{
          return  <span>
            <Link to={{pathname: `/drugStorage/configMgt/drugDirectory/edit/${record.detailId}`}}>{'编辑'}</Link>
          </span>
        }
      },
    ];
    let query = {...this.props.base.queryConditons};
    delete query.key;
    return (
    <div className='ysynet-main-content'>
      <WrappSearchForm formProps={{...this.props}}/>
      <Row className='ant-row-bottom'>
        <Col>
          <Button type='primary' onClick={this.bitchEdit}>批量设置上下限</Button>
          <Button type='default' onClick={this.add} style={{ margin: '0 8px' }}>新增</Button>
          <Button type='default' onClick={this.remove}>移除</Button>
          <Button type='default' style={{marginLeft: 8}} onClick={this.export}>导出</Button>
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
                rules:[{
                  required:true,message:"请输入库存上限！"
                }]
              })(
                <InputNumber
                  style={{width: '100%'}}
                  min={downQuantity}
                  onChange={this.setQuantity.bind(this, 'upperQuantity')}
                  placeholder='请输入'
                  precision={0}                  
                />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label={`库存下限`}>
            {
              getFieldDecorator(`downQuantity`,{
                rules:[{
                  required:true,message:"请输入库存下限！"
                }]
              })(
                <InputNumber
                  style={{width: '100%'}}
                  max={upperQuantity}
                  onChange={this.setQuantity.bind(this, 'downQuantity')}
                  placeholder='请输入'
                />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label={`采购量`}>
            {
              getFieldDecorator(`purchaseQuantity`,{
              })(
                <InputNumber 
                  style={{width: '100%'}}
                  max={upperQuantity}
                  placeholder='请输入'
                />
              )
            }
          </FormItem>
        </Form>
      </Modal>
      <Modal
        title='添加药品'
        width={1100}
        visible={addVisible}
        onCancel={()=>this.setState({ addVisible: false })}
        footer={[
          <Button key="submit" type='primary' loading={addLoading} onClick={this.addDrug}>
              确认
          </Button>,
          <Button key="back"  type='default' onClick={()=>this.setState({ addVisible: false })}>取消</Button>
        ]}
        >
        <Search placeholder='通用名/商品名/生产厂家' style={{ width: 256 }}
          onSearch={(e)=>this.searchModalInsert(e)}/>
        <RemoteTable 
          ref='modalTableInsert'
          query={{}}
          style={{marginTop: 20}}
          columns={columns}
          scroll={{ x: 2080 }}
          url={configMgt.findDepotFilterList}
          rowSelection={{
            selectedRowKeys: this.state.modalSelected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({modalSelected: selectedRowKeys, modalSelectedRows: selectedRows})
            }
          }}
          rowKey='bigDrugCode'
        />
      </Modal>

      <RemoteTable
        ref='table'
        query={query}
        style={{marginTop: 20}}
        columns={IndexColumns}
        scroll={{ x: 1564 }}
        url={configMgt.findDepotlist}
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