import React,{PureComponent} from "react";
import { Form, Row, Col, Button, Input, Icon, DatePicker,Tooltip,Select,Table } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {post} from "../../../../services/purchase/patientTracing";
import {tracingTotalList} from "../../../../api/purchase/patientTracing";

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

class OrderRetrospect extends PureComponent {
  constructor(props){
    super(props);
      console.log(this.props.match.params)

      this.state={
        query: {
            userid: this.props.match.params.bigDrugCode,
            "starttime":"",
            "endtime":""
        },
      data:[],
      loading:false, baseData:{},
      columns:[
        {
          title: '单据类型',
          dataIndex: 'pickingtype',
          width: 100,
          render:(text)=>{
              var t={
                  "1":'召回',
                  "2":"调拨",
                  "3":"申领",
                  "4":"退货",
                  "5":"药房退库",
                  "9":"医院退货"
              }
              return t[text];
          }
        },

        {
          title: '单据号',
          dataIndex: 'pickingorderno',
          width: 168,
          render:(text)=>(
              {text}
          )
        },
        {
          title: '操作时间',
          dataIndex: 'createdate',
          width: 118,
          render:(text)=>{
            var t= dateFtt('yyyy-mm-dd',new Date(text||''));
            return t;
          }
        },
        {
          title: '商品名称',
          dataIndex: 'ctmmtradename',
          width: 250,
        },
        {
          title: '规格',
          dataIndex: 'ctmmspecification',
          width: 168,
        },
        {
          title: '生产厂商',
          dataIndex: 'ctmmmanufacturername',
          width: 212,
        },
        {
          title: '单位',
          dataIndex: 'ctmmvaluationunit',
          width: 112,
        },
        {
          title: '操作前库存',
          dataIndex: 'storenum',
          width: 90,
        },
        {
          title: '操作数量',
          dataIndex: 'pickingnum',
          width:90,
        },
        {
          title: '操作后结存',
          dataIndex: 'number',
          width: 90,
        },
        {
          title: '货位',
          dataIndex: 'positionname',
          width: 166,
        },
      ],
    }
  }


  render() {


    const {baseData,columns,query}=this.state;
      const {userno,username} = this.props.match.params;
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
            <div style={{ display:'flex',justifyContent: 'space-between' }}>
                <h3><b>基本信息</b></h3>
            </div>
            <Row>
                <Col span={8}>
                    <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                        <label>工号</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                        <div className='ant-form-item-control'>{userno&&userno!='undefined'?userno:''}</div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                        <label>姓名</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                        <div className='ant-form-item-control'>{username?username:''}</div>
                    </div>
                </Col>
            </Row>
        </div>
          <RemoteTable
              rowKey="batchNo"
              scroll={{x: '100%'}}
              isJson
              query={query}
              url={tracingTotalList.GET_MED_Order_Detail}
              columns={columns}
          />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(OrderRetrospect));

