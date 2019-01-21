/*
 * @Author: yuwei  召回及锁定审核 /recallAndLockedCheck
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Icon, Select , message , Input ,DatePicker, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import { outStorage } from '../../../../api/drugStorage/outStorage';
import { connect } from 'dva';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
    title: '召回/锁定单号',
    dataIndex: 'recallNo',
    width: 168,
    render: (text, record) => 
    <span>
      <Link to={{pathname: `/purchase/outStorage/recallAndLockedCheck/details/${text}/${record.recallStatus}`}}>{text}</Link>
    </span>
  },
  {
    title: '发起部门',
    dataIndex: 'recallDeptCodeName',
    width: 168
  },
  {
    title: '状态',
    width: 112,
    dataIndex: 'recallStatusName',
  },
  {
    title: '类型',
    width: 168,
    dataIndex: 'recallTypeName',
  },
  {
    title: '供应商',
    width: 224,
    dataIndex: 'supplierName',
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '发起人',
    width: 112,
    dataIndex: 'createUserName',
  },
  {
   title: '发起时间',
   width: 224,
   dataIndex: 'createDate',
  },
  {
    title: '审核人',
    width: 112,
    dataIndex: 'updateUserName',
  },
  {
    title: '审核时间',
    width: 224,
    dataIndex: 'updateDate',
  },
  {
    title: '原因',
    dataIndex: 'remarks',
    width: 280
  }
];
/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
  state = {
    recall_status_options: [],
    recallReason: [],
    initDept: []
  }
  componentDidMount = () =>{
    const { dispatch } = this.props.formProps;
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: { type: 'recall_status' },
      callback: (data) =>{
        let res = data.filter(item => item.value === '' || item.value === '1' || item.value === '2' || item.value === '4');
        this.setState({ recall_status_options: res });
      }
    });
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'recall_reason'
      },
      callback: (data) => {
        this.setState({
          recallReason: data
        });
      }
    });
    dispatch({
      type: 'outStorage/getDeptInfoAndStore',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            initDept: data
          });
        }else {
          message.error(msg);
        };
      }
    })
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
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const makingTime = values.makingTime === undefined || values.makingTime === null ? "" : values.makingTime;
        if (makingTime.length > 0) {
          values.startTime = makingTime[0].format('YYYY-MM-DD');
          values.endTime = makingTime[1].format('YYYY-MM-DD');
        }else {
          values.startTime = '';
          values.endTime = '';
        };
        this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
        });
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
 
  render() {
    const { recall_status_options, recallReason, initDept } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={'发起部门'} {...formItemLayout}>
              {getFieldDecorator('recallDeptCode',{
                initialValue: ''
              })(
                <Select
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                > 
                  <Option key="" value="">全部</Option>
                  {
                    initDept.map((item,index)=> (
                      <Option key={item.id} value={item.id}>{item.deptName}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={'单据号'} {...formItemLayout}>
              {getFieldDecorator('recallNo',{
                initialValue: ''
              })(
                <Input placeholder={'请输入'} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={'状态'} {...formItemLayout} style={{ display }}>
              {getFieldDecorator('recallStatus', {
                initialValue: recall_status_options.length ? recall_status_options[0].value: null
              })(
                <Select
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                  {
                     recall_status_options.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ display }}>
            <FormItem label={'原因'} {...formItemLayout}>
              {getFieldDecorator('recallReasonType',)(
                <Select
                  placeholder="请选择原因"
                  style={{width: '100%'}}
                >
                  {
                    recallReason.map(item => (
                      <Option key={item.value} value={item.value}>{item.label}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem style={{ display }} label={'发起时间'} {...formItemLayout}>
              {getFieldDecorator('makingTime')(
                <RangePicker format={'YYYY-MM-DD'} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={'供应商'} {...formItemLayout} style={{ display }}>
              {getFieldDecorator('supplierName', {
                initialValue: ''
              })(
                <Input placeholder={'请输入'} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
          </Col>
          <Col span={8} style={{ float: 'right', textAlign: 'right', marginTop: 4 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
            <a style={{ marginLeft: 8, fontSize: 14 }} onClick={this.toggle}>
              {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
 }
const SearchForm = Form.create()(SearchFormWrapper);
class RecallAndLockedCheck extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      selectedRows: [],
      batchLoading: false,
    }
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  bitchPass = () =>{
    let { selectedRows, query } = this.state;
    if(selectedRows.length === 0){
      return message.warning('请至少选中一条数据');
    }
    let detailList = [];
    selectedRows.map(item => detailList.push({ recallNo: item.recallNo }));
    this.setState({
      batchLoading: true
    })
    this.props.dispatch({
      type: 'outStorage/batchAudit',
      payload: { detailList },
      callback: () =>{
        message.success('批量处理成功');
        this.refs.table.fetch(query);
        this.setState({
          batchLoading: false
        })
      }
    })

  }
  render(){
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.makingTime;
    delete query.key;
    let {batchLoading} = this.state;
    
    return (
      <div className='ysynet-main-content'>
        <SearchForm
          formProps={{...this.props}}
        />
        <Row>
          <Button type='primary' className='button-gap'onClick={this.bitchPass} loading={batchLoading}> 批量通过</Button>
        </Row>
        <RemoteTable
          ref='table'
          query={query}
          url={outStorage.ROOMRECALL_SHEVE_LIST}
          scroll={{x: '100%'}}
          isDetail={true}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 20}}
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            },
            getCheckboxProps: record => ({
              disabled: record.recallStatus !== '1',
            })
          }}
        /> 
      </div>
    )
  }
}
export default  connect(state => state)(RecallAndLockedCheck) ;
