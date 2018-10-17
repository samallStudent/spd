/*
 * @Author: yuwei 
 * @Date: 2018-08-22 14:39:17 
* @Last Modified time: 2018-08-22 14:39:17 
 */
/**
 * @file 系统管理--角色管理--角色-新增
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, message, Spin, Tree} from 'antd';
import { connect } from 'dva';
import { formItemLayout } from '../../../../utils/commonStyles';
import { menuFormat } from '../../../../utils/utils';
import {difference} from 'lodash';
const FormItem = Form.Item;
const {TreeNode} = Tree;
class AddRoleMgt extends PureComponent{

  state = {
    loading: false,
    dataSource: [],
    checkedKeys: []
  }

   //提交表单
   onSubmit = () => {
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if(!err){
        if(this.state.checkedKeys && this.state.checkedKeys.length){
          let menuIds = this.state.checkedKeys;
          menuIds.push('1');//添加功能菜单ID;
          this.props.dispatch({
            type: 'systemRole/RoleSave',
            payload: { menuIds,...values},
            callback: (data) => {
              console.log(data,'RoleSave')
              message.success('保存成功！')
              this.props.history.push('/sys/role/roleMgt')
            }
          })
        }else{
          message.warn('请至少选择一个角色权限！')
        }
      }
    })  
  }
  
  componentDidMount() {
    this.props.dispatch({
      type: 'systemRole/allMenuList',
      callback: (data) => {
        let dataSource = menuFormat(data, true);
        this.setState({
          dataSource,
          loading: false
        });
      }
    });
  }

  titleRender = (item) => {
    return <p style={{margin: 0}}>
            <span style={{width: 150, display: 'inline-block'}}>{item.name}</span>
            <span>{item.href}</span>
           </p>
  }
  //渲染树形菜单
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={this.titleRender(item)} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={this.titleRender(item)} key={item.id} dataRef={item} />;
    });
  }

  onCheck = (checkedKey, e) => {
    let {checkedKeys} = this.state;
    let ids = this.getIds(e.node.props.dataRef);
    if(e.checked) {  //选中push
      checkedKeys = [...new Set([...checkedKeys, ...ids])];
    }else {       //反选去除
      checkedKeys = difference(checkedKeys, ids);
    };
    this.setState({checkedKeys});
  }
  getIds = (record) => {
    let ids = []
    ids.push(record.id);
    if(record.children) {
      idsTree(record.children)
    }
    function idsTree(tree) {
      tree.map(item => {
        ids.push(item.id);
        if(item.children) {
          idsTree(item.children)
        };
        return item;
      })
    };
    return ids;
  }
  //取消 - 提交表单
  goBack = () => {
    const { history } = this.props;
    history.push({pathname:'/sys/role/roleMgt'})
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { dataSource, loading, checkedKeys } = this.state;
    return (
      <div className="fullCol">
        <div className='detailCard'>
          <h3 style={{margin: 0}}>角色信息</h3>
          <hr className="hr"/>
          <Form>
              <Row gutter={30}>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={`角色名称`}>
                    {
                      getFieldDecorator(`name`,{
                        initialValue: '',
                        rules:[{required:true,message:'请输入角色名称！'}]
                      })(
                        <Input placeholder='请输入' />
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={`备注`}>
                    {
                      getFieldDecorator(`remarks`,{
                        initialValue: ''
                      })(
                        <Input placeholder='请输入' />
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
          </Form>
        </div>
        
        <Spin spinning={loading}>
          <div className='detailCard'>
            <h3>角色权限</h3>
            <hr className='hr'/>
            <Tree
              checkable
              checkedKeys={dataSource.length > 0 ? checkedKeys : []}
              checkStrictly
              onCheck={this.onCheck}
            >
              {this.renderTreeNodes(dataSource)}
            </Tree>
            <div style={{textAlign: 'right'}}>
              <Button
                style={{padding: 20, margin: 5}}
                type="primary"
                onClick={() => {this.onSubmit()}}
              >
                确认
              </Button>
              <Button
                style={{padding: 20, margin: 5}}
                onClick={() => {this.goBack()}}
              >
                取消
              </Button>
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}
export default connect(state=>state)( Form.create()(AddRoleMgt) );