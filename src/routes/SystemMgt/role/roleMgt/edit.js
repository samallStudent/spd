/*
 * @Author: yuwei 
 * @Date: 2018-08-22 14:39:17 
* @Last Modified time: 2018-08-22 14:39:17 
 */
/**
 * @file 系统管理--角色管理--角色-新增
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, message, Tree, Spin} from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import { menuFormat } from '../../../../utils/utils';
import _ from 'lodash';
import { connect } from 'dva';
const FormItem = Form.Item;
const {TreeNode} = Tree;
class EditRoleMgt extends PureComponent{

  state = {
    loading: false,
    baseInfo:{},//回显信息
    checkedKeys:[],
    dataSource: [],
    saveLoading: false,
  }

   //提交表单
  onSubmit = () => {
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if(!err){
        this.setState({
          saveLoading: true
        });
        let { baseInfo , checkedKeys } = this.state;
        checkedKeys.push('1');//添加功能菜单ID;
        const postData ={
          id:baseInfo.id,
          menuIds:checkedKeys,
          name:baseInfo.name,
          ...values
        }
        console.log(postData);
        
        this.props.dispatch({
          type:'systemRole/RoleSave',
          payload:postData,
          callback: (data) => {
            this.setState({
              saveLoading: false
            });
            message.success('修改成功！')
            this.props.history.push('/sys/role/roleMgt')
          }
        })
      }
    })  
  }

  componentDidMount (){
    this.setState({loading: true});
    this.props.dispatch({
      type: 'systemRole/RoleDetail',
      payload: this.props.match.params,//{id:[]}
      callback: (data) => {
        let checkedKeys = data.data.menuIds.split(',').filter(item => item !== '1');
        this.setState({
          baseInfo:data.data,
          checkedKeys,
        })
      }
    });
    this.props.dispatch({
      type: 'systemRole/allMenuList',
      callback: (data) => {
        let dataSource = menuFormat(data, true);
        this.setState({
          dataSource,
          loading: false
        });
      }
    })
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
  //标记
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
  //选中
  onCheck = (checkedKey, e) => {
    let {checkedKeys} = this.state;
    let ids = this.getIds(e.node.props.dataRef);
    if(e.checked) {  //选中push
      checkedKeys = [...new Set([...checkedKeys, ...ids])];
    }else {       //反选去除
      checkedKeys = _.difference(checkedKeys, ids);
    }
    this.setState({checkedKeys});
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const {baseInfo, checkedKeys, dataSource, loading, saveLoading} = this.state;
    return (
      <div className='fullCol'>
        <div className='detailCard'>
          <h3>
            基本信息
            <Button 
              type='primary' 
              style={{float:'right'}} 
              onClick={this.onSubmit}
              loading={saveLoading}
            >保存</Button>
          </h3>
          <hr className="hr"/>
          <Form>
              <Row gutter={30}>
                <Col span={8}>
                  <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                    角色名称 :&nbsp;
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                    <div className="ant-form-item-control">
                      <span className="ant-form-item-children">
                        {baseInfo.name}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={`备注`}>
                    {
                      getFieldDecorator(`remarks`,{
                        initialValue:baseInfo?baseInfo.remarks:''
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
          </div>
        </Spin>
      </div>
    )
  }
}
export default connect( state=>state )( Form.create()(EditRoleMgt) );