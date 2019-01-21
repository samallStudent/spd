/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 全院管理 - 药品调价--调价确认
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {drugPricing} from '../../../../api/purchase/purchase';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
  componentDidMount() {
    let { queryConditons } = this.props.formProps.base;
    //找出表单的name 然后set
    console.log(queryConditons);
    
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
  }
  handleSearch = e => {
    console.log('12')
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const sponsorDate = values.sponsorDate === undefined ? '' : values.sponsorDate;
        if (sponsorDate.length > 0) {
          values.startDate = sponsorDate[0].format('YYYY-MM-DD');
          values.endDate = sponsorDate[1].format('YYYY-MM-DD');
        }else {
          values.startDate = '';
          values.endDate = '';
        };
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
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`单号`}>
              {
                getFieldDecorator(`updatePriceNo`)(
                  <Input placeholder='请输入单号'/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`发起时间`}>
              {
                getFieldDecorator(`sponsorDate`)(
                  <RangePicker />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
         </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class PricingConfirmation extends PureComponent {
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  render() {
    const {match} = this.props;    
    const columns = [
      {
        title: '调价单号',
        dataIndex: 'updatePriceNo',
        width: 224,
        render: (text, record) => {
          return <span>
                  <Link to={{ pathname: `${match.path}/details/${text}`}}>{text}</Link>
                 </span>
        }
      }, {
        title: '状态',
        dataIndex: 'statusName',
        width: 168,
      }, {
        title: '发起时间',
        dataIndex: 'createDate',
        width: 168,
      }, {
        title: '发起人',
        dataIndex: 'createUserName',
        width: 168,
      }
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...query,
    }
    delete query.sponsorDate;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
        />
        <Link to={{pathname: `${match.path}/add`}}><Button type="primary">新建调价</Button></Link>
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          columns={columns}
          scroll={{x: '100%'}}
          isDetail={true}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={drugPricing.CHECK_PRICE}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(PricingConfirmation));