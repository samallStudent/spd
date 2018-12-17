/*
 * @Author: yuwei  退库详情 /refund/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Tooltip, Spin, message } from 'antd';
import { connect } from 'dva';
const columns = [
  {
    title: '通用名称',
    width: 224,
    dataIndex: 'ctmmGenericName',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '入库单号',
    width: 168,
    dataIndex: 'inStoreCode',
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification',
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'replanUnit',
  },
  {
    title: '出库数量',
    width: 112,
    dataIndex: 'backNum',
  },
  {
    title: '生产批号',
    width: 168,
    dataIndex: 'lot',
  },
  {
    title: '生产日期',
    width: 168,
    dataIndex: 'productDate',
  },
  {
    title: '有效期至',
    width: 168,
    dataIndex: 'validEndDate',
  },
  {
    title: '生产厂家',
    dataIndex: 'ctmmManufacturerName',
    width: 224,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '批准文号',
    dataIndex: 'approvalNo',
    width: 224
  }
];

class DetailsRefund extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      visible: false,
      spinning: false,
      loading: false,
      detailsData: {},
      dataSource: []
    }
  }
  componentDidMount = () =>{
    if (this.props.match.params.id) {
      let { id } = this.props.match.params;
      this.setState({ spinning: true });
        this.props.dispatch({
          type:'salvageCar/rescuecarBackInfo',
          payload: { backNo: id },
          callback:({data, code, msg})=>{
            if(code === 200) {
              this.setState({ 
                detailsData: data,
                dataSource: data.list, 
                spinning: false 
              });
            }else {
              message.error(msg);
              this.setState({
                spinning: false 
              });
            };
          }
        });
      }
  }

  render(){
    const { detailsData, dataSource, spinning } = this.state;
    return (
      <div className='fadeIn ysynet-content'>
        <Spin spinning={spinning}>
          <div style={{margin: '0 16px'}}>
            <div className='ysynet-details-flex-header'>
              <h3>单据信息</h3>
            </div>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退库单</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.backNo }</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退库货位</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.backDpetName }</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退库人</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.createUserName }</div>
                  </div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退库时间</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.createDate }</div>
                  </div>
              </Col>
            </Row>
            <hr className='hr'/>
            <h3>产品信息</h3>
            <Table  
              bordered
              dataSource={dataSource}
              scroll={{x: '100%'}}
              columns={columns}
              rowKey={'drugCode'}
              pagination={false}
            />
          </div>
        </Spin>
      </div>
    )
  }
}
export default  connect(state => state)(DetailsRefund) ;
