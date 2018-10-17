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
import { Form, Row, Col, Button, Input, DatePicker } from 'antd';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { connect } from 'dva';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const closeDate = values.closeDate === undefined ? '' : values.closeDate;
        if (closeDate.length > 0) {
          values.settleStartTime = closeDate[0].format('YYYY-MM-DD');
          values.settleEndTime = closeDate[1].format('YYYY-MM-DD');
        }else {
          values.settleStartTime = '';
          values.settleEndTime = '';
        };
      }
    })
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierName`)(
                  <Input placeholder='请输入' className={'ysynet-formItem-width'}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`结算时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker className={'ysynet-formItem-width'}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
         </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class SettlementAnalysis extends PureComponent {
  state = {
    data: []
  }
  setData = (data) => {
    this.setState({
      data
    });
  }
  export() {
    
  }
  
  render() {
    const data = [
      { time: '10:10', waiting: 2, people: 2},
      { time: '10:15', waiting: 6, people: 3},
      { time: '10:20', waiting: 2, people: 5},
      { time: '10:25', waiting: 9, people: 1},
      { time: '10:30', waiting: 2, people: 3},
      { time: '10:35', waiting: 2, people: 1},
      { time: '10:40', waiting: 1, people: 2}
    ];
    const scale = {
      people: {
        min: 0
      },
      waiting: {
        min: 0
      }
    }
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
          setData={this.setData}
        />
        <div>
          <Button onClick={this.export} style={{marginLeft: 42}}>导出</Button>
        </div>
        <div style={{marginTop: 20}}>
          <Chart 
            height={400} 
            scale={scale} 
            forceFit 
            data={data} 
            padding={[ 20, 30, 60, 30]}
          >
            <Legend
              custom={true}
              clickable={false}
              items={[
                { value: '结存金额(万元)', marker: {symbol: 'circle', fill: '#3182bd', radius: 5} },
                { value: '库房结存数量', marker: {symbol: 'circle', fill: '#ffae6b', radius: 5} }
              ]}
            />
            <Axis
              name="people"
              label={{
                textStyle:{
                  fill: '#fdae6b'
                }
              }}
            />
            <Tooltip />
            <Geom 
              type="interval" 
              position="time*waiting" 
              size={30} 
              color="#3182bd"
              tooltip={['time*waiting', (time, waiting)=>{
                return {
                  name: '结存金额(万元)',
                  value: waiting
                }
              }]}
            />
            <Geom
              type="line" 
              position="time*people" 
              color="#fdae6b" 
              size={3} 
              shape="smooth" 
            />
            <Geom 
              type="point" 
              position="time*people" 
              color="#fdae6b" 
              size={3} 
              shape="circle" 
            />
          </Chart>
        </div>
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(SettlementAnalysis));