/*
 * @Author: wwb 
 * @Date: 2018-08-28 17:42:54 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-06 21:48:20
 */

import React , {PureComponent} from 'react';
import { Form, Row, Col, Button, Input, Select, Icon, Tooltip, Modal,Badge  } from 'antd';
import RemoteTable from '../../../components/TableGrid';
import { systemMgt } from '../../../api/systemMgt';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },//5
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 }
  },
};
const singleFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },//5
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 }
  },
}

class SearchForm extends PureComponent{
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  componentDidMount() {
    let { queryConditons } = this.props.formProps.base;
    //找出表单的name 然后set
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.formProps.dispatch({
        type:'base/updateConditions',
        payload: values
      });
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
  render(){
    const {getFieldDecorator} = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`名称`}>
              {
                getFieldDecorator(`ctmmDesc`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`剂型`}>
              {
                getFieldDecorator(`ctmmDosageFormDesc`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`规格`}>
              {
                getFieldDecorator(`ctmmSpecification`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`状态`}>
              {
                getFieldDecorator(`ctmmStatusCode`,{
                  initialValue: ''
                })(
                  <Select placeholder="请选择">
                    <Option value=''>全部</Option>
                    <Option value='0'>启用</Option>
                    <Option value='1'>停用</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`是否报告药`}>
              {
                getFieldDecorator('medDrugType',{
                  initialValue: ''
                })(
                  <Select placeholder="请选择">
                    <Option key={0} value='2'>是</Option>
                    <Option key={1} value='1'>否</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
           <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
             {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
           </a>
         </Col>
        </Row>
      </Form>
    )
  }
}
const WrappSearchForm = Form.create()(SearchForm);

const columns = [{
  title: '通用名称',
  dataIndex: 'ctmmGenericName',
  width: 168,
  render: (text,record) =>{
    return <span>
            <Link to={{pathname: `/sys/drugDirectory/directory/edit/${record.bigDrugCode}/${record.medDrugType}`}}>{text}</Link>
          </span>
  }
},
{
  title: '商品名',
  dataIndex: 'ctmmTradeName',
  width: 224,
},
{
  title: '规格',
  dataIndex: 'ctmmSpecification',
  width: 168,
  className: 'ellipsis',
  render:(text)=>(
    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
  )
},
{
  title: '剂型',
  dataIndex: 'ctmmDosageFormDesc',
  width: 168,
},
{
  title: '包装规格',
  dataIndex: 'packageSpecification',
  width: 112,
},
{
  title: '药品编码',
  dataIndex: 'hisDrugCode',
  width: 224,
},
{
  title: '批准文号',
  dataIndex: 'approvalNo',
  width: 224,
}]

class DrugDirectory extends PureComponent{
  state = {
    addVisible: false,
    addLoading: false,
  }
  add = () => {
    this.setState({ addVisible: true });
  }
  save = (e) =>{
    e.preventDefault();
    let { dispatch, form } = this.props;
    form.validateFields((err,values)=>{
      this.setState({ addLoading: true });
      if(!err){
        values.medDrugType = '2';
        console.log(JSON.stringify(values),'values');
        dispatch({
          type: "drugDirectory/addMedicine",
          payload: {
            hisCtMedicineMaterial: values
          },
          callback: () =>{
            this.setState({ addVisible: false, addLoading: false });
            this.refs.table.fetch(this.state.query);
            this.props.form.resetFields()
          }
        })
      }else{
        this.setState({ addLoading: false });
      }
    })
    
    
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    })
  }
  validDay = (rule, value, callback) => {
    let num = Number(value);
    if (/^[0-9]+$/.test(num) && num !== 0) {
      if (num > 99999999) {
        callback(new Error('输入数值过大, 不能超过100000000'));
      }else{
        callback();
      }
    } else {
      callback(new Error('请输入非0正整数！'));
    }
  }
  //导出
  print = () => {
    let {queryConditons} = this.props.base;
    queryConditons = {...queryConditons};
    delete queryConditons.pageSize;
    delete queryConditons.pageNo;
    delete queryConditons.sortField;
    delete queryConditons.sortOrder;
    delete queryConditons.key;
    this.props.dispatch({
      type: 'base/deptExport',
      payload: queryConditons,
    })
  }
  render(){
    const { addVisible, addLoading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const IndexColumns = [
      ...columns,
      {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '状态',
        dataIndex: 'ctmmStatusCode',
        width: 112,
        fixed: 'right',
        render: text => <Badge status={text==="0" ? "success" :"error"} text={text==="0" ? "启用" :"停用"}/>
      },
    ];
    let query = {...this.props.base.queryConditons};
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <WrappSearchForm
          formProps={{...this.props}} 
        />
        <Row className='ant-row-bottom'>
          <Col>
            <Button style={{marginRight: 8}} type='primary' onClick={this.add}>新增</Button>
            <Button onClick={this.print}>导出</Button>
          </Col>
        </Row>
        <Modal
          title='新建'
          width={1000}
          visible={addVisible}
          onCancel={()=>{this.setState({ addVisible: false });this.props.form.resetFields()}}
          footer={[
            <Button key="submit" type='primary' loading={addLoading} onClick={this.save}>
                确认
            </Button>,
            <Button key="back"  type='default' onClick={()=>{this.setState({ addVisible: false });this.props.form.resetFields()}}>取消</Button>
          ]}
        >
          <Form>
            <Row>
              <Col span={10}>
                <FormItem {...singleFormItemLayout} label={`通用名称`}>
                  {
                    getFieldDecorator(`ctmmGenericName`,{
                      initialValue: '',
                      rules: [{ required: true,message: '请输入通用名称' }]
                    })(
                      <Input placeholder='请输入' />
                    )
                  }
                </FormItem>
                <FormItem {...singleFormItemLayout} label={`商品名`}>
                  {
                    getFieldDecorator(`ctmmTradeName`,{
                      initialValue: '',
                      rules: [{ required: true,message: '请输入商品名' }]
                    })(
                      <Input placeholder='请输入' />
                    )
                  }
                </FormItem>
                <FormItem {...singleFormItemLayout} label={`规格`}>
                  {
                    getFieldDecorator(`ctmmSpecification`,{
                      initialValue: '',
                      rules: [{ required: true,message: '请输入规格' }]
                    })(
                      <Input placeholder='请输入' />
                    )
                  }
                </FormItem>
                <FormItem {...singleFormItemLayout} label={`剂型`}>
                  {
                    getFieldDecorator(`ctmmDosageFormDesc`,{
                      initialValue: '',
                      rules: [{ required: true,message: '请输入剂型' }]
                    })(
                      <Input placeholder='请输入' />
                    )
                  }
                </FormItem>
                <FormItem {...singleFormItemLayout} label={`生产厂家`}>
                  {
                    getFieldDecorator(`ctmmManufacturerName`,{
                      initialValue: '',
                      rules: [{ required: true,message: '请输入生产厂家' }]
                    })(
                      <Input placeholder='请输入' />
                    )
                  }
                </FormItem>
              
              </Col>
              <Col span={10} push={1}>
                <FormItem {...singleFormItemLayout} label={`批准文号`}>
                  {
                    getFieldDecorator(`approvalNo`,{
                      initialValue: '',
                      rules: [{ required: true,message: '请输入批准文号' }]
                    })(
                      <Input placeholder='请输入' />
                    )
                  }
                </FormItem>
                <FormItem {...singleFormItemLayout} label={`包装规格`}>
                  {
                    getFieldDecorator(`ctpHdmsCheckinUnitDesc`,{
                      initialValue: '',
                      rules: [{ required: true,message: '请输入包装规格' }]
                    })(
                      <Input placeholder='请输入' />
                    )
                  }
                </FormItem>
                <FormItem {...singleFormItemLayout} label={`最小发药单位`}>
                  {
                    getFieldDecorator(`ctpHdmsBasicUnitDesc`,{
                      initialValue: '',
                      rules: [{ required: true,message: '请输入最小发药单位' }]
                    })(
                      <Input placeholder='请输入' />
                    )
                  }
                </FormItem>
                <FormItem {...singleFormItemLayout} label={`1包装规格 = `}>
                  {
                    getFieldDecorator(`ctpHdmsCheckInConvfacCode`,{
                      initialValue: '',
                      rules: [{ 
                        required: true,
                        message: '请输入转换系数',
                        whitespace: true,
                        validator: this.validDay
                      }]
                    })(
                      <Input
                        type="number"
                        placeholder='请输入' 
                        addonAfter='最小发药单位'
                      />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <RemoteTable
          onChange={this._tableChange}
          ref='table'
          bordered
          query={query}
          url={systemMgt.MEDICINEMATERIAL_LIST}
          scroll={{x: 1624}}
          columns={IndexColumns}
          rowKey={'id'}
        />
      </div>
    )
  }
}
export default connect(state=>state)(Form.create()(DrugDirectory))