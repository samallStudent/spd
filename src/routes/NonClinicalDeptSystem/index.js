import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Select,Popconfirm,message } from 'antd';
import RemoteTable from '../../components/TableGrid';
import { CommonData } from '../../utils/utils';
// import jxh from '../../api/jxh'
import { connect } from 'dva';
const { Search } = Input;
const { Option } = Select;
const EditableCell = ({ value, record, index, onEditChange, options, column, max }) => (
  <div>
    {
      (record.editable && record.index === index) ?
      column === 'configValue' ?
      <Select
        onSelect={(value)=> onEditChange(value,record,index,column)} 
        defaultValue={record.configValue}
        style={{ width: '100%' }}>
        {
          options.map((item,index)=>{
            return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
          })
        }
      </Select>
      :
      <Input style={{ margin: '-2px 0' }} defaultValue={value} onChange={e => onEditChange(e.target.value, record, index, column, max)} />
      : 
      value
    }
  </div>
);
class NonClinicalDeptSystem extends PureComponent{
  state = {
    query: {},
    record: {}
  }
  edit = (record,stateRecord,index)=>{
    if(stateRecord.editable){
      let values = {};
      values.dsGuid = stateRecord.dsGuid;
      values.configName = stateRecord.configName;
      values.tfRemark = stateRecord.tfRemark;
      values.configValue = stateRecord.configValue;
      values.dsType = stateRecord.dsType;
      console.log(values,'values');
      this.props.dispatch({
        type: 'subSystemConfig/saveConfig',
        payload: values,
        callback: () => this.refs.table.fetch()
      })
      this.setState({ record: {...record, editable: false,index } })
    }else{
      console.log('编辑')
      if(record.configCode){
        CommonData(record.configCode, (data) => {
          this.setState({ options: data })
        });
      }
      this.setState({ record: {...record, editable: true, index } })
    }
  }
  delete = (record)=>{
    let values = {};
    values.dsGuid = record.dsGuid;
    values.dsType = record.dsType;
    this.props.dispatch({
      type: 'subSystemConfig/deleteRecord',
      payload: values,
      callback: () => this.refs.table.fetch()
    })
  }
  onCellChange = (value,record,index,column,max) => {
    if(column !== 'configValue'){
      if(value.length > max){
        message.warning(`输入字符长度不能超过${max}`)
      }else{
        record[column] = value;
        this.setState({ record });
      }
    }else{
      record[column] = value;
      this.setState({ record });
    }
  }
  renderColumns(text, record, index, column, max) {
    return (
      <EditableCell
        value={ text }
        index={index}
        column={column}
        options={this.state.options}
        record={this.state.record}
        max={max}
        onEditChange={(text, index, record, column, max)=>this.onCellChange(text, index, record, column, max)}
      />
    );
  }
  render(){
    const columns = [{
      title: '编号',
      dataIndex: 'No',
      render: (text,record,index)=>{
        return index + 1;
      }
    },{
      title: '参数分类',
      dataIndex: 'configType',
    },{
      title: '参数名称',
      dataIndex: 'configName',
      width: 200,
      render: (text, record, index) => {
        return this.renderColumns(text, record, index,'configName',100)
      }
    },{
      title: '代码',
      dataIndex: 'configCode',
    },{
      title: '默认值',
      dataIndex: 'configValueName',
      width: 200,
      render: (text, record, index) => {
        return this.renderColumns(text, record, index,'configValue')
      }
    },{
      title: '备注',
      dataIndex: 'tfRemark',
      width: 250,
      render: (text, record, index) => {
        return this.renderColumns(text, record, index,'tfRemark',250)
      }
    },{
      title: '操作',
      dataIndex: 'action',
      width: 90,
      fixed: 'right',
      render: (text,record,index)=>{
        return <span>
          {
            record.configCode ?
            <a onClick={this.edit.bind(null,record,this.state.record,index)}>{ this.state.record.editable && this.state.record.index===index ? '保存': '编辑' }</a>
            :
            <Popconfirm title="是否确认删除此条记录?" onConfirm={this.delete.bind(null, record)} okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
          }
          
        </span>
      }
    }]
    const { query } = this.state;
    return (
      <div>
        <Row className='ant-row-bottom'>
          <Col span={4}>
            <Button type='primary' onClick={()=>this.refs.table.fetch()}>更新</Button>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            <Search 
              style={{ width: 256 }}
              placeholder='请输入参数名称/参数分类'
              onSearch={value => this.refs.table.fetch({ searchName: value }) }
            />
          </Col>
        </Row>
        <RemoteTable 
          ref='table'
          url={'/Configure/findSubSystemConfigList'}
          rowKey={'dsGuid'}
          scroll={{ x:'100%' }}
          query={query}
          columns={columns}
          showHeader={true}
        />
      </div>
    )
  }
}
export default connect(state =>  state)(NonClinicalDeptSystem);