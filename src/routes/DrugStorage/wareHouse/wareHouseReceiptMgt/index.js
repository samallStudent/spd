/*
 * @Author: gaofengjiao  入库单管理 
 * @Date: 2018-08-06 15:31:15 
* @Last Modified time: 2018-08-06 15:31:15 
 */
import React, { PureComponent } from 'react';
import { DatePicker, Form, Input , Row, Col, Button, Icon, Select } from 'antd';
import { formItemLayout } from '../../../../utils/commonStyles';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import wareHouse from '../../../../api/drugStorage/wareHouse';
import {connect} from 'dva';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class Putaway extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      messageError:"",
      selectedRowKeys:[]
    }
  }

  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }

  render(){
    const columns = [
      {
       title: '入库单',
       width: 280,
       dataIndex: 'inStoreCode',
       render: (text,record) =>{
        return <span>
           <Link to={{pathname: `/drugStorage/wareHouse/wareHouseReceiptMgt/detail/${record.inStoreCode}`}}>{text}</Link>
         </span>
        }
      },
      {
        title: '配送单',
        width: 280,
        dataIndex: 'distributeCode',
      },
      {
        title: '订单',
        width: 280,
        dataIndex: 'orderCode',
      },
      {
        title: '状态',
        width: 112,
        dataIndex: 'auditStatuslName',
      },
      {
        title: '入库分类',
        width: 112,
        dataIndex: 'inStoreTypeName',
      },
      {
        title: '供应商',
        width: 224,
        dataIndex: 'ctmaSupplierName',
      },
      {
        title: '上架时间',
        width: 224,
        dataIndex: 'createDate'
      }
    ];
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.time;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <SearchForm 
          formProps={{...this.props}}
         />
        <RemoteTable  
          onChange={this._tableChange}
          isJson
          query={query}
          url={wareHouse.depotinstoreList}
          ref="tab"
          scroll={{x: 1568}}
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 24}}
        />
      </div>
    )
  }
}
// export default connect(state=>state.wareHouse)(Putaway);
export default connect(state=>state)(Putaway);

/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
  state = {
    types: [],
    supplierList: []
  }
  componentDidMount() {
    this.props.formProps.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'in_store_type'
      },
      callback: (data) => {
        this.setState({
          types: data
        });
      }
    });
    this.props.formProps.dispatch({
      type: 'wareHouse/getsupplierList',
      callback: (data) => {
        this.setState({
          supplierList: data
        });
      }
    });
    let { queryConditons } = this.props.formProps.base;
    queryConditons = {...queryConditons};
    if(queryConditons.supplierCodeList) {
      queryConditons.supplierCodeList = queryConditons.supplierCodeList[0];
    };
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
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      for (const key in values) {
        values[key] = values[key] === undefined? "" : values[key]
      };
      if(values.time !== "" && values.time.length > 0) {
        values.startTime = values.time[0].format('YYYY-MM-DD');
        values.endTime = values.time[1].format('YYYY-MM-DD');
      }else {
        values.startTime = "";
        values.endTime = "";
      }
      values.supplierCodeList = values.supplierCodeList? [values.supplierCodeList] : [];
      this.props.formProps.dispatch({
        type:'base/updateConditions',
        payload: values
      });
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }

  render() {
    let { types, supplierList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    types = types.map(item => {
      return <Option key={item.value} value={item.value}>{item.label}</Option>
    });
    supplierList = supplierList.map(item => {
      return <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
    });
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`单号`} {...formItemLayout}>
              {getFieldDecorator('inStoreCode', {})(
              <Input placeholder='入库单/配送单/订单号'/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
          <FormItem label={`供应商`} {...formItemLayout}>
            {getFieldDecorator('supplierCodeList', {})(
                <Select
                  allowClear
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                    {supplierList}
                </Select>
              )}
          </FormItem>
        </Col>
        <Col span={8} style={{display: display}}>
            <FormItem label={`入库时间`} {...formItemLayout}>
              {getFieldDecorator('time', {})(
              <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`入库分类`} {...formItemLayout}>
              {getFieldDecorator('inStoreType', {})(
                <Select
                  allowClear
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                    {types}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ float:'right',textAlign: 'right', marginTop: 4}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
              {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchForm = Form.create()(SearchFormWrapper); 