/*
 * @Author: wwb 
 * @Date: 2018-07-24 20:15:54 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 00:16:10
 */
/* 
  @file 补货计划 详情
*/
import React, { PureComponent } from 'react';
import { Table ,Row, Col,Tooltip, Button, message, Select} from 'antd';
import { connect } from 'dva';
import { replenishmentPlan } from '../../../../api/replenishment/replenishmentPlan';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect/index';
import {Link} from 'react-router-dom';

const Option = Select.Option;

const columns = [
  {
    title: '药品名称',
    width:350,
    dataIndex: 'ctmmTradeName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc'
  },
  {
    title: '包装规格',
    width: 148,
    dataIndex: 'packageSpecification'
  },
  {
    title: '单位',
    width: 90,
    dataIndex: 'replanUnit'
  },
  {
    title: '需求数量',
    dataIndex: 'demandQuantity',
    width: 90
  },
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
    title: '供应商',
    width: 200,
    dataIndex: 'supplierName',
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 100
  },
  {
    title: '金额',
    dataIndex: 'amount',
    width: 100,
    render: (text, record) => (record.price * record.demandQuantity).toFixed(4)
  },
  {
    title: '批准文号',
    width: 200,
    dataIndex: 'approvalNo'
  },
    {
        title: '药品编码',
        dataIndex: 'hisDrugCode',
        width: 200,
    },
];
class ReplenishmentDetail extends PureComponent{
  state = {
    options:[],
    detailsData: {},
    drugCommonName:undefined,
    value: undefined,
    submitLoading: false,
    dataSource: [],
    show:'none',
    show2:'block',
    query: {
      medDrugType: '1',
      purchaseType: 1,
      planCode:"PA190220000003",
      deptCode:"24C69445D19C4625960DA3F1E58A6A1F"
    },
    deptModules: [],// 补货部门
    visible: false,
    loading: false,
  }
  componentWillMount = () =>{
    const { dispatch } = this.props;
    console.log('123',this.props)
    dispatch({
      type: 'base/getModule',
      payload: { deptType : '3' },
      callback: (data) =>{
        this.setState({ deptModules: data })
      }
    });


  };
  
  componentDidMount = () => {
    this.getDetail();
    if(this.props.match.path === "/purchase/replenishment/replenishmentPlan/edit/:planCode") {
      let { planCode } = this.props.match.params;
      this.setState({loading: true})
      this.props.dispatch({
        type:'base/ReplenishDetails',
        payload: { planCode },
        callback:({data, code, msg})=>{
          if(code === 200) {
            let deptCode;
            let {deptModules, query} = this.state;
            deptModules.map(item=>{
              if(data.deptCode === item.id) {
                deptCode = item.id
              };
              return item;
            });
            let existDrugCodeList = data.list.map(item => item.drugCode);

            this.setState({ 
              info: data, 
              isEdit: true, 
              dataSource: data.list,
              loading: false,
              query: {
                ...query,
                deptCode,
                existDrugCodeList
              },
              spinLoading: false
            });
          }else {
            message.error(msg);
          };
        }
      });
    }else {
      this.setState({spinLoading: false})
    }
  }

  handleChange = (value) => {
    let options;
    if (!value || value.indexOf('@') >= 0) {
      options = [];
    } else {
      options = ['gmail.com', '163.com', 'qq.com'].map((domain) => {
        const email = `${value}@${domain}`;
        return <Option key={email}>{email}</Option>;
      });
    }
    this.setState({ options });
    const { dispatch } = this.props;
    let {query, dataSource} = this.state;
    dispatch({
      type: 'base/detailXG',
      payload: {
        ...query
      },
      callback: (data) =>{
        
      }
    });
    //this.setState({ options });
  }

