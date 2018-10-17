/*
 * @Author: yuwei 
 * @Date: 2018-08-22 15:31:52 
* @Last Modified time: 2018-08-22 15:31:52 
 */
 /**
 * @file 系统管理--组织机构--部门管理-编辑
 */

 import React , { PureComponent } from 'react';
import { Button , Row , Col, Input} from 'antd';
import { connect } from 'dva';

class EditDepartmentMgt extends PureComponent {

  state={
    record:{},
    deptLocation:''
  }

  componentDidMount (){

    console.log(this.props.match.params)
    this.props.dispatch({
      type:'Organization/DepartmentDetails',
      payload:this.props.match.params,
      callback:(data)=>{
        console.log(data)
        this.setState({
          record:data.data
        })
      }
    })
  }


  //提交该表单
  onSubmit = ()=>{
    const { deptLocation , record} = this.state;
    console.log(deptLocation);
    this.props.dispatch({
      type:'Organization/OperSysDept',
      payload:{
        deptLocation,
        id: record.id,
        deptType: record.deptType,
        deptName: record.deptName
      },
      callback:(data)=>{
        console.log(data)
        this.props.history.push('/sys/organization/departmentMgt')
      }
    })
  }
  render(){
    const { record } = this.state;

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
          </Col>
        </Row>
      </div>
    )
  }


 }
 export default connect ( state => state)(EditDepartmentMgt) 