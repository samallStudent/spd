/*
 * @Author: yuwei  药品目录 - 编辑
 * @Date: 2018-07-24 10:58:49 
* @Last Modified time: 2018-07-24 10:58:49 
 */
import React, { PureComponent } from 'react';
import { Form , Row , Button , Col , Select, Modal, Collapse, Radio , message, Table} from 'antd';
// import { supplierDurs } from '../../../api/drugStorage/supplierDrugs';
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
      type:'supplierDrugs/genDrugDetail',
      payload:{id: this.props.match.params.id, hisDrugCode: this.props.match.params.code },
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
          // upperQuantity: data.data.upperQuantity,
          // downQuantity: data.data.downQuantity
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
  getLayoutInfo = (label,val)=>(
    <Col span={8}>
      <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-8">
        <label>{label}</label>
      </div>
      <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
        <div className='ant-form-item-control ellipsis' style={{ width: '100%' }}>
          {val}
        </div>
      </div>
    </Col>
  )
  render(){
    const {
      fillBackData, 
      replanUnitSelect, 
      listTransforsVo,
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
    return (
      <div className='fullCol fadeIn fixHeight'>
        <div className='fullCol-fullChild'>
          <div style={{ display:'flex',justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 'bold' }}>基本信息</h3>
            {/* <Button type='primary' onClick={this.onSubmit}>保存</Button> */}
            <Button type='primary' onClick={() =>console.log('保存')}>保存</Button>
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
            {/* <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>药品编码</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{fillBackData?fillBackData.hisDrugCode:''}</div>
              </div>
            </Col> */}
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
            defaultActiveKey={['1','3','5']}
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

            <Panel header="价格" key="3" style={customPanelStyle}>
              <Row>
                <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>价格</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{fillBackData && fillBackData.drugPrice ? fillBackData.drugPrice.toFixed(4):''}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>供应商</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{fillBackData?fillBackData.supplierName:''}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={`采购方式`}>
                    {
                      getFieldDecorator(`upperQuantity`,{
                        rules:[{
                          required:true,message:"请选择采购方式！"
                        }]
                      })(
                        <RadioGroup>
                          <Radio value={1}>零库存</Radio>
                          <Radio value={2}>采购</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel header="药品信息" key="5" style={customPanelStyle}>
              <Row className='fixHeight'>
                {this.getLayoutInfo('药品名称',fillBackData?fillBackData.ctmmDesc:'')}
                {this.getLayoutInfo('药品剂量',fillBackData?fillBackData.ctmmDosage:'')}
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