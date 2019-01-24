/*
 * @Author: 抢救车目录管理
 * @Date: 2018-08-28 17:42:54 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-06 21:48:20
 */

import React , {PureComponent} from 'react';
import { Form, Row, Col, Button, Select, message } from 'antd';
import {Link} from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { baseMgt } from '../../../../api/pharmacy/configMgt';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },//5
    md: {span: 8}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
    md: {span: 16}
  },
};

class SearchForm extends PureComponent{
  state = {
    deptList: [],
    rescueCarList: []
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.deptCodeList) {
        values.deptCodeList = [values.deptCodeList]
      }else {
        values.deptCodeList = [];
      }
      this.props.formProps.dispatch({
        type:'base/updateConditions',
        payload: values
      });
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }

  baseListRender = (baseList) => {
    return baseList.map(item => {
      return <Option key={item.id} value={item.id}>{item.deptName}</Option>
    })
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
    dispatch({
      type: 'configMgt/findRoomDeptlist',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            rescueCarList: data
          });
        }else {
          message.error(msg);
        };
      }
    });
    dispatch({
      type: 'base/findDeptlist',
      callback: ({data, code, msg}) => {
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
    queryConditons = {...queryConditons};
    if(queryConditons.deptCodeList) {
      queryConditons.deptCodeList = queryConditons.deptCodeList[0];
    };
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const {deptList, rescueCarList} = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`部门`}>
              {
                getFieldDecorator(`parentDeptCode`)(
                  <Select placeholder="请选择">
                    <Option key="" value="">全部</Option>
                    {this.baseListRender(deptList)}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`抢救车`}>
              {
                getFieldDecorator(`deptCode`,{
                  initialValue: ''
                })(
                  <Select placeholder="请选择">
                    <Option key="" value="">全部</Option>
                    {this.baseListRender(rescueCarList)}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col style={{textAlign: 'right'}} span={8}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const WrappSearchForm = Form.create()(SearchForm);
class BaseMgt extends PureComponent{
  state = {
    addVisible: false,
    addLoading: false,
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  render(){
    const {match} = this.props;
    const IndexColumns = [
      {
        title: '部门',
        dataIndex: 'parentDeptName'
      },
      {
        title: '抢救车',
        dataIndex: 'deptName',
      },
      {
        title: '操作',
        dataIndex: 'RN',
        width: 112,
        render: (text, record) => <Link to={{pathname: `${match.path}/drug/code=${record.deptCode}`}}>编辑目录</Link>
      }
    ];
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.key;
    delete query.display;
    return (
    <div className='ysynet-main-content'>
      <WrappSearchForm formProps={{...this.props}}/>
      <RemoteTable
        onChange={this._tableChange}
        isJson
        ref='table'
        query={query}//a/rescuecardetail/findRescuecarMedicineList
        url={baseMgt.FIND_RESCUECAR_MADICINE_LIST}
        scroll={{x: '100%'}}
          isDetail={true}
        columns={IndexColumns}
        rowKey={'deptCode'}
      />
    </div>
    )
  }
}
export default connect(state=>state)(BaseMgt)