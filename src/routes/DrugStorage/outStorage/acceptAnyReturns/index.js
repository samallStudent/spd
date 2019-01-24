/*
 * @Author: yuwei  拣货下架 /pickSoldOut
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Icon , message , Select , Input , DatePicker ,} from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import { outStorage } from '../../../../api/drugStorage/outStorage';
import { connect } from 'dva';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
  state = {
    deptOptions: [], // 申领部门
    picking_status: [], //拣货状态
    picking_type: []// 拣货类型
  }
  componentDidMount = () =>{ 
    const { dispatch } = this.props.formProps;
    // 申领部门
    dispatch({
      type: 'outStorage/findApplyDepts',
      payload: {},
      callback: (data) => {
        this.setState({ deptOptions: data })
      }
    });

    // 拣货状态
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: { type : 'picking_status' },
      callback: (data) =>{
        this.setState({ picking_status: data })
      }
    });
    //拣货类型
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: { type : 'dept_picking_type' },
      callback: (data) =>{
        this.setState({ picking_type: data })
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
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const Time = values.Time === undefined || values.Time === null ? "" : values.Time;
        if(Time.length > 0) {
          values.startTime = values.Time[0].format('YYYY-MM-DD');
          values.endTime = values.Time[1].format('YYYY-MM-DD');
        }else {
          values.startTime = '';
          values.endTime = '';
        };
        console.log(values, '查询条件');
        this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
        });
      }
    })
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
 
  render() {
    const { deptOptions, picking_status, picking_type } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
     <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`申领部门`} {...formItemLayout}>
              {getFieldDecorator('deptCode', {
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
                  deptOptions.map((item,index)=> <Option key={index} value={ item.id } depttype={item.deptType}>{ item.deptName }</Option>)
                }
               </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`状态`} {...formItemLayout}>
              {getFieldDecorator('pickingStatus', {
                initialValue: ''
              })(
               <Select 
                 showSearch
                 placeholder={'请选择'}
                 optionFilterProp="children"
                 filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                 >
                  {
                    picking_status.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                  }
               </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`类型`} {...formItemLayout}>
              {getFieldDecorator('pickingType')(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                  {
                    picking_type.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`单据号`} {...formItemLayout}>
              {getFieldDecorator('applyOrderNo',{
                initialValue: ''
              })(
               <Input placeholder='拣货单/申领单'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`发起时间`} {...formItemLayout}>
              {getFieldDecorator('Time')(
               <RangePicker format={'YYYY-MM-DD'}/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
              {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
 }
const SearchForm = Form.create()(SearchFormWrapper);
class PickSoldOut extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      messageError:"",
      selectedRowKeys:[],
      query: {
        queryType: 1
      }
    }
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }

  //单行确认 
  confirmOk = () => {
    message.success('操作成功')
  }

  //打印
  print = (record) => {
    window.open(`${outStorage.PICKING_PRINT}?pickingOrderNo=${record.pickingOrderNo}`, '_blank');
  }

  render(){
    const columns = [
      {
        title: '拣货单',
        dataIndex: 'pickingOrderNo',
        width: 168,
        render:(text,record)=>(
          <span>
            <Link to={{pathname: `/drugStorage/outStorage/acceptAnyReturns/details/${text}/${record.pickingStatus}/${record.pickingType}`}}>{text}</Link>
          </span> 
        )
      },
      {
       title: '受理部门',
       dataIndex: 'deptName',
       width: 168,
      },
      {
        title: '状态',
        dataIndex: 'statusName',
        width: 112,
      },
      {
        title: '类型',
        width: 168,
        dataIndex: 'type',
      },
      {
        title: '发起人',
        dataIndex: 'createUserName',
        width: 112,
      },
      {
        title: '发起时间',
        dataIndex: 'createDate',
        width: 224,
      },
      {
        title: '拣货时间',
        dataIndex: 'updateDate',
        width: 224,
      },
      {
        title: '操作',
        width: 60,
        dataIndex: 'RN',
        render: (text, record) => <a onClick={this.print.bind(this, record)}>打印</a>
      }
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...this.state.query, 
      ...query
    };
    delete query.Time;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <SearchForm 
          formProps={{...this.props}}
        />
        <RemoteTable
          onChange={this._tableChange}
          bordered
          ref='table'
          query={query}
          url={outStorage.FINDPICKINGORDER_LIT}
          scroll={{x: '100%'}}
          isDetail={true}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 20}}
        />
      </div>
    )
  }
}
export default connect(state => state)(PickSoldOut);

