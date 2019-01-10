/*
 * @Author: yuwei  批号追溯 - 详情
 * @Date: 2018-07-24 10:58:49
* @Last Modified time: 2018-07-24 10:58:49
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Table,Tabs} from 'antd';
import { connect } from 'dva';
const {TabPane} = Tabs;

class EditDrugDirectory extends PureComponent{

    constructor(props){
        super(props)
        this.state = {
            baseData: {},
            tabsData:[],
            baseUrl:['','statistics/batchGetStore','statistics/batchGetPlanAndCheck','statistics/batchMedCirculate','statistics/batchGetDispensing','statistics/batchGetMakeUp'],
            loading: false,
        }
    }
    componentDidMount = () =>{
        const { bigDrugCode, drugCode,hisDrugCode,lot } = this.props.match.params;
        //基本信息
        this.props.dispatch({
            type: 'statistics/batchGetDrugInfo',
            payload: { bigDrugCode , drugCode ,hisDrugCode,lot},
            callback: (data) =>{
                this.setState({
                    baseData: data.data,
                })
            }
        })

        this.getData(1)
    }
    getData=(key)=>{
        const { bigDrugCode, drugCode,hisDrugCode,lot } = this.props.match.params;
        this.setState({loading: true});
        this.props.dispatch({
            type:this.state.baseUrl[key],
            payload: { bigDrugCode , drugCode ,hisDrugCode,lot},
            callback: (data) =>{
                this.setState({
                    tabsData: data.data,
                    loading:false
                })
            }
        })
    }
    getLayout = (columns,url)=>(
        <Table
            columns={columns}
            dataSource={url}
            bordered
            rowKey={'lot'}
            pagination={false}
            loading={this.state.loading}
        />
    )

    render(){
        const { baseData,tabsData,} = this.state;
        //当前库存
        const columns = [
            {
                title: '所在部门',
                dataIndex: 'deptName',
                width: 120
            },
            {
                title: '货位',
                dataIndex: 'positionName',
                width: 140
            },
            {
                title: '货位类型',
                dataIndex: 'positionTypeName',
                width: 130
            },
            {
                title: '数量',
                dataIndex: 'storeNum',
                width: 100
            },
            {
                title: '单位',
                dataIndex: 'unit',
                width: 100
            }
        ];
        //采购验收记录
        const columns2 = [
            {
                title: '供应商',
                dataIndex: 'supplierName',
                width: 190
            },
            {
                title: '采购订单',
                dataIndex: 'planBillNo',
                width: 160
            },
            {
                title: '采购时间',
                dataIndex: 'planDate',
                width: 140
            },
            {
                title: '采购人',
                dataIndex: 'planUserName',
                width: 120
            },
            {
                title: '验收时间',
                dataIndex: 'checkDate',
                width: 140
            },
            {
                title: '验收数量',
                dataIndex: 'checkNum',
                width: 140
            },
            {
                title: '验收人',
                dataIndex: 'checkUserName',
                width: 120
            },
        ];
        //院内流通记录
        const columns3 = [
            {
                title: '操作部门',
                dataIndex: 'deptName',
            },
            {
                title: '操作类型',
                dataIndex: 'typeName',
            },
            {
                title: '操作时间',
                dataIndex: 'time',
            },
            {
                title: '操作人',
                dataIndex: 'userName',
            },
            {
                title: '单据编号',
                dataIndex: 'billNo',
            },
            {
                title: '操作数量',
                dataIndex: 'num',
            },
            {
                title: '单位',
                dataIndex: 'unit',
            },
        ];
        //发药记录
        const columns4 = [
            {
                title: '发药部门',
                dataIndex: 'deptName',
            },
            {
                title: '发药时间',
                dataIndex: 'dispensingDate',
            },
            {
                title: '发药单号',
                dataIndex: 'dispensingBillNo',
            },
            {
                title: '发药单位',
                dataIndex: 'dispensingUnit',
            },
            {
                title: '发药数量',
                dataIndex: 'dispensingNum',
            },
            {
                title: '患者姓名',
                dataIndex: 'sickUserName',
            },
            {
                title: '就诊卡号',
                dataIndex: 'cardNo',
            },
        ]
        //非发药消耗
        const columns5 = [
            {
                title: '消耗部门',
                dataIndex: 'deptName'
            },
            {
                title: '消耗时间',
                dataIndex: 'makeUpDate'
            },
            {
                title: '发药单位',
                dataIndex: 'makeUpUnit'
            },
            {
                title: '发药数量',
                dataIndex: 'makeUpNum'
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
                       {/* <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>通用名</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.ctmmGenericName ? baseData.ctmmGenericName: ''  }</div>
                            </div>
                        </Col>*/}
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>药品名称</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.ctmmTradeName ? baseData.ctmmTradeName: ''}</div>
                            </div>
                        </Col>
                      {/*  <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>规格</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.ctmmSpecification ? baseData.ctmmSpecification: ''}</div>
                            </div>
                        </Col>*/}
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>剂型</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.ctmmDosageFormDesc ? baseData.ctmmDosageFormDesc: ''}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={30}>

                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                                <label>包装规格</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.packageSpecification ? baseData.packageSpecification: ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
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
                                <div className='ant-form-item-control'>{ baseData.lot ? baseData.lot: ''}</div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Tabs onChange={this.getData}>
                    <TabPane tab="当前库存" key="1">
                        {this.getLayout(columns,tabsData)}
                    </TabPane>
                    <TabPane tab="采购/验收记录" key="2">
                        {this.getLayout(columns2,tabsData)}
                    </TabPane>
                    <TabPane tab="院内流通记录" key="3">
                        {this.getLayout(columns3,tabsData)}
                    </TabPane>
                    <TabPane tab="发药记录" key="4">
                        {this.getLayout(columns4,tabsData)}
                    </TabPane>
                    <TabPane tab="非发药消耗" key="5">
                        {this.getLayout(columns5,tabsData)}
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
export default connect()(Form.create()(EditDrugDirectory))