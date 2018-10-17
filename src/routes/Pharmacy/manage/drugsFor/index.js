/*
 * @Author: yuwei  药品申领  /drugsFor
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import { Table , Form, Input , Row, Col, Button, Icon, Select , Modal , message , DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import { createData } from '../../../../common/data';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Confirm = Modal.confirm;
const columns = [
  {
   title: '申领单',
   width:150,
   dataIndex: 'medicinalCode',
   render:(text)=>(<Link to={{pathname: `/pharmacy/manage/drugsFor/details`}}>{text}</Link>)
  },
  {
    title: '申领药房',
    width:100,
    dataIndex: 'assetsRecord',
    render: (text, record, index) => '药房'
  },
  {
    title: '药库',
    width:100,
    dataIndex: 'assetsRecord123',
    render: (text, record, index) => '药房'
  },
  {
    title: '状态',
    width:100,
    dataIndex: 'fstate',
    render: (text, record, index) => text === '00' ? '已申领' : '未申领'
  },
  {
    title: '制单人',
    width:100,
    dataIndex: 'equipmentStandardName',
    render: (text, record, index) => '未申领'
  },
  {
    title: '制单时间',
    width:150,
    dataIndex: 'time',
    render: (text, record, index) => '2018-7-25 21:49'
  },
  {
    title: '受理人',
    width:100,
    dataIndex: 'custodian',
    render: (text, record, index) => '已申领'
  },
  {
    title: '受理时间',
    width:150,
    dataIndex: 'bDept',
    render: (text, record, index) => '2018-7-25 21:49'
  }
];
class DrugsFor extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query:{},
      messageError:"",
      selectedRowKeys:[]
    }
  }

  queryHandler = (query) => {
    this.setState({ query:query })
  }

  //批量编辑 - 打开弹窗
  onSubmit = () =>{
    const { selectedRowKeys } = this.state;
    if(selectedRowKeys.length>0){
      Confirm({
        content:"您确定要执行此操作？",
        onOk:()=>{
          message.success('操作成功！')
        },
        onCancel:()=>{}
      })
    }else{
      message.warn('最少选择一条数据进行操作！')
    }
  }

  render(){
    return (
      <div>
        <SearchForm query={this.queryHandler} />
        <Row>
          <Button type='primary'>
            <Link to={{pathname:`/pharmacy/manage/drugsFor/add`}}>新建申领</Link>
          </Button>
        </Row>
        <Table
          dataSource={createData()}
          rowSelection={
            {
              onChange:(selectedRowKeys)=>{
                //选中编辑的内容
                this.setState({selectedRowKeys})
              }
            }
          }
          bordered
          loading={ this.state.loading}
          scroll={{x: '100%'}}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 24}}
        />
      </div>
    )
  }
}
export default DrugsFor;

/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
 state = {
   display: 'none',
 }
 toggle = () => {
   const { display, expand } = this.state;
   this.setState({
     display: display === 'none' ? 'block' : 'none',
     expand: !expand
   })
 }
 handleSearch = (e) => {
   e.preventDefault();
   this.props.form.validateFields((err, values) => {
     this.props.query(values);
   });
 }
 //重置
 handleReset = () => {
   this.props.form.resetFields();
   this.props.query({});
 }

 render() {
   const { display } = this.state;
   const { getFieldDecorator } = this.props.form;
   return (
     <Form onSubmit={this.handleSearch}>
       <Row gutter={30}>
         <Col span={8}>
           <FormItem label={`申领单`} {...formItemLayout}>
             {getFieldDecorator('assetCode', {})(
              <Input/>
             )}
           </FormItem>
         </Col>
         <Col span={8}>
           <FormItem label={`状态`} {...formItemLayout}>
             {getFieldDecorator('assetName', {})(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    <Option key="" value="">全部</Option>
                    <Option key="01" value="01">待确认</Option>
                    <Option key="02" value="02">已确认</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`制单时间`} {...formItemLayout}>
             {getFieldDecorator('time')(
              <RangePicker/>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{ float:'right',textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button style={{marginLeft: 30}} onClick={this.handleReset}>重置</Button>
           <a style={{marginLeft: 30, fontSize: 14}} onClick={this.toggle}>
             {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
           </a>
         </Col>
       </Row>
     </Form>
   )
 }
}
const SearchForm = Form.create()(SearchFormWrapper);