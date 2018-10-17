/*
 * @Author: yuwei 配货详情 /picking/details
 * @Date: 2018-07-24 13:16:33 
* @Last Modified time: 2018-07-24 13:16:33 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Spin, Button, Modal , InputNumber , Tooltip, message, Affix } from 'antd';
import { connect } from 'dva';
const Conform = Modal.confirm;


class DetailsPicking extends PureComponent{

  constructor(props){
    super (props)
    this.state = {
      detailsData: {},
      rigthDistribut: {},// 配货明细
      leftDataSource: [],
      rightDataSource: [], // 配货明细表格列表
      selectedRow: {}, // 选中行
      loading: false,
      applyStatus: null, // 单据状态
      hasStyle: null, // 表格选中某行index
      amount: 0,
      rightLoading: false,
      okLoading: false,
      cancelLoading: false,
      saveLoading: false,
      createLoaing: false
    }
  }
  componentWillMount = () => {
    this.getDatailInfo();
  }
  //详情
  getDatailInfo = () => {
    if (this.props.match.params.applyCode) {
      let { applyCode } = this.props.match.params;
      this.setState({ loading: true });
      this.props.dispatch({
        type:'outStorage/distributeDetail',
        payload: { applyCode },
        callback:(data)=>{
          this.setState({ 
            detailsData: data, 
            applyStatus: data.applyStatus, 
            loading: false, 
            leftDataSource: data.detailList,
            hasStyle: null,
            selectedRow: {},
            amount: 0,
            rightDataSource: []
          });
        }
      });
    }
  }
  // 配货
  distribite = () =>{
    this.setState({okLoading: true})
    this.distributeEvent('allocate', ()=>{
      this.setState({okLoading: false});
    })
  }
  //请求
  distributeEvent = (editType, cb) =>{
    let values = {};
    values.applyCode = this.state.detailsData.applyCode;
    values.editType = editType;
    this.props.dispatch({
      type: 'outStorage/distributeEvent',
      payload: { ...values },
      callback: (data) =>{
        this.getDatailInfo();
        let msg;
        switch(editType){
          case 'allocate':
            msg = '配货';
            break;
          case 'cancel':
            msg = '取消';
            break;
          case 'addPick':
            msg = '拣货';
            break;
          default: 
            break;
        }
        cb && cb();
        return message.success(`${msg}成功`);
      }
    })
  }
  //生成拣货单
  onCreate = () =>{
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        this.setState({createLoaing: true})
        this.distributeEvent('addPick', ()=>{
          this.setState({createLoaing: false})
        });
      },
      onCancel:()=>{}
    })
  }
  //确认配货 - 取消
  onCancel = () =>{
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        this.setState({cancelLoading: true})
        this.distributeEvent('cancel', ()=>{
          this.setState({cancelLoading: false})
        });
      },
      onCancel:()=>{}
    })
  }
  // 查询配货明细的单条配货记录
  getDistributeDetail = (id) =>{
    this.setState({ rightLoading: true });
    this.props.dispatch({
      type: 'outStorage/getDistributeDetail',
      payload: { id },
      callback: (data) =>{
        this.setState({ rightDataSource: data.detailList, rightLoading: false, rigthDistribut: data })
      }
    })
  }
  //分配数输入框
  amountInputRender = (text,record,index)=>{
    let {amount, rightDataSource} = this.state;
    let otherAmount = rightDataSource.map(item => item.usableQuantity)
    otherAmount = otherAmount.reduce((total, num) => total + num);
    let max = amount - otherAmount + record.usableQuantity;
    console.log(max, 'max');
    return record.detailDistributeStatus === 1? 
      <span>{record.usableQuantity}</span>
      : 
      <InputNumber
        min={0}
        precision={0}
        max={max}
        onChange={this.onChange.bind(this, record, index, max)}
        defaultValue={record.usableQuantity}
      />
  }
  onChange = (record, index, max, value) =>{
    let newRightDataSource = [...this.state.rightDataSource];
    if (/^\d+$/.test(value)) {
      if (value > max) {
        return message.warn('输入数值过大, 总数不能超过未分配数量')
      }
    }else {
      return message.warn('请输入非0正整数')
    }
    newRightDataSource[index].usableQuantity = value;
    
    this.setState({rightDataSource: newRightDataSource})
  }
  // 修改配货明细
  singleUpdateDetail = () =>{
    this.setState({saveLoading: true});
    let { rightDataSource } = this.state;
    let detailList = [], postData = {};
    rightDataSource
    .filter(item => item.detailDistributeStatus === 0)
    .map(item => detailList.push({ id: item.id, usableQuantity: item.usableQuantity }));
    postData.detailList = detailList;
    postData.id = this.state.selectedRow.id;
    this.props.dispatch({
      type: 'outStorage/singUpdate',
      payload: { ...postData },
      callback: () =>{
        this.setState({saveLoading: false});
        this.getDatailInfo();
        message.success('保存成功');
      }
    })
  }
  //固钉按钮
  affixButton = () => {
    let {rightDataSource} = this.state;
    let isShow = rightDataSource.some(item => item.distributeStatus === 0);
    if(!isShow) return null;
    return <Affix offsetBottom={10}>
              <div style={{textAlign: 'right'}}>
                <Button
                  loading={this.state.saveLoading}
                  type="primary"
                  onClick={this.singleUpdateDetail}
                >
                  保存
                </Button>
              </div>
            </Affix>
  }
  //是否禁用按钮
  isDisabled = (x, y) => {
    let {applyStatus} = this.state;
    return !(applyStatus === x || applyStatus === y);
  }
  //顶部配货按钮
  buttonRender = () => {
    let {applyStatus, okLoading, cancelLoading, createLoaing} = this.state;
    if(applyStatus === 5) return null;
    return (
      <div style={{ textAlign: 'right' }}>
        <Button 
          type='primary'
          loading={okLoading}
          disabled={this.isDisabled(1, 3)} 
          className='button-gap' 
          onClick={()=>this.distribite()}
        >
          配货
        </Button>
        <Button 
          loading={cancelLoading}
          disabled={this.isDisabled(2, 4)}
          className='button-gap'
          onClick={()=>this.onCancel()} 
        >
          取消
        </Button>
        <Button
          loading={createLoaing}
          disabled={this.isDisabled(2, 4)}
          onClick={()=>this.onCreate()} 
        >
          生成拣货单
        </Button>
      </div>
    )
  }

  render(){
    const { detailsData, leftDataSource, rightDataSource, rightLoading, loading, hasStyle} = this.state;
    const leftColumns = [
      {
        title: '通用名称',
        width: 168,
        dataIndex: 'ctmmGenericName',
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
        title: '剂型',
        width: 168,
        dataIndex: 'ctmmDosageFormDesc',
      },
      {
        title: '生产厂家',
        width: 224,
        dataIndex: 'ctmmManufacturerName',
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '单位',
        width: 60,
        dataIndex: 'replanUnit',
      },
      {
        title: '申领数量',
        width: 112,
        dataIndex: 'applyNum',
      },
      {
        title: '当前库存',
        width: 112,
        dataIndex: 'totalStoreNum',
      },
      {
        title: '已分配',
        width: 112,
        dataIndex: 'finishNum',
      },
      {
        title: '欠品数',
        width: 112,
        dataIndex: 'lackNum',
      },
      {
        title: '预分配数',
        width: 112,
        dataIndex: 'receiveNum'
      },
    ];
    const rightColumns =  [
      {
        title: '生产批号',
        width: 112,
        dataIndex: 'lot',
      },
      {
        title: '生产日期',
        width: 168,
        dataIndex: 'productDate'
      },
      {
        title: '有效期至',
        width: 168,
        dataIndex: 'validEndDate',
      },
      {
        title: '可分配数',
        width: 112,
        dataIndex: 'allocationNum',
      },
      {
        title: '分配数',
        width: 120,
        dataIndex: 'usableQuantity',
        render: this.amountInputRender
      }
    ];
    return (
      <div style={{padding: '0 16px'}} className='ysynet-content'>
        <Spin spinning={loading}>
          <div className='ysynet-details-flex-header'>
            <h3>单据信息</h3>
            <div>
              {
                this.buttonRender()
              }
            </div>
          </div>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>申领单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.applyCode }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.applyStatusName }</div>
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
                <label>发起人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.createUserName }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>发起时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.createDate }
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>联系电话</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.applyUserPhone }</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>药房地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.applyLocation }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>配货人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.distributeUserName }</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>配货时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{ detailsData.distributeDate }</div>
              </div>
            </Col>
          </Row>
          <hr className='hr'/>
        </Spin>
        <h3>产品信息</h3>
        <Row style={{marginBottom: 10}}>
          <Col span={13} >
            <Table
              bordered
              loading={loading}
              scroll={{x: 1180}}
              columns={leftColumns}
              dataSource={leftDataSource}
              rowKey={'id'}
              pagination={false}
              rowClassName={ (record, index) => index === hasStyle ? 'rowClassBg' : ''}
              onRow={ (record, index) => {
                return {
                  onClick: () => {
                    let { id } = record;
                    if(!this.isDisabled(1, 3)) {
                      return message.warning('请先配货');
                    }
                    if(this.state.selectedRow.id !== id && this.isDisabled(1, 3)){
                      this.setState({ 
                        hasStyle: index, 
                        selectedRow: record,
                        amount: record.applyNum - record.finishNum
                      });
                      this.getDistributeDetail(id);
                    }
                    /* if(applyStatus !== '5'){
                      this.singleUpdateDetail(id)
                    } */
                  }
                };
              }}
            />
          </Col>
          <Col span={10} offset={1}>
            <Table
              bordered
              scroll={{x: 680}}
              dataSource={rightDataSource}
              columns={rightColumns}
              loading={rightLoading}
              rowKey={'id'}
              pagination={false}
            />
          </Col>
        </Row>
        { 
          this.affixButton() 
        }
      </div>
    )
  }
}
export default connect(state => state)(DetailsPicking);