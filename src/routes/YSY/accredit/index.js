import React, { PureComponent } from 'react';
import { List, Input, Button, Spin, Menu, Row, Col, Modal, message  } from 'antd';
import { connect } from 'dva';
const { Search } = Input;
class Accredit extends PureComponent{
  componentWillMount = () =>{
    this.genDeployList();
  }
  genDeployList = (value) =>{
    this.props.dispatch({
      type: 'accredit/deployList',
      payload: { searchLike: value ? value: '' }
    });
  }
  onSearch = (value) =>{
    this.genDeployList(value);
  }
  handleClick = (e) => {
    let deployId = e.item.props.deployid;
    let { dataSource } = this.props.accredit;
    let target = dataSource.filter(item=> item.deployId === deployId)[0];
    // 同步显示右侧部署信息
    this.props.dispatch({
      type: 'accredit/showTargetDetail',
      payload: target
    });
    let orgId = e.key;
    let deployName = e.item.props.deployname;
    // 异步获取授权子系统
    if(deployId && deployName){
      console.log('subMenu','子系统授权');
      this.props.dispatch({
        type: 'accredit/searchSubSystemList',
        payload: { deployId: deployId, orgId: orgId }
      })
    }else{
      console.log('main','部署授权')
      this.props.dispatch({
        type: 'accredit/searchSubSystemList',
        payload: { deployId: deployId }
      })
    }
  }
  edit = () =>{
    if(this.props.accredit.selectedSystem.deployId){
      this.props.dispatch({
        type: 'accredit/showModal',
        payload: {}
      })
    }else{
      message.warning('请选择一个部署或子系统')
    }
  }
  flagChange = (item) =>{
    let { relFlag, synFlag } = item;
    if(relFlag === '01'&& synFlag === '01'){
      return;
    }
    this.props.dispatch({
      type: 'accredit/flagChange',
      payload: item
    })
  }
  modifySystem = () =>{
    const { modalSubSystemList,selectedSystem } = this.props.accredit;
    let subSystemIds = [];
    modalSubSystemList.map(item => {
      if(item.relFlag === '01'){
        subSystemIds.push(item.subSystemId);
      }
      return null;
    });
    let values = { ...selectedSystem };
    values.subSystemIds = subSystemIds; 
    console.log(values,'values')
    this.props.dispatch({
      type: 'accredit/modifySubSystem',
      payload: values
    })
  }
  render(){
    const { dataSource, loading, subLoading, baseData, subSystemList, modalSubSystemList, visible,dirtyClick } = this.props.accredit;
    let relSubSystem = subSystemList.filter(item=> item.relFlag === '01');
    // console.log(selectedSystem,'selectedSystem')
    return (
      <div className='ysynet-siderMenu-noborder'>
        <div style={{ background: '#fff',display: 'flex' }}>
          <div style={{ background: '#fff',borderRight: 'dashed 1px #ccc',padding: '0 10px' }}>
            <Search 
              style={{ marginBottom: 16 }}
              placeholder='部署/机构名称'
              onSearch={this.onSearch}
            />
            <Spin spinning={loading}>
              <List
                itemLayout='vertical'
                dataSource={dataSource}
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                  },
                  size: 'small',
                  pageSize: 1,
                }}
                renderItem={item=>(
                    <Menu
                      mode="inline"
                      onClick={this.handleClick}
                    >
                      <Menu.Item deployid={item.deployId} key={item.orgId}>
                        <span style={{ fontWeight: 'bold' }}> { item.deployName } </span>
                      </Menu.Item>
                      {
                        item.orgList.length
                        &&
                        item.orgList.map((menu,index)=>{
                          return <Menu.Item className='ysysnet-accredit-subMenu' 
                            parentorgid={item.orgId} 
                            deployid={item.deployId}
                            deployname={item.deployName} 
                            key={menu.orgId}>{menu.orgName}
                          </Menu.Item>
                        })
                      }
                    </Menu>
                )
                }
              >
              </List>
            </Spin>
          </div>
          <div style={{ padding: '0 16px',flex: 1 }}>
            <div>
              <h3>部署信息</h3>
                <Row style={{ padding: '0 20px' }}>
                  <Col className="ant-col-8">
                    <div className="ant-row">
                      <div className="ant-col-6 ant-form-item-label-left-left">
                        <label>部署名称</label>
                      </div>
                      <div className="ant-col-15">
                        <div className="ant-form-item-control">
                          { baseData.deployName ? baseData.deployName: '' }
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col className="ant-col-8">
                    <div className="ant-row">
                      <div className="ant-col-6 ant-form-item-label-left-left">
                        <label>授权码</label>
                      </div>
                      <div className="ant-col-15">
                        <div className="ant-form-item-control">
                          { baseData.keyCode ? baseData.keyCode: ''  }
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col className="ant-col-8">
                    <div className="ant-row">
                      <div className="ant-col-8 ant-form-item-label-left-left">
                        <label>授权有效期</label>
                      </div>
                      <div className="ant-col-15">
                        <div className="ant-form-item-control">
                          { baseData.usefulDate ? baseData.usefulDate: ''  }
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col className="ant-col-8">
                    <div className="ant-row">
                      <div className="ant-col-8 ant-form-item-label-left-left">
                        <label>最后编辑时间</label>
                      </div>
                      <div className="ant-col-15">
                        <div className="ant-form-item-control">
                          { baseData.modifyTime ? baseData.modifyTime: ''  }
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex',justifyContent: 'space-between' }}>
                  <h3>授权子系统</h3>
                  <Button type='primary' onClick={this.edit} style={{ marginRight: 16 }}>编辑</Button>
                </div>
                <Spin spinning={subLoading} style={{ marginTop: 24 }}>
                  {
                    relSubSystem.length ?
                    <List
                      style={{ marginTop: 24 }}
                      className='ysy-accredit-list'
                      grid={{ gutter: 16, column: 4 }}
                      dataSource={relSubSystem}
                      renderItem={item => (
                        <List.Item>
                          <div className='ysy-accredit-card'>
                              <img src={require('../../../assets/ysyFlag.png')} alt='flag' style={{ width: 38,height: 45 }}/>
                              <p style={{ marginTop: 12 }}>{ item.subSystemName}</p>
                          </div>
                        </List.Item>
                      )}
                    />
                    :
                    <div style={{ textAlign: 'center',marginTop: 16 }}>暂无数据</div>
                  }
                </Spin>
                <Modal
                  visible={visible}
                  onCancel={()=>this.edit()}
                  title='编辑'
                  width={726}
                  footer={[
                    <Button key="submit" type='primary' loading={dirtyClick} onClick={this.modifySystem}>
                        确认
                    </Button>,
                    <Button key="back"  type='default' onClick={()=>this.edit()}>取消</Button>
                  ]}
                >
                  <List
                    style={{ marginTop: 24 }}
                    className='ysy-accredit-list'
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={modalSubSystemList}
                    renderItem={item => (
                      <List.Item>
                        <div className='ysy-accredit-card' onClick={()=>this.flagChange(item)}>
                          <img src={require('../../../assets/ysyFlag.png')} alt='flag' style={{ width: 38,height: 45 }}/>
                          <p style={{ marginTop: 12 }}>{ item.subSystemName}</p>
                          {
                            (item.relFlag === '01' && item.synFlag === '01')
                            ?
                            <div className='ysy-triangle ysy-triangle-disabled'></div>
                            :
                            item.relFlag === '01'?
                            <div className='ysy-triangle'></div>
                            :
                            null
                          }
                        </div>
                      </List.Item>
                    )}
                  />
                </Modal>
              </div>
          </div>
        </div>
      </div>
    )
  }
}
export default connect(state =>  state)(Accredit);