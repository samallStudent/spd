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
import { Form, Row, Col, Select, Button, Icon, DatePicker, message, Tooltip} from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid/index'; 
import salvageCar from '../../../../api/baseDrug/salvageCar';
import FetchSelect from '../../../../components/FetchSelect';
import {connect} from 'dva';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const singleFormItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  }
  const IndexColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 168,
    },{
      title: '通用名',
      dataIndex: 'ctmmGenericName',
      width: 224,
      className:'ellipsis',
      render: (text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      )
    },{
      title: '商品名',
      dataIndex: 'ctmmTradeName',
      width: 224,
      className:'ellipsis',
      render: (text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      )
    },{
      title: '规格',
      dataIndex: 'ctmmSpecification',
      width: 168,
    },{
      title: '生产厂家',
      dataIndex: 'ctmmManufacturerName',
      width: 224,
    },{
      title: '单位',
      dataIndex: 'replanUnit',
      width: 112,
    },{
      title: '生产批号',
      dataIndex: 'lot',
      width: 112,
    },{
      title: '生产日期',
      dataIndex: 'productDate',
      width: 168,
    },{
      title: '有效期止',
      dataIndex: 'validEndDate',
      width: 168,
    },{
      title: '包装规格',
      dataIndex: 'packageSpecification',
      width: 168,
    },{
      title: '剂型',
      dataIndex: 'ctmmDosageFormDesc',
      width: 168,
    },{
        title: '供应商',
        dataIndex: 'supplierName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
    },{
        title: '批准文号',
        dataIndex: 'hisDrugCode',
        width: 168,
    },{
        title: '库存数量',
        dataIndex: 'stockNum',
        width: 112,
    },{
        title: '入库数量',
        dataIndex: 'inStockNum',
        width: 112,
    },{
        title: '出库数量',
        dataIndex: 'outStockNum',
        width: 112,
    },{
        title: '结存数量',
        dataIndex: 'balanceNum',
        width: 112,
    }
  ];

class formSearch extends PureComponent{
    state={
        typeListData: [],
        suppliersListData: [],
        deptsListData: []
    }
    componentDidMount=()=>{
        const { dispatch } = this.props.formProps;
        dispatch({
            type: 'base/orderStatusOrorderType',
            payload: { type: 'medicine_standing' },
            callback: (data) =>{
                data = data.filter(item => item.value !== '');
                this.setState({ typeListData: data });
            }
        })

        dispatch({
            type: 'salvageCar/getDepts',
            payload: {},
            callback: (res) =>{
                if(res.code === 200){
                    console.log(res.data);
                    this.setState({ deptsListData: res.data });
                }else{
                    message.error(res.msg);
                }
            }
        })

        dispatch({
            type: 'salvageCar/getSuppliers',
            payload: {},
            callback: (res) =>{
                if(res.code === 200){
                    this.setState({ suppliersListData: res.data });
                }else{
                    message.error(res.msg);
                }
            }
        })

    }
    toggle = () => {
        this.props.formProps.dispatch({
          type:'base/setShowHide'
        });
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
        const {display} = this.props.formProps.base;
        const expand = display === 'block'; 
        return(
            <Form className="ant-advanced-search-form" onSubmit={this.handlSearch}>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`抢救车货位`}>
                        {
                            getFieldDecorator(`deptCode`,{
                                initialValue: ''
                            })(
                                <Select 
                                    style={{width:'100%'}}
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="请选择..."
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                >
                                     <Option value=''>全部</Option> 
                                    { 
                                        this.state.deptsListData.map((item,index)=>
                                            <Option value={item.id} key={index}>{item.deptName}</Option>
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
                            getFieldDecorator(`supplierCode`,{
                                initialValue: ''
                            })(
                                <Select 
                                    style={{width:'100%'}}
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="请选择"
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                >
                                     <Option value=''>全部</Option> 
                                    { 
                                        this.state.suppliersListData.map((item,index)=>
                                            <Option value={item.id} key={index}>{item.ctmaSupplierName}</Option>
                                        )
                                    }
                                </Select>
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col span={8}  style={{display: display}}>
                        <FormItem {...singleFormItemLayout} label={`商品名/通用名`}>
                        {
                            getFieldDecorator(`paramsName`,{})(
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
                    <Col span={8}  style={{display: display}}>
                        <FormItem {...formItemLayout} label={`类型`}>
                        {
                            getFieldDecorator(`secondType`,{
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
                                            <Option value={item.value||item.value} key={index}>{item.label}</Option>
                                        )
                                    }
                                </Select>
                            )
                        }
                        </FormItem>
                    </Col>
                  
                    <Col span={8}  style={{display: display}}>
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
                        <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                          {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
                        </a>
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
        //导出
        export = () => {
            let query = this.props.base.queryConditons;
            query = {
                ...query,
            }
            delete query.time;
            delete query.key;
            this.props.dispatch({
            type: 'salvageCar/exportList',
                payload: query,
            });
        }
    
    render(){
    let query = this.props.base.queryConditons;
    query = {
        ...query,
    }
    delete query.time;
    delete query.key;
      return(
          <div>
              <WrappSearchForm  formProps={{...this.props}}  />
              <Row className='ant-row-bottom'>
                <Col>
                <Button type='default' onClick={this.export}>导出</Button>
                </Col>
              </Row>
              <RemoteTable
               query={query}
               ref="salvageCarLedgerTable"
               columns={IndexColumns}
               scroll={{x: 2744}}
               rowKey={'id'}
               style={{marginTop: 20}}
               url={salvageCar.GET_DRUG_LEDGER}
               loading={false}
              />
          </div>
      )
    }
}

export default connect(state=>state)(salvageLadgerList);