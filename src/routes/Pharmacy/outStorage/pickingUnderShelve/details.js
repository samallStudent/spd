/*
 * @Author: yuwei  拣货下架详情 /pickSoldOut/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Row, Col, Button, Modal, Tabs, message , InputNumber, Tooltip } from 'antd';
import { connect } from 'dva';
import { outStorage } from '../../../../api/drugStorage/outStorage';
import RemoteTable from '../../../../components/TableGrid';
import { Link } from 'react-router-dom';
const TabPane = Tabs.TabPane; 
const Conform = Modal.confirm;
class DetailsPickSoldOut extends PureComponent{
  constructor(props) {
    super(props);
    const { pickingOrderNo } = this.props.match.params;
    this.state = {
      detailsData: {},
      activeKey: null,
      selected: [],
      selectedRows: [],
      submitLoading: false,
      pendingQuery: {
        pickingOrderNo,
        pickingStatus: 0
      },
      pickedQuery: {
        pickingOrderNo,
        pickingStatus: 1
      }
    }
  }
  
  componentDidMount = () => {
    this.getDetail();
  }
  //获取详情
  getDetail = () => {
    if (this.props.match.params.pickingOrderNo) {
      let { pickingOrderNo } = this.props.match.params;
      this.setState({ loading: true });
      this.props.dispatch({//getpickingDetail
        type:'outStorage/getPickingDetailPad',
        payload: { pickingOrderNo },
        callback:({data, code, msg})=>{
          if(code !== 200) return message.error(msg);
          this.setState({ 
            detailsData: data, 
            activeKey: data.status === 1? '1': '2'
          });
        }
      });
    };
  }
  //确认拣货
  onSubmit = () => {
    let { selectedRows, detailsData } = this.state;
    if(selectedRows.length === 0) {
      return message.warning('至少选择一条数据');
    };
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        const { dispatch } = this.props;
        let postData = {}, pickingDetail = [];
        selectedRows.map(item => pickingDetail.push({
          drugCode: item.drugCode,
          id: item.id,
          pickingNum: item.amount === undefined ? item.allocationNum : item.amount,
        }));
        postData.pickingDetail = pickingDetail;
        postData.applyNo = detailsData.applyOrder;
        postData.pickingOrderNo = detailsData.pickingOredr;
        this.setState({submitLoading:true});
        dispatch({
          type: 'outStorage/finishPicking',
          payload: { ...postData },
          callback: () =>{
            message.success('操作成功！');
            this.getDetail();
            this.setState({submitLoading:false});
            this.pickingTable.fetch();
            this.pickedTable && this.pickedTable.fetch();
            this.tableOnChange();
          }
        })
      },
      onCancel:()=>{}
    })
  }
  
  tableOnChange = () => {
    this.setState({
      selected: [],
      selectedRows: [],
    });
  }

  //打印
  print = () => {
    const {pickingOrderNo} = this.props.match.params;
    window.open(`${outStorage.PICKING_PRINT}?pickingOrderNo=${pickingOrderNo}`, '_blank');
  }

  render(){
    const { 
      detailsData,
      activeKey, 
      pendingQuery,
      pickedQuery,
      selected
    } = this.state;
    const columns = [
      {
          title: '药品名称',
          dataIndex: 'ctmmTradeName',
          width: 350,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      /*{
        title: '规格',
        width: 168,
        dataIndex: 'ctmmSpecification',
      },*/
      {
        title: '生产厂家',
        width: 200,
        dataIndex: 'ctmmManufacturerName',
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '生产批号',
        width: 148,
        dataIndex: 'lot'
      },
      {
        title: '生产日期',
        width: 118,
        dataIndex: 'productDate'
      },
      {
        title: '有效期至',
        width: 118,
        dataIndex: 'validEndDate'
      },
      {
        title: '包装规格',
        width: 148,
        dataIndex: 'packageSpecification',
      },
      {
        title: '单位',
        width: 112,
        dataIndex: 'replanUnit'
      },
      {
        title: '指示货位',
        width: 148,
        fixed: 'right',
        dataIndex: 'locName',
      },
      {
        title: '配货数量',
        width: 112,
        fixed: 'right',
        dataIndex: 'allocationNum',
      },
      {
        title: '实际拣货数量',
        width: 128,
        fixed: 'right',
        dataIndex: 'amount',
        render:(text,record,index)=>{
          const {pickingType} = this.props.match.params;
          if(pickingType === '1') {
            return <span>{record.allocationNum}</span>
          }else {
            return <InputNumber
                    min={1}
                    max={record.allocationNum}
                    precision={0}
                    defaultValue={record.allocationNum} 
                    onChange={(value) => {
                      record.amount = value;
                      const newSelected = selected.map(item => {
                        if(item.id === record.id) {
                          item.amount = value;
                        };
                        return item;
                      });
                      this.setState({
                        selected: newSelected
                      });
                    }}
                  />
          }
        }
      },
    ];
    let readyPickingColumns = columns.slice(0,columns.length-1);
    readyPickingColumns.push({
      title: '实际拣货数量',
      width: 120,
      fixed: 'right',
      dataIndex: 'pickingNum'
    });
    return (
      <div className='fadeIn' style={{ padding: '0 16px' }}>
        <Row>
          <Col span={12}>
            <h3>单据信息</h3>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            {
              detailsData && detailsData.status === 2 ? 
              <Link to={{pathname: `/pharmacy/outStorage/pharmacyReview/details/id=${detailsData.backNo}`}}>
                <Button style={{marginRight: 8}} type="primary">下一步: 复核</Button>
              </Link> : null
            }
            <Button icon='printer' onClick={this.print}>打印</Button>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>拣货单</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{ detailsData.pickingOredr }</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>申领单</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{ detailsData.applyOrder }</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>申领部门</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{ detailsData.applyDeptName }</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>状态</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{ detailsData.statusName }</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>拣货时间</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{ detailsData.pickingTime }</div>
            </div>
          </Col>
        </Row>
        <hr className='hr'/>
        <h3>产品信息</h3>
        <Tabs  
          activeKey={activeKey} 
          onChange={(activeKey)=>this.setState({ activeKey })} 
          tabBarExtraContent={ 
            activeKey  === '1' && detailsData.status === 1||detailsData.status === 2 ?
            <Button type='primary' onClick={()=>this.onSubmit()} loading={this.state.submitLoading}>确认拣货</Button> 
            : null
          }
        >
          <TabPane tab="待拣货" key="1">
            {/* <Table
              bordered
              dataSource={leftDataSource}
              scroll={{x: '100%'}}
              columns={columns}
              loading={loading}
              pagination={false}
              rowKey={'id'}
              rowSelection={{
                selectedRowKeys: this.state.selected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                }
              }}
            /> */}
            <RemoteTable 
              ref={(node) => this.pickingTable = node}
              query={pendingQuery}
              columns={columns}
              scroll={{ x: '100%' }}
              url={outStorage.PICKING_DETAIL_LIST}
              rowSelection={{
                selectedRowKeys: selected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    selected: selectedRowKeys, 
                    selectedRows: selectedRows
                  });
                }
              }}
              rowKey='id'
              pagination={{
                onChange: this.tableOnChange
              }}
            />
          </TabPane>
          <TabPane tab="已拣货" key="2">
            {/* <Table
              bordered
              dataSource={rightDataSource}
              scroll={{x: '100%'}}
              loading={loading}
              columns={readyPickingColumns}
              pagination={false}
              rowKey={'id'}
            /> */}
            <RemoteTable 
              ref={(node) => this.pickedTable = node}
              query={pickedQuery}
              columns={readyPickingColumns}
              scroll={{ x: '100%' }}
              url={outStorage.PICKING_DETAIL_LIST}
              rowKey='id'
            />
          </TabPane>
        </Tabs>
        
      </div>
    )
  }
}
export default connect(state => state)(DetailsPickSoldOut);