import React, { PureComponent } from 'react';
import { Button, Row, Col, Form, Input, Table, DatePicker, Modal, Checkbox } from 'antd';
import RemoteTable from '../../../components/TableGrid';
import  FetchSelect from '../../../components/FetchSelect'
import { formItemLayout } from '../../../utils/commonStyles';
import ysy from '../../../api/ysy'
import { connect } from 'dva';
import moment from 'moment';
const { Search,TextArea } = Input;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class ModalForm extends PureComponent{
  render(){
    const { getFieldDecorator } = this.props.form;
    const { data, isEdit } = this.props;
    return (
      <Form className="ant-advanced-search-form">
        {
          isEdit ? 
          <FormItem {...formItemLayout} label={`部署名称`}>
            {
              getFieldDecorator(`orgId`,{
                initialValue: isEdit ? data.deployName: ''
              })(
                <Input  disabled/>
              )
            }
          </FormItem>
          :
          <FormItem {...formItemLayout} label={`部署名称`}>
            {
              <FetchSelect url={`/orgInfoController/findOrgs`} query={{flag: '00'}} cb={(orgId)=>this.props.cb({ orgId })}/>
            }
          </FormItem>
        }
        <FormItem {...formItemLayout} label={`授权码`}>
          {
            getFieldDecorator(`keyCode`,{
              initialValue: isEdit ? data.keyCode: ''
            })(
              <Input  disabled/>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label={`授权有效期`}>
          {
            getFieldDecorator(`usefulDate`,{
              initialValue: isEdit? [moment(data.usefulDate,'YYYY-MM-DD'),moment(data.usefulDate,'YYYY-MM-DD')]:'',
              rules: [{ required: true,message: '请选择授权日期' }]
            })(
              <RangePicker format="YYYY-MM-DD"/>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label={`备注`}>
          {
            getFieldDecorator(`tfRemark`,{
              initialValue: isEdit ? data.tfRemark:''
            })(
              <TextArea rows={4}/>
            )
          }
        </FormItem>
      </Form>
    )
  }
}
const WrapperModalForm = Form.create()(ModalForm);


const ModalColumns = [{
  title: '机构名称',
  dataIndex: 'orgName'
}]
class Arrange extends PureComponent{
  state = {
    addVisible: false,
    arrangeVisible: false,
    saveLoading: false,
    isEdit: false,
    leftSelected: [],
    leftSelectedRows: [],
    rightSelected: [],
    rightSelectedRows: [],
    LeftIndeterminate: true,
    leftCheckAll: false,
    rightIndeterminate: true,
    rightCheckAll: false,
    title: '新建部署',
    record: {},
    query: {}
  }
  /* 
    获取所有机构列表
  */
  searchLeftOrgList = (record) =>{
    this.search('left','',record);
  }
  saveDeploy = () =>{
    this.AddOrEditforms.validateFields((err,values)=>{
      if(!err){
        values.orgId = this.state.orgId;
        if(this.props.isEdit){
          values.deployId = this.state.record.deployId;
          values.orgId = this.state.record.deployName;
        }
        values.startTime = values.usefulDate[0].format('YYYY-DD-MM');
        values.endTime = values.usefulDate[1].format('YYYY-DD-MM');
        delete values.usefulDate;
        this.setState({ saveLoading: true });
        console.log(values,'values');
        this.props.dispatch({
          type: 'arrange/saveArrange',
          payload: values,
          callback: ()=>{
            this.setState({ saveLoading: false, addVisible: false });
            this.refs.table.fetch();
          }
        })
      }
    })
  }
  onLeftCheckAllChange = (e) => {
    let allOrgIdList = [];
    let { orgList } = this.props.arrange;
    orgList.map(item => allOrgIdList.push(item.orgId));
    this.setState({
      leftSelected: e.target.checked ? allOrgIdList : [],
      leftSelectedRows: e.target.checked ? orgList: [],
      LeftIndeterminate: false,
      leftCheckAll: e.target.checked,
    });
  }
  onRightCheckAllChange = (e) => {
    let rightOrgIdList = [];
    let { targetKeys } = this.props.arrange;
    targetKeys.map(item => rightOrgIdList.push(item.orgId));
    this.setState({
      rightSelected: e.target.checked ? rightOrgIdList : [],
      rightSelectedRows: e.target.checked ? targetKeys: [],
      rightIndeterminate: false,
      rightCheckAll: e.target.checked,
    });
  }
  leftSearch = (value) =>{
    this.search('left',value)
  }
  rightSearch = (value) =>{
    this.search('right',value)
  }
  search = (dir,value,record) =>{
    let values = {};
    values.deployId = this.state.record.deployId || record.deployId;
    if(value){
      values.searchName = value;
    }
    values.flag = dir === 'right'?'00':'01'
    this.props.dispatch({
      type: 'arrange/search',
      payload: { ...values }
    })
  }
  addOrg = () =>{
    this.props.dispatch({
      type: 'arrange/transfer',
      payload: { data: [...this.state.rightSelectedRows], key: 'add' }
    });
    this.setState({ rightSelected: [], rightSelectedRows: [],rightCheckAll: false });
  }
  removeOrg = () =>{
    this.props.dispatch({
      type: 'arrange/transfer',
      payload: { data: [...this.state.leftSelectedRows], key: 'remove' }
    });
    this.setState({ leftSelected: [], leftSelectedRows: [],leftCheckAll: false });
  }
  // 编辑部署 确定保存
  modifyOrg = () =>{
    let addOrgIds = [];
    this.props.arrange.orgList.map(item => addOrgIds.push(item.orgId));
    let values = {};
    values.deployId = this.state.record.deployId;
    values.addOrgIds = addOrgIds;
    this.setState({ saveLoading: true });
    this.props.dispatch({
      type: 'arrange/modifyOrg',
      payload: values,
      callback: ()=>{
        this.setState({ saveLoading: false,arrangeVisible: false });
        this.refs.table.fetch();
      }
    })
  }
  //清空模态框部署机构表格
  clearTable = () =>{
    this.props.dispatch({
      type: 'arrange/clearTable',
      payload: {}
    })
  }
  render(){
    const { leftTableLoading, rightTableLoading, orgList, targetKeys } = this.props.arrange;
    const { record, isEdit, addVisible, arrangeVisible, title } = this.state;
    const columns = [{
      title:'部署名称',
      dataIndex: 'deployName'
    },{
      title:'授权码',
      dataIndex: 'keyCode'
    },{
      title:'授权有效期',
      dataIndex: 'usefulDate'
    },{
      title:'管理员账号',
      dataIndex: 'userNo'
    },{
      title:'最后编辑时间',
      dataIndex: 'modifyTime'
    },{
      title:'机构数量',
      dataIndex: 'orgCount'
    },{
      title:'备注',
      dataIndex: 'tfRemark'
    },{
      title: '操作',
      dataIndex: 'action',
      render:(text,record)=>{
        return <span>
          <a onClick={()=>{
            this.setState({ title: '编辑部署', record,isEdit: true,addVisible: true })
          }}>编辑</a>
          <a style={{ marginLeft: 8 }} onClick={()=>{
            this.setState({ record,arrangeVisible: true })
            this.clearTable();
            this.searchLeftOrgList(record);
          }}>部署机构</a>
        </span>
      }
    }]
    return (
    <div>
      <Row className='ant-row-bottom'>
        <Col span={4}>
          <Button type='primary' icon='plus' onClick={()=>{
              if(this.AddOrEditforms){
                this.AddOrEditforms.resetFields();
              }
              this.setState({ title: '新建部署',record: {},isEdit: false,addVisible: true })
            }}>添加
          </Button>
        </Col>
        <Col span={20} style={{ textAlign:'right' }}>
          <Search 
            style={{ width: 300 }}
            placeholder='部署名称/授权码/管理员账号'
            onSearch={value =>  this.refs.table.fetch({ searchName: value })}
          />
        </Col>
      </Row>
      <Modal
        title={title}
        className='ant-modal-center-footer'
        visible={addVisible}
        onCancel={()=>this.setState({ addVisible: false })}
        footer={[
          <Button key="submit" type='primary' loading={this.state.saveLoading} onClick={this.saveDeploy}>
            保存
          </Button>,
          <Button key="back"  type='default' onClick={()=>this.setState({ addVisible: false })}>关闭</Button>
        ]}
      >
        <WrapperModalForm 
          cb={(orgId)=>this.setState(orgId)}
          ref={(form) => this.AddOrEditforms = form}
          data={record}
          isEdit={isEdit}
        />
      </Modal>
      <Modal
        className='ysynet-ant-modal'
        title='部署机构'
        width={1100}
        visible={arrangeVisible}
        onCancel={()=>this.setState({ arrangeVisible: false })}
        footer={[
          <Button key="submit" type='primary' loading={this.state.saveLoading} onClick={this.modifyOrg}>
            保存
          </Button>,
          <Button key="back"  type='default' onClick={()=>this.setState({ arrangeVisible: false })}>取消</Button>
        ]}
      >
        <h3 style={{ padding: '10px 0 10px 10px',background:'#fff' }}>{ record.deployName}</h3>
        <Row className='ysynet-transfer'>
          <Col span={11}>
            <div className='ysynet-transfer-header'>
              <div>
                <Checkbox 
                  disabled={orgList.length === 0? true: false}
                  indeterminate={this.state.LeftIndeterminate}
                  onChange={this.onLeftCheckAllChange}
                  checked={this.state.leftCheckAll}
                />
                <span style={{ marginLeft: 16 }}>已添加机构</span>
              </div>
              <div>
                <span><span>{this.state.leftSelected.length ? `${this.state.leftSelected.length}/`:'' }</span>{orgList.length}</span>
              </div>
            </div>
            <Search 
              style={{ margin: '10px 0' }}
              placeholder='请输入搜索内容'
              onSearch={this.leftSearch}
            />
            <Table 
              dataSource={orgList}
              columns={ModalColumns}
              loading={leftTableLoading}
              pagination={false}
              showHeader={false}
              size={'small'}
              rowKey={'orgId'}
              rowSelection={{
                selectedRowKeys: this.state.leftSelected,
                onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                  leftSelected: selectedRowKeys,
                  leftSelectedRows: selectedRows,
                  LeftIndeterminate: !!selectedRowKeys.length && (selectedRowKeys.length < orgList.length),
                  leftCheckAll: selectedRowKeys.length === orgList.length,
                  })
                }
            }}
            />
          </Col>
          <Col span={2} style={{ textAlign:'center',alignSelf:'center' }}>
            <Button type='primary'disabled={this.state.rightSelected.length === 0? true : false} onClick={this.addOrg}>添加</Button>
            <Button type='primary' style={{ marginTop: 16 }} disabled={this.state.leftSelected.length === 0 ? true : false} onClick={this.removeOrg}>移除</Button>
          </Col>
          <Col span={11}>
            <div className='ysynet-transfer-header'>
              <div>
                <Checkbox 
                  disabled={targetKeys.length === 0? true: false}
                  indeterminate={this.state.rightIndeterminate}
                  onChange={this.onRightCheckAllChange}
                  checked={this.state.rightCheckAll}
                />
                <span style={{ marginLeft: 16 }}>未添加机构</span>
              </div>
            </div>
            <Search 
              style={{ margin: '10px 0' }}
              onSearch={this.rightSearch}
              placeholder='请输入搜索内容'/>
            <Table 
              columns={ModalColumns}
              pagination={false}
              showHeader={false}
              loading={rightTableLoading}
              dataSource={targetKeys}
              size={'small'}
              rowKey={'orgId'}
              rowSelection={{
                selectedRowKeys: this.state.rightSelected,
                onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                  rightSelected: selectedRowKeys, 
                  rightSelectedRows: selectedRows,
                  rightIndeterminate: !!selectedRowKeys.length && (selectedRowKeys.length < targetKeys.length),
                  rightCheckAll: selectedRowKeys.length === targetKeys.length,
                  })
                }
            }}
            />
          </Col>
        </Row>
      </Modal>
      <RemoteTable 
        ref='table'
        url={ysy.SEARCHDEPLOYLIST}
        columns={columns}
        query={this.state.query}
        rowKey={'deployId'}
        size={'small'}
        showHeader={true}
      />
    </div>
    )
  }
}
export default connect(state =>  state)(Arrange);
