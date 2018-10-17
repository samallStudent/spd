/*
 * @Author: yuwei 药房- 药品目录 - 编辑
 * @Date: 2018-09-01 09:40:37 
* @Last Modified time: 2018-09-01 09:40:37 
 */
import React, { PureComponent } from 'react';
import { Form , Row , Button , Col , Select , Input , Modal , Icon , Collapse , message, InputNumber } from 'antd';
import { connect } from 'dva';
const formItemLayout ={
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  },
}
const inlineFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  },
}
const customPanelStyle = {
  background: '#fff',
  borderRadius: 4,
  marginBottom: 20,
  border: 0,
  overflow: 'hidden',
}
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const Comfirm = Modal.confirm;
let uuid = 0;
class EditDrugDirectory extends PureComponent{

  state={
    fillBackData:{},//药品目录详情信息
    replanUnitSelect:[],//补货单位下拉框
    goodsTypeSelect:[],//补货指示货位
    keys:[],
    replanSelect:[],//补货指示货位
    dispensingSelect:[],//发药机货位
    scatteredSelect:[],//预拆零货位
    advanceSelect:[],//拆零发药货位
    replanUnitZN:'',//存储补货单位的中文。然后赋值给指示货位的补货指示货位的存储单位
    minUnit: '',
    packUnit: '',
    fullUnit: '',
    upperQuantity: 0,
    downQuantity: 0
  }

  componentDidMount(){
    console.log(this.props.match.params.id)
    //获取当前药品目录详情信息
    this.props.dispatch({
      type:'drugStorageConfigMgt/GetDrugInfo',
      payload:{id:this.props.match.params.id},
      callback:(data)=>{
        console.log(data)
        const fillBackData = data.data;
        let minUnit = '',
            packUnit = '',
            fullUnit = '';
        fillBackData.listTransforsVo = fillBackData.listTransforsVo.map(item => {
          let unit = this.getMaPInfo(fillBackData.listTransforsVo, item.sort);
          if(item.sort === 1) {
            fullUnit = unit;
          };
          if(item.sort === 2) {
            packUnit = unit;
          };
          if(item.sort === 3) {
            minUnit = unit;
          };
          return item;
        })
        this.setState({
          fillBackData,
          minUnit,
          packUnit,
          fullUnit,
          upperQuantity: data.data.upperQuantity,
          downQuantity: data.data.downQuantity
        })
         //获取补货单位下拉框
          this.props.dispatch({
            type:'drugStorageConfigMgt/GetUnitInfo',
            payload:{bigDrugCode:data.data.bigDrugCode},
            callback:(data)=>{
              let replanUnitSelect = data.data;
              let replanUnitZN = '';
              if(fillBackData.replanUnitCode) {
                replanUnitZN = replanUnitSelect.filter(item => item.unitCode === fillBackData.replanUnitCode)[0].unit
              }
              this.setState({
                replanUnitSelect,
                replanUnitZN
              })
            }
          })
      }
    })

    //获取指示货位各种下拉框
    this.props.dispatch({
      type:'drugStorageConfigMgt/GetAllGoodsTypeInfo',
      payload:null,
      callback:(data)=>{
        if(data && data.data[0]){
          let obj = data.data[0];
          this.setState({
            replanSelect:obj.replan,//补货指示货位
            dispensingSelect:obj.dispensing,//发药机货位
            scatteredSelect:obj.scattered,//预拆零货位
            advanceSelect:obj.advance,//拆零发药货位
          })
        }
      }
    })
  }
  //保存
  onSubmit = () =>{
    Comfirm({
      content:"确认保存吗？",
      onOk:()=>{
        this.props.form.validateFields((err,values)=>{
          if(!err){
            console.log(values)
            let {replanUnitSelect} = this.state;
            const { 
              customUnit, 
              replanUnitCode,
              replanStore, 
              purchaseQuantity, 
              dispensingMachineUnitCode,
              upperQuantity,
              downQuantity,
              advanceScatteredUnitCode,
              scatteredLocUnitCode,
              ...otherInfo 
            }  = values;
              let replanUnit = replanUnitSelect.filter(item => item.unitCode === replanUnitCode)[0].unit;
              let dispensingMachineUnit = replanUnitSelect.filter(item => item.unitCode === dispensingMachineUnitCode)[0].unit;
              let advanceScatteredLocUnit = replanUnitSelect.filter(item => item.unitCode === advanceScatteredUnitCode)[0].unit;
              let scatteredLocUnit = replanUnitSelect.filter(item => item.unitCode === scatteredLocUnitCode)[0].unit;
              let postData = {
                customUnit,
                drugInfo:{
                  dispensingMachineUnitCode,
                  advanceScatteredUnitCode,
                  scatteredLocUnitCode,
                  replanUnit,
                  dispensingMachineUnit,
                  advanceScatteredLocUnit,
                  scatteredLocUnit,
                  replanUnitCode, 
                  purchaseQuantity,
                  upperQuantity, 
                  downQuantity,
                  replanStore,
                  medDrugType:this.state.fillBackData.medDrugType,
                  id:this.props.match.params.id,
                  drugCode:this.state.fillBackData.drugCode||'',
                  bigDrugCode:this.state.fillBackData.bigDrugCode,
                  hisDrugCode:this.state.fillBackData.hisDrugCode,
                  ...otherInfo
                }
              }
              delete postData['drugInfo']['keys'];
              
            console.log(postData);
            // 发出请求
            this.props.dispatch({
              type:'drugStorageConfigMgt/EditOperDeptInfo',
              payload:postData,
              callback:(data)=>{
                message.success('保存成功！')
                const { history } = this.props;
                history.push({pathname:"/pharmacy/configMgt/drugDirectory"})
              }
            })
          }
        })
      },
      onCancel:()=>{}
    })
  }
  //新增自定义单位
  addUnit = ()=>{
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  //删除自定义单位
  removeUnit = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    uuid--;
    let ret = []
    keys.filter((key,index) =>{
      if(index !== k){
        ret.push(key)
      }
      return key
    })
    // ret = ret.map((item,index)=>{item=index;return item})
    form.setFieldsValue({
      keys: ret
    });
  }

