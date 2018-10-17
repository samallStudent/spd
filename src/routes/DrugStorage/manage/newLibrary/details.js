/*
 * @Author: yuwei  出库管理详情 /newLibrary/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Button, Modal , message , Tooltip} from 'antd';
import { createData } from '../../../../common/data';
const Conform = Modal.confirm;
const columns = [
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
    title: '出库数量',
    width:150,
    dataIndex: 'approvalNo1',
  },
  {
    title: '生产批号',
    width:150,
    dataIndex: 'approvalNo2',
  },
  {
    title: '生产日期',
    width:150,
    dataIndex: 'approvalNo3',
  },
  {
    title: '有效期',
    width:150,
    dataIndex: 'approvalNo45',
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
    title: '供应商',
    width:150,
    dataIndex: 'gongyings',
  }
];

class DetailsNewLibrary extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      visible:false,
    }
  }
  //打印
  onBPrint = () =>{
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        message.success('操作成功！')
        const { history } = this.props;
        history.push({pathname:"/drugStorage/drugStorageManage/newLibrary"})
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
        history.push({pathname:"/drugStorage/drugStorageManage/newLibrary"})
      },
      onCancel:()=>{}
    })
  }

  render(){
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <h3>单据信息 
            <Button  style={{float:'right'}} onClick={()=>this.onBPrint()} >导出</Button>
            <Button  type='primary'  className='button-gap' style={{float:'right'}} onClick={()=>this.onSubmit()}>打印</Button>
          </h3>
          <Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>库房</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>药库</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>入库分类</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>采购入库</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>供应商</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>裕美供应商</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>入库单</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>RK00221180700005QU</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>配送单</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>PO0022118070000383
                  </div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>订单号</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>DD0022118070000383</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>入库人</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>张三三</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>入库时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>2018-07-12 17:09:15
                  </div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>备注</label>
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
              scroll={{x: '200%'}}
              columns={columns}
              rowKey={'id'}
              pagination={{
                size: 'small',
                showQuickJumper: true,
                showSizeChanger: true
              }}
            />
          </div>
      </div>
    )
  }
}
export default DetailsNewLibrary;