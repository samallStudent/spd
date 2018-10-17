import React , {PureComponent} from 'react';

import { Link } from 'react-router-dom'

import { Form, Row, Col, Button, Tooltip } from 'antd';
//Select
import {connect} from 'dva';
import FetchSelect from '../../../components/FetchSelect/index';

import RemoteTable from '../../../components/TableGrid';

import {stockMgt} from '../../../api/baseDrug/stockMgt';

import goodsAdjust from '../../../api/drugStorage/goodsAdjust';

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
  {
    title: '通用名',
    dataIndex: 'ctmmGenericName',
    width: 168,
    render: (text, record) => {
      return (
        <span>
          <Link to={{pathname: `/baseDrug/stockMgt/stockInquiry/details/dCode=${record.drugCode}&bCode=${record.bigDrugCode}`}}>{text}</Link>
        </span>  
      )
    }
  }, {
    title: '商品名',
    dataIndex: 'ctmmTradeName',
    width: 224,
  }, {
    title: '规格',
    dataIndex: 'ctmmSpecification',
    width: 168,
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  }, {
    title: '生产厂家',
    dataIndex: 'ctmmManufacturerName',
    width: 224,
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  }, {
    title: '包装规格',
    dataIndex: 'packageSpecification',
    width: 168,
  }, {
    title: '单位',
    dataIndex: 'replanUnit',
    width: 60,
  }, {
    title: '数量',
    dataIndex: 'usableQuantity',
    width: 112,
  }, {
    title: '剂型',
    dataIndex: 'ctmmDosageFormDesc',
    width: 168,
  }, {
    title: '批准文号',
    dataIndex: 'approvalNo',
    width: 168,
  }
];


class StockInquiry extends PureComponent {
  state = {
    value: undefined
  }
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
      values.hisDrugCodeList = this.state.value ? [this.state.value] : [];

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
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  render() {
    // const { getFieldDecorator } = this.props.form;
    const {value} = this.state;
    let query = this.props.base.queryConditons;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={30}>
            <Col span={8}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-5">
                  <label>关键字</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                  <div className="ant-form-item-control">
                    <FetchSelect
                      allowClear={true}
                      value={value}
                      style={{ width: 248 }}
                      placeholder='通用名/商品名'
                      url={goodsAdjust.QUERY_DRUG_BY_LIST}
                      cb={(value, option) => {
                        this.setState({
                          value
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
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
        <RemoteTable
          onChange={this._tableChange}
          url={stockMgt.BASE_MEDICINE_LIST}
          isJson={true}
          showHeader={true}
          query={query}
          ref="tab"
          bordered={true}
          scroll={{x: 1460}}
          columns={columns}
          rowKey="drugCode"
        />
      </div>
    )
  }
}

const WrappedStockInquiry = Form.create()(StockInquiry);
export default connect(state=>state)(WrappedStockInquiry);
