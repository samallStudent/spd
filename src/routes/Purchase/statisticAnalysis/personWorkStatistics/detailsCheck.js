import React, {PureComponent} from 'react';
import {Row, Col, message, Tooltip} from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import moment from 'moment';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';
import {connect} from 'dva';
import { Link } from 'react-router-dom';

const columns = [
    {
        title: '药品名称',
        dataIndex: 'ctmmgenericname',
        width: 350,
    }, {
        title: '规格',
        dataIndex: 'ctmmspecification',
        width: 168,
    }, {
        title: '单位',
        dataIndex: 'unit',
        width: 118,
    }, {
        title: '操作前库存数量',
        dataIndex: "storenum",
        width: 120,
    }, {
        title: '操作数量',
        dataIndex: "quantiry",
        width: 100,
    }, {
        title: '操作后结存',
        dataIndex: "balance",
        width: 100,
    }
]

class Details extends PureComponent{
    render() {
        let {distributecode,checktype,lousernamet,receptiontime}=this.props.match.params
        if(checktype==1){
            checktype='药库验收'
        }else if(checktype==2){
            checktype='药房验收'
        }else if(checktype==3){
            checktype='基数药验收'
        }
        let newReceptiontime=new Number(receptiontime)
            newReceptiontime=moment(newReceptiontime).format('YYYY-MM-DD')
        let query={
            distributecode:distributecode
        }
        return (
            <div className="fullCol">
              <div className="fullCol-fullChild">
                <h3>基本信息</h3>
                <Row>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>单号</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{distributecode|| ''}</div>
                        </div>
                    </Col>
                   <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                            <label>单据类型</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                            <div className='ant-form-item-control'>{checktype|| ''}</div>
                        </div>
                    </Col>
                </Row>
                <Row>
                      <Col span={8}>
                          <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                              <label>操作人</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                              <div className='ant-form-item-control'>{lousernamet&&lousernamet!='undefined'?lousernamet:''}</div>
                          </div>
                      </Col>
                      <Col span={8}>
                          <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                              <label>操作时间</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className='ant-form-item-control'>{newReceptiontime||''}</div>
                          </div>
                      </Col>

                  </Row>
              </div>
                <div className='detailCard'>
                    <h3 style={{marginBottom: 16}}>单据明细</h3>
                    <RemoteTable
                        rowKey="batchNo"
                        scroll={{x: '100%'}}
                        query={query}
                        isJson
                        url={tracingTotalList.GET_Check_List_Detail}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
};

export default connect(state=>state)(Details);