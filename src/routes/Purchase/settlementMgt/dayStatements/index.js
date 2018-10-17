/**
 * @file 结算管理 - 日对账单
 */
import React, {PureComponent} from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select, Icon } from 'antd';
import {Link} from 'react-router-dom';
import {dayStatements} from '../../../../api/purchase/purchase';
import RemoteTable from '../../../../components/TableGrid';
import {connect} from 'dva';

const FormItem = Form.Item;

const {Option} = Select;

const { RangePicker } = DatePicker;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
    },
};


const columns = [
    {
    title: '对账单',
    dataIndex: 'balanceCode',
    width: 280,
    render: (text) => (
        <span>
            <Link to={{ pathname: `/purchase/settlementMgt/dayStatements/details/${text}`}}>{text}</Link>
        </span>
    )
    }, {
        title: '状态',
        dataIndex: 'confirmStatusName',
        width: 112
    }, {
        title: '明细数量',
        dataIndex: 'detailCount',
        width: 112
    }, {
        title: '对账人',
        dataIndex: 'balanceUserName',
        width: 112
    }, {
        title: '对账完成时间',
        dataIndex: 'balanceEndTime',
        width: 224,
    }]


class Statements extends PureComponent{
    state = {
        status: [],
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'base/orderStatusOrorderType',
            payload: {
                type: 'balance_status'
            },
            callback: (data) => {
                this.setState({
                    status: data
                });
            }
        });
        let { queryConditons } = this.props.base;
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
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let {time} = values;
            if(time && time.length > 0) {
                values.startTime = time[0].format('YYYY-MM-DD');
                values.endTime = time[1].format('YYYY-MM-DD');
            }else {
                values.startTime = '';
                values.endTime = '';
            };
            this.props.dispatch({
                type:'base/updateConditions',
                payload: values
            });
        })
    }
    handleReset = (e) => {
        this.props.form.resetFields();
        this.props.dispatch({
            type:'base/clearQueryConditions'
        });
    }
    statusRender = () => {
        let {status} = this.state;
        return status.map(item => {
            return <Option key={item.value} value={item.value}>{item.label}</Option>
        })
    }
    toggle = () => {
        this.props.dispatch({
            type:'base/setShowHide'
        });
    }
    _tableChange = values => {
        this.props.dispatch({
            type:'base/setQueryConditions',
            payload: values
        });
    }
    //导出
    export = () => {
        let {queryConditons} = this.props.base;
        queryConditons = {...queryConditons};
        delete queryConditons.pageNo;
        delete queryConditons.key;
        delete queryConditons.pageSize;
        delete queryConditons.sortField;
        delete queryConditons.sortOrder;
        delete queryConditons.time;
        this.props.dispatch({
            type: 'settlementMgt/billExport',
            payload: queryConditons,
        });
    }
    render() {
        let {getFieldDecorator} = this.props.form;
        const {display} = this.props.base;
        const expand = display === 'block';
        let query = this.props.base.queryConditons;
        query = {...query};
        delete query.time;
        delete query.key;
        return (
            <div className="ysynet-main-content">
                <Form onSubmit={this.handleSearch}>
                    <Row gutter={30} style={{marginBottom: 20}}>
                        <Col span={8}>
                            <FormItem label={`对账单`} {...formItemLayout}>
                                {getFieldDecorator('balanceCode', {})(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={`对账日期`} {...formItemLayout}>
                                {getFieldDecorator('time', {})(
                                    <RangePicker />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} style={{display: display}}>
                            <FormItem label={`状态`} {...formItemLayout}>
                                {getFieldDecorator('balanceStatus', {})(
                                <Select 
                                    showSearch
                                    placeholder={'请选择'}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                    >
                                        {this.statusRender()}
                                </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} style={{float: 'right', textAlign: 'right'}}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{margin: '0 8px'}} onClick={this.handleReset}>重置</Button>
                            <a style={{fontSize: 14}} onClick={this.toggle}>
                                {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
                            </a>
                        </Col>
                        <Col span={24}>
                            <Link to={{ pathname: `/NewRecon` }}><Button type="primary">生成对账</Button></Link>
                            <Button style={{marginLeft: 8}} onClick={this.export}>导出</Button>
                        </Col>
                    </Row>
                </Form>
                <RemoteTable
                    onChange={this._tableChange}
                    isJson
                    rowKey="id"
                    query={query}
                    columns={columns}
                    scroll={{ x: '100%' }}
                    url={dayStatements.DAILY_LIST}
                />
            </div>
        )
    }
};
const WrappedStatements = Form.create()(Statements);
export default connect(state=>state)(WrappedStatements);