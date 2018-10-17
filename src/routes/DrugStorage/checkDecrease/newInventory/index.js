/**
 * @file 药库 - 盘点损益 - 新建盘点
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, DatePicker, Input, Select, Button, Icon, Modal, Radio, message } from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import {common} from '../../../../api/checkDecrease';
import {connect} from 'dva';
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const RadioGroup = Radio.Group;

class SearchForm extends PureComponent {
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  componentDidMount() {
    let { queryConditons } = this.props.formProps.base;
    queryConditons = {...queryConditons};
    if(queryConditons.filterStatus && queryConditons.filterStatus.length > 1) {
      queryConditons.filterStatus = "";
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
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {status} = this.props
        const makingTime = values.makingTime === undefined || values.makingTime === null ? "" : values.makingTime;
        if(makingTime.length > 0) {
          values.checkStartTime = makingTime[0].format('YYYY-MM-DD');
          values.checkEndTime = makingTime[1].format('YYYY-MM-DD');
        };
        let {filterStatus} = values;
        if(filterStatus === '') {
          values.filterStatus = status.map(item=>item.value).filter(item=>item !== '').join(',');
        }
        this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
        });
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
  listRender = (list) => {
    return <Select placeholder="请选择">
            {
              list.map(item => {
                return <Option key={item.value} value={item.value}>{item.label}</Option>
              })
            }
           </Select>
  } 
  render() {
    const { getFieldDecorator } = this.props.form;
    let {status, types} = this.props;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return(
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={'盘点时间'} {...formItemLayout}>
              {getFieldDecorator('makingTime')(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={'单号'} {...formItemLayout}>
              {getFieldDecorator('checkBillNo')(
                <Input placeholder={'盘点单号'} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={'状态'} {...formItemLayout} style={{ display }}>
              {getFieldDecorator('filterStatus')(
                this.listRender(status)
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={'类型'} {...formItemLayout} style={{ display }}>
              {getFieldDecorator('checkBillType')(
                this.listRender(types)
              )}
            </FormItem>
          </Col>
          <Col span={8}>
          </Col>
          <Col span={8} style={{ textAlign: 'right', marginTop: 4 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
            <a style={{ marginLeft: 8, fontSize: 14 }} onClick={this.toggle}>
              {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWarp = Form.create()(SearchForm);

class NewInventory extends PureComponent {
  state = {
    loading: false,
    visible: false,
    selected: [],
    selectedRows: [],
    subType: '',
    types: [],
    status: [],
    subTypes: [],
    deleteLoadig: false
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'check_bill_type'
      },
      callback: (data) => {
        this.setState({
          types: data
        });
      }
    });
    this.props.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'check_status'
      },
      callback: (data) => {
        this.setState({
          status: data
        });
      }
    });
    this.props.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'check_bill_sub_type'
      },
      callback: (data) => {
        this.setState({
          subTypes: data
        });
      }
    })
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
  //新建
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(err) return;
      console.log(values);
      if(values.checkStartTime) {
        values.checkStartTime = values.checkStartTime.format('YYYY-MM-DD HH:mm');
      }
      this.setState({ loading: true });
      
      this.props.dispatch({
        type: 'checkDecrease/createCheckbill',
        payload: values,
        callback: (data) => {
          if(data.msg === 'success') {
            this.setState({
              loading: false,
              visible: false,
            });
            this.refs.table.fetch(this.state.query);
            message.success('新建成功！');
          }else {
            this.setState({
              loading: false
            });
            message.error(data.msg);
            message.warning('新建失败！');
          }
        }
      })
    })
  }
  //删除
  delete = () =>{
    const {selectedRows} = this.state;
    if (selectedRows.length === 0) {
      return message.warn('请至少选择一条数据')
    };
    this.setState({ deleteLoadig: true });
    let ids = selectedRows.map(item=>item.id);
    this.props.dispatch({
      type: 'checkDecrease/deleteCheckBill',
      payload: {ids},
      callback: (data) => {
        if(data.msg === 'success') {
          this.refs.table.fetch(this.state.query);
        }else {
          message.error(data.msg);
          message.warning('删除失败！');
        }
        this.setState({
          deleteLoadig: false
        })
      }
    })
  }
  //新建
  newAdd = () => {
    this.setState({
      visible: true
    });
    this.props.form.resetFields();
  }
  //单选框渲染
  radioRender = (list) => {
    list = list.filter(item => item.label !== "全部")
    return list.map(item => {
      return <Radio key={item.value} value={item.value}>{item.label}</Radio>
    })
  }
  //导出 
  export = () => { 
    let { queryConditons } = this.props.base;
    queryConditons = {...queryConditons};
    delete queryConditons.key;
    delete queryConditons.makingTime;
    delete queryConditons.pageNo;
    delete queryConditons.pageSize;
    delete queryConditons.sortOrder;
    delete queryConditons.sortField;
    this.props.dispatch({
      type: 'checkDecrease/checkBillExport',
      payload: queryConditons
    })
  }
  render() {
    const { getFieldDecorator} = this.props.form;
    const formItemLayoutAdd = { 
      labelCol: { span: 6 }, 
      wrapperCol: { span: 18 } 
    };
    const {status, types, subTypes, subType, deleteLoadig} = this.state;
    const columns = [
      {
        title: '盘点单',
        dataIndex: 'checkBillNo',
        width: 280,
        render: (text, record) => {
          return <span><Link to={{ pathname: `/drugStorage/checkDecrease/newInventory/details/${record.checkBillNo}`}}>{text}</Link></span>
        }
      },
      {
        title: '状态',
        dataIndex: 'checkStatusName',
        width: 112,
      },
      {
        title: '盘点类型',
        dataIndex: 'checkBillTypeName',
        width: 168,
      },
      {
        title: '盘点子类型',
        dataIndex: 'checkBillSubTypeName',
        width: 168,
      },
      {
        title: '部门',
        dataIndex: 'checkBillDeptName',
        width: 168,
      },
      {
        title: '盘点责任人',
        dataIndex: 'sheveUserName',
        width: 112,
      },
      {
        title: '制单时间',
        dataIndex: 'createDate',
        width: 224,
      },
      {
        title: '盘点时间',
        dataIndex: 'checkTime',
        width: 224,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        width: 280,
      }
    ];
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.makingTime;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
        <SearchFormWarp
          status={status}
          types={types}
          formProps={{...this.props}} 
        />
        <div>
          <Button type='primary' onClick={this.newAdd}><Icon type="plus" />新建</Button>
          <Button loading={deleteLoadig} style={{ margin: '0 8px' }} onClick={this.delete}>删除</Button>
          <Button onClick={this.export}>导出</Button>
        </div>
        <RemoteTable 
          onChange={this._tableChange}
          query={query}
          url={common.CHECKBILL_LIST}
          columns={columns}
          rowKey={'id'}
          ref="table"
          scroll={{x: 1784}}
          style={{marginTop: 20}}
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            },
            getCheckboxProps: record => ({
              disabled: record.checkStatus !== 1
            }),
          }}
        />
        <Modal
          visible={this.state.visible}
          title="新增盘点"
          onOk={this.handleOk}
          onCancel={() => this.setState({ visible: false })}
          footer={[
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>确认</Button>,
            <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>
          ]}
        >
          <Form>
            <Row>
              <Col span={24}>
                <FormItem label={'类型'} {...formItemLayoutAdd}>
                  {getFieldDecorator('checkBillType', {
                    rules: [{ required: true, message: '请选择类型' }]
                  })(
                    <RadioGroup>
                      {this.radioRender(types)}
                    </RadioGroup>
                  )}
                  
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label={'子类型'} {...formItemLayoutAdd}>
                  {getFieldDecorator('checkBillSubType', {
                    rules: [{ required: true, message: '请选择子类型' }]
                  })(
                    <RadioGroup onChange={(e) => this.setState({ subType: e.target.value })}>
                      {this.radioRender(subTypes)}
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              {
                subType === '3' ?
                  <Col span={24}>
                    <FormItem label={'起始时间'} {...formItemLayoutAdd}>
                      {getFieldDecorator('checkStartTime', {
                        rules: [{ required: true, message: '请选择起始时间' }],
                        initialValue: moment(new Date(), moment().format('YYYY-MM-DD 00:00'))
                      })(
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm"
                        />
                        )
                      }
                    </FormItem>
                  </Col> 
                  : 
                  null
              }
              <Col span={24}>
                <FormItem label={'备注'} {...formItemLayoutAdd}>
                  {getFieldDecorator('remarks')(
                    <Input style={{ width: 280 }} />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default connect(state=>state)(Form.create()(NewInventory));