/* 
  精细化平台 Tab
*/
import React, { PureComponent } from 'react';
import { Input, Switch } from 'antd';
import RemoteTable from '../../../components/TableGrid';
import EditableCell from '../../../components/EditableCell';
import ysy from '../../../api/ysy'
import { connect } from 'dva';
const { Search } = Input;
const openTilte = '是否确认开启此状态?';
// const closeTitle = '是否确认关闭此状态?';
class Refine extends PureComponent{
  state = {
    title: openTilte,
    isopen: false,
  }
  onCellChange = (value,record,) => {
    let values = {};
    values.menuId = record.menuId;
    values.tfRemark = value;
    this.props.dispatch({
      type: 'menu/modifyMenu',
      payload: values,
      callback: () => this.refs.table.fetch()
    })
  }
  render(){
    const columns = [{
      title: '菜单名称',
      width: '20%',
      dataIndex: 'menuName'
    },{
      title:'菜单编号',
      width: '20%',
      dataIndex: 'menuId'
    },{
      title:'路径',
      width: '20%',
      dataIndex: 'url'
    },{
      title:'状态',
      dataIndex: 'fstate',
      width: 100,
      render:(text,record) =>{
        return (
        // <Popconfirm title={this.state.isopen ? '是否确认开启此状态':'是否确认关闭此状态?'} okText="是" cancelText="否">
            <Switch  
              checkedChildren="开" unCheckedChildren="关"
              defaultChecked={text === '01' ? true: false}
              onFocus={(e)=>console.log(e.target.checked)}
              onChange={(checked)=>console.log(checked,'checked')}
              /* onChange={(e)=>{
                this.setState({ isopen:this.state.isopen })
              }} */
            />
        // </Popconfirm>
        )
      }
    },{
      title:'备注',
      dataIndex: 'tfRemark',
      width: 280,
      render: (text,record,index)=>{
        return (
          <EditableCell
            value={ text }
            record={record}
            index={index}
            max='250'
            cb={(record)=>this.setState({ record })}
            onEditChange={(index,record,editable)=>this.onCellChange(index, record, editable)}
          />
        )
      }
    }]

    return (
    <div>
      <Search 
        style={{ width: 300,marginBottom: 24 }}
        placeholder='请输入菜单名称/路径/编号'
        onSearch={value=> this.refs.table.fetch({ searchName: value })}
      />
        <RemoteTable 
          ref='table'
          url={ysy.QUERYMENULIST}
          size={'small'}
          scroll={{ x: '100%' }}
          columns={columns}
          rowKey={'menuId'}
          showHeader={true}
        />
    </div>
    )
  }
}
export default connect(state => state)(Refine);