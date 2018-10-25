/*
 * @Author: gaofengjiao  补登单据 
 * @Date: 2018-08-06 17:40:15 
* @Last Modified time: 17:40:15 
 */
import React, { PureComponent } from 'react';
import { Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { supplementDoc } from '../../../../api/pharmacy/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
class Putaway extends PureComponent{

  state = {
    selected: [],
    selectedRows: [],
    query:{
      makeupType: 3,
      type: 2
    }
  }

  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }


  //显示异常弹窗
  showAbnormalModal = () => {
    this.setState({
      abnormalVisible: true,
    });
  }
  //异常单弹窗取消
  abnormalCancel = () => {
    this.setState({ 
      abnormalVisible: false, 
      modalSelected: [],
      modalSelectedRows: [],
      abnormalQuery: {
        ...this.state.abnormalQuery,
        hisBackNo: ''
      },
    });
  }
  //异常确认添加
  handleAbnormalOk = () => {
    const { modalSelectedRows } = this.state;
    const {dispatch} = this.props;
    if(modalSelectedRows.length === 0) {
      return message.warning('至少选择一条信息');
    };
    dispatch({
      type: 'base/submitBadFlowList',
      payload: {
        dispensingNo: modalSelectedRows[0].dispensingNo,
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            abnormalVisible: false,
            modalSelected: [], 
            modalSelectedRows: []
          });
          this.refs.infoTable.fetch();
        }else {
          message.error(msg);
        }
      }
    })
  }
  render(){
    let query = this.props.base.queryConditons;
    query = {...query, ...this.state.query};
    delete query.key;
    const columns = [
      {
        title: '状态',
        width: 168,
        dataIndex: 'makeupStatusName',
      },
      {
        title: '发药单编号',
        width: 168,
        dataIndex: 'storeCode',
      },
      {
        title: '补登单号',
        width: 168,
        dataIndex: 'makeupCode',
      },
      {
        title: '操作',
        width: 68,
        dataIndex: 'RN',
        render: (text, record) => <Link to={{pathname: `/pharmacy/supplementDoc/exceptionHandling/detail/${record.makeupCode}`}}>详情</Link>
      },
    ];
    return (
      <div className='ysynet-main-content'>
        <div className='ant-row-bottom'>
          <Button type='primary' onClick={this.showAbnormalModal} >批量发送</Button>
        </div>
        <RemoteTable
          scroll={{x: 960}}
          columns={columns}
          onChange={this._tableChange}
          query={query}
          rowKey={'id'}
          ref="infoTable"
          style={{marginTop: 20}}
          url={supplementDoc.makeList}
        />
      </div>
    )
  }
}
export default connect(state=>state)(Putaway);
