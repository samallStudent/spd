import React , {PureComponent} from 'react';
import { Link } from 'react-router-dom'
import { Form, Row, Col, Button, Tooltip, Select, Icon, message } from 'antd';
import FetchSelect from '../../../../components/FetchSelect/index';
import RemoteTable from '../../../../components/TableGrid';
import {common, statisticAnalysis} from '../../../../api/purchase/purchase';
import {connect} from 'dva';


const FormItem = Form.Item;
const {Option} = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: {span: 8}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
    md: {span: 16}
  },
 };
class StockInquiry extends PureComponent {
  state = {
    purchaseTypeList: [],
    deptList: []
  }
  componentDidMount() {
    const {dispatch} = this.props;
    let { queryConditons } = this.props.base;
    //找出表单的name 然后set
    let values = this.props.form.getFieldsValue();
    values = Object.getOwnPropertyNames(values);
    let value = {};
    values.map(keyItem => {
      value[keyItem] = queryConditons[keyItem];
      return keyItem;
    });
    this.props.form.setFieldsValue(value);
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'his_purchase_type'
      },
      callback: (data) => {
        this.setState({
          purchaseTypeList: data
        });
      }
    });
    dispatch({
      type: 'statistics/getDeptInfoNoAdmin',
      callback: ({code, msg, data}) => {
        if(code === 200) {
          this.setState({
            deptList: data
          });
        }else {
          message.error(msg);
        };
      }
    })
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values.hisDrugCodeList = values.hisDrugCodeList ? [values.hisDrugCodeList] : [];
      this.props.dispatch({
        type:'base/updateConditions',
        payload: values
      });
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.dispatch({
      type:'base/clearQueryConditions'
    });
  }
  //导出
  export = () => {
    let {queryConditons} = this.props.base;
    queryConditons = {...queryConditons}
    delete queryConditons.pageNo;
    console.log(queryConditons);
    this.props.dispatch({
      type:'statistics/StockExport',
      payload: queryConditons
    });
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  toggle = () => {
    this.props.dispatch({
      type:'base/setShowHide'
    });
  }
  render() {
    const {match} = this.props;
    const columns = [
     /* {
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 224,
        render: (text, record) => {
          return (
            <span>
              <Link to={{pathname: `${match.path}/details/${record.deptCode}/${record.drugCode}/${record.hisDrugCode}`}}>{text}</Link>
            </span>  
          )
        }
      }, */{
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width: 350,
        className: 'ellipsis',
        render:(text, record)=>(
          <span>
              <Link to={{pathname: `${match.path}/details/${record.deptCode}/${record.drugCode}/${record.hisDrugCode}`}}>
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
              </Link>
          </span>
        )
      },/* {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      },*/ {
        title: '部门',
        dataIndex: 'deptName',
        width: 168,
      }, {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 112,
      }, {
        title: '单位',
        dataIndex: 'replanUnit',
        width: 112,
      }, {
        title: '库存数量',
        dataIndex: 'totalStoreNum',
        width: 112,
      }, {
        title: '可用库存',
        width: 112,
        dataIndex: 'usableQuantity',
      }, 
      {
        title: '待处理库存',
        width: 112,
        dataIndex: 'waitStoreNum',
      },
      {
        title: '锁定区库存',
        width: 112,
        dataIndex: 'lockStoreNum',
      },{
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90,
      },{
        title: '采购方式',
        dataIndex: 'purchaseType',
        width: 118,
        render:(text)=>(
          <span>{text===1?'零库存':'自采'}</span>
        )
      }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 148,
      }
    ];
    const { getFieldDecorator } = this.props.form;

    const {display} = this.props.base;
    const expand = display === 'block';

    let query = this.props.base.queryConditons;
    delete query.key;

    const {deptList, purchaseTypeList} = this.state;
    return (
      <div className='ysynet-main-content'>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={30}>
            <Col span={8}>
              <FormItem label={`关键字`} {...formItemLayout}>
                {getFieldDecorator('hisDrugCodeList')(
                  <FetchSelect
                    allowClear={true}
                    style={{ width: '100%' }}
                    placeholder='药品名称'
                    url={common.QUERY_DRUG_BY_LIST}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`部门`} {...formItemLayout}>
                {getFieldDecorator('deptCode')(
                  <Select 
                    showSearch
                    placeholder={'请选择'}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                    <Option value="">全部</Option>
                    {
                      deptList.map(item => (
                        <Option key={item.id} value={item.id}>{item.deptName}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{display}}>
              <FormItem label={`采购方式`} {...formItemLayout}>
                {getFieldDecorator('purchaseType')(
                  <Select placeholder="请选择">
                    {
                      purchaseTypeList.map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
              </a>
            </Col>
          </Row>
        </Form>
        <Button  type='default' onClick={this.export}>导出</Button>
        <RemoteTable
          onChange={this._tableChange}
          url={statisticAnalysis.QUERY_DRUG_DEPT_LIST}
          isJson={true}
          query={query}
          ref="tab"
          style={{marginTop: 20}}
          scroll={{x: '100%'}}
          isDetail={true}
          columns={columns}
          rowKey="batchNo"
        />
      </div>
    )
  }
}

const WrappedStockInquiry = Form.create()(StockInquiry);
export default connect(state=>state)(WrappedStockInquiry);
