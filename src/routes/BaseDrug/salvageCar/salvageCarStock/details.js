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
        dataIndex: 'storeLocName'
    },{
        title: '货位类型',
        dataIndex: 'storeType'
    },{
        title: '单位',
        dataIndex: 'unit'
    },{
        title: '数量',
        dataIndex: 'totalQuantity'
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
        console.log(this.props);
        if (this.props.match.params.backNo) {
            let { backNo } = this.props.match.params;
            this.setState({ spinning: true });
            this.props.dispatch({
                type:'base/getBackStorageDetail',
                payload: { backNo },
                callback:(data)=>{
                    this.setState({ detailsData: data,dataSource: data.list, spinning: false });
                }
            });
        }
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
                        url={salvageCar.GET_RESCUECAR_MEDICEINE_DETAIL_LIST}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}
export default connect(state=>state)(Details);