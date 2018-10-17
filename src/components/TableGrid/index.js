import React, { Component } from 'react';
import { Table, message } from 'antd';
import querystring from 'querystring';
import { objCompare } from '../../utils/utils'
// import request from '../../utils/request';
class RemoteTable extends Component {
  constructor(props) {
    super(props)
    this.defaultPageSize = window.screen.height >= 1080 ? 20 : 10;
    
    this.state = {
      data: [],
      pagination: {},
      loading: false,
      searchParams: {}
    }
  };
  componentDidMount() {
    this.fetch();
  }
  componentWillReceiveProps = (nextProps) => {
    if ((nextProps.url !== this.props.url) || 
      (typeof nextProps.query === 'string' ? nextProps.query !== this.props.query : !objCompare(nextProps.query, this.props.query))) {
        this.fetch(nextProps.query, nextProps.url)
    };
    if(typeof this.props.cb !== typeof nextProps.cb && typeof nextProps.cb === 'function') {
      nextProps.cb(this.state.data);
    };
  }
  
  handleTableChange = (pagination, filters, sorter) => {
    const {onChange} = this.props;  
    const pager = this.state.pagination;
    
    pager.pageSize = pagination.pageSize;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const postData = Object.assign({}, this.state.searchParams, {
      pageSize: pagination.pageSize,
      pageNo: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
    if (onChange && typeof onChange === 'function') {
      onChange({
        ...postData
      })
    }else {
      this.fetch(postData);
    }
  }
  fetch = (params = {...this.props.query}, url = this.props.url,catchData={...this.props.catchData}) => {
    this.setState({loading: true, searchParams: params });
    this.props.fetchBefore && this.props.fetchBefore();
    if(url){
      let pagination = this.state.pagination;
      pagination.current = params.pageNo ? params.pageNo : pagination.pageNo;
      pagination.pageSize = params.pageSize ? params.pageSize : pagination.pageSize;
      let dataMethod, contentType;
      if(this.props.isJson) {
        dataMethod = JSON.stringify;
        contentType = 'application/json';
      }else {
        dataMethod = querystring.stringify;
        contentType = 'application/x-www-form-urlencoded';
      }
      const body = dataMethod({
        pageSize: pagination.pageSize ?  pagination.pageSize : ( this.props.pagesize || this.defaultPageSize ),
        ...params,
        ...catchData
      });
      let bodyProps={
        headers: {
          'Content-Type': 'application/json'
        },
      }
      if(!this.props.method ||this.props.method ==='post'||  this.props.method ==='POST'){
        
         bodyProps={
          body:body,
          headers: {
            'Content-Type': contentType
          },
        }
      }
      
      fetch(url,{
        method: this.props.method || 'post',
        mode: 'cors',
        credentials: 'include',
        ...bodyProps
      }).then(res => res.json())
        .then((data)=> {
          if(data.code !== 200){
            this.setState({ loading: false })
            return message.error(data.msg);
          }
          pagination.total = data.data.count;
          pagination.showSizeChanger = true;
          pagination.pageSizeOptions=['10','20','30'];
          pagination.showQuickJumper = true;
          pagination.showTotal=(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`;
          pagination.pageSize = pagination.pageSize ?  pagination.pageSize : ( this.props.pagesize || this.defaultPageSize );
          
          if(!params.pageNo) {
            pagination.current = 1;
          }
          this.setState({
            loading: false,
            data: data.data.list || (Array.isArray(data.data.list) ? data.data.list : (Array.isArray(data.data) ? data.data : []) ) ,
            // fieldName: data.result.fieldName,
            pagination,
          });
          if (typeof this.props.cb === 'function') {
            this.props.cb(data.data.list, data.data);
          }
          if (typeof this.props.getTotal === 'function') {
            this.props.getTotal(data.data);
          }
        })
        .catch((error) => {
          if (error.code) {
            message.error('出错啦！！');
          }
        })
    }
    else{
      this.setState({
        loading: false,
        data: []
      })
    }
  }
  render () {
    const { columns, rowKey, rowClassName, 
            rowSelection, scroll, footer,showHeader,title } = this.props; 
    return (
      <Table 
        {...this.props}
        onRow={this.props.onRow || null}
        style={this.props.style}
        columns={columns || null}
        rowKey={rowKey}
        bordered={true}
        size={this.props.size || 'small'}
        dataSource={this.props.data || this.state.data}
        loading={this.props.loading || this.state.loading}
        pagination={this.state.pagination}
        onChange={this.handleTableChange}
        rowClassName={rowClassName}
        title={title || null}
        showHeader={showHeader || true }
        rowSelection={rowSelection || null}
        scroll={scroll || { x: '1300px' }}
        footer={footer || null}
        expandedRowRender={this.props.expandedRowRender}
      />
    )
  }
}

export default RemoteTable;