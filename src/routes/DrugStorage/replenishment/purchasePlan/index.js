/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-07-31 13:40:21
 */

/**
 * @file 药库 - 补货管理--补货计划
 */
import React, { PureComponent } from 'react';
import { Form, Button, Table, message, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import SearchForm from '../commomSearchForm'
import { createData } from '../../../../common/data';

const WrapperForm = Form.create()(SearchForm);
class PurchasePlan extends PureComponent{
  state = {
    selected: [],
    selectedRows: [],
    loading: false,
    dataSource: createData()
  }
  delete = () =>{
    const dataSource = this.state.dataSource;
    const selected = this.state.selected;
    if (selected.length === 0) {
      message.warn('请至少选择一条数据')
    } else {
      this.setState({ loading: true });
      let result = [];
      dataSource.map( (item, index) => {
        const a = selected.find( (value, index, arr) => {
        return value === item.id;
        })
        if (typeof a === 'undefined') {
            return result.push(item)
        }
        return null;
    })
      setTimeout(()=>{
        this.setState({dataSource: result,loading: false,selected:[],selectedRows: []});
      },500)
    }
  }
  render(){
    const columns = [{
      title: '计划单号',
      dataIndex: 'planNo',
      width: 180,
      render: (text,record) =>{
        return <span>
          <Link to={{pathname: `/drugStorage/replenishment/purchasePlan/detail`}}>{text}</Link>
        </span>  
      }
    },{
      title: '状态',
      dataIndex: 'fstate',
      render: (text,record) =>{
        if(text === '00'){
          return '待确认'
        }else if( text === '01' ){
          return '采购中'
        }else if(text === '09'){
          return '已驳回'
        }else{
          return ''
        }
      }
    },{
      title: '类型',
      dataIndex: 'planType'
    },{
      title: '制单人',
      dataIndex: 'createUser'
    },{
      title: '制单时间',
      dataIndex: 'planTime'
    },{
      title: '申请单号',
      dataIndex: 'applyNo'
    },{
      title: '收货地址',
      dataIndex: 'tfAddress',
      width: 270,
      className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
    },{
      title: '驳回原因',
      dataIndex: 'planReject'
    }];
    return (
      <div className='ysynet-main-content'>
         <WrapperForm />
         <div className='ant-row-bottom'>
            <Button type='primary' onClick={()=>this.props.history.push({ pathname: `/drugStorage/replenishment/purchasePlan/add` })}>新建采购计划</Button>
            <Button type='default' onClick={this.delete} style={{ marginLeft: 8 }}>删除</Button>
         </div>
         <Table 
          columns={columns}
          bordered
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          scroll={{ x: '130%' }}
          rowKey={'id'}
          pagination={{
            size: "small",
            showQuickJumper: true,
            showSizeChanger: true
          }}
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            }
          }}
         />
      </div>
    )
  }
}
export default PurchasePlan;