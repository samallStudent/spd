/*
 * @Author: gaofengjiao  补登单据 
 * @Date: 2018-08-06 17:40:15 
* @Last Modified time: 17:40:15 
 */
import React, { PureComponent } from 'react';
import { Button, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { supplementDoc } from '../../../../api/pharmacy/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import { difference } from 'lodash';
// const {Search} = Input;
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
    if(modalSelectedRows.length > 1) {
      return message.warning('一次只能添加一条信息');
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
    const abnormalModalColumns = [
      {
        title: '发药单据编号',
        dataIndex: 'dispensingNo',
        width: 224
      },
      {
        title: '发药时间',
        dataIndex: 'dispensingDate',
        width: 224
      },
      {
        title: '药品品类数',
        dataIndex: 'drugCategories',
        width: 168
      },
      {
        title: '发药总数量',
        dataIndex: 'drugCount',
        width: 168
      },
    ];
    const {abnormalVisible} = this.state;
    return (
      <div className='ysynet-main-content'>
        <div className='ant-row-bottom'>
          <Button type='primary' onClick={this.showAbnormalModal} >选择异常发药出库单</Button>
        </div>
        <RemoteTable
          scroll={{x: '100%'}}
          isDetail={true}
          columns={columns}
          onChange={this._tableChange}
          query={query}
          rowKey={'id'}
          ref="infoTable"
          style={{marginTop: 20}}
          url={supplementDoc.makeList}
        />
        {/*选择异常发药出库单 - 弹窗*/}
        <Modal 
          bordered
          title={'异常发药出库单'}
          visible={abnormalVisible}
          width={1200}
          style={{ top: 20 }}
          destroyOnClose
          onCancel={this.abnormalCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleAbnormalOk}>确认</Button>,
            <Button key="back" onClick={this.abnormalCancel}>取消</Button>
          ]}
        >
          {/* <Row gutter={30}>
            <Col span={8}>
              <Search 
                placeholder="请输入退药入库单号搜索"
                onSearch={(value) => {
                  this.setState({
                    abnormalQuery: {
                      ...this.state.abnormalQuery,
                      hisBackNo: value
                    }
                  });
                }}
              />
            </Col>  
          </Row> */}
          <RemoteTable
            query={{}}
            url={supplementDoc.billFlowBadVoList}
            scroll={{x: '100%'}}
            style={{marginTop: 20}}
            columns={abnormalModalColumns}
            rowKey={'dispensingNo'}
            rowSelection={{
              selectedRowKeys: this.state.modalSelected,
              onChange: (selectedRowKeys, selectedRows) => {
                let {modalSelected, modalSelectedRows} = this.state;
                modalSelected = difference(selectedRowKeys, modalSelected);
                modalSelectedRows = difference(selectedRows, modalSelectedRows);
                if(modalSelected.length > 1) {
                  return message.warning('一次只能处理一张异常单据!');
                };
                this.setState({ modalSelected, modalSelectedRows });
              }
            }}
          />
        </Modal>
      </div>
    )
  }
}
export default connect(state=>state)(Putaway);
