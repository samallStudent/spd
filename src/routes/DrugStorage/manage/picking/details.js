/*
 * @Author: yuwei 配货详情 /picking/details
 * @Date: 2018-07-24 13:16:33 
* @Last Modified time: 2018-07-24 13:16:33 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Button, Modal , message , Input , Tooltip} from 'antd';
import { createData } from '../../../../common/data';
const Conform = Modal.confirm;


class DetailsPicking extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      visible:false,
      selectedRowKey:[]
    }
  }
  //打印
  onPrint = () =>{
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        message.success('操作成功！')
        const { history } = this.props;
        history.push({pathname:"/drugStorage/drugStorageManage/picking"})
      },
      onCancel:()=>{}
    })
  }
  //确认
  onSubmit = () =>{
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        message.success('操作成功！')
        const { history } = this.props;
        history.push({pathname:"/drugStorage/drugStorageManage/picking"})
      },
      onCancel:()=>{}
    })
  }

  //执行调整操作 - 显示弹窗
  showModal = () =>{
    this.setState({visible:true})
  }
  //提交调整操作 -
  modalSubmit = () =>{
    const { selectedRowKey } = this.state;
    if(selectedRowKey.length>0){
      this.setState({visible:false})
    }else{
      message.warn('请选择要调整的数据！')
    }
  }

  render(){
    const columns = [
      {
       title: '申领数量',
       width:150,
       dataIndex: 'medicinalCode',
      },
      {
        title: '可分配数',
        width:120,
        dataIndex: 'assetsRecord',
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
        title: '最小单位',
        width:150,
        dataIndex: 'unit1',
      },
      {
        title: '批准文号',
        width:150,
        dataIndex: 'approvalNo',
      },
      {
        title: '生产厂家',
        width:150,
        dataIndex: 'productCompany',
      },
      {
        title: '操作',
        width:100,
        dataIndex: 'RN',
        render: (text, record) => 
            <a onClick={()=>this.showModal()}>调整</a>
        }
    ];
    const modalColumns = [
      {
       title: '序号',
       width:60,
       dataIndex: 'index',
       render:(text,record,index)=>`${index+1}`
      },
      {
        title: '生产批号',
        width:120,
        dataIndex: 'assetsRecord',
      },
      {
        title: '生产日期',
        width:100,
        dataIndex: 'productName1',
        render:(text,record)=>record.productName
      },
      {
        title: '有效期至',
        width:150,
        dataIndex: 'productName',
      },
      {
        title: '可分配数',
        width:150,
        dataIndex: 'spec',
      },
      {
        title: '分配数',
        width:150,
        dataIndex: 'fmodal',
        render:()=>(<Input/>)
      }
    ];
    const { visible } = this.state;
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <h3>单据信息 
            <Button style={{float:'right'}} onClick={()=>this.onPrint()} >打印</Button>
            <Button type='primary' className='button-gap' style={{float:'right'}} onClick={()=>this.onSubmit()}>确认</Button>
          </h3>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>申领单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>PA002211807000086U</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>待确认</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>申领药房</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>门诊药房</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>制单人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>张三三</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>制单时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>2015-09-03 15:00:02
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>联系电话</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>13020082008</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>药房地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>这是一个药房的地址</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>受理人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'></div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>受理时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'></div>
              </div>
            </Col>
          </Row>
          </div>
          <div className='detailCard'>
            <Table
              dataSource={createData()}
              bordered
              title={()=>'产品信息'}
              scroll={{x: '100%'}}
              columns={columns}
              rowKey={'id'}
              pagination={{
                size: 'small',
                showQuickJumper: true,
                showSizeChanger: true
              }}
            />
          </div>
          <Modal visible={visible} width={980} onOk={()=>this.modalSubmit()} onCancel={()=>this.setState({visible:false})}>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>商品名称</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>注射用复方甘草酸苷</div>
                  </div>  
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>申领药房</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>静配中心</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>待分配申领数量</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>100</div>
                  </div>
              </Col>
            </Row>
            <Table
              dataSource={createData()}
              bordered
              scroll={{x: '100%'}}
              columns={modalColumns}
              rowKey={'id'}
              style={{marginTop: 24}}
              rowSelection={{
                onChange:(selectedRowKey)=>{
                  this.setState({selectedRowKey})
                }
              }}
            />
          </Modal>
      </div>
    )
  }
}
export default DetailsPicking;