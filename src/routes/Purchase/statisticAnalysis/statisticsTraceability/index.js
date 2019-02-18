/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 统计分析--人员统计及追溯
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, Icon, DatePicker,Tooltip,Select } from 'antd';
import { Link } from 'react-router-dom';



import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {statisticAnalysis,tracingTotalList} from '../../../../api/purchase/patientTracing';
import {post} from '../../../../services/purchase/patientTracing';



function formatDateTime(timeStamp) { 
    var date = new Date();
    date.setTime(timeStamp );
    var y = date.getFullYear();    
    var m = date.getMonth() + 1;    
    m = m < 10 ? ('0' + m) : m;    
    var d = date.getDate();    
    d = d < 10 ? ('0' + d) : d;    
    var h = date.getHours();  
    h = h < 10 ? ('0' + h) : h;  
    var minute = date.getMinutes();  
    var second = date.getSeconds();  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;   
    return y + '-' + m + '-' + d;
}; 

const Option = Select.Option;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
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
    typelist:[]
  }
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  componentDidMount() {
    let { queryConditons } = this.props.formProps.base;
    queryConditons = {...queryConditons};
    queryConditons.supplierCodeList = queryConditons.supplierCodeList ? queryConditons.supplierCodeList[0] : "";
    //找出表单的name 然后set
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);

    //部门
    post('/reportform/back/getdeptList',{}).then(data=>{
      
      var t=[<Option value="">全部</Option>];
      data.data.forEach(i=>{
        t.push(<Option value={i.deptname} key={i.id}>{i.deptname}</Option>)
      })
      this.setState({
         typelist: t
      })
    })

  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const closeDate = values.closeDate === undefined ? '' : values.closeDate;
        if (closeDate.length > 0) {
          values.starttime = closeDate[0].format('YYYY-MM-DD');
          values.endtime = closeDate[1].format('YYYY-MM-DD');
        }else {
          values.starttime = '';
          values.endtime = '';
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
    const {display} = this.props.formProps.base;
    const expand = display === 'block';

    const {typelist} =this.state;

    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`科室`}>
              {
                getFieldDecorator(`ctddesc`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`患者名称`}>
              {
                getFieldDecorator(`patpatientname`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>  
          <Col span={8} style={{ display: display }}>
              <FormItem {...formItemLayout} label={`部门`}>
                  {
                      getFieldDecorator(`deptname`)(
                          <Select   >
                            {typelist}
                          </Select>
                      )
                  }
              </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`起止时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
              <FormItem {...formItemLayout} label={`退药来源`}>
                  {
                      getFieldDecorator(`backSource`)(
                          <Select   >
                            <Option value="">全部</Option>
                            <Option value="2">患者退药</Option>
                            <Option value="1">基数药退药</Option>
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

class OrderRetrospect extends PureComponent {
  state = {
    query: {},
  }
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
        title: '科室名称',
        dataIndex: 'ctddesc',
        width:200,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
    
      {
        title: '接收部门',
        width:150,
        dataIndex: 'deptname',
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '退货单',
        dataIndex: 'backcount',
        width: 112,
        render: (text,record) =>(
          <span>
            <Link to={{pathname: `${match.path}/detailsList/${record.ctdid}/${record.deptid}`}}>{text}</Link>
          </span>
        )
      },
      {
        title: '上月同期',
        dataIndex: 'monthlybackcount',
        width: 112,
        render: (text,record) =>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '去年同期',
        dataIndex: 'yearbackcount',
        width: 112,
        render: (text,record) =>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '环比变化',
        dataIndex: 'monthlybackchange',
        width: 112,
      }, 
      {
        title: '同比变化',
        dataIndex: 'yearbackchange',
        width: 112,
      },
      {
        title: '退货品种数',
        dataIndex: 'goodscount',
        width: 112,
      },
      {
        title: '上月同期',
        dataIndex: 'monthlygoodscount',
        width: 112,
      },
      {
        title: '去年同期',
        dataIndex: 'yeargoodscount',
        width: 112,
      },
      {
        title: '环比变化',
        dataIndex: 'monthlygoodschange',
        width: 112,
      },
      {
        title: '同比变化',
        dataIndex: 'yeargoodschange',
        width: 112,
      }
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...query,
    }
    if(!query.endtime || query.endtime=='' || query.starttime==''){
      query.starttime=formatDateTime((new Date()).getTime())
      query.endtime=formatDateTime((new Date()).getTime())
    }
    delete query.invoiceDate;
    delete query.closeDate;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
        />
        <RemoteTable
          onChange={this._tableChange}
          query={query}
          scroll={{x: '100%', y: 300}}
          isJson
          columns={columns}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={tracingTotalList.SEARCH}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(OrderRetrospect));