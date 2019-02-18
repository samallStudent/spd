import React, {PureComponent} from 'react';
import {Row, Col, message, Tooltip} from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';

import {connect} from 'dva';
import { Link } from 'react-router-dom';

const columns = [

    {
        title: '姓名',
        dataIndex: 'username',
        width: 148,
    }, {
        title: '工号',
        dataIndex: 'userno',
        width: 118,
    }, {
        //订单类型 1 零库存补货 2 报告药 4医院采购
        title: '单据类型',
        dataIndex: 'depttype',
        width: 118,
        render:(text)=>{
            var t={
                "1":'零库存补货',
                "2":"报告药",
                "4":"医院采购"
            }
            return t[text];
        }
    }, {
        title: '单据号',
        dataIndex: "ordercode",
        width: 168,
    }, {
        title: '供应商名称',
        dataIndex: "ctmasuppliername",
        width: 168,
    }, {
        title: '单位',
        dataIndex: "orderdetailcount",
        width: 112,
    }, {
        // 订单状态 1 代确认 2 备货中  3 订单完成  4 关闭订单
        title: '单据状态',
        dataIndex: "orderstatus",
        width: 112,
        render:(text)=>{
            var t={
                "1":'代确认',
                "2":"备货中",
                "3":"订单完成",
                "4":"关闭订单"
            }
            return t[text];
        }
    },
    {
        title: '操作',
        dataIndex: "vacuumNum",
        width: 112,
        render: (text,record) =>(
          <span>
            <Link to={{ pathname: `/purchase/statisticAnalysis/personWorkStatistics/details/${record.ordercode}` }}>详情</Link>
          </span>
        )
    }

]

class Details extends PureComponent{
    constructor(props) {
        super(props);
        let {deptCode, drugCode, hisDrugCode} = this.props.match.params;
        this.state = {
            query: {
                userid: this.props.match.params.guid,
                "starttime":"",
                "endtime":""
            },
            hisDrugCode,
            info: {}
        }
    }

    render() {
        let {query} = this.state;
        const {userno,username} = this.props.match.params;
        return (
            <div className="fullCol">
              <div className="fullCol-fullChild">
                <h3>基本信息</h3>
                <Row>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>工号</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{userno&&userno!='undefined'?userno:''}</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>姓名</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{username?username:''}</div>
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
                        url={tracingTotalList.GET_Purchase_Order_List}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
};

export default connect(state=>state)(Details);
