import React, {PureComponent} from 'react';
import {Row, Col} from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import salvageCar from '../../../../api/baseDrug/salvageCar';
import {connect} from 'dva';
import querystring from 'querystring';
const columns = [
    {
        title: '生产批号',
        dataIndex: 'lot'
    },{
        title: '生产日期',
        dataIndex: 'productDate'
    },{
        title: '有效期至',
        dataIndex: 'validEndDate'
    },{
        title: '货位',
        dataIndex: 'hw'
    },{
        title: '货位类型',
        dataIndex: 'storeType'
    },{
        title: '单位',
        dataIndex: 'unit'
    },{
        title: '数量',
        dataIndex: 'sl'
    },{
        title: '供应商',
        dataIndex: 'supplierName'
    }
]

class Details extends PureComponent{
    state = {
        query: {
            drugCode:''
        },
        hisDrugCode:'',
        info: {}
    }
    componentWillMount() {
        let info = this.props.match.params.id;
        info = querystring.parse(info);
        let query = {
            drugCode : info.dCode
        }
        this.setState({
            query,
            hisDrugCode: info.bCode
        })
    }
    componentDidMount(){
        //获取抢救车详情，暂无接口，后期添加
        let info = {
            approvalNo: "",
            dosageDesc: null,
            genericName: "替莫唑胺胶囊(50mg*5粒/盒)",
            manufactureName: "江苏天士力帝益药业有限公司",
            packageSpecification: null,
            specification: "50mg*5粒/盒",
            tradeName: "替莫唑胺胶囊(50mg*5粒/盒)"
        }
        this.setState({
            info
        })
    }
    render(){
        let {query, info} = this.state;
        return(
            <div className="fullCol">
             <div className="fullCol-fullChild">
                <h3>基本信息</h3>
                <Row>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>通用名：</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.genericName || ''}</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>商品名：</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.tradeName || ''}</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>规格：</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.specification || ''}</div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>剂型：</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.approvalNo || ''}</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>包装规格：</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.dosageDesc || ''}</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>生产厂家：</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.manufactureName || ''}</div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>批准文号：</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.packageSpecification || ''}</div>
                        </div>
                    </Col>
                </Row>
             </div>
             <div className='detailCard'>
                    <h3 style={{marginBottom: 16}}>库存信息</h3>
                    <RemoteTable
                        rowKey="batchNo"
                        query={query}
                        url={salvageCar.GET_SALVGECAR_DETAILS_LIST}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}
export default connect(state=>state)(Details);