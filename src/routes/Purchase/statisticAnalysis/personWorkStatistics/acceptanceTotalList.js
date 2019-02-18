import React,{PureComponent} from "react";
import { Form, Row, Col, Button, Input, Icon, DatePicker,Tooltip,Select } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';
const Option = Select.Option;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    md: {span: 8}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: {span: 16}
  },
};

class OrderRetrospect extends PureComponent {
  _tableChange = values => {

    //当table 变动时修改搜索条件
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
    console.log(values)
  }
  render() {
    const {match} = this.props;
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'ctmmgenericname',
        width: 270,
      },

      {
        title: '规格',
        dataIndex: 'ctmmspecification',
        width: 200
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 112,
      },
      {
        title: '操作前库存数量',
        dataIndex: 'storenum',
        width: 120,
      },

      {
        title: '操作数量',
        dataIndex: 'quantiry',
        width: 100,
      },
      {
        title: '操作后结存',
        dataIndex: 'balance',
        width: 100,
      },
    ];
    let query = {
        userid:this.props.match.params.userid
    }
    return (
      <div className='ysynet-main-content'>
        <RemoteTable
          query={query}
          scroll={{x: '100%', y: 400}}
          isJson
          columns={columns}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={tracingTotalList.GET_Checkaccept_Details}
        />
      </div>
    )
  }
}
export default connect(state => state)(OrderRetrospect);

