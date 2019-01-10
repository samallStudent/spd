/*
 * @Author: yuwei  药品目录 - 编辑
 * @Date: 2018-07-24 10:58:49 
* @Last Modified time: 2018-07-24 10:58:49 
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Table, Button, Radio, message } from 'antd';
import { connect } from 'dva';
const singleFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },//5
    md: {span: 10},
    style: {
      textAlign: 'left'
    }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
    md: {span: 13}
  },
}
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class EditDrugDirectory extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      baseData: {},
      saveLoading: false
    }
  }
  componentDidMount = () =>{
    this.getDetail();
  }
  getDetail = () => {
    const { hisDrugCode } = this.props.match.params;
    this.props.dispatch({
      type: 'drugDirectory/getMedicineInfo',
      payload: { hisDrugCode },
      callback: (data) =>{
        this.setState({ 
          baseData: data,
        })
      }
    })
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
  onSave = () => {
    this.props.form.validateFields((err, values) => {
      if(!err) {
        this.setState({
          saveLoading: true
        });
        const { hisDrugCode } = this.props.match.params;
        this.props.dispatch({
          type: 'drugDirectory/editMedicinalType',
          payload: {
            hisDrugCode,
            medDrugType: values.medDrugType,
            ctmmCriticalCareMedicine: values.ctmmCriticalCareMedicine,
            ctmmValuableSign: values.ctmmValuableSign,
            storageCondition: values.storageCondition,
            poisonHemp: values.poisonHemp
          },
          callback: ({data, code, msg}) => {
            if(code === 200) {
              message.success('操作成功');
              this.props.history.push(`/sys/drugDirectory/directory`);
            }else {
              message.error(msg);
            };
          }
        })
      }
    });
  }
  render(){
    const { baseData, saveLoading } = this.state;
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
              return "";
          }
        }
      },
      {
        title: '单位名称',
        dataIndex: 'bigUnit',
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
    const { getFieldDecorator } = this.props.form;
    
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <div style={{ display:'flex',justifyContent: 'space-between' }}>
            <h3><b>基本信息</b></h3>
            <Button loading={saveLoading} onClick={this.onSave} type="primary">保存</Button>
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
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>药品名称</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                <div className='ant-form-item-control'>{ baseData.ctmmTradeName ? baseData.ctmmTradeName: ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>别名</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.ctmmAnotherName ? baseData.ctmmAnotherName: ''}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={30}>
            {/*<Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>规格</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.ctmmSpecification ? baseData.ctmmSpecification: ''}</div>
              </div>
            </Col>*/}
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
                  <label>剂型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.ctmmDosageFormDesc ? baseData.ctmmDosageFormDesc: ''}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>生产厂家</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.ctmmManufacturerName ? baseData.ctmmManufacturerName: ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>批准文号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.approvalNo ? baseData.approvalNo: ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.statusName ? baseData.statusName: ''}</div>
              </div>
            </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                      <label>药品编码</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                      <div className='ant-form-item-control'>{ baseData.hisDrugCode ? baseData.hisDrugCode: ''}</div>
                  </div>
              </Col>
          </Row>
        </div>
        <div className='detailCard'>
          <h3>单位信息</h3>
          <hr className='hr'/>
          <Table
            columns={columns}
            dataSource={baseData.listTransforsVo}
            bordered
            rowKey={'sort'}
            pagination={false}
          />
        </div>
        <div className='detailCard'>
          <h3>报告药标识</h3>
          <hr className='hr'/>
          <Form>
            <Row gutter={30}>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`是否报告药`}>
                  {
                    getFieldDecorator(`medDrugType`,{
                      initialValue: baseData.medDrugType ? baseData.medDrugType : '', 
                      rules: [{ required: true,message: '请选择是否报告药' }]
                    })(
                      <RadioGroup>
                        <Radio value={2}>是</Radio>
                        <Radio value={1}>否</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`是否贵重`}>
                  {
                    getFieldDecorator(`ctmmValuableSign`,{
                      initialValue: baseData.ctmmValuableSign ? baseData.ctmmValuableSign : '', 
                      rules: [{ required: true,message: '请选择是否贵重' }]
                    })(
                      <RadioGroup>
                        <Radio value={'2'}>是</Radio>
                        <Radio value={'1'}>否</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`是否高危`}>
                  {
                    getFieldDecorator(`ctmmCriticalCareMedicine`,{
                      initialValue: baseData.ctmmCriticalCareMedicine ? baseData.ctmmCriticalCareMedicine : '', 
                      rules: [{ required: true,message: '请选择是否高危' }]
                    })(
                      <RadioGroup>
                        <Radio value={'2'}>是</Radio>
                        <Radio value={'1'}>否</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`存储条件`}>
                  {
                    getFieldDecorator(`storageCondition`,{
                      initialValue: baseData.storageCondition ? baseData.storageCondition : '', 
                      rules: [{ required: true,message: '请选择存储条件' }]
                    })(
                      <RadioGroup>
                        <Radio value={1}>常温</Radio>
                        <Radio value={2}>阴凉</Radio>
                        <Radio value={3}>冷库</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...singleFormItemLayout} label={`毒麻标识`}>
                  {
                    getFieldDecorator(`poisonHemp`,{
                      initialValue: baseData.poisonHemp ? baseData.poisonHemp : '', 
                      rules: [{ required: true,message: '请选择毒麻标识' }]
                    })(
                      <RadioGroup>
                        <Radio value={2}>是</Radio>
                        <Radio value={1}>否</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className='detailCard' style={{marginTop: 0}}>
          <h3>药品信息</h3>
          <hr className='hr'/>
          <Row className='fixHeight'>
          {this.getLayoutInfo('药品名称',baseData?baseData.ctmmDesc:'')}
          {this.getLayoutInfo('药品剂量',baseData?baseData.ctphdmiDosageUnitDesc:'')}
          {this.getLayoutInfo('药学分类描述',baseData?baseData.ctphdmiCategoryDesc:'')}
          {this.getLayoutInfo('管制分类描述',baseData?baseData.ctphdmiRegulatoryClassDesc:'')}
          {this.getLayoutInfo('抗菌药物标志',baseData?baseData.ctmmAntibacterialsign:'')}
          {this.getLayoutInfo('国家基本药物标记',baseData?baseData.ctmmEssentialMedicine:'')}
          {this.getLayoutInfo('皮试标志',baseData.ctmmSkintestSign?baseData.ctmmSkintestSign==="1"?'Y':'N':'')}
          {this.getLayoutInfo('停用标记',baseData.ctmmStatusCode?baseData.ctmmStatusCode==="1"?'Y':'N':'')}
          </Row>
        </div>
      </div>
    )
  }
}
export default connect()(Form.create()(EditDrugDirectory))