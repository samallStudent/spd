/*
 * @Author: yuwei 
 * @Date: 2018-08-22 10:50:34 
* @Last Modified time: 2018-08-22 10:50:34 
 */

import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Select , Radio , Affix , Modal , Tree, Spin } from 'antd';
import { connect } from 'dva';
import querystring from 'querystring';
import { DeptSelect } from '../../../../common/dic';
import { menuFormat } from '../../../../utils/utils';
const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;
const singleFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
class AddMenuMgt extends PureComponent{

  state = {
    spining: false,
    baseInfo:{},
    loading: false,
    visible:false,
    treeDataSource:[],//树状菜单的所有列表
    treeSelectedKeys:[],
    treeInfo:{},
    selectCache:{},//打开上级菜单之前存储的内容
    parentId:''
  }

  componentWillMount (){
    //编辑的时候进行回填操作
    const params = this.props.match.params.id;
    const paramsJson = querystring.parse(params);
    if(params && paramsJson.id){
      //console.log('编辑')
      this.setState({ spining: true });
      this.props.dispatch({
        type:'sysSetting/MenuDetail',
        payload:paramsJson,
        callback:(data)=>{
          this.setState({
            baseInfo:data.data,
            spining: false
          })
        }
      })
    }else if(params && paramsJson.parentId){
      //console.log('添加下级菜单')
      this.setState({
        treeSelectedKeys:[paramsJson.parentId]
      })
      this.props.form.setFieldsValue({parentName:paramsJson.parentName})
    }

    this.props.dispatch({
      type:'sysSetting/MenuList',
      payload:{},
      callback:(data)=>{
        let ret = menuFormat(data.data,true) ;
        this.setState({treeDataSource:ret})
      }
    })
  }

  //提交表单
  onSubmit = () => {
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if(!err){
        const { baseInfo,treeSelectedKeys } = this.state;
        values['parent.id'] = treeSelectedKeys.length ? treeSelectedKeys[0]: baseInfo.parentId ;
        delete values['parent']
        delete values['parentName']
        values.depType = Number(values.depType)
        if(baseInfo.id){//修改的时候传递ID
          values.id=baseInfo.id
        }
        console.log(JSON.stringify(values),'新增菜单')
        this.props.dispatch({
          type: 'sysSetting/MenuSave',
          payload: values,
          callback: (data) => {
            // message.success('添加成功！');
            this.props.history.push('/sys/menu/menuMgt');
            /* 
              这里要重新获取菜单
            */
          }
        })
      }
    })  
  }

  //取消 - 提交表单
  goBack = () => {
    const { history } = this.props;
    history.push({pathname:'/sys/menu/menuMgt'})
  }

  // 选择上级菜单 
  onSelect = (treeSelectedKeys, treeInfo)=> {
    //存储选择信息 以及 相关 key 值
    this.setState({
      treeSelectedKeys,
      treeInfo
    })
  }
  //选择上级菜单
  submitModal =()=>{
    const { treeInfo , treeSelectedKeys} = this.state;
    this.setState({
      visible:false,
      parentId:treeSelectedKeys,
      selectCache:{
        treeSelectedKeys,treeInfo
      }
    })
    this.props.form.setFieldsValue({'parentName':treeInfo.node.props.title})
  }

  //取消选择上级菜单
  cancelSubmitModal = () => {
    const { selectCache } = this.state;
    if(selectCache.treeSelectedKeys && selectCache.treeInfo){
      this.setState({
        visible:false,
        treeSelectedKeys:selectCache.treeSelectedKeys,
        treeInfo:selectCache.treeInfo,
      })
      this.props.form.setFieldsValue({'parent.id':selectCache.treeInfo.node.props.title})
    }else{
      this.setState({visible:false})
    }
  }
  loop = (data) => {
    if(data) {
      return data.map((item) => {
        if (item.children && item.children.length) {
          return <TreeNode key={item.id} title={item.name}>{this.loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.id} title={item.name} />;
      });
    }else {
      return null;
    }
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { visible , baseInfo , treeDataSource, spining } = this.state;
    return (
      <Spin spinning={spining}>  
        <div className='ysynet-main-content'>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`上级菜单`}>
                  {
                    getFieldDecorator(`parentName`,{// parent.id
                      initialValue:baseInfo?baseInfo.parentName:'',
                      rules: [{ required: true,message: '请输入' }]
                    })(
                      <Input onClick={()=>this.setState({visible:true})  } />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`菜单名称`}>
                  {
                    getFieldDecorator(`name`,{
                      initialValue:baseInfo?baseInfo.name:'',
                      rules: [{ required: true,message: '请输入' }]
                    })(
                      <Input />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`链接`}>
                  {
                    getFieldDecorator(`href`,{
                      initialValue:baseInfo?baseInfo.href:'',
                      // rules: [{ required: true,message: '请输入' }]
                    })(
                      <Input />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`图标`}>
                  {
                    getFieldDecorator(`icon`,{
                      initialValue:baseInfo?baseInfo.icon:'',
                    })(
                      <Input />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`排序`}>
                  {
                    getFieldDecorator(`sort`,{
                      initialValue:baseInfo?baseInfo.sort:'',
                      rules: [{ required: true,message: '请输入' }]
                    })(
                      <Input />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6}>
                  <span style={{padding:8,display:' inline-block'}}>排序顺序，升序</span>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`部门类型`}>
                  {
                    getFieldDecorator(`depType`,{
                      initialValue:baseInfo.depType?`${baseInfo.depType}`:'',
                      rules: [{ required: true,message: '请选择部门类型' }]
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                        >
                        {
                          DeptSelect.map((item,index)=>(
                            <Option value={`${item.value}`} key={item.value}>{item.text}</Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`是否可见`}>
                  {
                    getFieldDecorator(`isShow`,{
                      initialValue:baseInfo?baseInfo.isShow:'1',
                    })(
                      <Radio.Group>
                        <Radio value='1' key='1'>是</Radio>
                        <Radio value='0' key='0'>否</Radio>
                      </Radio.Group>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6}>
                  <span style={{padding:8,display:' inline-block'}}>该菜单是否显示在系统菜单中。</span>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`权限标识`}>
                  {
                    getFieldDecorator(`permission`,{
                      initialValue:baseInfo?baseInfo.permission?baseInfo.permission:'':'',
                    })(
                      <Input placeholder='请输入' />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                  <span style={{padding:8,display:' inline-block'}}>控制器中定义的权限标识，如：@RequiresPermissions("权限标识")</span>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`备注`}>
                  {
                    getFieldDecorator(`remarks`,{
                      initialValue:baseInfo?baseInfo.remarks:'',
                    })(
                      <Input.TextArea placeholder='请输入' />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </Form>

          <Affix offsetBottom={0} className='affix'  style={{textAlign: 'right',marginLeft:'-16px',marginRight:'-16px'}}>
              <Button
                style={{float:'right',padding:20,margin:5}}
                type="primary"
                onClick={() => {this.onSubmit()}}
              >
                确认
              </Button>
              <Button
                style={{float:'right',padding:20,margin:5}}
                onClick={() => {this.goBack()}}
              >
                取消
              </Button>
          </Affix>

          <Modal 
            visible={visible}
            onOk={()=>this.submitModal()}
            onCancel={()=>this.cancelSubmitModal()}
            title='上级菜单'
            >
              <Tree
                showLine
                defaultExpandedKeys={['0-0-0']}
                onSelect={this.onSelect}
              >
                {this.loop(treeDataSource)}
              </Tree>
            </Modal>
        </div>
      </Spin>
    )
  }
}
export default connect(state=>state)(Form.create()(AddMenuMgt));