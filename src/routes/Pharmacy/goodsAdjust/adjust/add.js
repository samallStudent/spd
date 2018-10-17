/*
 * @Author: gaofengjiao 
 * @Date: 2018-08-06 16:37:22 
 * @Last Modified by: gaofengjiao
 * @Last Modified time: 2018-08-06 16:37:22 
 */
/**
 * @file 药房 - 货位调整--新建货位
 */
import React, { PureComponent } from 'react';
import {Row, message, InputNumber, Col, Button, Table, Modal, Select, Icon, Tooltip} from 'antd';
import RemoteTable from '../../../../components/TableGrid/index';
import goodsAdjust from '../../../../api/drugStorage/goodsAdjust';
import FetchSelect from '../../../../components/FetchSelect/index';
import {connect} from 'dva';
import _ from 'lodash';
const {Option} = Select;
class NewAddGoodsAdjust extends PureComponent{
  state = {
    isShow: false,
    visible: false,
    okLoading: false,
    selected: [],
    selectedRows: [],
    modalSelected: [],
    modalSelectedRows: [],
    query: {
      hisDrugCodeList: [],
      existDrugList: []
    },
    dataSource: [],
    submitLoading: false,
    value: undefined
  }

  addProduct = () => {
    let {modalSelectedRows, dataSource} = this.state;
    
    if(modalSelectedRows.length === 0) {
      message.warning('请选择一条数据');
      return;
    };
    this.setState({okLoading: true});
    modalSelectedRows = modalSelectedRows.map(item=>{
      return {
        drugCode: item.drugCode,
        lot: item.lot,
        locCode: item.goodsCode
      }
    });
    let payload = {
      detailList: modalSelectedRows,
      locType: '2'
    };
    this.props.dispatch({
      type: 'base/drugInformation',
      payload,
      callback: (data) => {
        this.setState({
          dataSource: [
            ...dataSource,
            ...data
          ],
          okLoading: false,
          visible: false,
          modalSelected: [],
          modalSelectedRows: []
        });
      }
    })
  }

  showModal = () => {
    let {dataSource, query} = this.state;
    dataSource = dataSource.map(item=>({
      drugCode: item.drugCode,
      locCode: item.goodsCode,
      lot: item.lot,
    }));
    this.setState({
      query: {
        ...query,
        existDrugList: dataSource
      }, 
      visible: true,
      modalSelectedRows: [],
      modalSelected: []
    });
  }

  delete = () => {
    let {dataSource, selectedRows} = this.state;
    if(selectedRows.length === 0) {
      message.warning('请至少选择一条数据进行删除');
      return;
    };
    dataSource = _.difference(dataSource, selectedRows);
    this.setState({
      dataSource,
      selectedRows: [],
      selected: []
    });
  }

  search = (value) => {
    let {query} = this.state;
    this.setState({
      query: {
        ...query,
        paramName: value
      }
    });
  }

  submit = () => {
    let {dataSource} = this.state;
    let isNull = dataSource.every(item=>{
      if(!item.adjustNum) {
        message.warning('移动数量不能为空');
        return false;
      };
      if(!item.goalLocCode) {
        message.warning('目的货位不能为空');
        return false;
      };
      return true;
    });
    if(!isNull) return;
    this.setState({submitLoading: true});
    let goodsLocationDetailDtoList = dataSource.map(item=>{
      return {
        adjustNum: item.adjustNum,
        batchNo: item.batchNo,
        conversionRate: item.conversionRate,
        drugCode: item.drugCode,
        goalBigDrugCode: item.goalBigDrugCode,
        goalDrugCode: item.goalDrugCode,
        goalLocCode: item.goalLocCode,
        goalUnit: item.targetUnitCode,
        lot: item.lot,
        goalLot: item.lot,
        originalBigDrugCode: item.bigDrugCode,
        originalLocCode: item.goodsCode,
        originalStore: item.usableQuantity,
        productDate: item.productDate,
        supplierCode: item.supplierCode,
        validEndDate: item.validEndDate,
        originalUnit: item.replanUnitCode,
        originLocName: item.goodsName
      }
    });
    
    this.props.dispatch({
      type: 'base/confirmAdjust',
      payload: {
        goodsLocationDetailDtoList
      },
      callback: (data) => {
        message.success('移库成功！');
        this.props.history.go(-1);
        this.setState({
          submitLoading: false
        });
      }
    })
  }

  cancel = () => {
    this.setState({ 
      visible: false, 
      modalSelected: [] 
    });
  }

  changeGoalLoc = (value, i, record) => {
    let {dataSource} = this.state;
    let index;
    record.targetLocInfoVoList.map((item, n)=>{
      if(item.id === value) {
        index = n;
      };
      return item;
    })
    dataSource[i].goalLocCode = value;
    dataSource[i].goalBigDrugCode = record.targetLocInfoVoList[index].goalBigDrugCode;
    dataSource[i].goalDrugCode = record.targetLocInfoVoList[index].goalDrugCode;
    dataSource[i].targetUnit = record.targetLocInfoVoList[index].targetUnit;
    dataSource[i].targetUnitCode = record.targetLocInfoVoList[index].targetUnitCode
    dataSource[i].targetTypeName = record.targetLocInfoVoList[index].targetTypeName;
    dataSource[i].conversionRate = record.targetLocInfoVoList[index].conversionRate;
    this.setState({
      dataSource: [...dataSource]
    });
  }
  
