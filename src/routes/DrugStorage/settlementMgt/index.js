import React, {PureComponent} from 'react';

import {Link} from 'react-router-dom';

import { formItemLayout } from '../../../utils/commonStyles';
import { Form, Row, Col, Input, Button, Table, DatePicker, Modal } from 'antd';

const FormItem = Form.Item;

const { RangePicker } = DatePicker;



const dataSource = [
    {
    key: 1,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 2,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 3,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 4,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 5,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 6,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 7,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 8,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 9,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 10,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 11,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 12,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 13,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 14,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 15,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 16,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}, {
    key: 17,
    summarySheet: 'YKHZ22118070000383',
    warehouse: '药库',
    totalMoney: '12345678.08',
    summaryMan: '张一山',
    summaryData: '2018-07-01 09:05:06'
}]

const columns = [
    {
    title: '汇总单',
    dataIndex: 'summarySheet',
    key: 'summarySheet',
    render: (text) => (
        <span>
            <Link to={{ pathname: `/drugStorage/settlementMgt/details`}}>{text}</Link>
        </span>
    )
}, {
    title: '库房',
    dataIndex: 'warehouse',
    key: 'warehouse'
}, {
    title: '结算总金额',
    dataIndex: 'totalMoney',
    key: 'totalMoney'
}, {
    title: '汇总人',
    dataIndex: 'summaryMan',
    key: 'SummaryMan'
}, {
    title: '汇总时间',
    dataIndex: 'summaryData',
    key: 'summaryData'
}]

const columns2 = [
    { 
        
        title: '结算单',
        dataIndex: 'statements',
        key: 'statements'
    }, {
        title: '结算药房',
        dataIndex: 'clearingPharmacy',
        key: 'clearingPharmacy'
    }, {
        title: '结算总金额',
        dataIndex: 'totalMoney',
        key: 'totalMoney'
    }, {
        title: '对账单数量',
        dataIndex: 'soaNum',
        key: 'soaNum'
    }, {
        title: '状态',
        dataIndex: 'state',
        key: 'state'
    }, {
        title: '制单人',
        dataIndex: 'documentMaker',
        key: "documentMaker"
    }, {
        title: '制单时间',
        dataIndex: 'documentDate',
        key: 'documentDate'
    }
]

const dataSource2 = [
    {
        key: 1,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    } , {
        key: 2,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }, {
        key: 3,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }, {
        key: 4,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }, {
        key: 5,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }, {
        key: 6,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }, {
        key: 7,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }, {
        key: 8,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }, {
        key: 9,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }, {
        key: 10,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }, {
        key: 11,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }, {
        key: 12,
        statements: 'KFJS22118070000383',
        clearingPharmacy: '中心药房',
        totalMoney: '12345678.08',
        soaNum: 30,
        state: '待汇总',
        documentMaker: '张一山',
        documentDate: '2018-07-16 09:05:06'
    }
]

class SettlementMgt extends PureComponent {
    state = {
        showNewSummary: false
    }
    showNewSummary = () => {
        let {showNewSummary} = this.state;
        showNewSummary = !showNewSummary;
        this.setState({
            showNewSummary
        });
    }
    handleCancel = (e) => {
        this.showNewSummary();
    }
    handleOk = (e) => {
        this.showNewSummary();
    }
    onChange = (e) => {
        console.log(e)
    }
    handleSearch = (e) => {
        console.log(e)
    }
    handleReset = (e) => {
        this.props.form.resetFields();
    }
    render() {
        let {getFieldDecorator} = this.props.form;
        return (
            <div className='ysynet-main-content'>
                <Form onSubmit={this.handleSearch}>
                    <Row gutter={30}>
                        <Col span={8}>
                            <FormItem label={`汇总单`} {...formItemLayout}>
                                {getFieldDecorator('summarSheet', {})(
                                    <Input/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} >
                            <FormItem label={`汇总日期`} {...formItemLayout}>
                                {getFieldDecorator('summarData', {})(
                                    <RangePicker onChange={this.onChange} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right', marginTop: 4}}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
                <Row className='ant-row-bottom'>
                    <Button type="primary" onClick={this.showNewSummary}>新建汇总</Button>
                    <Modal
                        title="单据信息"
                        visible={this.state.showNewSummary}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText = "确认汇总"
                        cancelText = "取消"
                        width={980}
                    >
                        <Table
                            rowSelection = {{
                                onChange: (selectedRowKeys, selectedRows) => {
                                    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                                },
                                getCheckboxProps: record => ({
                                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                                    name: record.name,
                                }),
                            }}
                            dataSource={dataSource2}
                            columns={columns2}
                            bordered
                        />
                    </Modal>    
                </Row>
                <Table
                    bordered={true}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                      size: 'small',
                      showQuickJumper: true,
                      showSizeChanger : true,
                      showTotal: (total) => {
                        return `总共${total}个项目`;
                      }
                    }}
                />
            </div>
        )
    }
};

const WrappedSettlementMgt = Form.create()(SettlementMgt);

export default WrappedSettlementMgt;