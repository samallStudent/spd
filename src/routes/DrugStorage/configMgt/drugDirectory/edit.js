/*
 * @Author: yuwei  药品目录 - 编辑
 * @Date: 2018-07-24 10:58:49 
* @Last Modified time: 2018-07-24 10:58:49 
 */
import React, { PureComponent } from 'react';
import { Form , Row , Button , Col , Select , InputNumber , Input, Modal , Collapse , Radio , message, Table} from 'antd';
import { connect } from 'dva';
import {difference} from 'lodash';
const supplyFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  },
}
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
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const Comfirm = Modal.confirm;
const RadioGroup = Radio.Group;
let uuid = 0;

const customPanelStyle = {
  background: '#fff',
  borderRadius: 4,
  marginBottom: 16,
  border: 0,
  overflow: 'hidden',
}

class EditDrugDirectory extends PureComponent{

  state = {
    fillBackData:{},//药品目录详情信息
    replanUnitSelect:[],//补货单位下拉框
    goodsTypeSelect:[],//补货指示货位
    supplierSelect:[],//供应商
    medDrugType:null,//1 目录内 2 目录外 
    keys:[],
    customUnit: [],
    listTransforsVo: [],    //单位信息表
    supplierList:[],//供应商循环数据
    replanUnitCode: '',
    upperQuantity: 0,
    downQuantity: 0
  }

