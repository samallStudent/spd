/**
 * @file 结算管理 - 结算单
 */
import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import { Form, Row, Col, Input, Button, DatePicker } from 'antd';
import {settlementMgt} from '../../../../api/purchase/purchase';
import RemoteTable from '../../../../components/TableGrid/index';
import moment from 'moment';
import {connect} from 'dva';
const FormItem = Form.Item;
const monthFormat = 'YYYY-MM-DD';
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
    title: '结算单',
    dataIndex: 'settleBillNo',
    width: 280,
    render: (text, record) => (
        <span>
            <Link to={{ pathname: `/purchase/settlementMgt/statements/details/${text}`}}>{text}</Link>
        </span>
    )
    }, {
        title: '供应商',
        dataIndex: 'ctmaSupplierName',
        width: 224,
    }, {
        title: '状态',
        dataIndex: 'settleStatusName',
        width: 112,
    }, {
        title: '结算总金额',
        dataIndex: 'settleSumAmount',        
        width: 168,
    }, {
        title: '对账单数量',
        dataIndex: 'settleSumQty',
        width: 112,
    }, {
        title: '结算时间',
        dataIndex: 'settleDate',
        width: 224,
    }]


class SettlementMgt extends PureComponent {
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
            delete values.time;
            this.props.dispatch({
                type:'base/setQueryConditions',
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
    componentDidMount() {
        let { queryConditons } = this.props.base;
        if(queryConditons.startTime && queryConditons.endTime) {
            queryConditons.time = [moment(queryConditons.startTime, monthFormat), moment(queryConditons.endTime, monthFormat)];
        }else {
            queryConditons.time = [];
        };
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
    //打印
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
            type: 'settlementMgt/settleExport',
            payload: queryConditons,
        });
    }
    render() {
        let {getFieldDecorator} = this.props.form;
        let query = this.props.base.queryConditons;
        query = {...query};
        delete query.key;
        delete query.time;
        return (
            <div className="ysynet-main-content">
                <Form onSubmit={this.handleSearch}>
                    <Row gutter={30}>
                        <Col span={8}>
                            <FormItem label={`汇总单`} {...formItemLayout}>
                                {getFieldDecorator('settleBillNo', {})(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={`制单日期`} {...formItemLayout}>
                                {getFieldDecorator('time', {})(
                                    <RangePicker />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right', marginTop: 4}}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Button onClick={this.export}>导出</Button>
                </Row>
                <RemoteTable
                    query={query}
                    style={{marginTop: 20}}
                    url={settlementMgt.SETTLE_LIST}
                    columns={columns}
                    rowKey={'id'}
                    scroll={{x: '100%'}}
                />
            </div>
        )
    }
};

const WrappedSettlementMgt = Form.create()(SettlementMgt);

export default connect(state=>state)(WrappedSettlementMgt);