  //获取使用单位
  getMaPInfo = (List,ind)=>{
    if(List && List.length){
      let ret =  List.filter(item=>item.sort===ind);
      return `${ret[0].bigUnit||''}  =  ${ret[0].conversionRate||''}${ret[0].smallUit||''}`
    }
  }

  getLayoutInfo = (label,val)=>(
    <Col span={8}>
      <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-8">
        <label>{label}</label>
      </div>
      <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
        <div className='ant-form-item-control'>
          {val}
        </div>
      </div>
    </Col>
  )

  setQuantity = (key, value) => {
    const {upperQuantity, downQuantity} = this.state;
    if(typeof value === 'number') {
      if(key === 'downQuantity' && value > upperQuantity) return;
      if(key === 'upperQuantity' && value < downQuantity) return;
      this.setState({
        [key]: value
      });
    };
  }

  render(){

    const { 
      fillBackData,
      minUnit, 
      packUnit, 
      fullUnit, 
      replanUnitSelect,
      replanUnitZN, 
      replanSelect,
      dispensingSelect, 
      scatteredSelect,
      advanceSelect,
      upperQuantity,
      downQuantity
    } =this.state;
    const { getFieldDecorator , getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: fillBackData?fillBackData.customUnit?fillBackData.customUnit:[]:[] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <Col span={10} key={index}>
          <FormItem {...formItemLayout} label={`自定义包装${index+1}`}  key={index}>
            {
              getFieldDecorator(`customUnit[${index}].unitName`,{
                initialValue:k.unitName||'',
                rules:[{
                  required:true,message:"必填！"
                }]
              })(
                <Input  style={{ width: 50 }}/>
              )
            }
            = 
            <FormItem style={{display: 'inline-block'}}>
              {
                getFieldDecorator(`customUnit[${index}].unitCoefficient`,{
                  initialValue:k.unitCoefficient||'',
                  rules:[{
                    required:true,message:"必填！"
                  }]
                })(
                  <Input type='number' style={{ width: 80 ,marginRight: 8}}/>
                )
              }
            </FormItem>
            <FormItem style={{display: 'inline-block',marginRight:8}}>
              {
                getFieldDecorator(`customUnit[${index}].unit`,{
                  initialValue: k.unit||'',
                  rules:[{
                    required:true,message:"必填！"
                  }]
                })(
                  <Select
                    style={{ width: 100 }}>
                      {
                        replanUnitSelect?
                        replanUnitSelect.map((item,index)=>(
                          <Option key={index} value={item.unitCode}>{item.unit}</Option>
                        )):null
                      }
                  </Select>
                )
              }
            </FormItem>
            {keys.length > 0 ? (
                <Icon
                  style={{marginRight:8}}
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.removeUnit(index)}
                />
            ) : null}
            {keys.length-1 === index ? (
                <Icon
                  className="dynamic-delete-button"
                  type="plus-circle-o"
                  onClick={() => this.addUnit(index)}
                />
            ) : null}
          </FormItem>
        </Col>
      )
    });
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <div style={{ display:'flex',justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 'bold' }}>基本信息</h3>
            <Button type='primary' onClick={this.onSubmit}>保存</Button>
          </div>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>通用名</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.ctmmGenericName:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>商品名</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.ctmmTradeName:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>别名</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.ctmmAnotherName:''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>规格</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.ctmmSpecification:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>包装规格</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.packageSpecification:''}
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>剂型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.ctmmDosageFormDesc:''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>生产厂家</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.ctmmManufacturerName:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>批准文号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.approvalNo:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>药品编码</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.hisDrugCode : ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.ctmmStatusCode==="1"?'停用':'启用':''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <Form className='leftLable'>
          <Collapse bordered={false} style={{backgroundColor:'#f0f2f5', marginLeft: '-16px', marginRight: '-16px'}} defaultActiveKey={['1','2','3','4']}>
            <Panel header="单位信息" key="1" style={customPanelStyle}>
              <Row>
                <Col span={10}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>最小发药单位</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{minUnit}</div>
                  </div>
                </Col>
                <Col span={10}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>包装规格</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{packUnit}</div>
                </div>
                </Col>
                <Col span={10}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>整包装单位</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{fullUnit}</div>
                  </div>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={`补货单位`}>
                    {
                      getFieldDecorator(`replanUnitCode`,{
                        initialValue:fillBackData?fillBackData.replanUnitCode:'',
                        rules:[{
                          required:true,message:"请选择补货单位！"
                        }]
                      })(
                        <Select
                          style={{ width: 200 }}
                          onChange={(value,option)=>{
                            console.log(option.props.children)
                            this.setState({
                              replanUnitZN:option.props.children
                            })
                          }}
                          >
                            {
                              replanUnitSelect && replanUnitSelect.length?
                              replanUnitSelect.map((item,index)=>(
                                <Option key={index} value={item.unitCode}>{item.unit}</Option>
                              )):null
                            }
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={10} style={{display: !keys.length ? 'block':'none'}}>
                  <Button onClick={this.addUnit}><Icon type="plus"   />添加自定义单位</Button>
                </Col>
                {formItems}
              </Row>
            </Panel>

            <Panel header="库存上下限" key="2" style={customPanelStyle}>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={`本部门上限`}>
                    {
                      getFieldDecorator(`upperQuantity`,{
                        initialValue:fillBackData?fillBackData.upperQuantity:''
                      })(
                        <InputNumber
                          min={downQuantity}
                          onChange={this.setQuantity.bind(this, 'upperQuantity')}
                          precision={0}
                          style={{width: '100%'}} 
                          placeholder='请输入' 
                        />
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={`采购量`}>
                    {
                      getFieldDecorator(`purchaseQuantity`,{
                        initialValue: fillBackData?fillBackData.purchaseQuantity:''
                      })(
                        <InputNumber
                          max={upperQuantity}
                          precision={0}
                          style={{width: '100%'}} 
                          placeholder='请输入' 
                        />
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={`本部门下限`}>
                    {
                      getFieldDecorator(`downQuantity`,{
                        initialValue: fillBackData?fillBackData.downQuantity:'',
                      })(
                        <InputNumber
                          max={upperQuantity}
                          precision={0}
                          onChange={this.setQuantity.bind(this, 'downQuantity')}
                          style={{width: '100%'}} 
                          placeholder='请输入' 
                        />
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </Panel>

            <Panel header="指示货位" key="3" style={customPanelStyle}>
              <Row>
                <Col span={10}>
                    <Row gutter={8}>
                      <Col span={12}>
                        <FormItem {...inlineFormItemLayout} label={`补货指示货位`}>
                          {
                            getFieldDecorator(`replanStore`,{
                              initialValue:fillBackData?fillBackData.replanStore:'',
                              rules:[
                                {required:true,message:'请选择补货指示货位！'}
                              ]
                            })(
                              <Select>
                                {
                                  replanSelect && replanSelect.length ?
                                  replanSelect.map((item,index)=>(
                                    <Option key={index} value={item.id}>{item.positionName}</Option>
                                  )):null
                                }
                              </Select>
                            )
                          }
                        </FormItem>
                      </Col>
                      <Col span={12} style={{    marginTop: 10}}>
                        {/*   replanUnit / replanUnitCode */}
                        存储单位:{replanUnitZN!==''? `${replanUnitZN}` : fillBackData?fillBackData.replanUnit:''}
                      </Col>
                    </Row>
                </Col>
                <Col span={10}>
                  <Row gutter={8}>
                      <Col span={12}>
                        <FormItem {...inlineFormItemLayout} label={`发药机货位`}>
                          {
                            getFieldDecorator(`dispensingMachineLoc`,{
                              initialValue:fillBackData?fillBackData.dispensingMachineLoc:'',
                              rules:[
                                {required:true,message:'请选择发药机货位！'}
                              ]
                            })(
                              <Select>
                              {
                                dispensingSelect && dispensingSelect.length ?
                                dispensingSelect.map((item,index)=>(
                                  <Option key={index} value={item.id}>{item.positionName}</Option>
                                )):null
                              }
                            </Select>
                            )
                          }
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem {...inlineFormItemLayout} label={`存储单位`}>
                          {
                            getFieldDecorator(`dispensingMachineUnitCode`,{//dispensingMachineUnitCode
                              initialValue:fillBackData?fillBackData.dispensingMachineUnitCode:'',
                              rules:[
                                {required:true,message:'请选择发药机货位！'}
                              ]
                            })(
                              <Select
                              style={{ width: 100 }}
                            >
                              {
                                replanUnitSelect && replanUnitSelect.length ?
                                replanUnitSelect.map((item,index)=>(
                                  <Option key={index} value={item.unitCode}>{item.unit}</Option>
                                )):null
                              }
                            </Select>
                            )
                          }
                        </FormItem>
                      </Col>
                  </Row>
                </Col>
                <Col span={10}>
                  <Row gutter={8}>
                    <Col span={12}>
                      <FormItem {...inlineFormItemLayout} label={`预拆零货位`}>
                        {
                          getFieldDecorator(`advanceScatteredLoc`,{
                            initialValue:fillBackData?fillBackData.advanceScatteredLoc:'',
                            rules:[
                              {required:true,message:'请选择预拆零货位！'}
                            ]
                          })(
                            <Select>
                            {
                              advanceSelect && advanceSelect.length ?
                              advanceSelect.map((item,index)=>(
                                <Option key={index} value={item.id}>{item.positionName}</Option>
                              )):null
                            }
                          </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...inlineFormItemLayout} label={`存储单位`}>
                        {
                          getFieldDecorator(`advanceScatteredUnitCode`,{//advanceScatteredUnitCode
                            initialValue:fillBackData?fillBackData.advanceScatteredUnitCode:'',
                            rules:[
                              {required:true,message:'请选择预拆零货位的存储单位！'}
                            ]
                          })(
                            <Select
                              style={{ width: 100 }}
                            >
                            {
                              replanUnitSelect && replanUnitSelect.length ?
                              replanUnitSelect.map((item,index)=>(
                                <Option key={index} value={item.unitCode}>{item.unit}</Option>
                              )):null
                            }
                          </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
                <Col span={10}>
                  <Row gutter={8}>
                    <Col span={12}>
                      <FormItem {...inlineFormItemLayout} label={`拆零发药货位`}>
                        {
                          getFieldDecorator(`scatteredLoc`,{
                            initialValue:fillBackData?fillBackData.scatteredLoc:'',
                            rules:[
                              {required:true,message:'请选择拆零发药货位！'}
                            ]
                          })(
                            <Select>
                            {
                              scatteredSelect && scatteredSelect.length ?
                              scatteredSelect.map((item,index)=>(
                                <Option key={index} value={item.id}>{item.positionName}</Option>
                              )):null
                            }
                          </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...inlineFormItemLayout} label={`存储单位`}>
                        {
                          getFieldDecorator(`scatteredLocUnitCode`,{
                            initialValue:fillBackData?fillBackData.scatteredLocUnitCode:'',
                            rules:[
                              {required:true,message:'请选择拆零发药货位的存储单位！'}
                            ]
                          })(
                            <Select
                            style={{ width: 100 }}
                          >
                            {
                              replanUnitSelect && replanUnitSelect.length ?
                              replanUnitSelect.map((item,index)=>(
                                <Option key={index} value={item.unitCode}>{item.unit}</Option>
                              )):null
                            }
                          </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Panel>

            <Panel header="药品信息" key="4" style={customPanelStyle}>
              <Row  className='fixHeight'>
                {this.getLayoutInfo('药品名称',fillBackData?fillBackData.ctmmDesc:'')}
                {this.getLayoutInfo('药品剂量',fillBackData?fillBackData.ctphdmiDosageUnitDesc:'')}
                {this.getLayoutInfo('药学分类描述',fillBackData?fillBackData.ctphdmiCategoryDesc:'')}
                {this.getLayoutInfo('管制分类描述',fillBackData?fillBackData.ctphdmiRegulatoryClassDesc:'')}
                {this.getLayoutInfo('危重药物标志',fillBackData?fillBackData.ctmmCriticalCareMedicine:'')}
                {this.getLayoutInfo('抗菌药物标志',fillBackData?fillBackData.ctmmAntibacterialsign:'')}
                {this.getLayoutInfo('国家基本药物标记',fillBackData?fillBackData.ctmmEssentialMedicine:'')}
                {this.getLayoutInfo('贵重标记',fillBackData.ctmmValuableSign?fillBackData.ctmmValuableSign==="1"?'Y':'N':'')}
                {this.getLayoutInfo('皮试标志',fillBackData.ctmmSkintestSign?fillBackData.ctmmSkintestSign==="1"?'Y':'N':'')}
                {this.getLayoutInfo('冷藏标识',fillBackData.refrigerateType?fillBackData.refrigerateType==="1"?'Y':'N':'')}
                {this.getLayoutInfo('停用标记',fillBackData.ctmmStatusCode?fillBackData.ctmmStatusCode==="1"?'Y':'N':'')}
                
                {/* 
                  {this.getLayoutInfo('适应症',12)}
                  {this.getLayoutInfo('禁忌症',12)}
                {this.getLayoutInfo('不良反应',12)}
                {this.getLayoutInfo('相互作用',12)}
                {this.getLayoutInfo('年龄限制',12)}
                {this.getLayoutInfo('疗程描述',12)}
                {this.getLayoutInfo('频次描述',12)}
                {this.getLayoutInfo('注意事项',12)}
                {this.getLayoutInfo('原描述',12)} */}
              </Row>
            </Panel>
          </Collapse>
        </Form>
      </div>
    )
  }
}
export default connect(state=>state)(Form.create()(EditDrugDirectory));