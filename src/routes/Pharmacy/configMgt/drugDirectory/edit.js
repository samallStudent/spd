/*
 * @Author: yuwei 药房- 药品目录 - 编辑
 * @Date: 2018-09-01 09:40:37 
* @Last Modified time: 2018-09-01 09:40:37 
 */
import React, { PureComponent } from 'react';
import { Form , Row , Button , Col , Select , Input , Modal , Collapse , message, InputNumber, Table, Radio, Icon, Tooltip } from 'antd';
import { connect } from 'dva';
import {difference} from 'lodash';
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
const RadioGroup = Radio.Group;
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
    replanUnitCode: '',
    upperQuantity: 999999999,
    downQuantity: 0,
    goodsList: [],      //指示货位
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
        let {listTransforsVo, customUnit} = fillBackData;
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
          fillBackData,
          listTransforsVo,
          customUnit,
          upperQuantity: data.data.upperQuantity || 999999999,
          downQuantity: data.data.downQuantity || 0,
          replanUnitCode: data.data.replanUnitCode
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
          let goodsList = [];
          const goodsListMap = {
            advance: {
              goods: 'advanceScatteredLoc',
              unit: 'advanceScatteredUnitCode'
            },
            scattered: {
              goods: 'scatteredLoc',
              unit: 'scatteredLocUnitCode'
            },
            dispensing: {
              unit: 'dispensingMachineUnitCode',
              goods: 'dispensingMachineLoc'
            },
            replan: {
              goods: 'replanStore',
              unit: ''
            }
          };
          for (const key in obj) {
            if(obj[key].length !== 0) {
              goodsList.push({
                name: obj[key][0].locationName,
                dataIndex: goodsListMap[key].goods,
                dataIndexUnit: goodsListMap[key].unit,
                list: obj[key]
              });
            };
          };
          this.setState({
            goodsList,  //货位数组
          })
        }
      }
    });
  }
  //保存
  onSubmit = () =>{
    Comfirm({
      content:"确认保存吗？",
      onOk:()=>{
        this.props.form.validateFields((err,values)=>{
          if(!err){
            console.log(values)
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
            const {
              replanStore, 
              purchaseQuantity, 
              dispensingMachineUnitCode,
              upperQuantity,
              downQuantity,
              advanceScatteredUnitCode,
              scatteredLocUnitCode,
              ...otherInfo 
            }  = values;
            let replanUnit,
                dispensingMachineUnit,
                advanceScatteredLocUnit,
                scatteredLocUnit;
            if(replanUnitCode) {
              replanUnit = replanUnitSelect.filter(item => item.unitCode === replanUnitCode)[0].unit;
            };
            if(dispensingMachineUnitCode) {
              dispensingMachineUnit = replanUnitSelect.filter(item => item.unitCode === dispensingMachineUnitCode)[0].unit;
            };
            if(advanceScatteredUnitCode) {
              advanceScatteredLocUnit = replanUnitSelect.filter(item => item.unitCode === advanceScatteredUnitCode)[0].unit;
            };
            if(scatteredLocUnitCode) {
              scatteredLocUnit = replanUnitSelect.filter(item => item.unitCode === scatteredLocUnitCode)[0].unit;
            };
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

  goodsRender = () => {
    const {goodsList, fillBackData, replanUnitSelect, replanUnitZN} = this.state;
    const {getFieldDecorator} = this.props.form;
    if(!goodsList.length) {
      return <p>暂无指示货位信息</p>;
    };
    return (
      goodsList.map(item => (
        <Col span={12} key={item.name} style={{height: 84}}>
          <Row gutter={8}>
            <Col span={12}>
              <FormItem {...inlineFormItemLayout} label={item.name}>
                {
                  getFieldDecorator(item.dataIndex,{
                    initialValue:fillBackData?fillBackData[item.dataIndex]:'',
                    rules:[
                      {required:true,message: `请选择${item.name}！`}
                    ]
                  })(
                    <Select>
                      {
                        item.list && item.list.length ?
                        item.list.map((goodsItem)=>(
                          <Option key={goodsItem.id} value={goodsItem.id}>{goodsItem.positionName}</Option>
                        )):null
                      }
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            {
              item.name === '补货指示货位' ? 
              <Col span={12} style={{paddingLeft: 11}}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-10">
                    <label>存储单位</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-14">
                  <div className='ant-form-item-control'>{replanUnitZN!==''? `${replanUnitZN}` : fillBackData?fillBackData.replanUnit:''}</div>
                </div>
              </Col> : 
              <Col span={12}>
                <FormItem {...inlineFormItemLayout} label={`存储单位`}>
                  {
                    getFieldDecorator(item.dataIndexUnit,{
                      initialValue: fillBackData ? fillBackData[item.dataIndexUnit]:'',
                      rules:[
                        {required:true,message:`请选择${item.name}存储单位！`}
                      ]
                    })(
                      <Select
                        style={{ width: '80%' }}
                      >
                      {
                        replanUnitSelect.map((unitItem)=>(
                          <Option key={unitItem.unitCode} value={unitItem.unitCode}>{unitItem.unit}</Option>
                        ))
                      }
                    </Select>
                    )
                  }
                </FormItem>
              </Col>
            }
            
          </Row>
        </Col>
      ))
    )
  }
  render(){
    const { 
      fillBackData,
      replanUnitSelect,
      upperQuantity,
      downQuantity,
      listTransforsVo,
      customUnit,
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
                onChange={(value, e) => {
                  this.setState({
                    replanUnitCode: value,
                    replanUnitZN: e.props.children
                  });
                }}
                defaultValue={text}
              >
                {
                  replanUnitSelect.map((item)=>(
                    <Option key={item.unitCode} value={item.unitCode}>{item.unit}</Option>
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
                  <FormItem {...formItemLayout} label={`补货量`}>
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
                          min={0}
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
                          <Radio value={2}>补基准水位</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </Panel>

            <Panel header="指示货位" key="3" style={customPanelStyle}>
              <Row>
                {
                  this.goodsRender()
                }
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