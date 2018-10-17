/*
 * @Author: yuwei - 药品目录 - drugDirectory
 * @Date: 2018-07-24 10:16:46 
* @Last Modified time: 2018-07-24 10:16:46 
 */

import React, { PureComponent } from 'react';
import { Table , Form, Row, Col, Button, Icon, Select , Modal , Input , message , Tooltip} from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import { createData } from '../../../../common/data';
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
   title: '通用名称',
   dataIndex: 'index',
   width:150,
   render: (text, record) => 
    <span>
      <Link to={{pathname: `/pharmacy/manage/drugDirectory/edit`}}>{record.productName}</Link>
    </span>
  },
  {
    title: '商品名称',
    width:150,
    dataIndex: 'productName',
    
  },
  {
    title: '规格',
    width:150,
    dataIndex: 'spec',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '剂型',
    width:100,
    dataIndex: 'fmodal',
  },
  {
    title: '包装单位',
    width:100,
    dataIndex: 'spec21',
    render:(text)=>'g'
  },
  {
    title: '最小单位',
    width:100,
    dataIndex: 'custodian',
    render:() => '个'
  },
  {
    title: '批准文号',
    width:100,
    dataIndex: 'bDept',
    render:(text, record, index) => '1000'+index
  },
  {
   title: '库存上限',
   width:100,
   dataIndex: 'useDept',
   render:(text, record, index) => index + 0.52
  },
 {
  title: '库存下限',
  width:100,
  dataIndex: 'useDept1',
  render:(text, record, index) => index + 0.1
 }
];

class DrugDirectory extends PureComponent{

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
  showModal = () =>{
    const { selectedRowKeys } = this.state;
    if(selectedRowKeys.length>0){
      this.setState({visible:true})
    }else{
      message.warn('最少选择一条数据进行编辑！')
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    return (
      <div>
        <SearchForm query={this.queryHandler} />
        <Row>
          <Button type='primary' onClick={()=>this.showModal()}>批量编辑</Button>
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
          style={{marginTop: 20}}
        /> 
        <Modal
         visible={visible}
         title='批量编辑'
         onCancel={()=>this.setState({visible:false})}
         onOk={()=>this.setState({visible:false})}>
          <Form>
            <FormItem label={`状态`} {...formItemLayout}>
              {getFieldDecorator('fstate', {})(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    <Option key="" value="">全部</Option>
              </Select>
              )}
            </FormItem>
            <FormItem label={`库存上限`} {...formItemLayout}>
              {getFieldDecorator('kucunshangxian', {})(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
            <FormItem label={`库存下限`} {...formItemLayout}>
              {getFieldDecorator('kucunxiaxian', {})(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(DrugDirectory);

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
           <FormItem label={`名称`} {...formItemLayout}>
             {getFieldDecorator('assetCode', {})(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    <Option key="" value="">全部</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8}>
           <FormItem label={`剂型`} {...formItemLayout}>
             {getFieldDecorator('assetName', {})(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    <Option key="" value="">全部</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`规格`} {...formItemLayout}>
             {getFieldDecorator('spec')(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                <Option key="" value="">全部</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`状态`} {...formItemLayout}>
             {getFieldDecorator('manageDeptGuid')(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
              >
              <Option key="" value="">全部</Option>
            </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{display: display}}>
           <FormItem label={`备货选项`} {...formItemLayout}>
             {getFieldDecorator('useDeptGuid')(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                <Option key="" value="">全部</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{ textAlign: 'right', marginTop: 4}} >
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