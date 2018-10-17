/*
 * @Author: yuwei 
 * @Date: 2018-08-22 15:18:53 
* @Last Modified time: 2018-08-22 15:18:53 
 */
 /**
 * @file 系统管理--组织机构--部门管理
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button,Icon,Modal,Select} from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import { systemMgt } from '../../../../api/systemMgt';
import { DeptSelect , DeptFormat } from '../../../../common/dic';
import { Link } from 'dva/router';
import { connect } from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const singleFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  },
}

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

  handleSearch = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if(!err){
        console.log(values,'查询数据');
        this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
        });
      }
    })
  }
  handleReset = () => {
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
            <FormItem {...formItemLayout} label={`部门名称`}>
              {
                getFieldDecorator(`deptName`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`科室名称`}>
              {
                getFieldDecorator(`hisCtDeptName`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{display:display}}>
            <FormItem {...formItemLayout} label={`部门类型`}>
              {
                getFieldDecorator(`deptType`,{
                  initialValue: ''
                })(
                  <Select
                    placeholder='请选择部门类型'>
                  {
                    DeptSelect.map(item=>(
                      <Option value={item.value} key={item.value}>{item.text}</Option>
                    ))
                  }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float:'right', textAlign: 'right', marginTop: 4}}>
            <Button type="primary" className='button-gap'  htmlType="submit">查询</Button>
            <Button type='default' className='button-gap' onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
              </a>
           </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class DepartmentMgt extends PureComponent{

  state = {
    loading: false,
    queryDept:{},//科室table的query
    queryGoods:{},//货位table的query
    visible:false,
    modalTitle:"新增",
    record:{},//当前要编辑的信息
    subModalVisible:false,//科室弹窗显示状态
    goodsModalVisible:false,//货位弹窗显示状态
    deptKeyword:'',//科室搜索关键字
    goodsKeyword:'',//货位搜索关键字 - 货位
    pharmacyKeyword:'',//货位搜索关键字- 药房
    hasStyle: null,
    subModalSelectRow:{},//科室点选-获取相关的信息
    subModalSelectRowCache:{},//科室点选-缓存
    goodsModalSelectRow:{},//科室点选-获取相关的信息
    goodsModalSelectRowCache:{},//科室点选-缓存
    
  }


  //新增部门 - 打开弹窗
  add = ()=>{
    this.props.form.resetFields();
    this.setState({visible:true})
  }

  //新增部门 -提交表单
  onSubmitModal = () => {
    this.props.form.validateFields((err,values)=>{
      console.log(values)
      if(!err){
        console.log(values)
        console.log(this.state.subModalSelectRowCache);//此数据为科室每次确认的最终数据
        const { subModalSelectRowCache , goodsModalSelectRowCache } = this.state;
        values.openDeptCode = subModalSelectRowCache.ctdCode;//ctdCode为编码 
        if(values.deptType===5){//选择基数药的时候获取选中的Id
          values.parentId = goodsModalSelectRowCache.deptCode;
          values.id = goodsModalSelectRowCache.id;
          values.positionType = 5;
        }
        delete values['openDeptName'] ;
        console.log(JSON.stringify(values))
        this.props.dispatch({
          type:'Organization/OperSysDept',
          payload:values,
          callback:(data)=>{
            console.log(data)
            this.refs.table.fetch()
            this.setState({visible:false})
          }
        })
        
      }
    })
  }

  //新增部门 -关闭弹窗
  onCancelModal = () => {
    this.props.form.resetFields();
    this.setState({visible:false})
  }
  /* ====================== 新增部门 弹窗 ======================*/
  //新增部门-选择科室 - 打开弹窗
  showDeptModal = () => {
    this.setState({subModalVisible:true})
  }
  //搜索科室弹窗
  searchSubModal = () => {
    console.log(this.state.deptKeyword)
    //在此处发出请求，并且刷新科室弹窗中的table
    let postData={
      ctdDesc:this.state.deptKeyword
    }
    this.refs.tableDept.fetch(postData)
  }

  //选择科室 - 确定
  onSubmitSubModal = () =>{
    console.log(this.state.subModalSelectRow)
    //当前选择科室后的信息-需要赋值给新增部门的文本框
    const { subModalSelectRow } = this.state;
    //存入缓存
    this.setState({subModalSelectRowCache:JSON.parse(JSON.stringify(subModalSelectRow)),subModalVisible:false  });
    this.props.form.setFieldsValue({openDeptName:subModalSelectRow.ctdDesc})

  }
   //选择科室 - 取消
  onCancelSubModal = () =>{
    const { subModalSelectRowCache } = this.state;
    this.setState({subModalVisible:false });
    this.props.form.setFieldsValue({openDeptName:subModalSelectRowCache.ctdDesc})
  }
   /*====================== 新增货位 弹窗 ======================*/
  //新增货位-选择货位 - 打开弹窗
  showGoodsModal = () => {
    this.setState({goodsModalVisible:true});
  }
  //搜索货位弹窗
  searchGoodsModal = () => {
    console.log(this.state.goodsKeyword)
    console.log(this.state.pharmacyKeyword)
    let postData = {
      deptName:this.state.pharmacyKeyword,
      positionName:this.state.goodsKeyword
    }
    //在此处发出请求，并且刷新货位弹窗中的table
    this.refs.tableGoods.fetch(postData)
  }

  //选择货位 - 确定
  onSubmitGoodsModal = () =>{
    console.log(this.state.goodsModalSelectRow)
    //当前选择货位后的信息-需要赋值给新增部门的文本框
    const { goodsModalSelectRow } = this.state;
    //存入缓存
    this.setState({goodsModalSelectRowCache:JSON.parse(JSON.stringify(goodsModalSelectRow)),goodsModalVisible:false  });
    this.props.form.setFieldsValue({positionName:goodsModalSelectRow.positionName})

  }
   //选择货位 - 取消
  onCancelGoodsModal = () =>{
    const { goodsModalSelectRowCache } = this.state;
    this.setState({goodsModalVisible:false });
    this.props.form.setFieldsValue({positionName:goodsModalSelectRowCache.positionName});
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    })
  }

  render(){
    const columns = [
      {
        title: '部门性质',
        dataIndex: 'deptType',
        width: 168,
        render:(text,record,index)=>text?DeptFormat[text]:''
      },
      {
        title: '科室名称',
        dataIndex: 'hisDeptName',
        width: 168,
      },
      {
        title: '部门名称',
        dataIndex: 'deptName',
        width: 168,
      },
      {
        title: '地址',
        dataIndex: 'deptLocation',
        width: 280,
      },
      {
        title: '编辑人',
        dataIndex: 'updateUserName',
        width: 112,
      },
      {
        title: '编辑时间',
        dataIndex: 'updateDate',
        width: 224,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 100,
        render: (text,record,index)=>{
          return <span>
            <Link className='button-gap' to={{pathname:`/sys/organization/departmentMgt/edit/${record.id}`,state:record}}>编辑</Link>
            {
              (record.deptType === '3'||record.deptType === '4')
              &&
              <Link to={{pathname:`/sys/organization/departmentMgt/goodsAllocation/${record.id}`,state:record}}>货位 </Link>
            }
          </span>
        }
      },
    ]
    const subModalCol = [
      {
        title: '科室名称',
        dataIndex: 'ctdDesc',
      },
      {
        title: '编码',
        dataIndex: 'ctdCode',
      },
    ]
    const goodsModalCol = [
      {
        title: '部门名称',
        dataIndex: 'deptName',
      },
      {
        title: '货位名称',
        dataIndex: 'positionName',
      },
    ]
    const { visible , modalTitle ,subModalVisible, hasStyle , goodsModalVisible , queryDept , queryGoods} = this.state;
    const { getFieldDecorator } = this.props.form;
    let query = this.props.base.queryConditons;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm formProps={{...this.props}}/>
        <div>
          <Button type='primary' icon='plus' className='button-gap' onClick={this.add}>新增</Button>
        </div>

        <RemoteTable 
          ref='table'
          query={query}
          style={{marginTop: 20}}
          columns={columns}
          scroll={{ x: '100%' }}
          url={systemMgt.DeptList}
          onChange={this._tableChange}
          rowSelection={{
            onChange:(selectRowKeys, selectedRows)=>{
              this.setState({selectRowKeys})
            }
          }}
          rowKey='id'
        />

        {/* 新增部门 - 弹窗  */}
        <Modal 
          visible={visible}
          title={modalTitle}
          onOk={this.onSubmitModal}
          onCancel={this.onCancelModal}
          >
          <Form onSubmit={this.onSubmit}>
            <FormItem {...singleFormItemLayout} label={`部门性质`}>
              {
                getFieldDecorator(`deptType`,{
                  rules: [{ required: true,message: '请输入部门性质' }]
                })(
                  <Select onSelect={(val)=>this.props.form.setFieldsValue({deptType:val})}>
                    {
                      DeptSelect.map(item=>(
                        <Option value={item.value} key={item.value}>{item.text}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`科室名称`}>
              {
                getFieldDecorator(`openDeptName`,{//openDeptCode
                  rules: [{ required: true,message: '请输入科室名称' }]
                })(
                  <Input onClick={this.showDeptModal} readOnly/>
                )
              }
            </FormItem>
            <FormItem {...singleFormItemLayout} label={`部门名称`}>
              {
                getFieldDecorator(`deptName`,{
                  rules: [{ required: true,message: '请输入部门名称' }]
                })(
                  <Input />
                )
              }
            </FormItem>
            {
              this.props.form.getFieldsValue(['deptType']).deptType === 5?
              <FormItem {...singleFormItemLayout} label={`货位`}>
              {
                getFieldDecorator(`positionName`,{
                  rules: [{ required: true,message: '请输入货位' }]
                })(
                  <Input onClick={this.showGoodsModal} readOnly/>
                )
              }
            </FormItem>:null
            }
            <FormItem {...singleFormItemLayout} label={`地址`}>
              {
                getFieldDecorator(`deptLocation`)(
                  <Input/>
                )
              }
            </FormItem>
          </Form>
        </Modal>
        {/* 新增部门 - 科室 - 弹窗  */}
        <Modal
          destroyOnClose
          visible={subModalVisible} 
          title='科室'     
          onOk={this.onSubmitSubModal}
          onCancel={this.onCancelSubModal}
          >
            <Row>
              <Input  className='button-gap' style={{width:200}} value={this.state.deptKeyword} onChange={(e)=>this.setState({deptKeyword:e.target.value})}/>
              <Button className='button-gap' onClick={this.searchSubModal}>查询</Button>
              <Button className='button-gap' onClick={()=>{this.setState({deptKeyword:''});this.refs.tableDept.fetch()}}>重置</Button>
            </Row>
            <RemoteTable 
              ref='tableDept'
              query={queryDept}
              style={{marginTop: 20}}
              columns={subModalCol}
              scroll={{ x: '100%' }}
              url={systemMgt.findHisDept}
              rowClassName={ (record, index) => index === hasStyle ? 'rowClassBg' : ''}
              onRow={ (record, index) => {
                return {
                  onClick: () => {
                    this.setState({ hasStyle: index , subModalSelectRow:record })
                  }
                };
              }}
              rowKey='id'
            />
        </Modal>

        {/* 新增部门 - 货位 - 弹窗  */}
        <Modal
          destroyOnClose
          visible={goodsModalVisible} 
          title='货位'     
          onOk={this.onSubmitGoodsModal}
          onCancel={this.onCancelGoodsModal}
          >
            <Row>
              <Input  className='button-gap' style={{width:120}} 
                value={this.state.pharmacyKeyword} 
                placeholder='药房关键字'
                onChange={(e)=>this.setState({pharmacyKeyword:e.target.value})}/>

              <Input  className='button-gap' style={{width:120}} 
              value={this.state.goodsKeyword} 
              placeholder='货位关键字'
              onChange={(e)=>this.setState({goodsKeyword:e.target.value})}/>

              <Button className='button-gap' onClick={this.searchGoodsModal}>查询</Button>
              <Button className='button-gap' onClick={()=>{this.setState({goodsKeyword:'',pharmacyKeyword:''});this.refs.tableGoods.fetch({}) }}>重置</Button>
            </Row>

            
            <RemoteTable 
              ref='tableGoods'
              query={queryGoods}
              // isJson={true}
              style={{marginTop: 20}}
              columns={goodsModalCol}
              scroll={{ x: '100%' }}
              url={systemMgt.getGoodsLocationInfo}
              rowClassName={ (record, index) => index === hasStyle ? 'rowClassBg' : ''}
              onRow={ (record, index) => {
                return {
                  onClick: () => {
                    this.setState({ hasStyle: index , goodsModalSelectRow:record })
                  }
                };
              }}
              rowKey='id'
            />
        </Modal>
      </div>
    )
  }
}
export default connect (state=>state)(Form.create()(DepartmentMgt));