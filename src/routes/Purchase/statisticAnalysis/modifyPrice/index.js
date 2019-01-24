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
import { Form, Row, Col, Button, Icon, DatePicker, message, Tooltip, Input} from 'antd';
import { Link } from 'react-router-dom'
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid/index'; 
import salvageCar from '../../../../api/baseDrug/salvageCar';
import {statisticAnalysis} from '../../../../api/purchase/purchase';
import FetchSelect from '../../../../components/FetchSelect';
import {connect} from 'dva';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const IndexColumns = [
    {
        title: '药品名称',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className:'ellipsis',
        render: (text, record) => {
        return (
            <Tooltip placement="topLeft" title={text}>
                <span>
                    <Link to={{pathname: `/purchase/statisticAnalysis/modifyPrice/details/id=${record.id}&updatePriceNo=${record.updatePriceNo}`}}>{text}</Link>
                </span>  
            </Tooltip>
        )
        }
    },{
        title: '调价单号',
        dataIndex: 'updatePriceNo',
        width: 224,
        className:'ellipsis',
        render: (text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
    },{
        title: '调价时间',
        dataIndex: 'fromDate',
        width: 168,
    },{
        title: '生成人',
        dataIndex: 'createUserName',
        width: 168,
    },{
        title: '生成时间',
        dataIndex: 'createDate',
        width: 168,
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
                    values.startDate = time[0].format('YYYY-MM-DD');
                    values.endDate = time[1].format('YYYY-MM-DD');
                }else {
                    values.startDate = '';
                    values.endDate = '';
                };
                values.hisDrugCodeList = values.keys ? [values.keys] : [];
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
            <Form className="ant-advanced-search-form" onSubmit={(e) => this.handlSearch(e)}>
            <Row gutter={30}>
                <Col span={8}>
                    <FormItem {...formItemLayout} label={`单号`}>
                    {
                        getFieldDecorator(`updatePriceNo`,{
                            initialValue: ''
                        })(
                            <Input />
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
                                placeholder='药品名称'
                                query={{queryType: 3}}
                                url={salvageCar.QUERY_DRUGBY_LIST}
                            />
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
                            />
                        )
                    }
                    </FormItem>
                </Col>
                <Col style={{float: 'right', textAlign: 'right', marginTop: 4}} span={8}>
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
       
    render(){
    let query = this.props.base.queryConditons;
    query = { ...query, }
    //query.hisDrugCodeList = query.keys ? [query.keys] : [];
    delete query.keys;
    delete query.time;
    delete query.key;
      return(
          <div>
              <WrappSearchForm  formProps={{...this.props}}  />
              <RemoteTable
               onChange={this._tableChange}
               isJson
               query={query}
               ref="modifyPrice"
               columns={IndexColumns}
               scroll={{x: '100%'}}
          isDetail={true}
               rowKey={'updatePriceNo'}
               style={{marginTop: 20}}
               url={statisticAnalysis.GET_PRICE_STATIC_LIST}
               loading={false}
              />
          </div>
      )
    }
}

export default connect(state=>state)(salvageLadgerList);