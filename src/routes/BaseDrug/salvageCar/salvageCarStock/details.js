import React, {PureComponent} from 'react';
import {Row, Col,message,Spin, Tooltip} from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import salvageCar from '../../../../api/baseDrug/salvageCar';
import {connect} from 'dva';
import querystring from 'querystring';
const columns = [
    {
        title: '生产批号',
        dataIndex: 'lot',
        width: 168,
    },{
        title: '生产日期',
        dataIndex: 'productDate',
        width: 168,
    },{
        title: '有效期至',
        dataIndex: 'validEndDate',
        width: 168,
    },{
        title: '货位',
        dataIndex: 'storeLocName',
        width: 112,
    },{
        title: '采购类型',
        dataIndex: "purchaseType",
        width: 112,
        render:(text)=>(
            <span>{text===1?'零库存':'自采'}</span>
        )
    },{
        title: '货位类型',
        dataIndex: 'storeType',
        width: 168,
    },{
        title: '单位',
        dataIndex: 'unit',
        width: 60,
    },{
        title: '数量',
        dataIndex: 'totalQuantity',
        width: 112,
    },{
        title: '供应商',
        dataIndex: 'supplierName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
    }
]

class Details extends PureComponent{
    state = {
        query: {
            drugCode:''
        },
        hisDrugCode:'',
        info: {},
        loading: false
    }
    componentDidMount(){
        if (this.props.match.params.id) {
            let _this = this;
            let { id } = this.props.match.params;
            let paramsInfo = querystring.parse(id);
            let qurey = {bigDrugCode:paramsInfo.bCode};
            this.setState({ loading: true });
            this.props.dispatch({
                type:'salvageCar/getRescuecarMedicineDetail',
                payload: qurey,
                callback:(res)=>{
                    if(res.code === 200){
                        _this.setState({ info: res.data });
                        this.setState({ loading: false });
                    }else{
                        message.error(res.msg);
                    }
                }
            });
        }
    }
    render(){
        let {query, info} = this.state;
        return(
            <div className="fullCol">
             <div className="fullCol-fullChild">
             <Spin spinning={this.state.loading}>
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
             </Spin>
             </div>
             <div className='detailCard'>
                    <h3 style={{marginBottom: 16}}>库存信息</h3>
                    <RemoteTable
                        rowKey="batchNo"
                        query={query}
                        url={salvageCar.GET_RESCUECAR_MEDICEINE_DETAIL_LIST}
                        columns={columns}
                        scroll={{x: 1292}}
                    />
                </div>
            </div>
        )
    }
}
export default connect(state=>state)(Details);