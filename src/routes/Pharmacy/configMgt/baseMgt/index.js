/*
 * @Author: 基数药目录管理
 * @Date: 2018-08-28 17:42:54 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-06 21:48:20
 */

import React , {PureComponent} from 'react';
import { Form, Row, Col, Button, Select } from 'antd';
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
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 }
  },
};

class SearchForm extends PureComponent{
  state = {
    baseList: []
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

  baseListRender = () => {
    let {baseList} = this.state;
    return baseList.map(item => {
      return <Option key={item.id} value={item.id}>{item.deptName}</Option>
    })
  }
  componentDidMount() {
    this.props.formProps.dispatch({
      type: 'configMgt/findBaseMedicineDeptlist',
      callback: (data) => {
        this.setState({
          baseList: data
        });
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
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`基数药部门`}>
              {
                getFieldDecorator(`deptCodeList`)(
                  <Select allowClear placeholder="请选择">
                    {this.baseListRender()}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            {/* <FormItem {...formItemLayout} label={`货位`}>
              {
                getFieldDecorator(`storeLocName`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem> */}
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
    const IndexColumns = [
      {
        title: '部门名称',
        dataIndex: 'deptName'
      },
      // {
      //   title: '货位名称',
      //   dataIndex: 'storeLoc',
      // },
      {
        title: '操作',
        dataIndex: 'RN',
        width: 112,
        render: (text, record) => <Link to={{pathname: `/pharmacy/configMgt/baseMgt/drug/code=${record.deptCode}`}}>编辑目录</Link>
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
        query={query}
        url={baseMgt.FIND_CARDINAL_MADICINE}
        scroll={{x: true}}
        columns={IndexColumns}
        rowKey={'deptCode'}
      />
    </div>
    )
  }
}
export default connect(state=>state)(BaseMgt)