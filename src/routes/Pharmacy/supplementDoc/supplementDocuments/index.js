/*
 * @Author: gaofengjiao  补登单据 
 * @Date: 2018-08-06 17:40:15 
* @Last Modified time: 17:40:15 
 */
import React, { PureComponent } from 'react';
import { DatePicker , Form, Input ,Select , Row, Col, Button, Icon, message  ,Modal } from 'antd';
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
class SpplementDocList extends PureComponent{

  state = {
    selected: [],
    selectedRows: [],
    loading: false,
    dataSource: [],
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  delete = () =>{
    const selected = this.state.selected;
    if (selected.length === 0) {
      message.warn('请至少选择一条数据')
    } else {
      Confirm({
        title:"确定执行删除操作吗？",
        onOk:()=>{
          this.setState({ loading: true });
          //出发删除请求
          this.props.dispatch({
            type:'pharmacy/DeleteMakeup',
            payload:{idList:selected},
            callback:(data)=>{
              message.success('删除成功')
              this.setState({loading: false,selected:[],selectedRows: []});
              this.refs.table.fetch();
            }
          })
        }
      })
      
    }
  }

  render(){
    let query = this.props.base.queryConditons;
    query = {...query};
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
           <Link to={{pathname: `/pharmacy/supplementDoc/supplementDocuments/detail/${record.makeupCode}`}}>{text}</Link>
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
        width: 112,
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
        <SearchForm formProps={{...this.props}} />
        <div className='ant-row-bottom'>
          <Button type='primary' onClick={()=>this.props.history.push({ pathname: `/AddSupplementDoc` })}>补登出库单</Button>
          <Button type='default' onClick={()=>this.props.history.push({ pathname: `/AddInSupplementDoc` })} style={{ marginLeft: 8 }}>补登入库单</Button>
          <Button type='default' onClick={this.delete} style={{ marginLeft: 8 }}>删除</Button>
        </div>
         <RemoteTable 
          onChange={this._tableChange}
          ref='table'
          query={query}
          style={{marginTop: 20}}
          columns={columns}
          loading={this.state.loading}
          scroll={{ x: 1624 }}
          url={supplementDoc.list}
          rowSelection={{
            selectedRowKeys: this.state.selected, 
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            }
          }}
          rowKey='id'
        />
      </div>
    )
  }
}
export default connect(state=>state)(SpplementDocList);

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
        })
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
      if(values.Time && values.Time.length){
        values.startTime = moment(values.Time[0]).format('YYYY-MM-DD');
        values.endTime = moment(values.Time[1]).format('YYYY-MM-DD');
      };
      if(values.reviewTime && values.Time.length){
        values.reviewstartTime = moment(values.reviewTime[0]).format('YYYY-MM-DD');
        values.reviewendTime = moment(values.reviewTime[1]).format('YYYY-MM-DD');
      };
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
                    initialValue: ''
                  })(
                    <Select >
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
                    <Select >
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