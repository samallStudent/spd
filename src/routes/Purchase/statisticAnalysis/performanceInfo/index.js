/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 绩效信息表
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, DatePicker, Icon, Select } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {statisticAnalysis} from '../../../../api/purchase/purchase';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
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
    subSysList: [],
    deptList: [],
    businessMenu:[]
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
    dispatch({
      type: 'statistics/operationlogDeptList',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            deptList: data
          });
        };
      }
    });
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
        const closeDate = values.closeDate === undefined ? '' : values.closeDate;
        if (closeDate.length > 0) {
          values.startTime = closeDate[0].format('YYYY-MM-DD');
          values.endTime = closeDate[1].format('YYYY-MM-DD');
        }else {
          values.startTime = '';
          values.endTime = '';
        };
        this.props._handlQuery(values);
      }
    })
  }
  _tableChange = values => {
    console.log(values);
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props._handlQuery({});
  }
  //监听部门切换
  listenDept = (value) => {
    const {deptList} = this.state;
    const {deptCode} = this.props.form.getFieldsValue();
    if(value === deptCode) return;
    if(value === undefined) {
      this.props.form.setFieldsValue({
        menuCode: undefined
      });
      this.setState({
        subSysList: []
      });
      return;
    }
    let i;
    deptList.map((item, index) => {
      if(item.id === value) {
        i = index;
      };
      return item;
    });
    this.props.form.setFieldsValue({
      menuCode: undefined
    });
    this.props.formProps.dispatch({
      type: 'statistics/operationlogMenu',
      payload: {
        deptType: deptList[i].deptType
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            subSysList: data
          });
        };
      }
    })
  };
  listenMenu = (value) =>{
    const {subSysList} = this.state;
    const {menuCode} = this.props.form.getFieldsValue();
    if(value === menuCode) return;
    if(value === undefined) {
      this.props.form.setFieldsValue({
        menuCode: undefined
      });
      this.setState({
        businessMenu: []
      });
      return;
    }
    let i;
    subSysList.map((item, index) => {
      if(item.shortNameValue === value) {
        i = index;
      };
      return item;
    });
    this.props.form.setFieldsValue({
      secMenuCode: undefined
    });
    this.props.formProps.dispatch({
      type: 'statistics/operationSecMenu',
      payload: {
        parentId : subSysList[i].id 
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            businessMenu: data
          });
        };
      }
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    const { subSysList, deptList ,businessMenu} = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`统计时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker showTime style={{width: '100%'}}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`部门`}>
              {
                getFieldDecorator(`deptCode`)(
                  <Select
                    allowClear
                    onChange={this.listenDept}
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                  {
                    deptList.map(item => (
                      <Option key={item.id} value={item.id}>{item.deptName}</Option>
                    ))
                  }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} >
            <FormItem {...formItemLayout} label={'人员'} style={{ display: display }}>
              {
                getFieldDecorator(`operatorName`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`一级菜单`} style={{ display: display }}>
              {
                getFieldDecorator(`menuCode`)(
                  <Select
                    allowClear
                    onChange={this.listenMenu}
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                  {
                    subSysList.map(item => (
                      <Option key={item.shortNameValue} value={item.shortNameValue}>{item.name}</Option>
                    ))
                  }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`业务菜单`} style={{ display: display }}>
              {
                getFieldDecorator(`secMenuCode`)(
                  <Select
                    allowClear
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                  {
                    businessMenu.map(item => (
                      <Option key={item.shortNameValue} value={item.shortNameValue}>{item.name}</Option>
                    ))
                  }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
           <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
             {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
           </a>
         </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class SectionAnalysis extends PureComponent {
  state = {
    query: {},
  }
  handlQuery = (query) => {
    this.setState({
      query: {
        ...this.state.query, 
        ...query
      }
    });
  }
  render() {
    const columns = [
      {
        title: '操作时间',
        dataIndex: 'operationTime',
        width: 224,
      }, {
        title: '部门',
        dataIndex: 'deptName',
        width: 168,
      }, {
        title: '人员',
        dataIndex: 'operatorName',
        width: 168,
      }, 
      {
        title: '一级菜单',
        dataIndex: 'menuName',
        width: 168,
      },
      {
        title: '业务菜单',
        dataIndex: 'secMenuName',
        width: 168,
      },{
        title: '业务操作',
        dataIndex: 'business',
        width: 224,
      }, {
        title: '业务单号',
        dataIndex: 'businessCode',
        width: 224
      }
    ];
    const {query} = this.state;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
          _handlQuery={this.handlQuery}
        />
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          isJson
          columns={columns}
          scroll={{x: 1008}}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={statisticAnalysis.OPERATIONLOG_LIST}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(SectionAnalysis));