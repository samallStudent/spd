/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 统计分析--患者追溯
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, Icon, DatePicker,Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {patientTracing} from '../../../../api/purchase/patientTracing';
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

//组件初始化后从base里拿到查询数据赋值给表单
//查询数据提交时条件放到base 里，
class SearchForm extends PureComponent{
  state = {

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
    //console.log(queryConditons)
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    //console.log(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
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
        //个性查询条件并把pageNo设置为1
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
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`就诊卡号`}>
              {
                getFieldDecorator(`patpatientid`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
              <FormItem {...formItemLayout} label={`患者姓名`}>
                  {
                      getFieldDecorator(`patpatientname`)(
                          <Input placeholder='请输入' />
                      )
                  }
              </FormItem>
          </Col>
          <Col span={8}>
              <FormItem {...formItemLayout} label={`发药单号`}>
                  {
                      getFieldDecorator(`dispensingno`)(
                          <Input placeholder='请输入' />
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
function dateFtt(fmt,date)   
{ //author: meizz   
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 

//从base 里拿到查询条件传递给表格组件，表格组件上绑定修改事件，当查询条件如分页修改后修改base内条件
//表格组件内监听Props修改，来调用接口更新数据
class OrderRetrospect extends PureComponent {
  _tableChange = values => {

    //当table 变动时修改搜索条件
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  render() {
    const {match} = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'patpatientname',
        width: 120
      },
    
      {
        title: '就诊卡号',
        dataIndex: 'patpatientid',
        width: 150
      },
      {
        title: '发药确认单号',
        dataIndex: 'dispensingno',
        width: 150,
      },
      {
        title: '商品名称',
        dataIndex: 'drugname',
        width: 350,
      },
      {
        title: '规格',
        dataIndex: 'specification',
        width: 168,
      },
      {
        title: '发药数量',
        dataIndex: 'quantity',
        width:80,
      },
      {
        title: '发药单位',
        dataIndex: 'drugdosuom',
        width: 112,
      },
      {
        title: '执行人',
        dataIndex: 'username',
        width: 112,
      },
      {
        title: '执行时间',
        dataIndex: 'dispensingdate',
        width: 112,
        render:(text)=>{
            var t= dateFtt('yyyy-mm-dd',new Date(text||''));
            return t;
        }
      },
      {
        title: '生产厂家',
        dataIndex: 'ctmmmanufacturername',
        width: 200,
      },
      {
        title: '批号',
        dataIndex: 'batch',
        width: 124,
      },
      {
        title: '流向追溯',
        dataIndex: 'ctmmdeil',
        width: 112,
        render: (text,record) =>{
          localStorage.setItem('patientTracing',JSON.stringify(record));
         return (
          <span>
            <Link to={{pathname: `${match.path}/details/${record.drugcode}/${record.drugcode}/${record.batch}/${record.batch}`}}>追溯</Link>
          </span>
          )
        }
      },
    ];
    let query = this.props.base.queryConditons;
    query = {
      ...query,
    }
    delete query.invoiceDate;
    delete query.closeDate;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={this.props}
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
          url={patientTracing.TABLE_LIST}
        />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(OrderRetrospect));