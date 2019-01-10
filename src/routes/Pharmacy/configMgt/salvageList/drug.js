/*
 * @Author: 药房 - 抢救车目录管理 - 药品
 * @Date: 2018-08-28 17:42:54 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-06 21:48:20
 */

import React , {PureComponent} from 'react';
import { Row, Col, Button, Modal, message, Tooltip, InputNumber} from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect/index';
import { baseMgt } from '../../../../api/pharmacy/configMgt';
import goodsAdjust from '../../../../api/drugStorage/goodsAdjust';
import { connect } from 'dva';
import querystring from 'querystring';

class BaseMgt extends PureComponent{
  constructor(props) {
    super(props);
    let info = this.props.match.params.id;
    info = querystring.parse(info);
    this.state = {
      info: {},
      medalQuery: {
        deptCode: info.code,
      },
      query: {
        deptCode: info.code
      },
      visible: false,
      value: undefined,
      okLoading: false,
      modalSelectedRows: [],
      modalSelected: [],
      selectedRows: [],
      selected: [],
      removeLoading: false,
      editingKey: '',
      upperQuantity: '',
      downQuantity: ''
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'configMgt/rescuecarGetDeptNameByCode',
      payload: {...this.state.query},
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            info: data
          });
        }else {
          message.error(msg);
        };
      }
    })
  }
  setQuery = (value) => {
    let {medalQuery} = this.state;
    medalQuery = {
      ...medalQuery,
      hisDrugCodeList: value? [value] : []
    };
    this.setState({
      medalQuery,
      value
    });
  }
  cancel = () => {
    this.setState({
      visible: false,
    });
  }
  addProduct = () => {
    let {modalSelectedRows, query} = this.state;
    if(modalSelectedRows.length === 0) {
      message.warning('至少选择一条数据');
      return;
    }
    this.setState({
      okLoading: true
    });
    let rescuecarMedicineDetails = modalSelectedRows.map((item) => {
      return {
        bigDrugCode: item.bigDrugCode,
        drugCode: item.drugCode
      }
    });
    
    this.props.dispatch({
      type: 'configMgt/pitchOnCardinalRescuecar',
      payload: {
        ...query,
        rescuecarMedicineDetails
      },
      callback: (data) => {
        this.setState({
          okLoading: false,
          visible: false,
          modalSelectedRows: [],
          modalSelected: []
        });
        this.refs.table.fetch(query);
      }
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
      value: undefined,
      modalSelected: [],
    });
  }
  //移除
  remove = () => {
    let {selectedRows, query} = this.state;
    if(selectedRows.length === 0) {
      return message.warning('至少选择一条数据移除');
    };
    this.setState({
      removeLoading: true
    });
    let ids = selectedRows.map(item => item.id);
    this.props.dispatch({
      type: 'configMgt/MoveCardinalMedicineDetail',
      payload: {ids},
      callback: () => {
        message.success('移除成功');
        this.setState({
          removeLoading: false
        });
        this.refs.table.fetch(query);
      }
    })
  }
  //库存基数
  changeStockBase = (key, value) => {
    this.setState({
      [key]: value
    });
  }
  //编辑
  editRow = (record) => {
    this.setState({
      editingKey: record.id,
      stockBase: record.stockBase,
    });
  }
  //保存
  saveStockBase = () => {
    const {stockBase, editingKey} = this.state;
    if(
      stockBase === null || 
      stockBase === "" || 
      stockBase === undefined
    ) return message.warning('请输入库存基数');
    this.props.dispatch({
      type: 'configMgt/editRescuecarQuantity',
      payload: {
        id: editingKey,
        stockBase,
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            editingKey: '',
            stockBase: ''
          });
          this.refs.table.fetch();
        }else {
          message.error(msg);
        }
      }
    })
  }
  //取消
  cancelStockBase = () => {
    this.setState({
      editingKey: '',
      stockBase: ''
    });
  }
  render(){
    const { medalQuery, info, visible, okLoading, value, query, editingKey } = this.state;
    const columns = [
      /*{
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },*/
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
        dataIndex: 'ctmmSpecification',
        width: 168,
      },*/
      {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 168,
      },
      {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 148,
      },
      {
        title: '单位',
        dataIndex: 'replanUnit',
        width: 112,
      },
      {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 200,
      },
      {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '库存基数',
        dataIndex: 'stockBase',
        width: 120,
        fixed: 'right',
        render:(text, record)=>{
          if(record.id === editingKey) {
            return <InputNumber
                    defaultValue={text}
                    min={1}
                    max={999999}
                    precision={0}
                    onChange={this.changeStockBase.bind(this, 'stockBase')}                    
                   />
          }else {
            return <span>{text}</span>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'RN',
        width: 140,
        fixed: 'right',
        render: (text, record) => {
          if(record.id === editingKey) {
            return <span>
                    <a style={{margin: 8}} onClick={this.saveStockBase}>保存</a>
                    <a onClick={this.cancelStockBase}>取消</a>
                   </span>
          }else {
            return <a onClick={this.editRow.bind(this, record)}>编辑库存基数</a>
          }
        }
      }
    ]
    const modalColumns = [
     /* {
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },*/{
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ),
        width: 350,
      },/*{
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      },*/{
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90,
      },{
        title: '单位',
        dataIndex: 'replanUnit',
        width: 112,
      },{
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 148,
      },{
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
    ];
    return (
      <div className="fullCol fadeIn">
        <div className="fullCol-fullChild">
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>抢救车</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className="ant-form-item-control">
                  {info.deptName || ''}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          destroyOnClose
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
                style={{ width: 496 }}
                placeholder='药品名称'
                url={goodsAdjust.QUERY_DRUG_BY_LIST}
                cb={this.setQuery}
              />
            </Col>
          </Row>
          <RemoteTable
            query={medalQuery}
            isJson={true}
            url={baseMgt.ADD_RESCUECAR_MEDICINE}
            style={{ marginTop: 16 }} 
            columns={modalColumns}
            scroll={{ x: '100%' }}
            rowKey='drugCode'
            rowSelection={{
              selectedRowKeys: this.state.modalSelected,
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({modalSelected: selectedRowKeys, modalSelectedRows: selectedRows})
              }
            }}
          />
        </Modal>
        <div className='detailCard'>
          <h3>产品信息
            <Button style={{margin: '0 8px'}} onClick={this.showModal} type="primary">新增</Button>
          </h3>
          <hr className="hr"/>
          <RemoteTable
            ref='table'
            query={query}
            url={baseMgt.FIND_RESCUECA_CARDINAL_MADICINE}
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'id'}
          />
        </div>
      </div>
    )
  }
}
export default connect()(BaseMgt)