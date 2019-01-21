/*
 * @Author: 基数药目录管理
 * @Date: 2018-08-28 17:42:54 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-06 21:48:20
 */

import React , {PureComponent} from 'react';
import { Form, Row, Col, Button, Select, message, Spin } from 'antd';
import {Link} from 'react-router-dom';
import RemoteTable from '../../../components/TableGrid';
import { baseMgt } from '../../../api/pharmacy/configMgt';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },//5
    md: {span: 8}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: {span: 16}
  },
};

class SearchForm extends PureComponent{
  state = {
    baseDeptList: [],
    deptList: [],
    fetching: false
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
    let { queryConditons } = this.props.formProps.base;
    dispatch({
      type: 'configMgt/findAllCardinalMedicineDeptList',
      payload: {
        deptTag: 1
      },
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
    this.changeDept(queryConditons.pDeptCode);
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
  changeDept = (value) => {
    const {dispatch} = this.props.formProps;
    if(value !== '' && value !== undefined) {
      this.setState({
        baseDeptList: [],
        fetching: true
      });
      this.props.form.setFieldsValue({
        deptCode: undefined
      });
      dispatch({
        type: 'configMgt/findAllCardinalMedicineDeptList',
        payload: {
          deptTag: 2,
          pDeptCode: value
        },
        callback: ({data, code, msg}) => {
          if(code === 200) {
            this.setState({
              baseDeptList: data,
              fetching: false
            });
          }else {
            message.error(msg);
          };
        }
      });
    }else {
      this.setState({
        baseDeptList: [],
      });
      this.props.form.setFieldsValue({
        deptCode: undefined
      });
    };
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { deptList, baseDeptList, fetching } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`部门`}>
              {
                getFieldDecorator(`pDeptCode`)(
                  <Select 
                    allowClear 
                    placeholder="请选择"
                    onChange={this.changeDept}
                  >
                    {
                      deptList.map(item => (
                        <Option key={item.deptCode} value={item.deptCode}>{item.deptName}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`基数药部门`}>
              {
                getFieldDecorator(`deptCode`)(
                  <Select 
                    allowClear 
                    placeholder="请选择"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                  >
                    <Option key="" value="">全部</Option>
                    {
                      baseDeptList.map(item => (
                        <Option key={item.deptCode} value={item.deptCode}>{item.deptName}</Option>
                      ))
                    }
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
    const IndexColumns = [
      {
        title: '部门',
        dataIndex: 'pDeptName'
      },
      {
        title: '基数药部门',
        dataIndex: 'deptName',
      },
      {
        title: '操作',
        dataIndex: 'RN',
        width: 112,
        render: (text, record) => <Link to={{pathname: `/sys/configMgt/baseMgt/drug/code=${record.deptCode}`}}>编辑目录</Link>
      }
    ];
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.key;
    return (
    <div className='ysynet-main-content'>
      <WrappSearchForm formProps={{...this.props}}/>
      <RemoteTable
        onChange={this._tableChange}
        isJson
        ref='table'
        query={query}
        url={baseMgt.FIND_ALL_CARDINAL_MADICINE_LIST}
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