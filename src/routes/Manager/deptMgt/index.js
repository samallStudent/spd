import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Button, Select, Modal, Table, Popconfirm, Checkbox, message } from 'antd';
import RemoteTable from '../../../components/TableGrid';
import jxh from '../../../api/jxh';
import { connect } from 'dva';
import { formItemLayout } from '../../../utils/commonStyles';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const EditableCell = ({ editable, value, onChange }) => (
  <div>
  {editable
      ? <Input style={{ margin: '-3px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
  }
  </div>
);
class SearchForm extends PureComponent{
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.query(values);
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row >
          <Col span={10} key={1}>
            <FormItem {...formItemLayout} label={'名称'}>
              {getFieldDecorator('searchName',{
                initialValue: ''
              })(
                <Input placeholder="请输入" style={{ width: 248 }}/>
              )}
            </FormItem>
          </Col>
            <Col span={10} key={6}>
              <FormItem {...formItemLayout} label={'状态'}>
                {getFieldDecorator('fstate',{
                  initialValue: '-1'
                })(
                  <Select placeholder="请选择" style={{ width: 248 }}>
                    <Option value="-1">全部</Option>
                    <Option value="00">停用</Option>
                    <Option value="01">启用</Option>
                  </Select>
                )}
              </FormItem>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">搜索</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class AddForm extends PureComponent{
  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if(!err){
        if(this.props.isEdit){
          //编辑
          values.deptGuid = this.props.data.deptGuid;
          this.props.cb(values);
          console.log(values,'values')
        }else{
          //新增
          console.log(values,'values')
          this.props.cb(values);
        }
      }
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { data, isEdit, loading } = this.props;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label={`科室名称`}>
          {
            getFieldDecorator(`deptName`,{
              initialValue: isEdit ? data.deptName: '',
              rules: [{ required: true,message: '请输入科室名称' }]
            })(
              <Input placeholder='请输入'/>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label={`科室编码`}>
          {
            getFieldDecorator(`deptCode`,{
              initialValue: isEdit ? data.deptCode: '',
              rules: [{ required: true,message: '请输入科室编码' }]
            })(
              <Input placeholder='请输入'/>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label={`状态`}>
          {
            getFieldDecorator(`fstate`,{
              initialValue: isEdit ? data.fstate: null,
            })(
              <Select placeholder='请选择'>
                <Option key={-1} value='01'>启用</Option>
                <Option key={-1} value='00'>停用</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label={`简码`}>
          {
            getFieldDecorator(`fqun`,{
              initialValue: isEdit ? data.fqun: '',
            })(
              <Input placeholder='请输入'/>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label={`备注`}>
          {
            getFieldDecorator(`tfRemark`,{
              initialValue: isEdit ? data.tfRemark: '',
            })(
              <TextArea rows={4} placeholder='请输入'/>
            )
          }
        </FormItem>
        <FormItem wrapperCol={{ span: 22,offset: 2 }}>
          <Button type='primary' style={{ width: '100%' }} loading={loading} htmlType='submit'>确定</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrapperAddForm = Form.create()(AddForm);
class DeptMgt extends PureComponent{
  state = {
    query: {},
    title: '添加',
    visible: false,
    loading: false,
    addressVisible: false,
    record: {},
    ModalColumns: [{
        title: '联系人',
        dataIndex: 'linkman',
        width:'15%',
        render: (text, record, index) => this.renderColumns(text, record, 'linkman')
    },{
        title: '联系电话',
        dataIndex: 'linktel',
        width:'25%',
        render: (text, record, index) => this.renderColumns(text, record, 'linktel')
    },{
        title: '地址',
        dataIndex: 'tfAddress',
        width:'35%',
        render: (text, record, index) => this.renderColumns(text, record, 'tfAddress')
    },{
      title: '是否默认地址',
      dataIndex: 'isDefault',
      render: (text, row, index) => 
        <Checkbox
          disabled={row.editable? false : true}
          dataIndex={index}
          checked={row.isDefault==='01'?true:false}
          defaultChecked={text==='01'? true: false}
          onChange={this.onCheckChanage}
        />
    },{
      title: '操作',
      dataIndex: 'actions',
      width: 150,
      render: (text,record,index) => {
        const { editable } = record;
          return (
            <span>
              <Popconfirm title={record.isDefault==='01' ? "该项是默认地址，是否删除？" : "是否删除？"} onConfirm={() => this.onDelete(record,index)}>
                  <a style={{ marginRight: 30 }}>删除</a>
              </Popconfirm>
              <a onClick={() => this.update(record.key)}>{editable?'保存':'修改'}</a>
            </span>
          )
      }
    }]
  }
  queryHandle = (query) => {
    this.refs.table.fetch(query);
    this.setState({ query })
  }
  edit = (record) =>{
    this.setState({ record,visible: true,title: '编辑',isEdit: true })
  }
  address = (record) =>{
    this.setState({ addressVisible: true, record })
    this.fetchAddressData();
  }
  // 获取科室地址列表
  fetchAddressData = () =>{
    this.setState({ tableLoading: true });
    this.props.dispatch({
      type: 'deptMgt/searchDeptAddress',
      payload: { deptGuid: this.state.record.deptGuid },
      callback: ()=>this.setState({ tableLoading: false })
    })
  }
  submit = (value) =>{
    this.setState({ loading: true });
    this.props.dispatch({
      type: 'deptMgt/insertOrmodify',
      payload: value,
      callback: () =>{
        this.setState({ visible: false,loading: false });
        this.modalForm.resetFields();
        this.refs.table.fetch();
      }
    })
  }
  handleChange(value, key, column) {
    let len = (column === 'linkman' || column === 'linktel') ? 25: 50;
    let text = column === 'linkman'? '联系人': column === 'linktel'?'联系电话': '地址';
    if(value.length > len){
      return message.warning(`${text}的长度不能超过${len}`);
    }
    const newData = [...this.props.deptMgt.addressData];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      // this.setState({ dataSource: newData });
      this.props.dispatch({
        type: 'deptMgt/updateAddress',
        payload: target
      })
    }
  }
  onCheckChanage = (e) => {
    var index = e.target.dataIndex;
    const dataSource = [ ...this.props.deptMgt.addressData ];
    dataSource.map((item,idx) => {
      if(index === idx){
        e.target.checked = true;
        dataSource[idx]['isDefault'] = '01';
      }else{
        e.target.checked = false;
        dataSource[idx]['isDefault'] = '00';
      }
      return null;
    });
    this.setState({dataSource});
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  // 修改科室地址信息
  update(key) {
    const newData = [...this.props.deptMgt.addressData];
    const target = newData.filter(item => key === item.key)[0];
    console.log(target,'target')
    if (target) {
      target.editable = !target.editable
      if(!target.editable){
        let flag = false;
        newData.map(item => {
          if(item.isDefault === '01'){
            flag = true;
          }
          return null;
        });
        if(flag){
          let postData = {
            tfAddress: target.tfAddress,
            linkman: target.linkman,
            linktel: target.linktel,
            isDefault: target.isDefault,
            addrGuid: target.addrGuid,
            tfCloGuid: this.state.record.deptGuid
          }
          console.log(postData,'postData');
          this.setState({ tableLoading: true });
          this.props.dispatch({
            type: 'deptMgt/modifyAddress',
            payload: postData,
            callback: () => {
              this.fetchAddressData()
              this.setState({ tableLoading: false })
            }
          })
        }else{
          message.warning('您没有设置默认地址,请设置默认地址')
        }
      }else{
        this.props.dispatch({
          type: 'deptMgt/editable',
          payload: target
        })
      }
    }
  }
  // 删除科室地址
  onDelete = (record,index) =>{
			const newData = [ ...this.props.deptMgt.addressData];
			if(record.addrGuid){
        this.props.dispatch({
          type: 'deptMgt/deleteAddress',
          payload: { addrGuid: record.addrGuid },
          callback: ()=> this.fetchAddressData()
        })
			}else{
        // 删除页面上地址，无交互
				newData.splice(index,1);
				this.props.dispatch({
          type: 'deptMgt/delete',
          payload: newData
        })
			}
  }
  // 添加科室地址
  handleAdd = () =>{
    const { count } = this.props.deptMgt;
    if(count >= 10){
      return message.warning('科室地址只能添加10条记录');
    }
    const newData = {
      key: count,
      linkman: '',
      linktel: '',
      tfAddress: '',
      isDefault: '00'
    };
    this.props.dispatch({
      type: 'deptMgt/addAddress',
      payload: newData
    });
  }
  render(){
    const { visible, title, record, isEdit, loading, addressVisible, tableLoading, ModalColumns } = this.state;
    const { addressData } = this.props.deptMgt;
    const columns = [{
        title: '科室名称',
        dataIndex: 'deptName'
    },{
        title : '状态',
        dataIndex : 'fstate',
        width: '80',
        render:  FSTATE => {
          return FSTATE === '00'? <span style={{ color: 'red' }}>停用</span>: FSTATE === '01'?<span style={{ color: 'green' }}>启用</span>:''
        }
    },{
        title : '编码',
        dataIndex : 'deptCode',
        width: '15%',
    },{
        title: '简码',
        dataIndex: 'fqun'
    },{
        title : '默认地址',
        className: 'ysy-text-overflow',
        dataIndex : 'defaultAddress',
        render: text => <span title={text}>{text}</span>
    },{
        title: '操作',
        dataIndex: 'actions',
        render: (text,record,index) =>{
          return (
            <span>
              <a onClick={this.edit.bind(null,record)}>编辑</a>
              <a style={{ marginLeft: 8 }} onClick={this.address.bind(null,record)}>地址</a>
            </span>
          )
        }
    }]
    return (
      <div>
        <Row className='ant-row-bottom'>
          <Col span={4}>
            <Button type='primary' onClick={()=>{
              if(this.modalForm){
                this.modalForm.resetFields();
              }
              this.setState({ visible: true,title: '新增',isEdit: false })
            }}>添加</Button>
          </Col>
          <Col span={14} offset={6} style={{ textAlign: 'right' }}>
            <WrapperForm  query={this.queryHandle}/>
          </Col>
        </Row>
        <Modal
          title={title}
          visible={visible}
          width={460}
          style={{ top: 20 }}
          onCancel={()=>this.setState({ visible: false })}
          footer={null}
        >
          <WrapperAddForm 
            data={record}
            isEdit={isEdit}
            loading={loading}
            cb={value=>this.submit(value)}
            ref={(form)=>this.modalForm = form}
          />
        </Modal>
        <Modal
          title='科室地址'
          width={1100}
          style={{ top: 20 }}
          visible={addressVisible}
          onCancel={()=>this.setState({ addressVisible: false })}
          footer={null}
        >
          <div>
            <div>
              <Button type='primary' icon='plus' onClick={this.handleAdd}>添加地址</Button>
            </div>
            <Table 
              bordered
              loading={tableLoading}
              columns={ModalColumns}
              dataSource={addressData}
              style={{ marginTop: 10 }}
              pagination={false}
              rowKey='key'
              size='small'
            />
          </div>
        </Modal>
        <RemoteTable 
          ref='table'
          url={jxh.DEPT_LIST}
          rowKey={'deptGuid'}
          scroll={{ x:'100%' }}
          query={this.state.query}
          columns={columns}
          showHeader={true}
        />
      </div>
    )
  }
}
export default connect(state =>  state)(DeptMgt);