/*
 * @Author: yuwei  上架 /putaway
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import { Table , Form, Input , Row, Col, Button, Select , Modal , message  , Popconfirm , Tooltip } from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import { createData } from '../../../../common/data';
const FormItem = Form.Item;
const Option = Select.Option;
const Confirm = Modal.confirm;

class Putaway extends PureComponent{

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

  //单行确认 
  confirmOk = () => {
    message.success('操作成功')
  }

  render(){
    const columns = [
      {
       title: '药库出库单',
       width:150,
       dataIndex: 'medicinalCode',
      },
      {
        title: '状态',
        width:100,
        dataIndex: 'fstate',
        render:()=>`待上架`
      },
      {
        title: '通用名称',
        width:100,
        dataIndex: 'productName1',
        render:(text,record)=>record.productName
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
        width:150,
        dataIndex: 'fmodal',
      },
      {
        title: '包装单位',
        width:150,
        dataIndex: 'unit',
        render:(text)=>'g'
      },
      {
        title: '批准文号',
        width:150,
        dataIndex: 'approvalNo',
      },
      {
        title: '生产厂家',
        width:150,
        dataIndex: 'productCompany1',
        render: (text, record, index) => 'PHXL'
      },
      {
        title: '生产批号',
        width:150,
        dataIndex: 'productCompany2',
        render: (text, record, index) => index
      },
      {
        title: '生产日期',
        width:150,
        dataIndex: 'productCompany3',
        render: (text, record, index) => '2018-7-25'
      },
      {
        title: '有效期至',
        width:150,
        dataIndex: 'productCompany4',
        render: (text, record, index) => '2018-7-25'
      },
      {
        title: '供应商',
        width:150,
        dataIndex: 'productCompany41',
        render: (text, record, index) => 'PHXL'
      },
      {
        title: '上架数量',
        width:150,
        dataIndex: 'productCompany42',
        render: (text, record, index) => Number(0.6+index)
      },
      {
        title: '指示货位',
        width:150,
        dataIndex: 'productCompany23',
        render: (text, record, index) => index
      },
      {
        title: '实际货位',
        width:150,
        dataIndex: 'productCompany5s',
        render:(text)=>(<Input defaultValue={1}/>)
      },
      {
        title: '操作',
        width:150,
        dataIndex: 'RN',
        render: (text, record) => 
          <span>
            <Popconfirm title="确定提交吗？" okText="是" cancelText="否"  onConfirm={()=>this.confirmOk(record)}><a>确认</a></Popconfirm>
          </span>  
      }
    ];
    return (
      <div>
        <SearchForm query={this.queryHandler} />
        <Row>
          <Button type='primary' onClick={()=>this.onSubmit()}>批量上架</Button>
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
          scroll={{x: '200%'}}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 24}}
        />
      </div>
    )
  }
}
export default Putaway;

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
   const { getFieldDecorator } = this.props.form;
   return (
     <Form onSubmit={this.handleSearch}>
       <Row gutter={30}>
         <Col span={8}>
           <FormItem label={`出库单`} {...formItemLayout}>
             {getFieldDecorator('assetCode', {})(
              <Input/>
             )}
           </FormItem>
         </Col>
         <Col span={8}>
           <FormItem label={`状态`} {...formItemLayout}>
             {getFieldDecorator('time')(
              <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    <Option key="" value="">全部</Option>
                    <Option key="01" value="01">待上架</Option>
                    <Option key="02" value="02">已上架</Option>
              </Select>
             )}
           </FormItem>
         </Col>
         <Col span={8} style={{ float:'right',textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button style={{marginLeft: 30}} onClick={this.handleReset}>重置</Button>
          {/* <a style={{marginLeft: 30, fontSize: 14}} onClick={this.toggle}>
             {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
           </a>*/}
         </Col>
       </Row>
     </Form>
   )
 }
}
const SearchForm = Form.create()(SearchFormWrapper);