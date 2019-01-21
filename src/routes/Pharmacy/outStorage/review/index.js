/*
 * @Author: yuwei  发药复核 /output
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input,Select } from 'antd';
import RetomeTable from '../../../../components/TableGrid';
import outStorage from '../../../../api/pharmacy/outStorage';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
   title: '出库单',
   dataIndex: 'backNo',
   width: 158,
   render:(text)=>(
    <Link to={{pathname: `/pharmacy/outStorage/review/details/${text}`}}>{text}</Link>
   )
  },
  {
    title: '发药确认单',
    dataIndex: 'dispensingCode',
    width: 162
   },
  {
    title: '内部药房',
    width: 100,
    dataIndex: 'innerDeptName'
  },
  {
    title: '外部药房',
    width: 100,
    dataIndex: 'outDeptName'
  },
  {
    title: '患者姓名',
    width: 100,
    dataIndex: 'sickName'
  },
  {
    title: '就诊卡编号',
    width: 164,
    dataIndex: 'medCardNo'
  },
  {
   title: '发药时间',
   width: 160,
   dataIndex: 'dispensingDate'
  },
    {
        title: '状态',
        dataIndex: 'confirmStatusName',
        width: 90,
    },
    {
        title: '配药人',
        width: 80,
        dataIndex: 'confirmUserName'
    },
    {
        title: '配药时间',
        width: 160,
        dataIndex: 'confirmDate'
    }
];
class Output extends PureComponent{
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  export = () => {
    let { queryConditons } = this.props.base;
    queryConditons = {...queryConditons};
    delete queryConditons.key;
    delete queryConditons.pageNo;
    delete queryConditons.pageSize;
    delete queryConditons.sortField;
    delete queryConditons.sortOrder;
    this.props.dispatch({
      type: 'outStorage/outStorageExport',
      payload: queryConditons
    });
  }
  render(){
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.key;
    return (
      <div  className='ysynet-main-content'>
        <SearchForm formProps={{...this.props}} />
        <Row>
          <Button onClick={this.export}>导出</Button>
        </Row>
        <RetomeTable
          onChange={this._tableChange}
          query={query}
          url={outStorage.BILLOUTSOTRE_LIST}
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
export default connect(state=>state)(Output);
/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {

    state = {
        status: []
    }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.formProps.dispatch({
        type:'base/updateConditions',
        payload: values
      });
    });
  }
  componentDidMount() {

      this.props.formProps.dispatch({
          type: 'base/orderStatusOrorderType',
          payload: {
              type: 'dispensing_confirm_status'
          },
          callback: (data) => {
              this.setState({status: data});
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
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }


    dataRender = (data) => {
        return data.map((item, i)=>{
            return <Option key={i} value={item.value}>{item.label}</Option>
        })
    }

  render() {
    const { getFieldDecorator } = this.props.form;
      let {status} = this.state;
      status = this.dataRender(status);
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`单据`} {...formItemLayout}>
                {getFieldDecorator('parameter', {})(
                  <Input placeholder="出库单/发药确认单"/>
                )}
            </FormItem>
          </Col>
            <Col span={8}>
                <FormItem label={`状态`} {...formItemLayout}>
                    {getFieldDecorator('confirmStatus')(
                        <Select
                            showSearch
                            placeholder={'请选择'}
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                        >
                            {status}
                        </Select>
                    )}
                </FormItem>
            </Col>
          <Col span={8} style={{float:'right', textAlign: 'right', marginTop: 4}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchForm = Form.create()(SearchFormWrapper);