/*
 * @Author: yuwei  药品目录 - 编辑
 * @Date: 2018-07-24 10:58:49
* @Last Modified time: 2018-07-24 10:58:49
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Table} from 'antd';
import { connect } from 'dva';
class EditDrugDirectory extends PureComponent{
    constructor(props){
        super(props)
        this.state = {
            baseData: {},
        }
    }
    componentDidMount = () =>{
        const { bigDrugCode, medDrugType } = this.props.match.params;
        this.props.dispatch({
            type: 'drugDirectory/getMedicineInfo',
            payload: { bigDrugCode , medDrugType },
            callback: (data) =>{
                this.setState({
                    baseData: data,
                })
            }
        })
    }

    getLayout = (label,columns,url)=>(
        <div className='detailCard'>
            <h3>{label}</h3>
            <hr className='hr'/>
            <Table
                columns={columns}
                dataSource={url}
                bordered
                rowKey={'sort'}
                pagination={false}
            />
        </div>
    )

    render(){
        const { baseData, } = this.state;
        //当前库存
        const columns = [
            {
                title: '所在部门',
                dataIndex: 'sort',
                width: 120
            },
            {
                title: '货位',
                dataIndex: 'bigUnit',
                width: 140
            },
            {
                title: '货位类型',
                dataIndex: 'conversionRate',
                width: 130
            },
            {
                title: '数量',
                dataIndex: 'smallUit',
                width: 100
            },
            {
                title: '单位',
                dataIndex: 'smallUit',
                width: 100
            }
        ];
        //采购验收记录
        const columns2 = [
            {
                title: '供应商',
                dataIndex: 'sort',
                width: 190
            },
            {
                title: '采购订单',
                dataIndex: 'bigUnit',
                width: 160
            },
            {
                title: '采购时间',
                dataIndex: 'conversionRate',
                width: 140
            },
            {
                title: '采购人',
                dataIndex: 'smallUit',
                width: 120
            },
            {
                title: '采购时间',
                dataIndex: 'conversionRate',
                width: 140
            },
            {
                title: '验收时间',
                dataIndex: 'conversionRate',
                width: 140
            },
            {
                title: '验收人',
                dataIndex: 'smallUit',
                width: 120
            },
        ];
        //院内流通记录
        const columns3 = [
            {
                title: '操作部门',
                dataIndex: 'sort',
            },
            {
                title: '操作类型',
                dataIndex: 'bigUnit',
            },
            {
                title: '操作时间',
                dataIndex: 'conversionRate',
            },
            {
                title: '操作人',
                dataIndex: 'smallUit',
            },
            {
                title: '单据编号',
                dataIndex: 'conversionRate',
            },
            {
                title: '操作数量',
                dataIndex: 'conversionRate',
            },
            {
                title: '单位',
                dataIndex: 'smallUit',
            },
        ];
        //发药记录
        const columns4 = [
            {
                title: '发药部门',
                dataIndex: 'sort',
            },
            {
                title: '发药时间',
                dataIndex: 'bigUnit',
            },
            {
                title: '发药单号',
                dataIndex: 'conversionRate',
            },
            {
                title: '发药单位',
                dataIndex: 'smallUit',
            },
            {
                title: '发药数量',
                dataIndex: 'conversionRate',
            },
            {
                title: '患者姓名',
                dataIndex: 'conversionRate',
            },
            {
                title: '就诊卡号',
                dataIndex: 'smallUit',
            },
        ]
        //非发药消耗
        const columns5 = [
            {
                title: '消耗部门',
                dataIndex: 'sort'
            },
            {
                title: '消耗时间',
                dataIndex: 'bigUnit'
            },
            {
                title: '发药单位',
                dataIndex: 'conversionRate'
            },
            {
                title: '发药数量',
                dataIndex: 'smallUit'
            },
            {
                title: '消耗方式',
                dataIndex: 'smallUit',
            }
        ];


        return (
            <div className='fullCol fadeIn'>
                <div className='fullCol-fullChild'>
                    <div style={{ display:'flex',justifyContent: 'space-between' }}>
                        <h3><b>基本信息</b></h3>
                    </div>
                    <Row gutter={30}>
                        {/*<Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>通用名</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.ctmmGenericName ? baseData.ctmmGenericName: ''  }</div>
                            </div>
                        </Col>*/}
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>商品名</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.ctmmTradeName ? baseData.ctmmTradeName: ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>规格</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.ctmmSpecification ? baseData.ctmmSpecification: ''}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={30}>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>剂型</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.ctmmDosageFormDesc ? baseData.ctmmDosageFormDesc: ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>包装规格</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.packageSpecification ? baseData.packageSpecification: ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>生产厂家</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.ctmmManufacturerName ? baseData.ctmmManufacturerName: ''}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={30}>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>批号</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.approvalNo ? baseData.approvalNo: ''}</div>
                            </div>
                        </Col>
                    </Row>
                </div>
                {this.getLayout('当前库存',columns,baseData.listTransforsVo)}
                {this.getLayout('采购/验收记录',columns2,baseData.listTransforsVo)}
                {this.getLayout('院内流通记录(排序:部门为第一主序,时间为第二顺序)',columns3,baseData.listTransforsVo)}
                {this.getLayout('发药记录',columns4,baseData.listTransforsVo)}
                {this.getLayout('非发药消耗',columns5,baseData.listTransforsVo)}
            </div>
        )
    }
}
export default connect()(Form.create()(EditDrugDirectory))