  showModalLogic = (addDrugType) => {
    let {query, dataSource} = this.state;
    if(!query.deptCode) {
      message.warning('请选择部门');
      return;
    };
    let existDrugCodeList = dataSource.map((item) => item.drugCode);
    this.setState({ 
      visible: true,
      addDrugType: 1,
      modalSelected: [],
      modalSelectedRows: [],
      query: {
        ...query,
        id:1,
        existDrugCodeList,
        hisDrugCodeList: [],
        filterThreeMonthFlag: false
      },
      value: undefined
    });
  }
  //详情
  getDetail = () => {
    if (this.props.match.params.planCode) {
      let { planCode } = this.props.match.params;
      this.props.dispatch({
        type:'base/ReplenishDetails',
        payload: { planCode },
        callback:({data, code, msg})=>{
          if(code === 200) {
            this.setState({ detailsData: data });
          }else {
            message.error(msg);
          };
        }
      });
    }
  }
  //提交
  submit = () => {
    this.setState({
      submitLoading: true
    });
    let {detailsData} = this.state;
    let dataSource = detailsData.list.map(item => {
      return {
        bigDrugCode: item.bigDrugCode,
        demandQuantity: item.demandQuantity,
        drugCode: item.drugCode,
        drugPrice: item.drugPrice,
        hisDrugCode: item.hisDrugCode,
        supplierCode: item.supplierCode
      }
    });
    this.props.dispatch({
      type: 'base/submit',
      payload: {
        auditStatus: 2,
        id: detailsData.id,
        planType: detailsData.planType,
        list: dataSource,
        deptCode: detailsData.deptCode,
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            submitLoading: false
          });
          message.success('提交成功');
          this.getDetail();
        }else {
          this.setState({
            submitLoading: false
          });
          message.error(msg);
        };
      }
    });
  }
  //打印
  print = () => {
    let { planCode } = this.props.match.params;
    window.open(`${replenishmentPlan.PLAN_DETAIL_PRINT}?planCode=${planCode}`, '_blank');
  }
  render(){
    const { 
      detailsData,
      query,  
      modalLoading
    } = this.state;
    let {path} = this.props.match;
    path = path.split('/');
    path.length = 4;
    path = path.join('/');
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <div style={{ display: 'flex',justifyContent: 'space-between' }}>
            <h3>单据信息</h3>
              <div>
                {
                  detailsData.auditStatus === 1 || 
                  detailsData.auditStatus === 3 ? 
                  [
                    <Link key="edit" to={{pathname: `${path}/edit/${this.props.match.params.planCode}`}}>
                      <Button type='default'>编辑</Button>
                    </Link>,
                    <Button key="submit" type='primary' onClick={this.submit} style={{ marginLeft: 8 }}>提交</Button>
                  ]
                  : 
                  <Button onClick={this.print}>打印</Button>
                }
              </div>
          </div>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>计划单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.planCode}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.planTypeName}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.statusName}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>发起人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.createUserName}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>发起时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.createDate}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>联系电话</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.mobile}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>收货地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.receiveAddress}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>审核人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.sheveUserName}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>审核时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.sheveDate}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>驳回说明</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{detailsData.note}</div>
              </div>
            </Col>
          </Row>
        </div>
        <Row style={{display: 'flex', alignItems: 'center'}}>
              <Col span={12} style={{ marginLeft: 4 }}>
                <FetchSelect
                  value={this.state.value}
                  name={this.state.name}
                  style={{ width: '100%' }}
                  placeholder='药品名称'
                  //url={replenishmentPlan.QUERY_DRUG_BY_LISTXG+'?'+'depotplanID='+this.props.match.params.planCode+'&'+'drugCommonName='+this.state.value}
                  url={replenishmentPlan.QUERY_DRUG_BY_LIST}
                  cb={(value, option) => {
                    console.log(value);
                    let name = localStorage.getItem('drugCommonName');
                    let {query,dataSource} = this.state;
                    query = {
                      ...query,
                      hisDrugCodeList: value ? [value] : [],
                    };
                    this.setState({
                      query,
                      value,
                      drugCommonName:name,
                      show:'block',
                      show2:'none'
                    });
                  }}
                />
              </Col>
            </Row>
            <div className='detailCard' style={{display:this.state.show}}>
              <RemoteTable
                title={()=>'产品信息'}
                scroll={{x: '100%'}}
                query={query}
                //url={'/medicinal-web/a/depot/depotplan/detailXG?planCode='+this.props.match.params.planCode}
                url={'/medicinal-web/a/depot/depotplan/detailbydrugname?depotplanID='+this.props.match.params.planCode+'&drugCommonName=lu'}
                isJson={true}
                ref="table"
                modalLoading={modalLoading}
                columns={columns}
                scroll={{ x: '100%' }}
                rowKey='drugCode'
                pagination={false}
              />
            </div>
        {<div className='detailCard'>
          <Table
            style={{display:this.state.show2}}
            title={()=>'产品信息'}
            scroll={{x: '100%'}}
            query={query}
            columns={columns}
            bordered
            dataSource={detailsData ? detailsData.list : []}
            pagination={false}
          />
        </div> }
      </div>
    )
  }
}
export default connect(state => state)(ReplenishmentDetail);