  render(){
    const {visible, value, query, dataSource, okLoading, submitLoading} = this.state;
    const columns = [
      {
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 168,
      },
      {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
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
        title: '移动数量',
        dataIndex: 'adjustNum',
        width: 112,
        render: (text, record, i) => {
          return <InputNumber
                  min={1}
                  max={record.usableQuantity}
                  precision={0}
                  onChange={(value) => {
                    record.adjustNum = value;
                  }}
                 />
        }
      },
      {
        title: '移动单位',
        dataIndex: 'replanUnit',
        width: 112,
      },
      {
        title: '原库存',
        dataIndex: 'usableQuantity',
        width: 112,
      },
      {
        title: '原货位',
        dataIndex: 'goodsName',
        width: 168,
      },
      {
        title: '原货位类型',
        dataIndex: 'positionTypeName',
        width: 168,
      },
      {
        title: '目的货位',
        dataIndex: 'goalLocCode',
        width: 168,
        render: (text, record, i) => {
          return <Select
                  style={{width: '100%'}}
                  placeholder="请选择目的货位"
                  onChange={(value)=>{this.changeGoalLoc(value, i, record)}}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                 >
                  {
                    record.targetLocInfoVoList.map(item=>{
                      return <Option key={item.id} value={item.id}>{item.targetLocName}</Option>
                    })
                  }
                 </Select>
        }
      },
      {
        title: '目的货位单位',
        dataIndex: 'targetUnit',
        width: 112,
      },
      {
        title: '目的货位类型',
        dataIndex: 'targetTypeName',
        width: 168,
      },
      {
        title: '转换系数',
        dataIndex: 'conversionRate',
        width: 112,
      },
      {
        title: '生产批号',
        dataIndex: 'lot',
        width: 168,
      },
      {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 112,
      }
    ];
    const modalColumns = [
      {
        title: '货位',
        dataIndex: 'goodsName',
        width: 168,
      },{
        title: '货位类型',
        dataIndex: 'positionTypeName',
        width: 168,
      },{
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 168,
      },{
        title: '商品名',
        dataIndex: 'ctmmTradeName',
        width: 224,
      },{
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      },{
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 168,
      },{
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 112,
      },{
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 224,
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '生产批号',
        dataIndex: 'lot',
        width: 168,
      },
      {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 224,
      }
    ];
    return (
      <div className='fullCol fadeIn' style={{padding: '0 24px 24px', background: 'rgb(240, 242, 245)'}}>
        <div className='fullCol-fullChild' style={{margin: '0 -24px 0'}}> 
          <Row style={{margin: '0 -32px', borderBottom: '1px solid rgba(0, 0, 0, .2)'}}>
            <Col span={8}>
              <h3 style={{padding: '0 0 15px 32px', fontSize: '20px'}}>
                新建移库
              </h3>
            </Col>
            <Col span={16} style={{textAlign: 'right', paddingRight: 32}}>
              <Icon 
                onClick={()=>{
                  this.props.history.go(-1);
                }} 
                style={{cursor: 'pointer', transform: 'scale(2)'}} 
                type="close" 
                theme="outlined" 
              />
            </Col>
          </Row>
          <Row style={{marginTop: 10}}>
            <Button type='primary' icon='plus' onClick={this.showModal}>添加产品</Button>
            <Button type='default' onClick={this.delete} style={{ marginLeft: 8 }}>删除</Button>
          </Row>
        </div>
        <div className='detailCard' style={{margin: '-10px -6px'}}>
          <h3>产品信息</h3>
          <Table 
            columns={columns}
            bordered
            rowKey='id'
            dataSource={dataSource}
            scroll={{ x: 2072 }}
            pagination={false}
            rowSelection={{
              selectedRowKeys: this.state.selected,
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
              }
            }}
          />
        </div>
        <div className="detailCard" style={{margin: '-10px -6px'}}>
          {
            dataSource.length > 0?
            <Row gutter={30}>
              <Col style={{lineHeight: '32px'}} span={8}>
                共<span style={{color: 'red'}}>{dataSource.length}</span>种产品
              </Col>
              <Col style={{textAlign: 'right'}} span={16}>
                <Button loading={submitLoading} onClick={this.submit} type="primary" style={{marginRight: 8}}>确认移库</Button>
                <Button onClick={()=>{this.props.history.go(-1)}}>取消</Button>
              </Col>
            </Row> : null
          }
        </div>
        <Modal
          title={'添加产品'}
          visible={visible}
          width={1100}
          style={{ top: 20 }}
          onCancel={this.cancel}
          footer={[
            <Button key="submit" type="primary" loading={okLoading} onClick={this.addProduct}>确认</Button>,
            <Button key="back" onClick={this.cancel}>取消</Button>
          ]}
        >
          <Row>
            <Col span={8} style={{marginLeft: 4}}>
              <FetchSelect
                allowClear
                value={value}
                style={{ width: 248 }}
                placeholder='通用名/商品名'
                url={goodsAdjust.QUERY_DRUG_BY_LIST}
                cb={(value, option) => {
                  let {query} = this.state;
                  query = {
                    ...query,
                    hisDrugCodeList: value? [value] : []
                  };
                  this.setState({
                    query,
                    value
                  });
                }}
              />
            </Col>
          </Row>
          <RemoteTable
            query={query}
            isJson={true}
            url={goodsAdjust.roomDrugList}
            style={{ marginTop: 16 }} 
            columns={modalColumns}
            scroll={{ x: 1842 }}
            rowKey='id'
            rowSelection={{
              selectedRowKeys: this.state.modalSelected,
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({modalSelected: selectedRowKeys, modalSelectedRows: selectedRows})
              }
            }}
          />
        </Modal>
      </div>
    )
  }
}
export default connect(state=>state)(NewAddGoodsAdjust);