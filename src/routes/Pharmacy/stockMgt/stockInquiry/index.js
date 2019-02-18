import React , {PureComponent} from 'react';

import { Link } from 'react-router-dom'

import { Form, Row, Col, Button, Tooltip } from 'antd';
//Select
import FetchSelect from '../../../../components/FetchSelect/index';

import RemoteTable from '../../../../components/TableGrid';

import drugStorage from '../../../../api/drugStorage/stockInquiry';
import goodsAdjust from '../../../../api/drugStorage/goodsAdjust';
import {connect} from 'dva';
import FormItem from 'antd/lib/form/FormItem';
import { formItemLayout } from '../../../../utils/commonStyles';


// const FormItem = Form.Item;
// const {Option} = Select;

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 5 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 19 },
//   },
//  };

const columns = [
  /*{
    title: '通用名',
    dataIndex: 'ctmmGenericName',
    width: 200,
    render: (text, record) => {
      return (
        <span>
          <Link to={{pathname: `/pharmacy/stockMgt/stockInquiry/details/dCode=${record.drugCode}&bCode=${record.hisDrugCode}`}}>{text}</Link>
        </span>  
      )
    }
  },*/ {
    title: '药品名称',
    dataIndex: 'ctmmTradeName',
    width: 350,
    className: 'ellipsis',
    render:(text, record)=>(
      <Tooltip placement="topLeft" title={text}>
        <Link to={{pathname: `/pharmacy/stockMgt/stockInquiry/details/dCode=${record.drugCode}&bCode=${record.hisDrugCode}
        &locCode=${record.goodsCode?record.goodsCode:""}&lot=${record.lot}`}}>{text}</Link>
      </Tooltip>
    )
  }, /*{
    title: '规格',
    dataIndex: 'ctmmSpecification',
    width: 148,
  }, */{
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
    width: 90,
  }, {
    title: '库存数量',
    dataIndex: 'totalStoreNum',
    width: 80,
  }, {
    title: '可用库存',
    width: 90,
    dataIndex: 'usableQuantity',
  }, {
    title: '锁定区库存',
    width: 100,
    dataIndex: 'lockStoreNum',
  }, {
    title: '待处理库存',
    dataIndex: 'waitStoreNum',
    width: 100
  }, {
    title: '剂型',
    dataIndex: 'ctmmDosageFormDesc',
    width: 90,
  }, {
    title: '批准文号',
    dataIndex: 'approvalNo',
    width: 138,
  }
];


class StockInquiry extends PureComponent {
  // state = {
  //   value: undefined
  // }
  componentDidMount() {
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
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // values.deptCode = values.deptCode === undefined? "" : values.deptCode;
      values.hisDrugCodeList = values.hisDrugCode ? [ values.hisDrugCode ] : []
      values.locCodeList = values.locCodeList ? [values.locCodeList] : [];      
      this.props.dispatch({
        type:'base/updateConditions',
        payload: values
      });
      // this.setState({
      //   query: {
      //     ...query,
      //     deptCode: values.deptCode,
      //     hisDrugCodeList: value? [value] : [],
      //   }
      // });
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.dispatch({
      type:'base/clearQueryConditions'
    });
    // this.setState({
    //   value: undefined
    // });
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  export = () => {
    // const {value} = this.state;
    // const hisDrugCodeList = value ? [value] : [];
    let {queryConditons} = this.props.base;
    queryConditons = {...queryConditons}
    delete queryConditons.pageNo;
    delete queryConditons.pageSize;
    delete queryConditons.pageNo;
    delete queryConditons.sortField;
    delete queryConditons.sortOrder;
    delete queryConditons.key;
    console.log(queryConditons);
    this.props.dispatch({
      type: 'stockInquiry/stockInquiryExport',
      payload: 
        // hisDrugCodeList
        queryConditons
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let query = this.props.base.queryConditons;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={30}>
            <Col span={8}>
              <FormItem label={`关键字`} {...formItemLayout}>
                {getFieldDecorator('hisDrugCode')(
                  <FetchSelect
                  allowClear={true}
                  style={{ width: 248 }}
                  placeholder='药品名称'
                  url={goodsAdjust.QUERY_DRUG_BY_LIST}
                />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`货位名称`} {...formItemLayout}>
                {getFieldDecorator('locCodeList')(
                  <FetchSelect
                  queryKey={"positionName"}
                  valueAndLabel={{
                    value: 'id',
                    label: 'positionName'
                  }}
                  allowClear={true}
                  style={{ width: 248 }}
                  placeholder='请输入货位名称'
                  url={drugStorage.locList}                  
                />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              {/* <FormItem label={`药品类型`} {...formItemLayout}>
                {getFieldDecorator('deptCode')(
                  <Select placeholder="请选择">
                    <Option value="全部">全部</Option>
                    <Option value="抗生素">抗生素</Option>
                    <Option value="营养类">营养类</Option>
                  </Select>
                )}
              </FormItem> */}
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginTop: 4}} >
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Button onClick={this.export}>
            导出
          </Button>
        </Row>
        <RemoteTable
          onChange={this._tableChange}
          url={drugStorage.queryDrugByDept}
          isJson={true}
          query={query}
          ref="tab"
          style={{marginTop: 20}}
          scroll={{x: '100%'}}
          isDetail={true}
          columns={columns}
          rowKey="drugCode"
        />
      </div>
    )
  }
}

const WrappedStockInquiry = Form.create()(StockInquiry);
export default connect(state=>state)(WrappedStockInquiry);
