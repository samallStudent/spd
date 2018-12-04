/*
 * @Author: yuwei 
 * @Date: 2018-08-22 15:31:52 
* @Last Modified time: 2018-08-22 15:31:52 
 */
 /**
 * @file 系统管理--组织机构--部门管理-编辑
 */

 import React , { PureComponent } from 'react';
import { Button , Row , Col, Input, Form, Checkbox, message} from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: {span: 8}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
    md: {span: 16}
  },
};
class EditDepartmentMgt extends PureComponent {

  state={
    record:{},
    deptLocation:'',
    storeInitialValue: []
  }

  componentDidMount (){

    console.log(this.props.match.params)
    this.props.dispatch({
      type:'Organization/DepartmentDetails',
      payload:this.props.match.params,
      callback:({data, code, msg})=>{
        if(code === 200) {
          let storeInitialValue = data.dicts.filter(item => item.check).map(item => item.value);
          this.setState({
            record:data,
            storeInitialValue
          })
        }else {
          message.error(msg);
        };
      }
    })
  }


  //提交该表单
  onSubmit = ()=>{
    console.log(1);
    this.props.form.validateFields((err, values) => {
      if(!err) {
        const { record } = this.state;
        this.props.dispatch({
          type:'Organization/OperSysDept',
          payload:{
            ...values,
            id: record.id,
            deptType: record.deptType,
            deptName: record.deptName
          },
          callback:(data)=>{
            console.log(data)
            this.props.history.push('/sys/organization/departmentMgt')
          }
        });
      }
    })
    return;
    
  }
  //校验货位
  verifyStore = (rule, value, callback) => {
    value = value || [];
    const isCheck = value.some(item => item === "1");
    if(isCheck) {
      callback();
    }else {
      callback(new Error('必须选择补货指示货位!'));
    };
  }
  //校验抢救车货位
  verifyRescuecar = (rule, value, callback) => {
    callback();
  }
  render(){
    const { record, storeInitialValue } = this.state;
    const { getFieldDecorator } = this.props.form;
    return(
      <div className='ysynet-main-content' style={{minHeight: '80vh'}}>
        <h3>基本信息 <Button type='primary' onClick={this.onSubmit} style={{float: 'right'}}>保存</Button></h3>
        <Row>
          <Col span={10}>
            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
              类型 :&nbsp;
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
              <div className="ant-form-item-control">
                <span className="ant-form-item-children">
                  {record.deptLabel||''}
                </span>
              </div>
            </div>
          </Col>
          <Col span={10}>
            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
            部门名称 :&nbsp;
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
              <div className="ant-form-item-control">
                <span className="ant-form-item-children">
                  {record.deptName||''}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
            科室名称 :&nbsp;
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
              <div className="ant-form-item-control">
                <span className="ant-form-item-children">
                  {record.hisDeptName||''}
                </span>
              </div>
            </div>
          </Col>
          <Col span={10}>
            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
            内部编码 :&nbsp;
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
              <div className="ant-form-item-control">
                <span className="ant-form-item-children">
                  {record.id||''}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
            医院科室代码 :&nbsp;
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
              <div className="ant-form-item-control">
                <span className="ant-form-item-children">
                  {record.hisDeptCode||''}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form className="ant-advanced-search-form" onSubmit={this.onSubmit}>
              <Row>
                <Col span={24}>
                  {
                    record.deptType !== "6" ? 
                    <FormItem {...formItemLayout} label={`地址`}>
                      {
                        getFieldDecorator(`deptLocation`,{
                          initialValue: record.deptLocation
                        })(
                          <Input.TextArea style={{ marginTop: 10 }} />
                        )
                      }
                    </FormItem> : null
                  }
                </Col>
              </Row>
              <Row>
                {
                  record.dicts && record.dicts.length ? 
                  <Col span={24}>
                    <FormItem {...formItemLayout} label={`货位设置`}>
                      {
                        getFieldDecorator(`storeType`,{
                          initialValue: storeInitialValue,
                          rules: [
                            { required: record.deptType !== '5', message: '请选择货位设置' },
                            { validator: record.deptType !== "5" ? this.verifyStore : this.verifyRescuecar }
                          ]
                        })(
                          <CheckboxGroup style={{ width: '100%', marginTop: 10 }}>
                            <Row>
                              {
                                record.dicts ? record.dicts.map(item => (
                                  <Col span={8} key={item.value}>
                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                  </Col>
                                )) : null
                              }
                            </Row>
                          </CheckboxGroup>
                        )
                      }
                    </FormItem>
                  </Col> : null
                }
              </Row>
            </Form>
          </Col>
          
          {/* <Col span={10}>
            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
            地址 :&nbsp;
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
              <div className="ant-form-item-control">
                <span className="ant-form-item-children">
                  <Input.TextArea 
                  value={this.state.deptLocation !=='' ? this.state.deptLocation : record.deptLocation } 
                  onChange={(e)=>this.setState({deptLocation:e.target.value})}></Input.TextArea>
                </span>
              </div>
            </div>
          </Col> */}
        </Row>
      </div>
    )
  }


 }
 export default connect ( state => state)(Form.create()(EditDepartmentMgt)) 