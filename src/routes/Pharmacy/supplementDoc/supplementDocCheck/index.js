/*
 * @Author: gaofengjiao  补登单据 
 * @Date: 2018-08-06 17:40:15 
* @Last Modified time: 17:40:15 
 */
import React, { PureComponent } from 'react';
import { DatePicker , Form, Input ,Select, Icon, Row, Col, Button  , message  ,Modal } from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import { Link } from 'react-router-dom';
import { supplementDoc } from '../../../../api/pharmacy/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import moment from 'moment';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const  Confirm = Modal.confirm;
class Putaway extends PureComponent{

  state = {
    selected: [],
    selectedRows: [],
    loading: false,
    query:{makeupStatus:2}
  }

  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }

  onCheck = (state)=>{
    const selected = this.state.selected;
    if (selected.length === 0) {
      message.warn('请至少选择一条数据')
    } else {
      Confirm({
        title:"确定执行此操作？",
        onOk:()=>{
          let postData = {
            makeuplist:selected.map(item=>{ return {makeupCode:item}}),
            type:state
          }
          this.props.dispatch({
            type:'pharmacy/CheckMakeupDetail',
            payload:postData,
            callback:(data)=>{
              message.success('审核状态变更成功！');
              this.refs.table.fetch(this.state.query)
              this.setState({selected:[],selectedRows:[]})
            }
          })
        }
      })
    }
   
  } 

  render(){
    let query = this.props.base.queryConditons;
    query = {...this.state.query, ...query};
    delete query.key;
    delete query.Time;
    delete query.reviewTime;
    const columns = [
      {
       title: '补登单号',
       width: 280,
       dataIndex: 'makeupCode',
       render: (text,record) =>{
        return <span>
           <Link to={{pathname: `/pharmacy/supplementDoc/supplementDocCheck/detail/${record.makeupCode}`}}>{text}</Link>
         </span>
        }
      },
      {
        title: '入库/出库单',
        width: 280,
        dataIndex: 'storeCode',
      },
      {
        title: '状态',
        width: 112,
        dataIndex: 'makeupStatusName',
      },
      {
        title: '部门',
        width: 168,
        dataIndex: 'deptName',
      },
      {
        title: '类型',
        width: 168,
        dataIndex: 'makeupTypeName',
      },
      {
        title: '补登人',
        width: 112,
        dataIndex: 'createUserName',
      },
      {
        title: '补登时间',
        width: 224,
        dataIndex: 'createDate',
        render:(text,record)=>text?text.substr(0,11):''
      },
      {
        title: '审核人',
        width: 112,
        dataIndex: 'reviewUserName',
      },
      {
        title: '审核时间',
        width: 224,
        dataIndex: 'reviewDate',
        render:(text,record)=>text?text.substr(0,11):''
      }
    ];
    return (
      <div className='ysynet-main-content'>
        <SearchForm formProps={{...this.props}}/>
        <div className='ant-row-bottom'>
          <Button type='primary' onClick={()=>this.onCheck(1)} >批量通过</Button>
          <Button type='default' onClick={()=>this.onCheck(2)} style={{ marginLeft: 8 }}>批量驳回</Button>
        </div>
        <RemoteTable 
          onChange={this._tableChange}
          ref='table'
          query={query}
          style={{marginTop: 20}}
          columns={columns}
          loading={this.state.loading}
          scroll={{ x: 1680 }}
          url={supplementDoc.list}
          rowSelection={{
            selectedRowKeys: this.state.selected, 
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            }
          }}
          rowKey='makeupCode'
        />
      </div>
    )
  }
}
export default connect(state=>state)(Putaway);

/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {

  state={
    state:[],
    type:[]
  }

  componentDidMount = () =>{
    this.props.formProps.dispatch({
      type:'base/orderStatusOrorderType',
      payload: { type : 'makeup_status' },
      callback:(data)=>{
        this.setState({
          fstate:data
        });
      }
    });
    this.props.formProps.dispatch({
      type:'base/orderStatusOrorderType',
      payload: { type : 'makeup_type' },
      callback:(data)=>{
        this.setState({
          type:data
        })
      }
    });
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
  toggle = () => {
      this.props.formProps.dispatch({
        type:'base/setShowHide'
      });
    }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.Time){
        values.startTime = moment(values.Time[0]).format('YYYY-MM-DD');
        values.endTime = moment(values.Time[1]).format('YYYY-MM-DD');
      }
      if(values.reviewTime){
        values.reviewstartTime = moment(values.reviewTime[0]).format('YYYY-MM-DD');
        values.reviewendTime = moment(values.reviewTime[1]).format('YYYY-MM-DD');
      }
      this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
        });
    });
  }
 //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { type , fstate } = this.state;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`单据号`} {...formItemLayout}>
              {getFieldDecorator('makeupCode', {})(
                <Input placeholder='补登单据/入库/出库单号'/>
              )}
            </FormItem>
          </Col>
        
          <Col span={8}>
            <FormItem label={`补登时间`} {...formItemLayout}>
              {getFieldDecorator('Time', {})(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col style={{display}} span={8}>
            <FormItem label={`审核时间`} {...formItemLayout}>
              {getFieldDecorator('reviewTime', {})(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col style={{display}} span={8}>
              <FormItem {...formItemLayout} label={`状态`}>
                {
                  getFieldDecorator(`makeupStatus`,{
                    initialValue: fstate && fstate.length?`2`:''
                  })(
                    <Select placeholder="请输入">
                      {
                        fstate && fstate.length ?
                        fstate.map(item=>(
                          <Option key={item.value} value={item.value}>{item.label}</Option>
                        )):null
                      }
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col style={{display}} span={8}>
              <FormItem {...formItemLayout} label={`类型`}>
                {
                  getFieldDecorator('makeupType',{
                    initialValue: ''
                  })(
                    <Select placeholder="请输入">
                      {
                        type && type.length ?
                        type.map(item=>(
                          <Option key={item.value} value={item.value}>{item.label}</Option>
                        )):null
                      }
                    </Select>
                  )
                }
              </FormItem>
            </Col>
          <Col span={8} style={{ float:'right',textAlign: 'right', marginTop: 4}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{margin: '0 8px'}} onClick={this.handleReset}>重置</Button>
            <a style={{fontSize: 14}} onClick={this.toggle}>
              {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchForm = connect(state=>state)(Form.create()(SearchFormWrapper)); 