  componentDidMount(){
    //获取当前药品目录详情信息
    this.props.dispatch({
      type:'drugStorageConfigMgt/GetDrugInfo',
      payload:{id:this.props.match.params.id},
      callback:(data)=>{
        let {listTransforsVo, customUnit} = data.data;
        listTransforsVo.push({
          sort: '补货单位',
          bigUnit: data.data.replanUnitCode
        });
        customUnit = customUnit || [];
        customUnit = customUnit.map(item => {
          uuid ++;
          item.uuid = uuid;
          return item;
        });
        this.setState({
          fillBackData:data.data,
          medDrugType:data.data.medDrugType,
          listTransforsVo,
          replanUnitCode: data.data.replanUnitCode,
          customUnit: customUnit,
          upperQuantity: data.data.upperQuantity,
          downQuantity: data.data.downQuantity
        })
        if(data.data.supplier && data.data.supplier.length&&data.data.medDrugType===2){//目录外 
          this.setState({
            supplierList:data.data.supplier
          })
        }else if (data.data.medDrugType===2){//目录外 -- 至少保留一条数据
          this.setState({
            supplierList:[{
              supplierCode:null,
              supplierName:null,
              supplierPrice:null,
              whetherDefault:1,
            }]
          })
        }else{//目录内 
          this.setState({
            supplierList:data.data.supplier
          })
        }
        //获取补货单位下拉框
        this.props.dispatch({
          type:'drugStorageConfigMgt/GetUnitInfo',
          payload:{bigDrugCode:data.data.bigDrugCode},
          callback:(data)=>{
            this.setState({replanUnitSelect:data.data})
          }
        })
      }
    })

    //获取供应商下拉框
    this.props.dispatch({
      type:'drugStorageConfigMgt/getSupplier',
      payload:null,//{hisDrugCode:data.data.hisDrugCode}
      callback:(data)=>{
        this.setState({supplierSelect:data.data})
      }
    })
    //获取补货指示h货位
    this.props.dispatch({
      type:'drugStorageConfigMgt/getGoodsTypeInfo',
      payload:{
        positionType: '1',
        deptCode: this.props.match.params.deptCode
      },
      callback:(data)=>{
        this.setState({goodsTypeSelect:data.data})
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
            let {replanUnitSelect, replanUnitCode, customUnit} = this.state;
            const isNull = customUnit.every(item => {
              if(!item.unit) {
                message.error('自定义单位基础单位不能为空!');
                return false;
              };
              if(!item.unitCoefficient) {
                message.error('自定义单位转换系数不能为空!')
                return false;
              };
              if(!item.unitName) {
                message.error('自定义单位基名称不能为空!')
                return false;
              };
              return true;
            });
            if (!isNull) return;
            const { supplier , replanStore , purchaseQuantity ,
              upperQuantity , downQuantity, planStrategyType }  =values; 
            const defaultSupplier = supplier.some(item => {
              if(item.whetherDefault) {
                return true;
              };
              return false;
            });
            if (!defaultSupplier) return message.warning('请选择一个供应商为默认');// 必须要选择默认供应商
            let replanUnit = replanUnitSelect.filter(item => item.unitCode === replanUnitCode)[0].unit;
            let postData = {
              customUnit,
              supplier,
              drugInfo:{
                replanUnit,
                replanUnitCode , replanStore , purchaseQuantity ,
                upperQuantity , downQuantity ,
                planStrategyType,
                id:this.props.match.params.id,
                medDrugType:this.state.fillBackData.medDrugType,
                drugCode:this.state.fillBackData.drugCode||'',
                bigDrugCode:this.state.fillBackData.bigDrugCode,
                hisDrugCode:this.state.fillBackData.hisDrugCode,
              }
            }
            if(this.state.medDrugType===1){//处理目录内的数据
              const supplierStateList = this.state.supplierList;
              let  supplierRet = supplierStateList.map((item,index)=>{
                item = Object.assign(item,supplier[index])//supplier[index],item
                return item
              })
              postData.supplier = supplierRet;
            }
            console.log(JSON.stringify(postData));
            //发出请求
            this.props.dispatch({
              type:'drugStorageConfigMgt/EditOperDeptInfo',
              payload:postData,
              callback:(data)=>{
                if(data.code!==200){
                  message.success(data.msg)
                }else{
                  message.success('保存成功！')
                  const { history } = this.props;
                  history.push({pathname:"/drugStorage/configMgt/drugDirectory"})
                }
                
              }
            })
          }
        })
      },
      onCancel:()=>{}
    })
  }

  addSupply = ()=>{
    const { supplierList } = this.state;
    let keys =supplierList.slice();
    const nextKeys = keys.concat({
      supplierCode:null,
      supplierName:null,
      supplierPrice:null,
      whetherDefault:null,
    });
    this.setState({
      supplierList:nextKeys
    })
  }

  removeSupply = (ind) => {
    const { supplierList } = this.state;
    let keys =supplierList.slice();
    let ret = keys.filter((key,index) =>index !== ind)
    this.setState({
      supplierList:ret
    })

    let s = this.props.form.getFieldValue('supplier')
    s = s.filter((key,index) =>index !== ind)
    this.props.form.setFieldsValue({supplier:s})
  }
  //使用互斥radio
  onChangeRadio = (e,ind)=>{
    let s = this.props.form.getFieldValue('supplier')
    s.map((item,index)=>{
      if(index===ind){//选中 并且为index
        item.whetherDefault=1
      }else{
        item.whetherDefault=null
      }
      return item;
    })
    this.props.form.setFieldsValue({supplier:s})
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
  //添加自定义单位
  addCustomUnit = (e) => {
    e.stopPropagation();
    uuid ++;
    let {customUnit} = this.state;
    customUnit = [...customUnit];
    customUnit.push({
      unitName: '',
      unitCoefficient: undefined,
      unit: undefined,
      uuid
    });
    this.setState({ customUnit })
  }
  //删除自定义单位
  removeUnit = (record) => {
    let {customUnit} = this.state;
    record = [record];
    customUnit = difference(customUnit, record);
    this.setState({customUnit});
  }
  render(){
    const {
      supplierList, 
      fillBackData, 
      replanUnitSelect, 
      goodsTypeSelect, 
      supplierSelect, 
      medDrugType, 
      upperQuantity,
      downQuantity,
      listTransforsVo,
      customUnit
    } =this.state;
    const { getFieldDecorator } = this.props.form;
    getFieldDecorator('keys', { initialValue: fillBackData?fillBackData.customUnit?fillBackData.customUnit:[]:[] });
    const columns = [
      {
        title: '单位属性',
        dataIndex: 'sort',
        render: (text) => {
          switch (text) {
            case 1:
              return <span>整包装单位</span>;
            case 2:
              return <span>包装规格</span>;
            case 3:
              return <span>最小发药单位</span>;
            default:
              return text;
          }
        }
      },
      {
        title: '单位名称',
        dataIndex: 'bigUnit',
        width: 300,
        render: (text, record) => {
          if(typeof record.sort === 'number') {
            return text;
          }else {
            return (
              <Select
                onChange={(value) => {
                  this.setState({
                    replanUnitCode: value
                  });
                }}
                defaultValue={text}
              >
                {
                  replanUnitSelect.map((item,index)=>(
                    <Option key={index} value={item.unitCode}>{item.unit}</Option>
                  ))
                }
              </Select>
            )
          }
        }
      },
      {
        title: '转化系数',
        dataIndex: 'conversionRate',
      },
      {
        title: '基础单位',
        dataIndex: 'smallUit',
      },
    ];
    const customColumns = [
      {
        title: '单位名称',
        dataIndex: 'unitName',
        render: (text, record) => (
          <Input 
            placeholder="请输入单位名称"
            onChange={(e) => {
              record.unitName = e.targetValue;
            }} 
          />
        )
      },
      {
        title: '转化系数',
        width: 300,
        dataIndex: 'unitCoefficient',
        render: (text, record) => (
          <InputNumber
            style={{width: '100%'}}
            placeholder="请输入转换系数"
            min={0}
            precision={0} 
            onChange={(value) => {
              record.unitCoefficient = value;
            }} 
          />
        )
      },
      {
        title: '基础单位',
        dataIndex: 'unit',
        width: 300,
        render: (text, record) => (
          <Select
            placeholder="请选择"
            defaultValue={text}
            onChange={(value) => {
              record.unit = value;
            }}
          >
            {
              replanUnitSelect.map((item,index)=>(
                <Option key={index} value={item.unitCode}>{item.unit}</Option>
              ))
            }
          </Select>
        )
      },
      {
        title: '操作',
        dataIndex: 'RN',
        width: 60,
        render: (text, record) => <a onClick={this.removeUnit.bind(this, record)}>删除</a>
      }
    ];
    console.log();
    
    const formItemSupply = supplierList.map((k, index) => {
      return (
        <Col span={12} key={index}>
          <Row>
            <Col span={8}>
              <FormItem {...supplyFormItemLayout} label={`供应商`}  key={k}>
                {
                  medDrugType===1?
                  <span style={{marginRight: 24}}>{k.supplierName}</span>
                  :
                  getFieldDecorator(`supplier[${index}].supplierCode`,{
                    initialValue:k.supplierCode,
                    rules:[{
                      required:true,message:"必填！"
                    }]
                  })(
                    <Select style={{width: '100%'}}>
                      {
                        supplierSelect && supplierSelect.length?supplierSelect.map((item)=>(
                          <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                        )):null
                      }
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...supplyFormItemLayout} style={{display: 'inline-block'}} label="价格" >
                {
                  getFieldDecorator(`supplier[${index}].supplierPrice`,{
                    initialValue: k.supplierPrice,
                    rules:[{
                      required:true,message:"必填！"
                    }]
                  })(
                    <Input type='number' style={{ width:120 ,marginRight: 8}} addonAfter='元'/>
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...supplyFormItemLayout} style={{display: 'inline-block',marginRight:8}}>
                {
                  getFieldDecorator(`supplier[${index}].whetherDefault`,{
                    initialValue:k.whetherDefault
                  })(
                    <RadioGroup onChange={(e)=>this.onChangeRadio(e,index)}>
                      <Radio value={1} >设为默认</Radio>
                    </RadioGroup>
                  )
                }
              </FormItem>
            </Col>
            {/* <Col span={2} style={{lineHeight: '40px'}}>
              {supplierList.length > 1 && medDrugType===2 ? (
                  <Icon
                    style={{marginRight:8}}
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.removeSupply(index)}
                  />
              ) : null}
              { (supplierList.length-1 === index )  && medDrugType===2 ? (
                  <Icon
                    className="dynamic-delete-button"
                    type="plus-circle-o"
                    onClick={() => this.addSupply(k)}
                  />
              ) : null}
            </Col> */}
          </Row>
        </Col>
      )
    });
    return (
      <div className='fullCol fadeIn fixHeight'>
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
                <div className='ant-form-item-control'>{fillBackData?fillBackData.hisDrugCode:''}</div>
              </div>
            </Col>
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
          <Collapse 
            bordered={false} 
            style={{backgroundColor:'#f0f2f5', margin: '0 -16px'}} 
            defaultActiveKey={['1','2','3','4','5']}
          >
            <Panel header="单位信息" key="1" style={customPanelStyle}>
              <Table
                columns={columns}
                dataSource={listTransforsVo}
                bordered
                rowKey={'sort'}
                pagination={false}
              />
            </Panel>
            <Panel 
              header={
                <Row>
                  <Col span={12}>自定义单位信息</Col>
                  <Col span={12} style={{textAlign: 'right', paddingRight: 16}}>
                    <a onClick={this.addCustomUnit}>新增自定义单位</a>
                  </Col>
                </Row>
              } 
              key="6" 
              style={customPanelStyle}
            >
              <Table
                columns={customColumns}
                dataSource={customUnit}
                bordered
                rowKey={'uuid'}
                pagination={false}
              />
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
                <Col span={10}>
                  <FormItem {...formItemLayout} label={`补货策略`}>
                    {
                      getFieldDecorator(`planStrategyType`,{
                        initialValue: fillBackData?fillBackData.planStrategyType:'',
                        rules:[
                          {required:true,message:'请选择补货策略！'}
                        ]
                      })(
                        <RadioGroup>
                          <Radio value={1}>补固定量</Radio>
                          <Radio value={2}>补基准水位</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </Panel>

            <Panel header="供应商" key="3" style={customPanelStyle}>
             {formItemSupply}
            </Panel>

            <Panel header="指示货位" key="4" style={customPanelStyle}>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={`补货指示货位`}>
                    {
                      getFieldDecorator(`replanStore`,{
                        initialValue:fillBackData?fillBackData.replanStore:'',
                        rules:[
                          {required:true,message:'请选择补货指示货位！'}
                        ]
                      })(
                        <Select
                        style={{ width: 200 }}
                      >
                        {
                          goodsTypeSelect && goodsTypeSelect.length ?
                          goodsTypeSelect.map((item,index)=>(
                            <Option key={index} value={item.id}>{item.positionName}</Option>
                          )):null
                        }
                      </Select>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </Panel>

            <Panel header="药品信息" key="5" style={customPanelStyle}>
              <Row className='fixHeight'>
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