/*
 * @Author: gaofengjiao  补登单据 
 * @Date: 2018-08-06 17:40:15 
* @Last Modified time: 17:40:15 
 */
import React, { PureComponent } from 'react';
import { DatePicker , Form, Input ,Select, Icon, Row, Col, Button  , message } from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import { Link } from 'react-router-dom';
import { supplementDoc } from '../../../../api/pharmacy/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import moment from 'moment';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
class Putaway extends PureComponent{

  state = {
    selected: [],
    selectedRows: [],
    loading: false,
    query:{
      makeupType: 3,
      type: 1
    },
    batchloading: false
  }

  batchSend = () => {
    const {selectedRows} = this.state;
    if(selectedRows.length === 0) {
      return message.warning('请选择一条数据');
    };
    this.setState({
      batchloading: true
    })
    const dispenseCodeList = selectedRows.map(item => item.storeCode);
    this.props.dispatch({
      type: 'pharmacy/batchSend',
      payload: { dispenseCodeList },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          message.success('发送成功');
          this.refs.table.fetch();
          this.setState({
            batchloading: false
          });
        }else {
          message.error(msg);
          this.setState({
            batchloading: false
          });
        };
      }
    });
  }

  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }

  render(){
    let query = this.props.base.queryConditons;
    query = {...query, ...this.state.query};
    delete query.key;
    delete query.Time;
    let {batchloading} = this.state; 
    const columns = [
      {
       title: '发药单',
       width: 168,
       dataIndex: 'storeCode',
       render: (text,record) =>{
        return <span>
           <Link to={{pathname: `/purchase/supplementDoc/dispensing/detail/${record.makeupCode}`}}>{text}</Link>
         </span>
        }
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
        title: '是否计入结算',
        width: 168,
        dataIndex: 'sfjrjs',
        render: () => '是'
      },
      {
        title: '补登时间',
        width: 224,
        dataIndex: 'createDate'
      },
      {
        title: '发送人',
        width: 112,
        dataIndex: 'reviewUserName',
      },
      {
        title: '发送时间',
        width: 224,
        dataIndex: 'reviewDate',
      }
    ];
    return (
      <div className='ysynet-main-content'>
        <SearchForm formProps={{...this.props}}/>
        <div className='ant-row-bottom'>
          <Button type='primary' onClick={this.batchSend} loading={batchloading}>批量发送</Button>
        </div>
        <RemoteTable 
          onChange={this._tableChange}
          ref='table'
          query={query}
          style={{marginTop: 20}}
          columns={columns}
          loading={this.state.loading}
          isDetail={true}
          scroll={{ x: '100%',  }}
          url={supplementDoc.makeList}
          rowSelection={{
            selectedRowKeys: this.state.selected, 
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            },
            getCheckboxProps: record => ({
              disabled: record.makeupStatus !== 2,
            })
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
      type:'pharmacy/getDeptByParam',
      payload: {
        deptType: 4
      },
      callback:({data, code, msg})=>{
        if(code === 200) {
          this.setState({
            deptList: data
          });
        }else {
          message.error(msg);
        };
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
    const { deptList , fstate } = this.state;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`单据号`} {...formItemLayout}>
              {getFieldDecorator('paramCode', {})(
                <Input placeholder='发药单号'/>
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
              <FormItem {...formItemLayout} label={`状态`}>
                {
                  getFieldDecorator(`makeupStatus`)(
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
              <FormItem {...formItemLayout} label={`部门`}>
                {
                  getFieldDecorator('deptCode')(
                    <Select placeholder="请输入">
                      <Option key='' value=''>全部</Option>
                      {
                        deptList && deptList.length ?
                        deptList.map(item=>(
                          <Option key={item.id} value={item.id}>{item.deptName}</Option>
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