import React, { PureComponent } from 'react';
import { Input, Row, Popconfirm, message } from 'antd';
import RemoteTable from '../../../components/TableGrid';
import ysy from '../../../api/ysy'
import { connect } from 'dva';
const { Search } = Input;

const EditableCell = ({ value, record, index, onEditChange, column, max }) => (
  <div>
    {
      (record.editable && record.index === index) ?
      <Input style={{ margin: '-2px 0' }} defaultValue={value} onChange={e => onEditChange(e.target.value, record, index, column, max)} />
      : 
      value
    }
  </div>
  );
class ManagerMgt extends PureComponent{
  state = {
    query: {},
    record: {}
  }
  renderColumns(text, record, index, column, max) {
    return (
      <EditableCell
        value={ text }
        index={index}
        column={column}
        record={this.state.record}
        max={max}
        onEditChange={(text, index, record, column, max)=>this.onCellChange(text, index, record, column, max)}
      />
    );
  }
  resetPwd = (record) =>{
    this.props.dispatch({
      type: 'managerMgt/resetPwd',
      payload: { userId: record.userId,restPwd: '01' },
      callback: ()=> this.refs.table.fetch()
    })
  }
  
  edit = (record,stateRecord,index) =>{
    if(stateRecord.editable){
      let values = {};
      values.userId = stateRecord.userId;
      values.userName = stateRecord.userName;
      values.mobilePhone = stateRecord.mobilePhone;
      values.tfRemark = stateRecord.tfRemark;
      this.props.dispatch({
        type: 'managerMgt/modifyAdmin',
        payload: values,
        callback: ()=> this.refs.table.fetch()
      })
      this.setState({ record: {...record, editable: false,index } })
    }else{
      console.log('编辑');
      this.setState({ record: {...record, editable: true, index } })
    }
  }
  onCellChange = (value,record,index,column,max) => {
    if(value.length > max){
      message.warning(`输入字符长度不能超过${max}`)
    }else{
      record[column] = value;
      this.setState({ record });
    }
  }
  render(){
    const columns = [{
      title: '账号',
      dataIndex: 'userNo'
    },{
      title: '姓名',
      dataIndex: 'userName',
      width: 150,
      render: (text,record,index)=>{
        return this.renderColumns(text,record,index,'userName',50)
      }
    },{
      title: '联系电话',
      dataIndex: 'mobilePhone',
      width: 150,
      render: (text,record,index)=>{
        return this.renderColumns(text,record,index,'mobilePhone')
      }
    },{
      title: '部署名称',
      dataIndex: 'deployName'
    },{
      title: '机构名称',
      dataIndex: 'orgName'
    },{
      title: '备注',
      dataIndex: 'tfRemark',
      width: 200,
      render: (text,record,index)=>{
        return this.renderColumns(text,record,index,'tfRemark',250)
      }
    },{
      title: '操作',
      dataIndex: 'action',
      render: (text,record,index) =>{
        return <span>
          <Popconfirm title="是否确认重置该用户密码?" onConfirm={this.resetPwd.bind(null, record)} okText="是" cancelText="否">
            <a>重置密码</a>
          </Popconfirm>
          <a style={{ marginLeft: 8 }} onClick={this.edit.bind(null,record,this.state.record,index)}>{ this.state.record.editable && this.state.record.index===index ? '保存': '编辑' }</a>
        </span>
      }
    }]
    return (
      <div>
        <Row className='ant-row-bottom'>
          <Search 
            style={{ width: 256 }}
            placeholder='账号/部署名/机构名'
            onSearch={value=>this.refs.table.fetch({ searchName: value })}
          />
        </Row>
        <RemoteTable
          ref='table' 
          query={this.state.query}
          url={ysy.SEARCHADMINLIST}
          columns={columns}
          rowKey='userId'
          size='small'
          scroll={{ x: '100%' }}
          showHeader={true}
        />
      </div>
    )
  }
}
export default connect(state =>  state)(ManagerMgt);