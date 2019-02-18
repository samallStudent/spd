import React, {PureComponent} from 'react';
import {Row, Col, message, Tooltip} from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';
import moment from 'moment';
import {connect} from 'dva';
import { Link } from 'react-router-dom';

const columns = [

    {
        title: '操作人',
        dataIndex: 'lousernamet',
        width: 118,
    }, {
        title: '工号',
        dataIndex: 'userno',
        width: 118,
    }, {
        // 验收单类型1.药库验收 2.药房验收 3.药房验收
        title: '单据类型',
        dataIndex: 'checktype',
        width: 100,
        render:(text)=>{
            var t={
                "1":'药库验收',
                "2":"药房验收",
                "3":"基数药验收"
            }
            return t[text];
        },
    }, {
        title: '单据号',
        dataIndex: "distributecode",
        width: 160,
    }, {
        title: '操作时间',
        dataIndex: "receptiontime",
        width: 118,
        render:(text)=>(
            <Tooltip>
                {moment(text).format('YYYY-MM-DD')}
            </Tooltip>
        )
    }, {
        title: '品规数',
        dataIndex: "checkacceptdetailcount",
        width: 112,
    }, {
    // 状态1.待验收 2.待上架 3.上架
        title: '单据状态',
        dataIndex: "auditstatus",
        render:(text)=>{
            var t={
                "1":'待验收',
                "2":"待上架",
                "3":"上架"
            }
            return t[text];
        },
        width: 100,
    },
    {
        title: '操作',
        dataIndex: "vacuumNum",
        width: 90,
        render: (text,record) =>(
          <span>
            <Link to={{ pathname: `/purchase/statisticAnalysis/personWorkStatistics/detailsCheck/${record.distributecode}/${record.checktype}/${record.lousernamet}/${record.receptiontime}` }}>详情</Link>
          </span>
        )
    }
]

class Details extends PureComponent{
    constructor(props) {
        super(props);
        console.log(this.props.match.params)
        let { hisDrugCode,guid} = this.props.match.params;
        this.state = {
            query: {
                "userid":guid,
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
                        url={tracingTotalList.GET_Check_List}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
};

export default connect(state=>state)(Details);
