import React, { PureComponent } from 'react';
import { Menu, Button, Row, Col, Input, Modal,Form, Checkbox, Icon, message,List,Spin } from 'antd';
import RemoteTable from '../../../components/TableGrid';
import EditableCell from '../../../components/EditableCell';
import ysy from '../../../api/ysy'
import { connect } from 'dva';
const { Search } = Input;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6},
  wrapperCol:{ span: 15 }
}

class NewAddForm extends PureComponent{
  render(){
    const { getFieldDecorator } = this.props.form;
    const { isEdit } = this.props;
    return (
      <Form>
          <FormItem {...formItemLayout} label={`子系统名称`}>
            {
              getFieldDecorator(`subSystemName`,{
                initialValue: isEdit ? this.props.data.subSystemName: '',
                rules: [{ required: true,message: '请输入子系统名称' }]
              })(
                <Input disabled={isEdit}/>
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label={`关联标识`}>
            {
              getFieldDecorator(`subSystemFlag`,{
                initialValue: isEdit ? this.props.data.subSystemFlag === '02'? ['00','01']: [this.props.data.subSystemFlag]: [],
                rules: [{ required: true,message: '请选择关联标识' }]
              })(
                <Checkbox.Group>
                  <Row>
                    <Col span={12}><Checkbox value='00'>关联部署</Checkbox></Col>
                    <Col span={12}><Checkbox value='01'>关联机构</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              )
            }
          </FormItem>
        </Form>
    )
  }
}

const WrapAddForm = Form.create()(NewAddForm);

class MenuAddForm extends PureComponent{
  componentWillReceiveProps = nextProps =>{
    if(nextProps.menuInfo.menuId!== this.props.menuInfo.menuId){
      let { menuInfo } = nextProps;
      this.props.form.setFieldsValue({ menuId: menuInfo.menuId, menuName: menuInfo.menuName,url: menuInfo.url });
    }
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem {...formItemLayout} label={`菜单编号`}>
          {
            getFieldDecorator(`menuId`,{
              initialValue:'',
              rules: [{ required: true,message:'请输入' }]
            })(
              <Input placeholder='请输入' onPressEnter={this.props.getMenuInfo}/>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label={`菜单名称`}>
          {
            getFieldDecorator(`menuName`,{
                
              initialValue:'',
              rules: [{ required: true,message:'请输入菜单名称' }]
            })(
              <Input disabled placeholder='请输入'/>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label={`路径`}>
          {
            getFieldDecorator(`url`,{
              initialValue:'',
              rules: [{ required: true,message:'请输入路径' }]
            })(
              <Input disabled placeholder='请输入'/>
            )
          }
        </FormItem>
      </Form>
    )
  }
}
const WrapperMenuForm  = Form.create()(MenuAddForm);

@connect(({ subSystem, app })=>({
  subSystem, app
}))
class SubSystem extends PureComponent{
  state = {
    newAddVisible: false,
    addMenuVisible: false,
    subSystemLoading: false,
    loading: false,
    isEdit: false,
    selectedSystemId: '',// 选中子系统的 subSystemId
    addsystemDisable: false,
    deleteBtndisable: false,
    selectedKeys: [],//选中菜单
    btnDisable: false,
    url: null,
    subSystemId: '',// 选中子系统的id 
    system: {},//选中子系统的信息
    query: {},
    editData: {}, //编辑时表单内容
    subSystemName: '',
    title: '新增',
    current: '',
    currentName: '',
    menuData: []
  }
  componentWillMount = () =>{
    this.setState({ loading: true });
    this.genSystemTree();
  }
  genSystemTree = (value) =>{
    this.props.dispatch({
      type: 'subSystem/fetchSubsystemList',
      payload: { searchName: value ? value: ''},
      callback: ()=>this.setState({ loading: false })
    });
  }
  search = (value) =>{
    this.setState({ loading: true, url: null,subSystemId: '',query: {}, system: {},selectedKeys: [],selectedSystemId: '' });
    this.genSystemTree(value);
  }
  /* 
    添加子系统确认
  */
  handelSystemOk = (e) =>{
    e.preventDefault();
      // 新建  isEdit  false   
    this.form_system.validateFields((err,values)=>{
      if(!err){
        if(this.state.isEdit){
          // 编辑
          values.subSystemId = this.state.editData.subSystemId;
          values.subSystemFlag = values.subSystemFlag.length > 1 ? '02':values.subSystemFlag[0];
          delete values.subSystemName;
          console.log(values,'values');
          this.setState({ subSystemLoading: true });
          this.props.dispatch({
            type: 'subSystem/modifySystem',
            payload: values,
            callback: () => this.setState({ subSystemLoading: false, newAddVisible: false  })
          })
          this.setState({ isEdit: false })
        }else{
          if(this.state.system.parentId){
            values.parentId = this.state.system.parentId;
          }
          values.subSystemFlag = values.subSystemFlag.length > 1 ? '02':values.subSystemFlag[0];
          console.log(values,'values');
          this.setState({ subSystemLoading: true });
          this.props.dispatch({
            type:'subSystem/addSubSystem',
            payload: values,
            callback: () => this.setState({ subSystemLoading: false, newAddVisible: false  })
          });
        }
      }
    })
  }
  /* 
    添加新增菜单确认
  */
  handleMenuOk = (e) =>{
    e.preventDefault();
    this.form_menu.validateFields((err,values)=>{
      if(!err){
        console.log(this.state.query,'query')
        let postData = {};
        postData.menuId = values.menuId;
        postData.subSystemId = this.state.selectedSystemId;
        console.log(values,'values');
        this.setState({ subSystemLoading: true })
        this.props.dispatch({
          type: 'subSystem/addMenu',
          payload: postData,
          callback: ()=> {
            this.setState({ subSystemLoading: false, addMenuVisible: false });
            this.refs.table.fetch(this.state.query)
          }
        })
      }
    })
  }
  IconEdit = (item,e) =>{
    e.stopPropagation();
    this.setState({ newAddVisible: true,title: '编辑',isEdit: true, 
    editData: { subSystemId: item.subSystemId, subSystemName: item.subSystemName,subSystemFlag: item.subSystemFlag } });
  }
  handleClick = (e) => {
    console.log(e,'e')
    //e.item.props.subsystemname  子集 
    let system = {};
    system.relFlag = e.item.props.relflag;
    let addsystemDisable = e.item.props.subsystemname ? true: false; // 新建子系统判断 是否可建
    let deleteBtndisable = e.item.props.relflag === '01'? true: false; // 选中子系统是否 可以删除
    let subSystemId = e.item.props.subsystemname ? e.item.props.subsystemid: e.key;
    let selectedKeys = e.key === this.state.selectedKeys[0] ? []: [e.key];
    if(selectedKeys.length === 0 ){
      this.setState({ url: null,subSystemId: '',query: {}, system: {} })
    }else{
      if(this.state.subSystemId !== subSystemId){
        this.setState({ url: ysy.SEARCHMENULIST,subSystemId, query: { subSystemId } })
      }
      if(!e.item.props.subsystemname){
        system.parentId = e.key;
      }
    }
    this.setState({ btnDisable: e.item.props.subsystemname ? false: true, 
      selectedKeys,system, addsystemDisable, deleteBtndisable,
      selectedSystemId: e.key
    });
  }
  //删除
  delete = () =>{
    if(this.state.selectedKeys.length){
      let subSystemId = this.state.selectedSystemId;
      const that = this;
      Modal.confirm({
        title: '提示 ?',
        okText:'确认',
        cancelText:'取消' ,
        content: `是否确认删除该子系统？`,
        onOk(){
          that.props.dispatch({
            type: 'subSystem/deletSubsystem',
            payload: { subSystemId },
            callback: ()=>{
              that.setState({ url: null,subSystemId: '',query: {}, system: {},selectedKeys: [],selectedSystemId: '',confirmLoading: false })
            }
          })
        },
        onCancel(){}

      })
    }else{
      message.warning('请选中任一子系统再进行操作')
    }
  }
  // 输入菜单编号查询菜单信息 
  getMenuInfo = (e) =>{
    console.log(e.target.value,'value');
    let menuId = e.target.value;
    this.props.dispatch({
      type: 'subSystem/findMenuById',
      payload: { menuId }
    });
  }
  onCellChange = (value,record,) => {
    console.log(value,record);
    let values = {};
    values.menuId = record.menuId;
    values.tfRemark = value;
    this.props.dispatch({
      type: 'subSystem/modifyMenu',
      payload: values,
      callback: () => this.refs.table.fetch(this.state.query)
    })
    
  }
  render(){
    const { newAddVisible, title, isEdit,addMenuVisible, 
      loading, btnDisable, query, url, selectedKeys, addsystemDisable, deleteBtndisable, editData } = this.state;
    const { menuData, menuInfo } = this.props.subSystem;
    const columns = [{
      title: '菜单名称',
      dataIndex: 'menuName'
    },{
      title:'菜单编号',
      dataIndex: 'menuId'
    },{
      title:'路径',
      dataIndex: 'url'
    },{
      title:'备注',
      dataIndex: 'tfRemark',
      width: 280,
      render: (text,record,index)=>{
        return (
          <EditableCell
            value={ text }
            record={record}
            index={index}
            max='250'
            cb={(record)=>this.setState({ record })}
            onEditChange={(index,record,editable)=>this.onCellChange(index, record, editable)}
          />
        )
      }
    }]
    return (
    <div className='subSystem ysynet-siderMenu-noborder'>
      <Modal 
        title={title}
        visible={newAddVisible}
        onCancel={()=>this.setState({ newAddVisible: false })}
        footer={[
          <Button key="submit" type='primary' loading={this.state.subSystemLoading} onClick={this.handelSystemOk}>
            确认
          </Button>,
          <Button key="back"  type='default' onClick={()=>this.setState({ newAddVisible: false })}>关闭</Button>
        ]}
      >
        <WrapAddForm 
          ref={(form) => this.form_system = form}
          data={editData}
          isEdit={isEdit}/>
      </Modal>
      <Modal
        title='添加菜单'
        visible={addMenuVisible}
        onCancel={()=>this.setState({ addMenuVisible: false })}
        footer={[
          <Button key="submit" type='primary' loading={this.state.subSystemLoading} onClick={this.handleMenuOk}>
            确认
          </Button>,
          <Button key="back" type='default' onClick={()=>this.setState({ addMenuVisible: false })}>关闭</Button>
        ]}
      >
        <WrapperMenuForm 
          getMenuInfo={this.getMenuInfo}
          menuInfo={menuInfo}
          ref={(form) => this.form_menu = form}  
        />
      </Modal>
      <Row>
        <Col span={5} style={{ borderRight:' dashed 1px rgb(217,217,217)' }}>
          <Row className='ant-row-bottom'>
            <Col>
              <Button type='primary' style={{ marginRight: 8 }} 
                disabled={addsystemDisable}
                onClick={()=>{
                  if(this.form_system){
                    this.form_system.resetFields();
                  }
                  this.setState({ newAddVisible: true })}
                }
                  >
                  新建子系统
                </Button>
              <Button type='default' onClick={this.delete} disabled={deleteBtndisable}>删除</Button>
            </Col>
          </Row>
          <Row className='ant-row-bottom'>
            <Col>
                <Search 
                  style={{ width: 256 }}
                  placeholder='请输入系统名称'
                  onSearch={value => this.search(value)}
                />
            </Col>
          </Row>
          <Spin spinning={loading}>
            <List
              itemLayout='vertical'
              dataSource={menuData}
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                size: 'small',
                pageSize: 1,
              }}
              renderItem={item=>(
                <Menu
                  onClick={this.handleClick}
                  selectedKeys={selectedKeys}
                  style={{ width: 256 }}
                  mode="inline"
                >
                  <Menu.Item subsystemid={item.subSystemId} key={item.subSystemId} subsystemflag={item.subSystemFlag}  relflag={item.relFlag}>
                    <span style={{ fontWeight: 'bold' }}> { item.subSystemName } <Icon type="edit" onClick={this.IconEdit.bind(this,item)} className='menuNode_tool'/> </span>
                  </Menu.Item>
                  {
                    item.children.length
                    &&
                    item.children.map((menu,index)=>{
                      return <Menu.Item className='ysysnet-accredit-subMenu'
                        subsystemid={menu.parentId}
                        relflag={menu.relFlag}
                        subsystemname={item.subSystemName} 
                        key={menu.subSystemId}
                      >
                        {menu.subSystemName}
                      </Menu.Item>
                    })
                  }
                </Menu>
              )}
            >
            </List>
          </Spin>
        </Col>
        <Col span={19} style={{ paddingLeft: 16 }}>
          <Row className='ant-row-bottom'>
            <Col span={12}>
              <Search
                style={{ width: 256 }}
                placeholder='请输入菜单名称/路径/编号'
                onSearch={value => {
                  if(query.subSystemId){
                    this.refs.table.fetch({ subSystemId: query.subSystemId,searchName: value })
                  }else{
                    message.warning('请选中一个子系统')
                  }
                }}
              />
            </Col>
            {
              btnDisable
              &&
              <Col span={12} style={{ textAlign: 'right' }}>
                <Button type='primary' 
                  onClick={()=>{
                    if(this.form_menu){
                      this.form_menu.resetFields();
                    }
                    this.setState({ addMenuVisible: true })}
                }>添加菜单</Button>
              </Col>
            }
          </Row>
          <Row>
            <Col>
              <RemoteTable
                ref='table'
                columns={columns}
                rowKey={'menuId'}
                size='small'
                query={query}
                url={url}
                scroll={{ x: "100%" }}
                showHeader={true}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
    )
  }
}
export default connect(state =>  state)(Form.create()(SubSystem));