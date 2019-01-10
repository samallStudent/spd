/*
 * @Author: yuwei  药品目录 - 编辑
 * @Date: 2018-07-24 10:58:49 
* @Last Modified time: 2018-07-24 10:58:49 
 */
import React, { PureComponent } from 'react';
import { Form , Row , Button , Col , Select , Input , Modal} from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
const FormItem = Form.Item;
const Option = Select.Option;
const Comfirm = Modal.confirm;
class EditDrugDirectory extends PureComponent{

  onSubmit = () =>{
    Comfirm({
      content:"确认保存吗？",
      onOk:()=>{
        const { history } = this.props;
        history.push({pathname:"/pharmacy/manage/drugDirectory"})
      },
      onCancel:()=>{}
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row className='ant-row-bottom'>
          <h3><b>基本信息</b> <Button type='primary' style={{float:'right'}} onClick={()=>this.onSubmit()}>保存</Button></h3>
        </Row>
        <Form onSubmit={this.handleSearch}>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>药品名称</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  注射用复方甘草酸苷
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <FormItem label={`状态`} {...formItemLayout}>
                {getFieldDecorator('fstate', {})(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                      <Option key="01" value="01">启用</Option>
                      <Option key="02" value="02">禁用</Option>
                </Select>
                )}
              </FormItem>
            </Col>
            {/*<Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>通用名</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  注射用复方甘草酸苷
                  </div>
                </div>
              </div>
            </Col>*/}
            <Col span={8}>
              <FormItem label={`库房上限`} {...formItemLayout}>
                {getFieldDecorator('kufangshangxian', {})(
                  <Input/>
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>药品打印名</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
            <FormItem label={`库房下限`} {...formItemLayout}>
              {getFieldDecorator('kufangxiaxian', {})(
                <Input/>
              )}
            </FormItem>
          </Col>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>批准文号</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  86900234000039
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <FormItem label={`最小单位`} {...formItemLayout}>
                {getFieldDecorator('unit', {})(
                  <Select 
                    showSearch
                    placeholder={'请选择'}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                    >
                        <Option key="01" value="01">ml</Option>
                        <Option key="02" value="02">g</Option>
                        <Option key="03" value="03">瓶</Option>
                  </Select>
                )}
              </FormItem>
          </Col>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>规格</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  甘草酸苷
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <FormItem label={`最小剂量单位`} {...formItemLayout}>
                {getFieldDecorator('unit123', {})(
                  <Select 
                    showSearch
                    placeholder={'请选择'}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                    >
                        <Option key="01" value="01">ml</Option>
                        <Option key="02" value="02">g</Option>
                        <Option key="03" value="03">瓶</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>剂型</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  甘草酸苷
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('1unit', {})(
                  <Input addonBefore="1包装单位=" addonAfter="1 最小单位"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>包装单位</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                    瓶
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}> 
              <FormItem {...formItemLayout}>
                {getFieldDecorator('1unit', {})(
                  <Input addonBefore="1最小单位 =" addonAfter="1 最小剂量单位"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>最小单位</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                    瓶
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>最小剂量单位</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                    g
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>生产厂家</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                    
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>药品分类</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  中成药
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>毒麻药品</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  非毒麻药品
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>一类精神药品</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  非一类精神药品
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>二类精神药品</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  非二类精神药品
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>基药标识</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  非基药
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>高危标识</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  否
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>是否胰岛素</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  否
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>报告药</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  非报告药
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>活动中标识</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  活动中
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>皮试用药</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  不需要皮试
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>抗生素级别</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>
                  0
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create()(EditDrugDirectory);