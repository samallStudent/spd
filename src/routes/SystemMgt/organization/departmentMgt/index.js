/*
 * @Author: yuwei 
 * @Date: 2018-08-22 15:18:53 
* @Last Modified time: 2018-08-22 15:18:53 
 */
 /**
 * @file 系统管理--组织机构--部门管理
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Icon, Modal, Select, Checkbox, message, Tooltip} from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import { systemMgt } from '../../../../api/systemMgt';
import { DeptSelect , DeptFormat } from '../../../../common/dic';
import { Link } from 'dva/router';
import { connect } from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const {Search} = Input;
const singleFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};
const CheckboxGroup = Checkbox.Group;

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
                    placeholder='请选择部门类型'
                  >
                    <Option value="" key="">全部</Option>
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
    subModalSelectRow:{},//科室点选-获取相关的信息
    subModalSelectRowCache:{},//科室点选-缓存
    goodsModalSelectRow:{},//科室点选-获取相关的信息
    goodsModalSelectRowCache:{},//科室点选-缓存
    storeList: [],
    OKLoading: false
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'location_type'
      },
      callback: (data) => {
        data = data.filter(item => item.value !== "");
        this.setState({
          storeList: data
        });
      }
    })
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
        this.setState({
          OKLoading: true
        });
        const { subModalSelectRowCache , goodsModalSelectRowCache } = this.state;
        values.openDeptCode = subModalSelectRowCache.ctdCode;//ctdCode为编码 
        if(values.deptType === 5 || values.deptType === 6){//选择基数药的时候获取选中的Id
          values.parentId = goodsModalSelectRowCache.deptCode;
          values.baseDeptCode = goodsModalSelectRowCache.id;
        };
        delete values['openDeptName'];
        console.log(JSON.stringify(values))
        this.props.dispatch({
          type:'Organization/OperSysDept',
          payload:values,
          callback:(data)=>{
            console.log(data)
            this.refs.table.fetch()
            this.setState({
              visible:false,
              OKLoading: false
            })
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
    const deptType = this.props.form.getFieldValue('deptType');
    if(!deptType) {
      return message.warning('请选择部门性质');
    };
    this.setState({
      subModalVisible:true,
      queryDept: {
        ctdCategory: deptType
      }
    })
  }
  //搜索科室弹窗
  searchSubModal = () => {
    //在此处发出请求，并且刷新科室弹窗中的table
    this.setState({
      queryDept: {
        ...this.state.queryDept,
        ctdDesc:this.state.deptKeyword
      }
    });
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
    this.setState({
      subModalVisible: false,
      subModalSelectRow: {...subModalSelectRowCache}
    });
  }
   /*====================== 新增货位 弹窗 ======================*/
  //新增货位-选择货位 - 打开弹窗
  showGoodsModal = () => {
    this.setState({goodsModalVisible:true});
  }
  //搜索货位弹窗
  searchGoodsModal = (value) => {
    const {queryGoods} = this.state;
    //在此处发出请求，并且刷新货位弹窗中的table
    this.setState({
      queryGoods: {
        ...queryGoods,
        positionName: value
      }
    });
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
    this.setState({
      goodsModalVisible: false,
      goodsModalSelectRow: {...goodsModalSelectRowCache}
    });
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    })
  }
  //校验货位
  verifyStore = (rule, value, callback) => {
    value = value || [];
    const isCheck = value.some(item => item === "1");
    if(isCheck) {
      callback();
    }else {
      callback(new Error('必须选择补货指示货位!'));
    };
  }
  //校验抢救车货位
  verifyRescuecar = (rule, value, callback) => {
    callback();
  }
  changeQueryGoods = (value) => {
    this.setState({
      queryGoods: {
        deptType: value
      },
      subModalSelectRow:{},//科室点选-获取相关的信息
      subModalSelectRowCache:{},//科室点选-缓存
      goodsModalSelectRow:{},//科室点选-获取相关的信息
      goodsModalSelectRowCache:{},//科室点选-缓存
    });
    this.props.form.resetFields(['positionName', 'storeType', 'openDeptName']);
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
        title: '编辑时间',
        dataIndex: 'updateDate',
        width: 224,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 100,
        render: (text,record,index)=>{
          return (
            <span>
              {
                (record.deptType !== '6') &&
                <Link className='button-gap' to={{pathname:`/sys/organization/departmentMgt/edit/${record.id}`,state:record}}>编辑</Link>
              }
              {
                (record.isEditLocation === 1) &&
                <Link to={{pathname:`/sys/organization/departmentMgt/goodsAllocation/${record.id}`,state:record}}>货位 </Link>
              }
            </span>
          )
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
    let { 
      visible, 
      modalTitle,
      subModalVisible, 
      goodsModalVisible, 
      queryDept, 
      queryGoods, 
      storeList, 
      OKLoading,
      subModalSelectRow,
      goodsModalSelectRow
    } = this.state;
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    let query = this.props.base.queryConditons;
    delete query.key;
    if(getFieldsValue(['deptType']).deptType === 4) {
      storeList = storeList.filter((item, i) => i !== 5);
    };
    if(getFieldsValue(['deptType']).deptType === 3) {
      storeList = storeList.filter((item, i) => i === 0);
    };
    if(getFieldsValue(['deptType']).deptType === 5) {
      storeList = storeList.filter((item, i) => i === 5);
    };
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
          okButtonProps={{
            loading: OKLoading
          }}
        >
          <Form onSubmit={this.onSubmit}>
            <FormItem {...singleFormItemLayout} label={`部门性质`}>
              {
                getFieldDecorator(`deptType`,{
                  rules: [{ required: true,message: '请选择部门性质' }]
                })(
                  <Select placeholder="请选择部门性质" onChange={this.changeQueryGoods}>
                    {
                      DeptSelect.map(item=>(
                        <Option value={item.value} key={item.value}>{item.text}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
            {
              getFieldsValue(['deptType']).deptType !== 1 && 
              getFieldsValue(['deptType']).deptType !== 2 &&
              getFieldsValue(['deptType']).deptType !== 6 ?
              <FormItem {...singleFormItemLayout} label={`科室名称`}>
                {
                  getFieldDecorator(`openDeptName`,{
                    rules: [{ required: true,message: '请输入科室名称' }]
                  })(
                    <Input placeholder="请输入科室名称" onClick={this.showDeptModal} readOnly/>
                  )
                }
              </FormItem> : null
            }
            {
              getFieldsValue(['deptType']).deptType === 6 ?
              <FormItem {...singleFormItemLayout} label={`编码`}>
                {
                  getFieldDecorator(`rescuecarCode`,{
                    rules: [{ required: true,message: '请输入编码' }]
                  })(
                    <Input style={{width: '90%', marginRight: '5%'}} placeholder="请输入编码" />
                  )
                }
                <Tooltip placement="bottom" title="输入与HIS相同的抢救车编码">
                  <Icon type="exclamation-circle" />
                </Tooltip>
              </FormItem> : null
            }
            {
              getFieldsValue(['deptType']).deptType !== 1 && 
              getFieldsValue(['deptType']).deptType !== 2 ?
              <FormItem key="2" {...singleFormItemLayout} label={`部门名称`}>
                {
                  getFieldDecorator(`deptName`,{
                    rules: [{ required: true,message: '请输入部门名称' }]
                  })(
                    <Input placeholder="请输入部门名称" />
                  )
                }
              </FormItem> : null
            }
            {
              getFieldsValue(['deptType']).deptType === 3 || 
              getFieldsValue(['deptType']).deptType === 4 ||
              getFieldsValue(['deptType']).deptType === 5 ?
              <FormItem {...singleFormItemLayout} label={`货位设置`}>
                {
                  getFieldDecorator(`storeType`,{
                    rules: [
                      { required: getFieldsValue(['deptType']).deptType !== 5, message: '请选择货位设置' },
                      { validator: getFieldsValue(['deptType']).deptType !== 5 ? this.verifyStore : this.verifyRescuecar }
                    ]
                  })(
                    <CheckboxGroup style={{ width: '100%', marginTop: 10 }}>
                      <Row>
                        {
                          storeList.map(item => (
                            <Col span={12} key={item.value}>
                              <Checkbox value={item.value}>{item.label}</Checkbox>
                            </Col>
                          ))
                        }
                      </Row>
                    </CheckboxGroup>
                  )
                }
              </FormItem> : null
            }
            {
              getFieldsValue(['deptType']).deptType === 5 || 
              getFieldsValue(['deptType']).deptType === 6 ?
              <FormItem {...singleFormItemLayout} label={`货位`}>
                {
                  getFieldDecorator(`positionName`,{
                    rules: [{ required: true,message: '请输入货位' }]
                  })(
                    <Input placeholder="请输入货位" onClick={this.showGoodsModal} readOnly/>
                  )
                }
              </FormItem>:null
            }
            {
              getFieldsValue(['deptType']).deptType !== 6 ? 
              <FormItem {...singleFormItemLayout} label={`地址`}>
                {
                  getFieldDecorator(`deptLocation`)(
                    <Input placeholder="请输入地址"/>
                  )
                }
              </FormItem> : null
            }
          </Form>
        </Modal>
        {/* 新增部门 - 科室 - 弹窗  */}
        <Modal
          destroyOnClose
          visible={subModalVisible} 
          title='科室'     
          onOk={this.onSubmitSubModal}
          width={600}
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
              rowClassName={ (record) => subModalSelectRow.id === record.id ? 'rowClassBg' : ''}
              onRow={ (record) => {
                return {
                  onClick: () => {
                    this.setState({ subModalSelectRow: record })
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
              <Search
                className='button-gap' 
                style={{width:238}} 
                placeholder='货位关键字'
                onSearch={this.searchGoodsModal}
                enterButton
              />
            </Row>
            <RemoteTable 
              ref='tableGoods'
              query={queryGoods}
              style={{marginTop: 20}}
              columns={goodsModalCol}
              scroll={{ x: '100%' }}
              url={systemMgt.getGoodsLocationInfo}
              rowClassName={ (record) => goodsModalSelectRow.id === record.id ? 'rowClassBg' : ''}
              onRow={ (record) => {
                return {
                  onClick: () => {
                    this.setState({ goodsModalSelectRow: record })
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