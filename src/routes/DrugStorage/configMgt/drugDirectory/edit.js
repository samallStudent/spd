/*
 * @Author: yuwei  药品目录 - 编辑
 * @Date: 2018-07-24 10:58:49 
* @Last Modified time: 2018-07-24 10:58:49 
 */
import React, { PureComponent } from 'react';
import { Form , Row , Button , Col , Select , InputNumber , Input, Modal , Collapse , Radio , message, Table, Icon, Tooltip} from 'antd';
import { connect } from 'dva';
import {difference} from 'lodash';
const supplyFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: {span: 6}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
    md: {span: 18}
  },
}
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: {span: 6}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: {span: 13}
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
    upperQuantity: 0,
    downQuantity: 0,
    activeKey: ['1','2','3','4','5','7'],
    isRenderSaveButton: true, //是否渲染保存按钮
  }

  componentDidMount(){
    //获取当前药品目录详情信息
    this.props.dispatch({
      type:'drugStorageConfigMgt/GetDrugInfo',
      payload:{id:this.props.match.params.id},
      callback:(data)=>{
        let {listTransforsVo, customUnit, goodsVos} = data.data;
        listTransforsVo.push({
          sort: '补货单位',
          bigUnit: data.data.replanUnit
        });
        customUnit = customUnit || [];
        customUnit = customUnit.map(item => {
          uuid ++;
          item.uuid = uuid;
          return item;
        });
        let activeKey = customUnit.length ? ['1','2','3','4','5','6','7'] : ['1','2','3','4','5','7'];
        if( 
          Array.isArray(goodsVos[0].replan) && 
          goodsVos[0].replan.length === 0 
        ) {
          message.warning(`该部门下没有补货指示货位，请先添加以后再对该药品进行编辑！`, 3);
          this.setState({
            isRenderSaveButton: false
          });
        };
        this.setState({
          fillBackData:data.data,
          medDrugType:data.data.medDrugType,
          listTransforsVo,
          customUnit: customUnit,
          activeKey,
          upperQuantity: data.data.upperQuantity,
          downQuantity: data.data.downQuantity,
          goodsTypeSelect: goodsVos[0].replan
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
      callback:(data) => {
        this.setState({supplierSelect:data.data})
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
            let {customUnit} = this.state;
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
                message.error('自定义单位名称不能为空!')
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
            let postData = {
              customUnit,
              supplier,
              drugInfo:{
                upperQuantity,
                downQuantity,
                replanStore,
                purchaseQuantity,
                planStrategyType,
                id:this.props.match.params.id,
                medDrugType:this.state.fillBackData.medDrugType,
                drugCode:this.state.fillBackData.drugCode,
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
    let {customUnit, activeKey} = this.state;
    customUnit = [...customUnit];
    customUnit.push({
      unitName: '',
      unitCoefficient: undefined,
      unit: undefined,
      uuid
    });
    activeKey = [...activeKey, '6'];
    this.setState({ customUnit, activeKey })
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
      customUnit,
      activeKey,
      isRenderSaveButton
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
            defaultValue={text}
            placeholder="请输入单位名称"
            onChange={(e) => {
              record.unitName = e.target.value;
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
            defaultValue={text}
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
    const formItemSupply = supplierList.map((k, index) => {
      return (
        <Col span={12} key={index}>
          <Row>
            <Col span={16}>
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
            <Col offset={2} span={6}>
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
          </Row>
        </Col>
      )
    });
    return (
      <div className='fullCol fadeIn fixHeight'>
        <div className='fullCol-fullChild'>
          <div style={{ display:'flex',justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 'bold' }}>基本信息</h3>
            {
              isRenderSaveButton && 
              <Button type='primary' onClick={this.onSubmit}>保存</Button>
            }
          </div>
          <Row>
           {/* <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>通用名</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.ctmmGenericName:''}</div>
              </div>
            </Col>*/}
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>药品名称</label>
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
            {/*<Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>规格</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.ctmmSpecification:''}</div>
              </div>
            </Col>*/}
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
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
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>生产厂家</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.ctmmManufacturerName:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>批准文号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.approvalNo:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
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
            onChange={(activeKey) => this.setState({ activeKey })}
            bordered={false} 
            style={{backgroundColor:'#f0f2f5', margin: '0 -16px'}} 
            activeKey={activeKey}
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
              <Row gutter={16}>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={`本部门上限`}>
                    {
                      getFieldDecorator(`upperQuantity`,{
                        initialValue:fillBackData?fillBackData.upperQuantity:'',
                        rules:[
                          {required:true,message:'请选择本部门上限！'}
                        ]
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
                        initialValue: fillBackData?fillBackData.purchaseQuantity:'',
                        rules:[
                          {required:true,message:'请选择补货量！'}
                        ]
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
              <Row gutter={16}>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={`本部门下限`}>
                    {
                      getFieldDecorator(`downQuantity`,{
                        initialValue: fillBackData?fillBackData.downQuantity:'',
                        rules:[
                          {required:true,message:'请选择本部门下限！'}
                        ]
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
                          <Radio value={1}>
                            <span style={{paddingRight: 8}}>补固定量</span>
                            <Tooltip placement="bottom" title="采购的数量为补固定的数量">
                              <Icon type="exclamation-circle" />
                            </Tooltip>
                          </Radio>
                          <Radio value={2}>
                            <span style={{paddingRight: 8}}>补基准水位</span>
                            <Tooltip placement="bottom" title="采购的数量为采购量-当前库存">
                              <Icon type="exclamation-circle" />
                            </Tooltip>
                          </Radio>
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
                    <Tooltip placement="bottom" title='单位默认包装规格'>
                      <Icon type="exclamation-circle" />
                    </Tooltip>
                    {
                      getFieldDecorator(`replanStore`,{
                        initialValue:fillBackData?fillBackData.replanStore:'',
                        rules:[
                          {required:true,message:'请选择补货指示货位！'}
                        ]
                      })(
                        <Select
                          style={{ 
                            width: 200,
                            marginLeft: 3
                          }}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
            <Panel header="药品信息" key="7" style={customPanelStyle}>
              <Row className='fixHeight'>
                {this.getLayoutInfo('是否报告药',fillBackData?fillBackData.medDrugTypes:'')}
                {this.getLayoutInfo('是否贵重',fillBackData.ctmmValuableSign?fillBackData.ctmmValuableSign : '')}
                {this.getLayoutInfo('是否高危',fillBackData?fillBackData.ctmmCriticalCareMedicine:'')}
                {this.getLayoutInfo('存储条件',fillBackData.storageConditions?fillBackData.storageConditions :'')}
                {this.getLayoutInfo('毒麻标识',fillBackData.poisonHemps?fillBackData.poisonHemps :'')}
              </Row>
            </Panel>
            <Panel header="药品信息" key="5" style={customPanelStyle}>
              <Row className='fixHeight'>
                {this.getLayoutInfo('药品名称',fillBackData?fillBackData.ctmmDesc:'')}
                {this.getLayoutInfo('药品剂量',fillBackData?fillBackData.ctphdmiDosageUnitDesc:'')}
                {this.getLayoutInfo('药学分类描述',fillBackData?fillBackData.ctphdmiCategoryDesc:'')}
                {this.getLayoutInfo('管制分类描述',fillBackData?fillBackData.ctphdmiRegulatoryClassDesc:'')}
                {this.getLayoutInfo('抗菌药物标志',fillBackData?fillBackData.ctmmAntibacterialsign:'')}
                {this.getLayoutInfo('国家基本药物标记',fillBackData?fillBackData.ctmmEssentialMedicine:'')}
                {this.getLayoutInfo('皮试标志',fillBackData.ctmmSkintestSign?fillBackData.ctmmSkintestSign==="1"?'Y':'N':'')}
                {this.getLayoutInfo('停用标记',fillBackData.ctmmStatusCode?fillBackData.ctmmStatusCode==="1"?'Y':'N':'')}
              </Row>
            </Panel>

          </Collapse>
        </Form>
      </div>
    )
  }
}
export default connect(state=>state)(Form.create()(EditDrugDirectory));