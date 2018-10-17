/*
 * @Author: wwb 
 * @Date: 2018-07-24 18:49:01 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-07-24 23:23:07
 */
/**
 * @file 药库 - 补货管理--补货计划--新建计划
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, Table, Modal, Icon, Tooltip  } from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles'
import { createData } from '../../../../common/data';
const FormItem = Form.Item;
const { Search } = Input;
const modalData = createData().splice(5,16);

class NewAdd extends PureComponent{
  state = {
    isShow: false,
    visible: false,
    loading: false,
    selected: [],
    selectedRows: [],
    modalSelected: [],
    modalSelectedRows: []
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    const columns = [{
      title: '通用名称',
      dataIndex: 'geName'
    },{
      title: '产品名称',
      dataIndex: 'productName'
    },{
      title: '规格',
      dataIndex: 'spec',
      className:'ellipsis',
      render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      )
    },{
      title: '剂型',
      dataIndex: 'fmodal',
      width: 150
    },{
      title: '包装单位',
      dataIndex: 'unit',
      width: 100,
    },{
      title: '批准文号',
      dataIndex: 'medicinalCode',
      width: 150,
    },{
      title: '生产厂家',
      dataIndex: 'productCompany'
    },{
      title: '需求数量',
      dataIndex: 'amount',
      width: 120,
      render: (text,record,index)=>{
        return <Input defaultValue={ text || 1} onChange={this.onChange.bind(this, record, index)}/>
      }
    },{
      title: '当前库存',
      dataIndex: 'kcsl',
    },{
      title: '库存上限',
      dataIndex: 'uLimit'
    },{
      title: '库存下限',
      dataIndex: 'lLimit'
    }];
    const modalColumns = [
      {
        title: '通用名称',
        dataIndex: 'geName'
      },{
        title: '产品名称',
        dataIndex: 'productName'
      },{
        title: '规格',
        dataIndex: 'spec'
      },{
        title: '剂型',
        dataIndex: 'fmodal',
        width: 150
      },{
        title: '包装单位',
        dataIndex: 'unit',
        width: 100,
      },{
        title: '批准文号',
        dataIndex: 'medicinalCode',
        width: 150,
      },{
        title: '生产厂家',
        dataIndex: 'productCompany'
      }
    ]
    return (
      <div className='fadeIn ysynet-content'>
        <div className='ant-row-bottom'> 
          <Button type='primary' icon='plus' onClick={()=>this.setState({ visible: true })}>添加产品</Button>
          <Button type='default' style={{ marginLeft: 8 }}>删除</Button>
        </div>
        <Modal
          title={'添加产品'}
          visible={visible}
          width={1100}
          style={{ top: 20 }}
          onCancel={()=>this.setState({ visible: false })}
          footer={[
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>确认</Button>,
            <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>
          ]}
        >
        <Row>
          <Col span={7} style={{marginLeft: 4}}>
            <Search 
              style={{ width: 248 }}
              placeholder='通用名/商品名'
            />
          </Col>
          <Col span={7} style={{textAlign: 'left', marginTop: 4}}>
            <a style={{userSelect: 'none'}} onClick={()=>this.setState({isShow: !this.state.isShow})}> 
              <Icon type={this.state.isShow ? 'up-circle-o' : 'down-circle-o'} /> {this.state.isShow ? '收起' : '更多筛选'}
            </a>
          </Col>
        </Row>
        <Form style={{marginTop: 20, display: this.state.isShow ? 'block' : 'none'}} onSubmit={this.onSubmit}>
          <Row>
            <Col span={7}>
              <FormItem label={`产品名称`} {...formItemLayout}>
                {getFieldDecorator('materialNameOrFqun')(
                  <Input placeholder={`请输入产品名称/产品名称首字母`} />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem label={`通用名称`} {...formItemLayout}>
                {getFieldDecorator('geNameOrFqun')(
                  <Input placeholder={`请输入通用名称/简码`} />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem label={`规格`} {...formItemLayout}>
                {getFieldDecorator('spec')(
                  <Input placeholder={`请输入规格`} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <FormItem label={`型号`} {...formItemLayout}>
                {getFieldDecorator('fmodel')(
                  <Input placeholder={`请输入型号`} />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem label={`品牌`} {...formItemLayout}>
                {getFieldDecorator('brandName')(
                  <Input placeholder={`请输入品牌`} />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={`生产商`} {...formItemLayout}>
                {getFieldDecorator('produceName')(
                  <Input placeholder={`请输入生产商`} />
                )}
              </FormItem>
            </Col>
            <Col span={4} style={{textAlign: 'right'}}>
              <Button type="primary" style={{ marginRight: 8 }} htmlType="submit">查询</Button>
              <Button onClick={()=>this.props.form.resetFields()}>重置</Button>
            </Col>
          </Row>
        </Form>
        <Table
          style={{ marginTop: 16 }} 
          columns={modalColumns}
          dataSource={modalData}
          bordered
          scroll={{ x: '150%' }}
          rowKey='id'
          pagination={{
            size: "small",
            showQuickJumper: true,
            showSizeChanger: true
          }}
          rowSelection={{
            selectedRowKeys: this.state.modalSelected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({modalSelected: selectedRowKeys, modalSelectedRows: selectedRows})
            }
          }}
        />
        </Modal>
        <Table 
          title={()=>'产品信息'}
          columns={columns}
          bordered
          rowKey='id'
          scroll={{ x: '150%' }}
          pagination={false}
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            }
          }}
        />
      </div>
    )
  }
}
export default Form.create()(NewAdd);