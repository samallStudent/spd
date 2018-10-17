import React, {PureComponent} from 'react';

import {Row, Col, Input, Table, Icon, Button} from 'antd';

import {createData} from '../../../../common/data.js';


const columns = [
    { 
        title: '对账单',
        dataIndex: 'medicinalCode'
    }, {
        title: '供应商',
        dataIndex: 'productCompany'
    }, {
        title: '明细数量',
        dataIndex: 'detailNum'
    }, {
        title: '对账金额',
        dataIndex: 'CheckMoney'
    }, {
        title: '状态',
        dataIndex: 'fstate'
    }, {
        title: '账期',
        dataIndex: 'documentMaker'
    }, {
        title: '对账完成时间',
        dataIndex: 'planTime'
    },
]

let dataSource = createData();

dataSource = dataSource.map( (item) => ({...item, 
    key: item.id, 
    documentMaker: '2018-07-16 09:05:06 ~2018-07-16 09:05:06',
    fstate: item.fstate === "00"? "已对账" : "未对账"
}) )


class NewSettlement extends PureComponent{
    state = {
        selectedNum: 0,
        totalMoney: 0
    }
    render() {
        let {selectedNum, totalMoney} = this.state;
        return (
            <div className="fullCol">
                <div className="fullCol-fullChild">
                    <Row>
                        <Col span={8}>
                            <div style={{lineHeight: '32px'}} className="ant-form-item-label ant-col-xs-24 ant-col-sm-4">
                                <Icon style={{transform: 'scale(1.5,1.5)', paddingRight: 10}} type="barcode" />
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <Input placeholder="输入或扫描对账单"/>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="detailCard">
                    <Row style={{paddingBottom: 20, borderBottom: '1px solid rgba(0, 0, 0, .1)' }} >单据信息</Row>
                    <Table
                        rowSelection = {{
                            onChange: (selectedRowKeys, selectedRows) => {
                                // let totalMoney = selectedRows.map( (item) => {
                                //     return Number(item.CheckMoney)
                                // } );
                                // totalMoney = totalMoney.reduce( (total, num) => total + num );

                                this.setState({ 
                                    // totalMoney,
                                    selectedNum: selectedRowKeys.length
                                })
                            }
                        }}
                        dataSource={dataSource}
                        columns={columns}
                        bordered
                    />
                    <Row>
                        <Col span={12}>已选{selectedNum}条，总金额{totalMoney}元</Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Button
                            style={{marginLeft: 30}} 
                            type="primary"
                            onClick={this.handleReset}>确认结算</Button>
                            <Button
                            style={{marginLeft: 30}} 
                            onClick={()=>{ this.props.history.go(-1) }}>取消</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
};


export default NewSettlement;