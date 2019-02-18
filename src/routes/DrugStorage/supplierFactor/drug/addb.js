/**
 * @author QER
 * @date 19/1/11
 * @Description: 上传药品资质
*/
import React, { PureComponent } from 'react';
import { Table , Col, Button, Icon, Modal , message, Input , Row , Tooltip, Spin, Form, Select,Upload ,DatePicker, Tabs} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import UploadPic from '../uploadPic'
import moment from 'moment';
import { formItemLayout } from '../../../../utils/commonStyles';
import {common} from "../../../../api/purchase/purchase";
import FetchSelect from "../../../../components/DrugSelect";
import { supplierFactor } from '../../../../api/drugStorage/supplierFactor';
const FormItem = Form.Item;
const {Option} = Select;
const {TabPane} = Tabs;


class AddRefund extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            selectedRowKey: [],
            spinLoading: false,
            visible: false,
            isRecall: true,
            btnLoading: false, // 添加产品modal 确认
            detailsData: {}, // 详情
            dataSource: [],
            selected: [],  // 新建, 编辑 table 勾选
            selectedRows: [],
            modalSelectedRows: [], // 模态框内勾选
            modalSelected: [],
            okLoading: false,
            display: 'none',
            previewVisible: false,
            previewImage: '',
            tabKey:'',
            druglist:'',
            psgoodsName:'',
            defaultKey:'',
            arr:['','1','2','3','4','5','6'],
            types:[]
        }
    }

    //取消


    cancel=e=>{
        if(e){
            e.stopPropagation()
        }
        if(this.state.defaultKey){
            this.setState({
                tabKey:this.state.defaultKey
            });
        }else {
            this.setState({
                tabKey:1
            });
        }
        this.setState({
            visible:false
        });
        this.props.form.resetFields();
    }

    componentDidMount=()=>{
    let {goodsName,licType}=this.props.record;

    //zujian
        if(licType){
            const stringKey=String(licType);
            this.setState({
                defaultKey: stringKey,
                tabKey:licType
            })
        }else {
            this.setState({
                defaultKey:'1',
                tabKey:1
            })
        }

    this.setState({
        psgoodsName:goodsName
    })
        if(this.state.tabKey!=this.state.defaultKey){
            this.setForms()
            console.log(this.state.tabKey)
        }

}


    okHandler=e=>{
        if(e){
            e.stopPropagation()
        }
        const {onOk,record:{id}}=this.props;
        const {druglist}=this.state;
        console.log(druglist)
        this.props.form.validateFields((err,values)=>{
            if(!err){
                const productTime = values.productTime === undefined ? '' : values.productTime;
                const validEndDate = values.validEndDate === undefined ? '' : values.validEndDate;
                if (validEndDate&&productTime) {
                    values.productTime = productTime.format('YYYY-MM-DD');
                    values.validEndDate= validEndDate.format('YYYY-MM-DD');
                }else {
                    values.productTime = '';
                    values.validEndDate = '';
                };
                if(values.inStoreDate){
                    values.inStoreDate = values.inStoreDate.format('YYYY-MM-DD');
                }
                if(values.pictcontents){
                    console.log(values.pictcontents)
                    let cc=[]
                    values.pictcontents.forEach(function (value,index,arr) {
                        cc.push(value.response.data)
                    });
                    values.pictcontents=cc;

                }


                values.producerName=druglist.ctmmManufacturerName;
                values.goodsName=druglist.children;
                values.registKey=druglist.approvalNos
                values.licType=this.state.tabKey;
                if(id){
                    values.id=id;
                }
                console.log(values)
                onOk(values)

                this.cancel();
            }
        })
    }
    getkey=e=>{

        this.setState({
            tabKey:this.state.arr[e]
        });
        if(e!=this.state.defaultKey){
            this.props.form.setFieldsValue({//文本框输入值的设置
                productTime: '',
                validEndDate:'',
                producerName:'',
                licCode:'',
                registKey:'',
                lot:'',
                inStoreCode:'',
                inStoreDate:'',
                goodsName:'',
                deliveryCode:''
            });
        };
        this.props.form.resetFields();
    }

    getVal=(values)=>{
        this.setState({druglist:values})
        console.log(this.state.druglist)
    }
    render(){
        let { visible, display,druglist,psgoodsName,tabKey,defaultKey} = this.state;
        const { getFieldDecorator } = this.props.form;
        const expand = display === 'block';
        const {children,supplierList,type}=this.props;
        let {
            supplierCode,productTime,validEndDate,producerName,licCode
            ,registKey,lot,inStoreCode,inStoreDate,goodsName,deliveryCode
        }=this.props.record;
        let productTimes='';
        let validEndDates='';
        let inStoreDates='';
        if(productTime&&validEndDate){
            productTimes=moment(productTime).format('YYYY-MM-DD');
            validEndDates=moment(validEndDate).format('YYYY-MM-DD');
        }
        if(inStoreDate){
            inStoreDates=moment(inStoreDate).format('YYYY-MM-DD');
        }

        return (
            <span onClick={()=>{this.setState({visible:true});}} >
                {children}
                <Modal
                    destroyOnClose
                    bordered
                    title={'上传药品资质'}
                    width={1200}
                    style={{ top: 50 }}
                    onCancel={this.cancel} visible={visible}
                    okText={'保存'}
                    onOk={this.okHandler}
                >
                    <div>
                        <Form onSubmit={this.handleSearch}>
                            <Row gutter={30}>
                                <Col span={8}>
                                    <FormItem label={'供应商'} {...formItemLayout}>


                                        {getFieldDecorator('supplierCode', {
                                            initialValue: supplierCode,
                                            rules:[
                                                {required:true,message:'请选择供应商'}
                                            ]
                                        },)(
                                            <Select
                                                showSearch
                                                placeholder="请选择"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {
                                                    supplierList.map(item => (
                                                        <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8}>
                                    <FormItem label={`药品名称`} {...formItemLayout}>
                                        {getFieldDecorator('goodsName',{
                                            initialValue:druglist.children
                                        })(
                                            <FetchSelect
                                                allowClear={true}
                                                placeholder='请输入药品名称'
                                                url={supplierFactor.SEARCHDRUG_LIST}
                                                getVal={this.getVal}
                                                psgoodsName={this.state.psgoodsName}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label={`生产厂家`} {...formItemLayout}>
                                        {getFieldDecorator('producerName',{
                                            initialValue:producerName
                                        })(
                                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                                {producerName?
                                                    <div className='ant-form-item-control'>{producerName}</div>
                                                    :<div className='ant-form-item-control'>{this.state.druglist.ctmmManufacturerName }</div>
                                                }
                                            </div>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={8}>
                                    <FormItem label={`批准文号`} {...formItemLayout}>
                                        {getFieldDecorator('registKey',{
                                            initialValue: registKey
                                        })(
                                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                                                {
                                                    registKey?
                                                        <div className='ant-form-item-control'>{registKey}</div>:
                                                        <div className='ant-form-item-control'>{this.state.druglist.approvalNos }</div>
                                                }
                                            </div>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Tabs onChange={this.getkey} defaultActiveKey={this.state.defaultKey}>
                                <TabPane tab="药品注册证" key="1">
                                    {this.state.tabKey==1?
                                    <div  className='uplaodpic'>
                                        <div style={{width:'440px'}}>
                                            <Row gutter={30}>
                                                <Col span={20}>
                                                    {productTimes?
                                                        <FormItem  label={'发证日期'} {...formItemLayout}>
                                                            {getFieldDecorator('productTime',{

                                                                initialValue: moment(productTimes, 'YYYY-MM-DD'),
                                                                rules:[
                                                                    {required:true,message:'发证日期不能为空'}
                                                                ]
                                                            })(
                                                                <DatePicker format={'YYYY-MM-DD'}/>
                                                            )}
                                                        </FormItem>:
                                                        <FormItem  label={'发证日期'} {...formItemLayout}>
                                                            {getFieldDecorator('productTime',{
                                                                rules:[
                                                                    {required:true,message:'发证日期不能为空'}
                                                                ]
                                                            })(
                                                                <DatePicker format={'YYYY-MM-DD'}/>
                                                            )}
                                                        </FormItem>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row gutter={30}>
                                                <Col span={20}>
                                                    {validEndDate?

                                                        <FormItem  label={'有效期至'} {...formItemLayout}>
                                                            {getFieldDecorator('validEndDate',{
                                                                initialValue: moment(validEndDates, 'YYYY-MM-DD'),
                                                                rules:[

                                                                    {required:true,message:'有效期不能为空'}
                                                                ]
                                                            })(
                                                                <DatePicker format={'YYYY-MM-DD'}/>
                                                            )}
                                                        </FormItem>:
                                                        <FormItem  label={'有效期至'} {...formItemLayout}>
                                                            {getFieldDecorator('validEndDate',{
                                                                rules:[

                                                                    {required:true,message:'有效期不能为空'}
                                                                ]
                                                            })(
                                                                <DatePicker format={'YYYY-MM-DD'}/>
                                                            )}
                                                        </FormItem>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row gutter={30}>
                                                <Col span={20}>
                                                    <FormItem label={`证件编号`} {...formItemLayout}>
                                                        {getFieldDecorator('licCode',{
                                                            initialValue:licCode,
                                                            rules:[
                                                                {required:true,message:'证件编号不能为空'}
                                                            ]
                                                        })(
                                                            <Input placeholder='证件编号'/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </div>
                                        <FormItem>
                                            {getFieldDecorator('pictcontents',{
                                                initialValue: ''
                                            })(
                                                <UploadPic  length={3}/>
                                            )}
                                        </FormItem>
                                    </div>:''}
                                </TabPane>

                                <TabPane tab="药品质检报告" key="2">
                                    {this.state.tabKey==2?
                                    <div className='uplaodpic'>
                                        <div style={{width:'440px'}}>
                                            <Row gutter={30}>
                                                <Col span={20}>
                                                    <FormItem label={`批号：`} {...formItemLayout}>
                                                        {getFieldDecorator('lot',{
                                                            initialValue: lot
                                                        })(
                                                            <Input placeholder='请输入批号'/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={30}>
                                                <Col span={20}>
                                                    {productTimes?
                                                        <FormItem  label={'发证日期'} {...formItemLayout}>
                                                            {getFieldDecorator('productTime',{

                                                                initialValue: moment(productTimes, 'YYYY-MM-DD'),
                                                                rules:[
                                                                    {required:true,message:'发证日期不能为空'}
                                                                ]
                                                            })(
                                                                <DatePicker format={'YYYY-MM-DD'}/>
                                                            )}
                                                        </FormItem>:
                                                        <FormItem  label={'发证日期'} {...formItemLayout}>
                                                            {getFieldDecorator('productTime',{
                                                                rules:[
                                                                    {required:true,message:'发证日期不能为空'}
                                                                ]
                                                            })(
                                                                <DatePicker format={'YYYY-MM-DD'}/>
                                                            )}
                                                        </FormItem>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row gutter={30}>
                                                <Col span={20}>
                                                    {validEndDate?

                                                        <FormItem  label={'有效期至'} {...formItemLayout}>
                                                            {getFieldDecorator('validEndDate',{
                                                                initialValue: moment(validEndDates, 'YYYY-MM-DD'),
                                                                rules:[

                                                                    {required:true,message:'有效期不能为空'}
                                                                ]
                                                            })(
                                                                <DatePicker format={'YYYY-MM-DD'}/>
                                                            )}
                                                        </FormItem>:
                                                        <FormItem  label={'有效期至'} {...formItemLayout}>
                                                            {getFieldDecorator('validEndDate',{
                                                                rules:[

                                                                    {required:true,message:'有效期不能为空'}
                                                                ]
                                                            })(
                                                                <DatePicker format={'YYYY-MM-DD'}/>
                                                            )}
                                                        </FormItem>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row gutter={30}>
                                                <Col span={20}>
                                                    <FormItem label={`入库单`} {...formItemLayout}>
                                                        {getFieldDecorator('inStoreCode',{
                                                            initialValue: inStoreCode,

                                                        })(
                                                            <Input placeholder='入库单'/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={30}>
                                                <Col span={20}>
                                                    {inStoreDate?

                                                        <FormItem  label={'入库日期'} {...formItemLayout}>
                                                            {getFieldDecorator('inStoreDate',{
                                                                initialValue: moment(inStoreDates, 'YYYY-MM-DD'),
                                                                rules:[

                                                                    {required:true,message:'入库日期不能为空'}
                                                                ]
                                                            })(
                                                                <DatePicker format={'YYYY-MM-DD'}/>
                                                            )}
                                                        </FormItem>:
                                                        <FormItem  label={'有效期至'} {...formItemLayout}>
                                                            {getFieldDecorator('inStoreDate',{
                                                                rules:[

                                                                    {required:true,message:'有效期不能为空'}
                                                                ]
                                                            })(
                                                                <DatePicker format={'YYYY-MM-DD'}/>
                                                            )}
                                                        </FormItem>
                                                    }
                                                </Col>
                                            </Row>
                                        </div>
                                        <FormItem>
                                            {getFieldDecorator('pictcontents',{
                                                initialValue: ''
                                            })(
                                                <UploadPic  length={3}/>
                                            )}
                                        </FormItem>
                                    </div>:''}
                                </TabPane>

                                <TabPane tab="药品说明书" key="3">
                                    {this.state.tabKey==3?
                                        <div className='uplaodpic'>
                                            <div style={{width:'440px'}}>
                                                <Row gutter={30}>
                                                    <Col span={20}>
                                                        {productTimes?
                                                            <FormItem  label={'核准日期'} {...formItemLayout}>
                                                                {getFieldDecorator('productTime',{

                                                                    initialValue: moment(productTimes, 'YYYY-MM-DD'),
                                                                    rules:[
                                                                        {required:true,message:'核准日期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>:
                                                            <FormItem  label={'核准日期'} {...formItemLayout}>
                                                                {getFieldDecorator('productTime',{
                                                                    rules:[
                                                                        {required:true,message:'核准日期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row gutter={30}>
                                                    <Col span={20}>
                                                        {validEndDate?

                                                            <FormItem  label={'修订日期'} {...formItemLayout}>
                                                                {getFieldDecorator('validEndDate',{
                                                                    initialValue: moment(validEndDates, 'YYYY-MM-DD'),
                                                                    rules:[

                                                                        {required:true,message:'修订日期'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>:
                                                            <FormItem  label={'有效期至'} {...formItemLayout}>
                                                                {getFieldDecorator('validEndDate',{
                                                                    rules:[

                                                                        {required:true,message:'有效期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>
                                                        }
                                                    </Col>
                                                </Row>
                                            </div>
                                            <FormItem>
                                                {getFieldDecorator('pictcontents',{
                                                    initialValue: ''
                                                })(
                                                    <UploadPic  length={3}/>
                                                )}
                                            </FormItem>
                                        </div>:''}
                                </TabPane>

                                <TabPane tab="进口药品通关单" key="4">
                                    {this.state.tabKey==4?
                                        <div className='uplaodpic'>
                                            <div style={{width:'440px'}}>
                                                <Row gutter={30}>
                                                    <Col span={20}>
                                                        <FormItem  label={'提运单号'} {...formItemLayout}>
                                                            {getFieldDecorator('deliveryCode',{
                                                                initialValue:deliveryCode,
                                                                rules:[
                                                                    {required:true,message:'提运单号不能为空'}
                                                                ]
                                                            })(
                                                                <Input placeholder='证件编号'/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                                <Row gutter={30}>
                                                    <Col span={20}>
                                                        <FormItem  label={'批件号'} {...formItemLayout}>
                                                            {getFieldDecorator('lot',{
                                                                initialValue:lot,
                                                                rules:[
                                                                    {required:true,message:'批件号不能为空'}
                                                                ]
                                                            })(
                                                                <Input placeholder='批件号'/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <FormItem>
                                                {getFieldDecorator('pictcontents',{
                                                    initialValue: ''
                                                })(
                                                    <UploadPic  length={3}/>
                                                )}
                                            </FormItem>
                                        </div>:null}
                                </TabPane>

                                <TabPane tab="再注册受理通知书" key="5">
                                    {this.state.tabKey==5?
                                        <div  className='uplaodpic'>
                                            <div style={{width:'440px'}}>
                                                <Row gutter={30}>
                                                    <Col span={20}>
                                                        {productTimes?
                                                            <FormItem  label={'发证日期'} {...formItemLayout}>
                                                                {getFieldDecorator('productTime',{

                                                                    initialValue: moment(productTimes, 'YYYY-MM-DD'),
                                                                    rules:[
                                                                        {required:true,message:'发证日期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>:
                                                            <FormItem  label={'发证日期'} {...formItemLayout}>
                                                                {getFieldDecorator('productTime',{
                                                                    rules:[
                                                                        {required:true,message:'发证日期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row gutter={30}>
                                                    <Col span={20}>
                                                        {validEndDate?

                                                            <FormItem  label={'有效期至'} {...formItemLayout}>
                                                                {getFieldDecorator('validEndDate',{
                                                                    initialValue: moment(validEndDates, 'YYYY-MM-DD'),
                                                                    rules:[

                                                                        {required:true,message:'有效期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>:
                                                            <FormItem  label={'有效期至'} {...formItemLayout}>
                                                                {getFieldDecorator('validEndDate',{
                                                                    rules:[

                                                                        {required:true,message:'有效期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row gutter={30}>
                                                    <Col span={20}>
                                                        <FormItem label={`证件编号`} {...formItemLayout}>
                                                            {getFieldDecorator('licCode',{
                                                                initialValue:licCode,
                                                                rules:[
                                                                    {required:true,message:'证件编号不能为空'}
                                                                ]
                                                            })(
                                                                <Input placeholder='证件编号'/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <FormItem>
                                                {getFieldDecorator('pictcontents',{
                                                    initialValue: ''
                                                })(
                                                    <UploadPic  length={3}/>
                                                )}
                                            </FormItem>
                                        </div>:''}
                                </TabPane>

                                <TabPane tab="再注册批件" key="6">
                                    {this.state.tabKey==6?
                                        <div  className='uplaodpic'>
                                            <div style={{width:'440px'}}>
                                                <Row gutter={30}>
                                                    <Col span={20}>
                                                        {productTimes?
                                                            <FormItem  label={'发证日期'} {...formItemLayout}>
                                                                {getFieldDecorator('productTime',{

                                                                    initialValue: moment(productTimes, 'YYYY-MM-DD'),
                                                                    rules:[
                                                                        {required:true,message:'发证日期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>:
                                                            <FormItem  label={'发证日期'} {...formItemLayout}>
                                                                {getFieldDecorator('productTime',{
                                                                    rules:[
                                                                        {required:true,message:'发证日期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row gutter={30}>
                                                    <Col span={20}>
                                                        {validEndDate?

                                                            <FormItem  label={'有效期至'} {...formItemLayout}>
                                                                {getFieldDecorator('validEndDate',{
                                                                    initialValue: moment(validEndDates, 'YYYY-MM-DD'),
                                                                    rules:[

                                                                        {required:true,message:'有效期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>:
                                                            <FormItem  label={'有效期至'} {...formItemLayout}>
                                                                {getFieldDecorator('validEndDate',{
                                                                    rules:[

                                                                        {required:true,message:'有效期不能为空'}
                                                                    ]
                                                                })(
                                                                    <DatePicker format={'YYYY-MM-DD'}/>
                                                                )}
                                                            </FormItem>
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row gutter={30}>
                                                    <Col span={20}>
                                                        <FormItem label={`证件编号`} {...formItemLayout}>
                                                            {getFieldDecorator('licCode',{
                                                                initialValue:licCode,
                                                                rules:[
                                                                    {required:true,message:'证件编号不能为空'}
                                                                ]
                                                            })(
                                                                <Input placeholder='证件编号'/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <FormItem>
                                                {getFieldDecorator('pictcontents',{
                                                    initialValue: ''
                                                })(
                                                    <UploadPic  length={3}/>
                                                )}
                                            </FormItem>
                                        </div>:''}
                                </TabPane>
                            </Tabs>
                        </Form>

                    </div>

                </Modal>
            </span>
        )
    }
}
export default connect(state => state)(Form.create()(AddRefund));