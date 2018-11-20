/*
 * @Author: xx 
 * @Date: 
 * @Last Modified by: xx
 * @Last Modified time: 
 */
 /**
 * @file 基数药--抢救车--抢救车台账
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Button , Icon , DatePicker } from 'antd';
import { Link } from 'react-router-dom'
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid/index'; 
import salvageCar from '../../../../api/baseDrug/salvageCar';
import {connect} from 'dva';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const singleFormItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  }
  const IndexColumns = [
    {
      title: '通用名',
      dataIndex: 'tym',
      width: 160,
      render: (text, record) => {
        return (
          <span>
            <Link to={{pathname: `/baseDrug/salvageCar/salvageCarStock/details/dCode=${record.drugCode}&bCode=${record.bigDrugCode}`}}>{text}</Link>
          </span>  
        )
      }
    },{
      title: '商品名',
      dataIndex: 'spm',
      width: 160
    },{
      title: '抢救车货位',
      dataIndex: 'qjchw',
      width: 112,
    },{
      title: '规格',
      dataIndex: 'gg',
      width: 112,
    },{
      title: '生产厂家',
      dataIndex: 'sccj',
      width: 112,
    },{
      title: '包装规格',
      dataIndex: 'bzgg',
      width: 112,
    },{
      title: '单位',
      dataIndex: 'dw',
      width: 112,
    },{
      title: '库存数量',
      dataIndex: 'kcsl',
      width: 112,
    },{
      title: '可用库存',
      dataIndex: 'kykc',
      width: 112,
    },{
      title: '剂型',
      dataIndex: 'jx',
      width: 112,
    },{
      title: '批准文号',
      dataIndex: 'pzwh',
      width: 112,
    }
  ];

class formSearch extends PureComponent{
    state={
        typeListData: []
    }
    componentDidMount=()=>{
        const mosTypeListData =  [{
            id:'1',
            name:'张三'
        },{
            id:'2',
            name:'李四'
        }];
        this.setState({
            typeListData:mosTypeListData
        })
    }
    handlSearch = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            console.log(values);
            if(!err){
                let time = values.time === undefined ? '' : values.time;
                if(time.length>0){
                    values.startDate = time[0].format('YYYY-MM-DD HH:mm');
                    values.endDate = time[1].format('YYYY-MM-DD HH:mm');
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
    handleReset = (e) =>{
        this.props.form.resetFields();
        this.props.formProps.dispatch({
             type:'base/clearQueryConditions'
        });
    }
    render(){
        const { getFieldDecorator } = this.props.form;

        return(
            <Form className="ant-advanced-search-form" onSubmit={this.handlSearch}>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`抢救车`}>
                        {
                            getFieldDecorator(`salvageCar`,{
                                initialValue: ''
                            })(
                                <Select 
                                    style={{width:'100%'}}
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="请选择..."
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                >
                                     <Option value=''>请选择...</Option> 
                                    { 
                                        this.state.typeListData.map((item,index)=>
                                            <Option value={item.id} key={index}>{item.name}</Option>
                                        )
                                    }
                                </Select>
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`供应商`}>
                        {
                            getFieldDecorator(`gys`,{
                                initialValue: ''
                            })(
                                <Select 
                                    style={{width:'100%'}}
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="请选择..."
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                >
                                     <Option value=''>请选择...</Option> 
                                    { 
                                        this.state.typeListData.map((item,index)=>
                                            <Option value={item.id} key={index}>{item.name}</Option>
                                        )
                                    }
                                </Select>
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...singleFormItemLayout} label={`商品名/通用名`}>
                        {
                            getFieldDecorator(`sp`,{
                                initialValue: ''
                           })(
                               <Input style={{width:'90%'}}
                                  placeholder="通用名/商品名"
                               />
                           )
                        }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`类型`}>
                        {
                            getFieldDecorator(`type`,{
                                initialValue: ''
                            })(
                                <Select 
                                    style={{width:'100%'}}
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="请选择..."
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                >
                                     <Option value=''>请选择...</Option> 
                                    { 
                                        this.state.typeListData.map((item,index)=>
                                            <Option value={item.id} key={index}>{item.name}</Option>
                                        )
                                    }
                                </Select>
                            )
                        }
                        </FormItem>
                    </Col>
                  
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`统计时间`}>
                        {
                            getFieldDecorator(`time`,{
                                initialValue: ''
                            })(
                                <RangePicker
                                style={{width:'100%'}}
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                />
                            )
                        }
                        </FormItem>
                    </Col>
        
                    <Col style={{textAlign: 'right'}} span={8}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={(e)=>this.handleReset(e)}>重置</Button>
                        <a style={{marginLeft: 8,display:'none'}}>收起 <Icon type="down" /></a>
                    </Col>
                </Row>
            </Form>
        )
    }
};
const WrappSearchForm = Form.create()(formSearch);
class salvageLadgerList extends PureComponent{
    state = {
        visible: false,
        isDisabled: true,
        ModalTitle: '',
        record: {},
        loading: false
    };
    
    render(){
    let query = this.props.base.queryConditons;
    query = {
        ...query,
    }
    delete query.sponsorDate;
    delete query.key;
      return(
          <div>
              <WrappSearchForm  formProps={{...this.props}}  />
              <RemoteTable
               query={query}
               ref="salvageCarTable"
               columns={IndexColumns}
               scroll={{x: '100%'}}
               rowKey={'id'}
               style={{marginTop: 20}}
               url={salvageCar.GET_SALVGECAR_LIST}
               loading={false}
              />
          </div>
      )
    }
}

export default connect(state=>state)(salvageLadgerList);