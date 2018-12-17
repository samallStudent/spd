/*
 * @Author: yuwei  发药出库详情 /output/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Modal , message , Tooltip } from 'antd';
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
    title: '有效期至',
    width:150,
    dataIndex: 'approvalNo45',
  },
  {
    title: '最小单位',
    width:150,
    dataIndex: 'gongyings',
  },
  {
    title: '最小剂量单位',
    width:150,
    dataIndex: 'jiliangdanwei',
  },
  {
    title: '发药单位',
    width:150,
    dataIndex: 'fayaodanwei',
  },
  {
    title: '发药数量',
    width:150,
    dataIndex: 'amount',
  },
  {
    title: '整货位',
    width:150,
    dataIndex: 'zhenghuowei',
  },
  {
    title: '零货位',
    width:150,
    dataIndex: 'zhenghuowei123',
  },
  {
    title: '机器货位',
    width:150,
    dataIndex: 'zhenghuowei435',
  },
];

class DetailsOutput extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      visible:false,
    }
  }
  //打印
  onBan = () =>{
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        message.success('操作成功！')
        const { history } = this.props;
        history.push({pathname:"/drugStorage/drugStorageManage/applyAccept"})
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
        history.push({pathname:"/drugStorage/drugStorageManage/applyAccept"})
      },
      onCancel:()=>{}
    })
  }

  render(){
    return (
      <div>
          <h3>单据信息 </h3>
          <Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>发药单</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>PA002211807000086U</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>药房</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>中心药房</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>出库分类</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>发药出库</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>制发药时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>2018-07-12 17:09:15</div>
                </div>
            </Col>
          </Row>
          <hr className='hr'/>
          <h3>产品信息</h3>
          <Table
            dataSource={createData()}
            bordered
            scroll={{x: '200%'}}
            columns={columns}
            rowKey={'id'}
            style={{marginTop: 24}}
          />
      </div>
    )
  }
}
export default DetailsOutput;