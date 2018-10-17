/*
 * @Author: yuwei  药品目录 - 编辑
 * @Date: 2018-07-24 10:58:49 
* @Last Modified time: 2018-07-24 10:58:49 
 */
import React, { PureComponent } from 'react';
import { Row, Col, Collapse } from 'antd';
import { connect } from 'dva';
import querystring from 'querystring';
const Panel = Collapse.Panel;

const customPanelStyle = {
  background: '#fff',
  borderRadius: 4,
  marginBottom: 16,
  border: 0,
  overflow: 'hidden',
}

class EditDrugDirectory extends PureComponent{

  state={
    fillBackData:{},//药品目录详情信息
    replanUnitSelect:[],//补货单位下拉框
    minUnit: '',        //最小单位
    packUnit: '',       //包装单位
    packageSpecification: '',   //包装规格
    id: ''
  }

  componentDidMount(){
    let info = this.props.match.params.id;
    info = querystring.parse(info);

    //获取当前药品目录详情信息
    this.props.dispatch({
      type: 'drugMgt/getHisMedicineInfo',
      payload: {
        bigDrugCode: info.bCode,
        drugCode: info.dCode
      },
      callback: (data) => {
        this.setState({
          fillBackData: data,
          bigDrugCode: info.bCode,
          max: data.upperQuantity,
          min: data.downQuantity,
          id: info.id
        });
      }
    });
    //获取转换关系
    this.props.dispatch({
      type: 'drugMgt/getHisMedicineTransfor',
      payload: {
        bigDrugCode: info.bCode
      },
      callback: (data) => {
        let {minUnit, packUnit, packageSpecification} = this.state;
        data.forEach(item => {
          if(item.sort === 1) {
            packageSpecification = this.unitTransform(item);
          };
          if(item.sort === 2) {
            packUnit = this.unitTransform(item);
          };
          if(item.sort === 3) {
            minUnit = this.unitTransform(item);
          };
        });
        this.setState({
          minUnit,
          packUnit,
          packageSpecification
        });
      }
    })
  }

  unitTransform(unitList) {
    let {bigUnit, conversionRate, smallUit} = unitList;
    return `${bigUnit} = ${conversionRate} ${smallUit}`;
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

  render(){
    const {fillBackData, minUnit, packUnit, packageSpecification} =this.state;
    return (
      <div className='fullCol fadeIn fixHeight'>
        <div className='fullCol-fullChild'>
          <div style={{ display:'flex',justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 'bold' }}>基本信息</h3>
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
                <div className='ant-form-item-control'>{fillBackData?fillBackData.hisDrugCode:''}</div>
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
        <Collapse bordered={false} style={{backgroundColor:'#f0f2f5', margin: '0 -16px'}} defaultActiveKey={['1','2','3','4','5']}>
          <Panel header="使用单位" key="1" style={customPanelStyle}>
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
                  <div className='ant-form-item-control'>{packageSpecification}</div>
                </div>
              </Col>
              <Col span={10}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>整包装单位</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{packUnit}</div>
                </div>
              </Col>
              <Col span={10}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>补货单位</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{fillBackData.replanUnit}</div>
                </div>
              </Col>
            </Row>
          </Panel>

          <Panel header="库存基数" key="2" style={customPanelStyle}>
            <Row>
              <Col span={10}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>库存基数</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{fillBackData.stockBase}</div>
                </div>
              </Col>
            </Row>
          </Panel>

          <Panel header="药品信息" key="3" style={customPanelStyle}>
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
      </div>
    )
  }
}
export default connect(state=>state)(EditDrugDirectory);