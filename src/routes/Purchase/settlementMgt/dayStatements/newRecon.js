/*-- 生成对账单 --*/
import React, { PureComponent } from 'react';
import { Row, Col, Tooltip, message, Input, Icon, Button } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect';
import {dayStatements, common} from '../../../../api/purchase/purchase';
import {connect} from 'dva';
const columns = [
  {
    title: '发药确认单',
    width: 168,
    dataIndex: 'dispensingNo'
  },
  {
    title: '出库单',
    dataIndex: 'backNo',
    width: 168
  },
  {
    title: '通用名',
    width: 168,
    dataIndex: 'ctmmGenericName'
  },
  {
    title: '商品名',
    width: 224,
    dataIndex: 'ctmmTradeName',
  },
  {
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
    className:'ellipsis',
    render: (text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '生产厂家',
    width: 224,
    dataIndex: 'ctmmManufacturerName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '批准文号',
    width: 168,
    dataIndex: 'approvalNo',
  },
  {
    title: '供应商',
    width: 224,
    dataIndex: 'supplierName',
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification',
  },
  {
    title: '发药单位',
    width: 112,
    dataIndex: 'replanUnit',
  },
  {
    title: '发药数量',
    width: 112,
    dataIndex: 'oEORIDispDrugQuantity',
  },
  {
    title: '出库数量',
    width: 112,
    dataIndex: 'backSumNum',
  },
  {
    title: '出库货位类别',
    width: 168,
    dataIndex: 'outStoreName',
  },
  {
    title: '生产批号',
    width: 168,
    dataIndex: 'lot',
  },
  {
    title: '参考价格',
    width: 112,
    dataIndex: 'drugPrice',
  },
  {
    title: '参考金额',
    width: 112,
    dataIndex: 'totalAmount',
  },
  {
    title: '生产日期',
    width: 168,
    dataIndex: 'productDate',
  },
  {
    title: '有效期至',
    width: 168,
    dataIndex: 'validEndDate'
  },
];

const Search = Input.Search;
class NewRecon extends PureComponent{
    constructor(props){
        super(props)
        this.state={
        query: {
            hisDrugCodeList: [],
            paramNo: ""
        },
        dispenseCodeList: [],
        value: undefined,
        submitLoading: false,
        count: 0
        }
    }
    changeSelect = (value) => {
        let {query} = this.state;
        query = {
            ...query,
            paramNo: value
        };
        this.setState({
            query
        });
    }

    changeFetchSelect = (value) => {
        let {query} = this.state;
        query = {
            ...query,
            hisDrugCodeList: value? [value] : []
        };
        this.setState({
            query,
            value
        });
    }
    
    submit = () => {
        this.setState({
            submitLoading: true
        });
        let {dispenseCodeList} = this.state;

        this.props.dispatch({
            type: 'base/push2Hrp',
            payload: {dispenseCodeList},
            callback: (data) => {
                if(data.msg === 'success') {
                    this.setState({
                        submitLoading: false
                    });
                    message.success('对账成功');
                    this.props.history.go(-1);
                }else {
                    message.error(data.msg);
                }
            }
        })
    }

    render(){
        let {query, value, submitLoading, count} = this.state;
        return (
        <div className='fullCol' style={{padding: '0 24px 24px', background: 'rgb(240, 242, 245)'}}>
            <div className='fullCol-fullChild' style={{margin: '0 -24px'}}>
                <Row style={{margin: '0 -32px', borderBottom: '1px solid rgba(0, 0, 0, .2)'}}>
                    <Col span={8}>
                    <h3 style={{padding: '0 0 15px 32px', fontSize: '20px'}}>
                        生成对账单
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
                    <Col span={6}>
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                        <label>
                        单号
                        </label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                        <div className='ant-form-item-control'>
                        <Search onSearch={this.changeSelect} placeholder="发药单/出库单"/>
                        </div>
                    </div>
                    </Col>
                    <Col span={6}>
                    <div className="ant-row">
                        <div className="ant-col-4 ant-form-item-label-left">
                        <label>名称</label>
                        </div>
                        <div className="ant-col-18">
                        <div className="ant-form-item-control">
                            <FetchSelect
                                allowClear
                                value={value}
                                style={{width: '100%'}}
                                url={common.QUERY_DRUG_BY_LIST}
                                placeholder='通用名/产品名'
                                cb={this.changeFetchSelect}
                            />
                        </div>
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>
            <div className='detailCard' style={{margin: '-12px -6px -6px'}}>
                <RemoteTable
                    query={query}
                    isJson
                    url={dayStatements.GENERATOR_DAILY_LIST}
                    scroll={{x: 2968}}
                    columns={columns}
                    rowKey={'id'}
                    cb={(list, data) => {
                        if(list[0].dispensingCodeList) {
                            this.setState({
                                dispenseCodeList: list[0].dispensingCodeList,
                            });
                        }
                        this.setState({
                            count: data.count                        
                        });
                    }}
                />
            </div>
            <div className="detailCard" style={{margin: '-10px -6px'}}>
            {
                count > 0?
                <Row gutter={30}>
                <Col style={{lineHeight: '32px'}} span={8}>
                    共<span style={{color: 'red'}}>{count}</span>种产品
                </Col>
                <Col style={{textAlign: 'right'}} span={16}>
                    <Button loading={submitLoading} onClick={this.submit} type="primary" style={{marginRight: 8}}>确认对账</Button>
                    <Button onClick={()=>{this.props.history.go(-1)}}>取消</Button>
                </Col>
                </Row> : null
            }
            </div>
        </div>
        )
    }
}
export default connect(state=>state)(NewRecon);