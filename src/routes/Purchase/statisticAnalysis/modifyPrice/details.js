import React, {PureComponent} from 'react';
import {Row, Col,message,Spin, Tooltip} from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import {statisticAnalysis} from '../../../../api/purchase/purchase';
import {connect} from 'dva';
import querystring from 'querystring';
const columns = [
    {
        title: '部门',
        dataIndex: 'deptName',
        width: 168,
    },{
        title: '生产批号',
        dataIndex: 'lot',
        width: 90,
    },{
        title: '生产日期',
        dataIndex: 'productDate',
        width: 112,
    },{
        title: '有效期至',
        dataIndex: 'validEndDate',
        width: 112,
    },{
        title: '货位',
        dataIndex: 'locName',
        width: 168,
    },{
        title: '货位类型',
        dataIndex: 'locTypeName',
        width: 168,
    },{
        title: '单位',
        dataIndex: 'unit',
        width: 60,
    },{
        title: '数量',
        dataIndex: 'totalQuantity',
        width: 112,
    },/*{
        title: '单价',
        dataIndex: 'newPrice',
        width: 60,
    },{
        title: '金额',
        dataIndex: 'totalPrice',
        width: 60,
    },*/{
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
    constructor(props) {
        super(props);
        let { id } = this.props.match.params;
        let paramsInfo = querystring.parse(id);
        this.state = {
            id: paramsInfo.id,
            query: {
                updatePriceId: paramsInfo.id
            },
            info: {},
            loading: false
        }
    }
    componentDidMount(){
        let qurey = {id:this.state.id}
        if (this.props.match.params.id) {
            this.setState({ 
                loading: true ,
            });
            this.props.dispatch({
                type:'statistics/getPriceStaticGet',
                payload: qurey,
                callback:(res)=>{
                    if(res.code === 200){
                        console.log(res.data)
                        this.setState({ info: res.data });
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
        console.log(JSON.stringify(info));
        return(
            <div className="fullCol">
             <div className="fullCol-fullChild">
             <Spin spinning={this.state.loading}>
                <h3>基本信息</h3>
                <Row>
                    {/*<Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>通用名</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.ctmmGenericName || ''}</div>
                        </div>
                    </Col>*/}
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>药品名称</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.ctmmTradeName || ''}</div>
                        </div>
                    </Col>
                   {/* <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>规格</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.ctmmSpecification || ''}</div>
                        </div>
                    </Col>*/}
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>剂型</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.approvalNo || ''}</div>
                        </div>
                    </Col>
                </Row>
                <Row>

                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>包装规格</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.ctmmDosageFormDesc || ''}</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>生产厂家</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.ctmmManufacturerName || ''}</div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>批准文号</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.packageSpecification || ''}</div>
                        </div>
                    </Col>
                </Row>      
             </Spin>
             </div>
             <div className='detailCard'>
                    <h3 style={{marginBottom: 16}}>调价基本信息</h3>
                    <RemoteTable
                        rowKey="batchNo"
                        query={query}
                        url={statisticAnalysis.GET_PRICE_STATIC_DETAIL}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}
export default connect(state=>state)(Details);