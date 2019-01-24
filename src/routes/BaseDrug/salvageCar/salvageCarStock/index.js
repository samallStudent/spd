/*
 * @Author: xx 
 * @Date: 
 * @Last Modified by: xx
 * @Last Modified time: 
 */
 /**
 * @file 基数药--抢救车--抢救车库存
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Select, Button, Icon, message,Tooltip} from 'antd';
import { Link } from 'react-router-dom'
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid/index'; 
import salvageCar from '../../../../api/baseDrug/salvageCar';
import FetchSelect from '../../../../components/FetchSelect';
import {connect} from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const IndexColumns = [
    {
      title: '通用名',
      dataIndex: 'ctmmGenericName',
      width: 224,
      className:'ellipsis',
      render: (text, record) => {
        return (
            <Tooltip placement="topLeft" title={text}>
                <span>
                    <Link to={{pathname: `/baseDrug/salvageCar/salvageCarStock/details/${record.bigDrugCode}/${record.deptCode}/${record.drugCode}`}}>{text}</Link>
                </span>  
            </Tooltip>
        )
      }
    },{
      title: '商品名',
      dataIndex: 'ctmmTradeName',
      width: 224,
      className:'ellipsis',
      render: (text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      )
    },{
      title: '抢救车货位',
      dataIndex: 'rescuecarDeptCodeName',
      width: 168,
    },{
      title: '规格',
      dataIndex: 'ctmmSpecification',
      width: 168,
    },{
      title: '生产厂家',
      dataIndex: 'ctmmManufacturerName',
      width: 224,
      className:'ellipsis',
      render: (text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      )
    },{
      title: '包装规格',
      dataIndex: 'packageSpecification',
      width: 168,
    },{
      title: '单位',
      dataIndex: 'replanUnit',
      width: 60,
    },{
      title: '库存数量',
      dataIndex: 'totalStoreNum',
      width: 112,
    },{
      title: '可用库存',
      dataIndex: 'usableQuantity',
      width: 112,
    },{
      title: '剂型',
      dataIndex: 'ctmmDosageFormDesc',
      width: 168,
    },{
      title: '批准文号',
      dataIndex: 'approvalNo',
      width: 224,
    }
  ];
  


class formSearch extends PureComponent{
    state = {
        findDeptlist: [],
        value: undefined,

    }
    
    componentDidMount = () => {
        const { dispatch } = this.props.formProps;
        let _this = this;
        dispatch({
            type: 'salvageCar/findDeptlist',
            payload: {},
            callback: (res) =>{
                if(res.code === 200){
                    _this.setState({ findDeptlist: res.data });
                }else{
                    message.error(res.msg);
                }
            }
        })
      
        let { queryConditons } = this.props.formProps.base;
        //找出表单的name 然后set
        let values = this.props.form.getFieldsValue();
        values = Object.getOwnPropertyNames(values);
        let value = {};
        values.map(keyItem => {
            if(keyItem !== 'keys'){
                value[keyItem] = queryConditons[keyItem];
            }
            return keyItem;
        });
        this.props.form.setFieldsValue(value);
    }
    handlSearch = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            values.hisDrugCodeList = this.state.value ? [this.state.value] : [];
            if(!err){
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
            <Form className="ant-advanced-search-form" onSubmit={(e) => this.handlSearch(e)}>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`抢救车货位：`}>
                        {
                            getFieldDecorator(`rescuecarDeptCode`,{
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
                                        this.state.findDeptlist.map((item,index)=>
                                            <Option value={item.id} key={index}>{item.deptName}</Option>
                                        )
                                    }
                                </Select>
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`关键字：`}>
                        {
                            getFieldDecorator(`keys`)(
                               <FetchSelect
                                    allowClear={true}
                                    placeholder='通用名/商品名'
                                    query={{queryType: 3}}
                                    url={salvageCar.QUERY_DRUGBY_LIST}
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
class salvageStockList extends PureComponent{
    state = {
        visible: false,
        isDisabled: true,
        ModalTitle: '',
        record: {},
        loading: false,
    };
    queryHandle = (query) =>{
        this.setState({ query });
        this.refs.salvageCarTable.fetch(query);
    }
    _tableChange = values => {
        this.props.dispatch({
          type:'base/setQueryConditions',
          payload: values
        });
      }
    render(){
        let query = this.props.base.queryConditons;
        query = {...query};
        query.hisDrugCodeList = query.keys ? [query.keys] : [];
        console.log(query);
        delete query.keys;
        delete query.key;
        delete query.backTime;
        return(
          <div>
              <WrappSearchForm 
                formProps={{...this.props,query:query,typeListData:this.state.typeListData}} 
              />
              <RemoteTable
               onChange={this._tableChange}
               isJson
               query={query}
               ref="salvageCarTable"
               columns={IndexColumns}
               scroll={{x: '100%'}}
          isDetail={true}
               rowKey={'batchNo'}
               style={{marginTop: 20}}
               url={salvageCar.GET_SALVGECAR_LIST}
               loading={false}
              />
          </div>
        )
    }
}

export default connect(state=>state)(salvageStockList);