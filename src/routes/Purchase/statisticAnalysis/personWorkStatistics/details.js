import React, {PureComponent} from 'react';
import {Row, Col, message, Tooltip} from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';
import {connect} from 'dva';
import { Link } from 'react-router-dom';

const columns = [
    {
        title: '商品名称',
        dataIndex: 'ctmmgenericname',
        width: 250,
    }, {
        title: '规格',
        dataIndex: 'ctmmspecification',
        width: 168,
    }, {
        title: '生产厂商',
        dataIndex: 'ctmmmanufacturername',
        width: 200,
    }, {
        title: '单位',
        dataIndex: "unit",
        width: 168,
    }, {
        title: '数量',
        dataIndex: "demandquantity",
        width: 100,
    },

]

class Details extends PureComponent{
    constructor(props) {
        super(props);
        let {ordercode} = this.props.match.params;
        this.state = {
            query: {
                ordercode
            },
            info: {}
        }
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'statistics/getRoomRepertoryDetail',
            payload: {
                hisDrugCode: this.state.hisDrugCode
            },
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({info: data});
                }else {
                    message.error(msg);
                };
            }
        })
    }
    render() {
        let {query, info} = this.state;
        return (
            <div className="fullCol">
              <div className="fullCol-fullChild">
                <h3>基本信息</h3>
                <Row>
                   {/* <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>通用名</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.genericName || ''}</div>
                        </div>
                    </Col>*/}
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>单号</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.tradeName || ''}</div>
                        </div>
                    </Col>
                   <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>单据类型</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.specification || ''}</div>
                        </div>
                    </Col>
        
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>操作人</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.packageSpecification || ''}</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>操作时间</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.manufactureName || ''}</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>部门</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.approvalNo || ''}</div>
                        </div>
                    </Col>
                </Row>
              </div>
                <div className='detailCard'>
                    <h3 style={{marginBottom: 16}}>单据明细</h3>
                    <RemoteTable
                        rowKey="batchNo"
                        scroll={{x: '100%'}}
                        isJson
                        query={query}
                        url={tracingTotalList.GET_Purchase_Order_Detail}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
};

export default connect(state=>state)(Details);