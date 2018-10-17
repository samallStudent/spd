import React, {PureComponent} from 'react';
import {Row, Col, Table, Spin} from 'antd';
import {connect} from 'dva';
import querystring from 'querystring';
const columns = [
    {
        title: '生产批号',
        dataIndex: 'lot',
        width: 168
    }, {
        title: '生产日期',
        dataIndex: 'productDate',
        width: 168
    }, {
        title: '有效期至',
        dataIndex: 'validEndDate',
        width: 168
    }, {
        title: '货位',
        dataIndex: "storeLocName",
        width: 112
    }, {
        title: '货位类型',
        dataIndex: "storeType",
        width: 168
    }, {
        title: '单位',
        dataIndex: "unit",
        width: 60
    }, {
        title: '数量',
        dataIndex: "usableQuantity",
        width: 112
    }, {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 224
    }
]

class Details extends PureComponent{
    constructor(props) {
        super(props);
        let info = this.props.match.params.id;
        info = querystring.parse(info);
        this.state = {
            drugCode: info.dCode,
            bigDrugCode: info.bCode,
            info: {},
            list: [],
            loading: true,
            detailLoading: true
        }
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'stockMgt/getBaseMedicineDetail',
            payload: {
                bigDrugCode: this.state.bigDrugCode
            },
            callback: (data) => {
                this.setState({
                    info: data,
                    detailLoading: false
                });
            }
        });
        this.props.dispatch({
            type: 'stockMgt/getBaseMedicineDetailList',
            payload: {
                drugCode: this.state.drugCode
            },
            callback: (data) => {
                this.setState({
                    list: data.list,
                    loading: false
                });
            }
        });
    }
    render() {
        let {list, info, loading, detailLoading} = this.state;
        return (
            <div className="fullCol">
                <Spin spinning={detailLoading}>
                    <div className="fullCol-fullChild">
                        <h3>基本信息</h3>
                        <Row>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>通用名</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{info.genericName || ''}</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>商品名</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{info.tradeName || ''}</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>规格</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{info.specification || ''}</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>剂型</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{info.dosageDesc || ''}</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>包装规格</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{info.packageSpecification || ''}</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>生产厂家</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{info.manufactureName || ''}</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>批准文号</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{info.approvalNo || ''}</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Spin>
                <div className='detailCard'>
                    <h3 style={{marginBottom: 16}}>库存信息</h3>
                    <Table
                        loading={loading}
                        rowKey="id"
                        columns={columns}
                        dataSource={list}
                        bordered
                        pagination={false}
                    />
                </div>
            </div>
        )
    }
};

export default connect(state=>state)(Details);