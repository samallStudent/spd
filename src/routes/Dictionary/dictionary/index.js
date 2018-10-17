/* 
  @file 字典管理
*/
import React, { PureComponent } from 'react';
import { Row, Col, Input, Button,Layout,Tree,Icon, Spin, Form,Modal } from 'antd';
import RemoteTable from '../../../components/TableGrid';
import ysy from '../../../api/ysy'
import { connect } from 'dva';
const FormItem = Form.Item;
const { Search, TextArea } = Input;
const { Content, Sider } = Layout;
const TreeNode = Tree.TreeNode;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
}

class Dictionary extends PureComponent{
  state = {
    query: {},
    staticId:'' ,
    ExpandedKeys:[],
    SelectedKeys:[],
    loading: false,
    visible: false,
    gridData: false,
    title: '新建字典',
    isEdit: false,
    dirtyClick: false,
    record: {}
  }
  componentWillMount = () =>{
    this.setState({ loading: true })
    this.props.dispatch({
      type: 'dictionary/searchTree',
      payload: {},
      callback: ()=>this.setState({ loading: false })
    })
  }
  onSelect = (selectedKeys, info) => {
    this.setState({
      staticId: selectedKeys[0],
      query:{'staticId':selectedKeys[0]}
    })
    if (selectedKeys.length) {
      this.setState({gridData: false})
      this.refs.table.fetch({'staticId':selectedKeys[0]});
    } else {
      this.setState({gridData: []})
    }
  }
  edit = (record) =>{
    this.setState({ title: '编辑', visible: true, record, isEdit: true });
  }
  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if(!err){
        let { record,isEdit } = this.state;
        this.setState({ dirtyClick: true });
        if(isEdit){
          // 编辑
          values.staticDataGuid = record.staticDataGuid;
          values.staticId = record.staticId;
          console.log(values,'values');
          this.props.dispatch({
            type: 'dictionary/updateStaticData',
            payload: values,
            callback: ()=> {
              this.setState({ dirtyClick: false });
              this.refs.table.fetch();
            }
          })
        }else{
          // 新增
          values.staticId = this.state.staticId === "" ? this.state.SelectedKeys[0] : this.state.staticId;
          this.props.dispatch({
            type: 'dictionary/insertData',
            payload: values,
            callback: ()=> {
              this.setState({ dirtyClick: false });
              this.refs.table.fetch();
            }
          })
        }
      }
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { defaultExpandedKeys, defaultSelectedKeys, treeData } = this.props.dictionary;
    let { query,ExpandedKeys,SelectedKeys, loading, title, visible, isEdit, record, dirtyClick } = this.state;
    ExpandedKeys = [defaultExpandedKeys];
    SelectedKeys = [defaultSelectedKeys];
    query.staticId = defaultSelectedKeys;
    const columns = [{
      title: '编码',
      dataIndex: 'tfCloCode',
    }, {
      title: '名称',
      dataIndex: 'tfCloName',
    },{
      title: '操作',
      dataIndex: 'actions',
      render: (text, record) => {
        return (
          <span>
            <a onClick={this.edit.bind(null,record)}> 编辑 </a>
          </span>
        )
      }
    }];
    const loop = data => data.map((item) => {
      if (item.children.length>0) {
        return <TreeNode title={item.tfComment} key={item.staticId}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode title={item.tfComment} key={item.staticId}/>;
    });
    const treeNodes = loop(treeData);
    return (
      <div>
        {
          defaultExpandedKeys === "" || defaultSelectedKeys === "" ? null
          :
          <Layout style={{background:'#fff'}}>
          <Sider style={{ overflow: 'auto' ,background:'#fff',border:'1px solid #ddd'}}>
            <Spin tip='数据加载中' spinning={loading}>
              <Tree 
                defaultExpandedKeys={ExpandedKeys}
                defaultSelectedKeys={SelectedKeys}
                onSelect={this.onSelect}
              >
                {treeNodes}
              </Tree>
            </Spin>
          </Sider>
          <Content style={{ marginLeft:'8px', overflow: 'initial' }}>
            <Row className='ant-row-bottom'>
              <Col span={10}>
                <Search
                  ref='search'
                  placeholder="名称编号"
                  style={{ width: 260 }}
                  onSearch={value =>  this.refs.table.fetch({'searchParams':value,'staticId':this.state.staticId})}
                />
              </Col>
              <Col span={10} offset={4} style={{textAlign: 'right'}}>
                <Button type="primary" onClick={()=>{
                    this.props.form.resetFields();
                    this.setState({ visible: true,title: '新建字典',isEdit: false });
                  }} > 
                  <Icon type="plus" />{'新建分类'}
                </Button>
              </Col> 
            </Row>
            <Modal 
              title={title}
              visible={visible}
              width={460}
              onCancel={()=>this.setState({ visible: false })}
              footer={null}
            >
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label="编码" hasFeedback>
                {
                  getFieldDecorator('tfCloCode', {
                    rules: [{ required: true, message: '请输入编码!' },
                    {max:20,message:'字符长度不能超过20'}],
                    initialValue: isEdit ? record.tfCloCode: ''
                  })(
                    <Input />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="名称" hasFeedback>
                {
                  getFieldDecorator('tfCloName', {
                  rules: [{ required: true, message: '请输入编号!', whitespace: true },
                  {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                  {max:20,message:'字符长度不能超过20'}],
                  initialValue: isEdit ? record.tfCloName: ''
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="备注" >
                {
                  getFieldDecorator('tfRemark',{
                    initialValue: isEdit ? record.tfRemark: ''
                  })(
                  <TextArea  rows={4}/>
                )}
              </FormItem>
              <FormItem wrapperCol={{ span: 22,offset: 2 }}>
                <Button type="primary" htmlType="submit" style={{ width: '95%' }} loading={dirtyClick}>保存</Button>
              </FormItem>
            </Form>
            </Modal>
              {
                query.staticId
                &&
                <RemoteTable 
                  data={this.state.gridData}
                  query={query}
                  ref='table'
                  columns={columns}
                  showHeader={true}
                  scroll={this.props.scroll || { x: '100%' }}
                  url={ysy.ITEMSDATADETAILS_LIST}
                  rowKey='staticDataGuid'
                />
              }
            </Content>
          </Layout>
        }
      </div>
    )
  }
}
export default connect(state =>  state)(Form.create()(Dictionary));