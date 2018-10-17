/*
 * @Author: yuwei  药品目录 - 编辑
 * @Date: 2018-07-24 10:58:49 
* @Last Modified time: 2018-07-24 10:58:49 
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col} from 'antd';
import { connect } from 'dva';
class EditDrugDirectory extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      baseData: {},
      minUnit: '',
      packUnit: '',
      fullUnit: ''
    }
  }
  componentDidMount = () =>{
    const { bigDrugCode, medDrugType } = this.props.match.params;
    this.props.dispatch({
      type: 'drugDirectory/getMedicineInfo',
      payload: { bigDrugCode , medDrugType },
      callback: (data) =>{
        let {minUnit, packUnit, fullUnit} = this.state;
        let {listTransforsVo} = data;
        listTransforsVo.forEach(item => {
          if(item.sort === 1) {
            fullUnit = this.getMaPInfo(listTransforsVo, item.sort);
          };
          if(item.sort === 2) {
            packUnit = this.getMaPInfo(listTransforsVo, item.sort);
          };
          if(item.sort === 3) {
            minUnit = this.getMaPInfo(listTransforsVo, item.sort);
          };
        });
        this.setState({ 
          baseData: data,
          minUnit,
          packUnit,
          fullUnit
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
  //获取使用单位
  getMaPInfo = (List,ind)=>{
    if(List && List.length){
      let ret =  List.filter(item=>item.sort===ind);
      if (ret.length){
        return `${ret[0].bigUnit||''}  =  ${ret[0].conversionRate||''}${ret[0].smallUit||''}`
      }else{
        return null
      }
    }
  }
  render(){
    const { baseData, minUnit, packUnit, fullUnit } = this.state;
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <div style={{ display:'flex',justifyContent: 'space-between' }}>
            <h3><b>基本信息</b></h3>
          </div>
          <Row gutter={30}>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>通用名</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.ctmmGenericName ? baseData.ctmmGenericName: ''  }</div>
              </div>
            </Col>
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
                <label>别名</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.ctmmAnotherName ? baseData.ctmmAnotherName: ''}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>规格</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.ctmmSpecification ? baseData.ctmmSpecification: ''}</div>
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
                  <label>药品编码</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                <div className='ant-form-item-control'>{ baseData.hisDrugCode ? baseData.hisDrugCode: ''}</div>
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
          </Row>
        </div>
        <div className='detailCard'>
            <h3>单位信息</h3>
            <hr className='hr'/>
            <Row>
              <Col span={10}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>最小发药单位</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'> {minUnit}</div>
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
            </Row>
          </div>
          <div className='detailCard'>
            <h3>药品信息</h3>
            <hr className='hr'/>
            <Row className='fixHeight'>
            {this.getLayoutInfo('药品名称',baseData?baseData.ctmmDesc:'')}
            {this.getLayoutInfo('药品剂量',baseData?baseData.ctphdmiDosageUnitDesc:'')}
            {this.getLayoutInfo('药学分类描述',baseData?baseData.ctphdmiCategoryDesc:'')}
            {this.getLayoutInfo('管制分类描述',baseData?baseData.ctphdmiRegulatoryClassDesc:'')}
            {this.getLayoutInfo('危重药物标志',baseData?baseData.ctmmCriticalCareMedicine:'')}
            {this.getLayoutInfo('抗菌药物标志',baseData?baseData.ctmmAntibacterialsign:'')}
            {this.getLayoutInfo('国家基本药物标记',baseData?baseData.ctmmEssentialMedicine:'')}
            {this.getLayoutInfo('贵重标记',baseData.ctmmValuableSign?baseData.ctmmValuableSign==="1"?'Y':'N':'')}
            {this.getLayoutInfo('皮试标志',baseData.ctmmSkintestSign?baseData.ctmmSkintestSign==="1"?'Y':'N':'')}
            {this.getLayoutInfo('冷藏标识',baseData.refrigerateType?baseData.refrigerateType==="1"?'Y':'N':'')}
            {this.getLayoutInfo('停用标记',baseData.ctmmStatusCode?baseData.ctmmStatusCode==="1"?'Y':'N':'')}
            
            </Row>
          </div>
      </div>
    )
  }
}
export default connect()(Form.create()(EditDrugDirectory))