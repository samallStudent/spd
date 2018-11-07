/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 补货管理--补货计划
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, DatePicker, message, Select, Spin } from 'antd';
import { Chart, Axis, Geom, Tooltip, Guide, Legend } from 'bizcharts';
import moment from 'moment';
import { connect } from 'dva';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const {Option} = Select;
const Text = Guide.Text;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  },
};


class SearchForm extends PureComponent{
  state = {
    supplierList: []
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
    dispatch({
      type: 'statistics/supplierAll',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            supplierList: data
          });
          this.setDetailValues(data[0].ctmaSupplierCode)
          this.getData({
            supplierCodeList: [data[0].ctmaSupplierCode],
            startTime: moment().subtract(6, 'months').format('YYYY-MM-DD'),
            endTime: moment().format('YYYY-MM-DD')
          });
        }else {
          message.error(msg);
        }
      }
    });
  }
  getData = (payload) => {
    const {dispatch} = this.props.formProps;
    dispatch({
      type: 'statistics/settleStaticsList',
      payload,
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.props.setData(data)
        }else {
          message.error(msg);
        };
      }
    });
  }
  setDetailValues = (supplierCodeList) => {
    const {setFieldsValue} = this.props.form;
    setFieldsValue({
      supplierCodeList,
      closeDate: [moment().subtract(6, 'months'), moment()]
    });
  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const closeDate = values.closeDate === undefined ? '' : values.closeDate;
        if (closeDate.length > 0) {
          values.startTime = closeDate[0].format('YYYY-MM-DD');
          values.endTime = closeDate[1].format('YYYY-MM-DD');
        }else {
          values.startTime = '';
          values.endTime = '';
        };
        this.getData({
          supplierCodeList: [values.supplierCodeList],
          startTime: values.startTime,
          endTime: values.endTime
        });
      }
    })
  }
  export = () => {
    const {dispatch} = this.props.formProps;
    const {getFieldsValue} = this.props.form;
    const {closeDate, supplierCodeList} = getFieldsValue();
    let payload = {};
    if(closeDate !== undefined && closeDate.length === 0) {
      payload.startTime = closeDate[0];
      payload.endTime = closeDate[1];
    }else {
      payload.startTime = '';
      payload.endTime = '';
    };
    payload.supplierCodeList = [supplierCodeList];
    dispatch({
      type: 'statistics/staticsExport',
      payload
    })
  }
  //重置
  handleReset = () => {
    const {supplierList} = this.state;
    this.setDetailValues(supplierList[0].ctmaSupplierCode);
    this.getData({
      supplierCodeList: [supplierList[0].ctmaSupplierCode],
      startTime: moment().subtract(6, 'months').format('YYYY-MM-DD'),
      endTime: moment().format('YYYY-MM-DD')
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { supplierList } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCodeList`)(
                  <Select
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                  {
                    supplierList.map(item => (
                      <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                    ))
                  }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`结算时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker allowClear={false} className={'ysynet-formItem-width'}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
         </Col>
        </Row>
        <div>
          <Button onClick={this.export} style={{marginLeft: 42}}>导出</Button>
        </div>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class SettlementAnalysis extends PureComponent {
  state = {
    data: [],
    spinning: true
  }
  setData = (data) => {
    this.setState({
      data,
      spinning: false
    });
  }
  
  render() {
    const { data, spinning } = this.state;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
          setData={this.setData}
        />
        <h2 style={{textAlign: 'center'}}>供应商结算分析（单位：万元）</h2>
        <div style={{marginTop: 20}}>
          <Spin spinning={spinning}>
            <Chart 
              height={400} 
              data={data} 
              forceFit
              padding={[ 20, 60, 60, 60]}
            >
              <Guide>
                <Legend
                  custom={true}
                  allowAllCanceled={false}
                  items={[
                    {
                      value: "结算金额",
                      marker: {
                        symbol: "circle",
                        fill: "#3182bd",
                        radius: 5
                      }
                    }
                  ]}
                />
                <Text
                  top={true}
                  position={ ['0%','0%'] }  // 文本的起始位置，值为原始数据值，支持 callback
                  content= {'结算金额'} // 显示的文本内容
                  style= {{
                    fontSize: '12', // 文本大小
                  }}
                />
                <Text
                  top={true}
                  position={ ['98%','97%'] }  // 文本的起始位置，值为原始数据值，支持 callback
                  content= {'日期'} // 显示的文本内容
                  style= {{
                    fontSize: '12', // 文本大小
                  }}
                />
              </Guide>
              <Axis name="settleDate"/>
              <Axis name="settleSumAmount"/>
              <Tooltip />
              <Geom 
                type="line" 
                position="settleDate*settleSumAmount" 
                size={2} 
                tooltip={['settleDate*settleSumAmount', (settleDate, settleSumAmount)=>{
                  return {
                    name: '结存金额(万元)',
                    value: settleSumAmount
                  }
                }]}
              />
              <Geom
                type="point"
                tooltip={['settleSumAmount*settleDate', (settleDate, settleSumAmount)=>{
                  return {
                    name: '日期',
                    value: settleDate
                  }
                }]}
                position="settleDate*settleSumAmount"
                size={4}
                shape={"circle"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
              />
            </Chart>
          </Spin>
        </div>
      </div>
    )
  }
}
export default connect(state => state)(SettlementAnalysis);