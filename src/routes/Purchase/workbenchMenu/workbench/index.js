/**
 * @file 工作台
 */
import React, { Component } from 'react';

import { Row, Col, Icon, message, Spin, Tooltip } from 'antd';

import {connect} from 'dva';

import S from './index.css';

class Workplace extends Component {
  state={
    left: 0,
    leftVisibility: 'hidden',
    rightVisibility: 'hidden',
    itemWidth: 180,
    matterList: null,
    billsList: [],
    backlogLoading: true,
    billsLoading: false,
    initHeight: 96,
    activeIndex: 0,
    itemQuantity: 4
  };

  componentDidMount() {
    let itemQuantity,
        rightVisibility = '';
    let clientWidth = document.body.clientWidth;
    if(clientWidth >= 1200) {
      itemQuantity = 4;
    };
    if(clientWidth >= 992 && clientWidth < 1200) {
      itemQuantity = 3;
    };
    if(clientWidth >= 768 && clientWidth < 992) {
      itemQuantity = 2;
    };
    if(clientWidth < 768) {
      itemQuantity = 1;
    };
    let itemWidth,
        itemListWarpWidth = this.itemList.offsetWidth;
    itemWidth = (itemListWarpWidth - 24*itemQuantity) / itemQuantity;
    this.setState({
      itemWidth,
      itemQuantity
    });
    const {dispatch} = this.props;
    dispatch({
      type: 'workbench/purchaseConsoleList',
      payload: {},
      callback: ({data, code, msg}) => {
        if(code === 200) {
          if(data.length <= itemQuantity) {
            rightVisibility = 'hidden'
          };
          this.setState({
            matterList: data,
            backlogLoading: false,
            initHeight: '',
            rightVisibility
          });
          if(data.length) {
            this.setState({
              billsLoading: true
            });
            this.getBillsList(data[0].categoryCode);
          };
        }else {
          message.error(msg);
        }
      }
    })
  }
  getBillsList = (categoryCode) => {
    this.props.dispatch({
      type: 'workbench/commonConsoleDetail',
      payload: {
        categoryCode
      },
      callback: ({data, code, msg}) => {
        if(code === 200) {
          data = data.map(item => {
            item.createTime = item.createTime.split(' ');
            let data = item.createTime[0];
            let time = item.createTime[1];
            data = data.split('-');
            data.shift();
            time = time.split(':');
            time.pop();
            data = data.join('-');
            time = time.join(':');
            item.createTime = `${data} ${time}`;
            return item;
          });
          console.log(data)
          this.setState({
            billsList: [...data],
            billsLoading: false
          });
        }else {
          message.error(msg);
        };
      }
    })
  }
  rightScroll = () => {
    let {left, rightVisibility, leftVisibility, itemWidth, itemQuantity, matterList} = this.state;
    left -= (itemWidth + 24);
    let removableLeft = (matterList.length - itemQuantity) * (itemWidth + 24);
    if(left <= -removableLeft ) {
      rightVisibility = 'hidden';
    };
    if(left < 0) {
      leftVisibility = '';
    };
    this.setState({
      left,
      leftVisibility,
      rightVisibility
    });
  }

  leftScroll = () => {
    let {left, leftVisibility, rightVisibility, itemWidth} = this.state;
    left += (itemWidth + 24);
    if(left >= 0 ) {
      leftVisibility = 'hidden';
    };
    rightVisibility = '';
    this.setState({
      left,
      leftVisibility,
      rightVisibility
    });
  }

  toggleActive = (item, i) => {
    const {activeIndex} = this.state;
    if(i === activeIndex) return;
    this.setState({
      activeIndex: i,
      billsLoading: true
    });
    this.getBillsList(item.categoryCode);
  }
  render() {
    const {left, leftVisibility, rightVisibility, itemWidth, matterList, backlogLoading, initHeight, activeIndex, billsList, billsLoading} = this.state;
    const itemsWidth = matterList ? matterList.length ? (itemWidth + 24) * matterList.length : '100%' : 99999;
    return (
      <div style={{background: '#fff', margin: '-31px -32px', paddingTop: 12}}>
        <div>
          <h1 style={{fontSize: 26, margin: '20px 0px 40px 24px'}}>您好，今日的待办事项</h1>
          <div className={S['backlog-warp']}>
            <div style={{visibility: leftVisibility}} onClick={this.leftScroll} className={S['left-icon']}>
              <Icon type="left" />
            </div>
            <div ref={(item) => this.itemList = item} className={S['item-list-warp']}>
              {
                <Spin spinning={backlogLoading}>
                  <div style={{left, width: itemsWidth, height: initHeight}} className={S['item-list']}>
                    {
                      matterList && matterList.length ?                     
                      matterList.map((item, index) => (
                        <div 
                          onClick={this.toggleActive.bind(this, item, index)} 
                          key={item.categoryCode} 
                          style={{width: itemWidth}} 
                          className={`${index === activeIndex? S['item-active'] : ''} ${S['item']}`}
                        >
                          <div className={S['item-icon']}>
                            <img alt="" src={require(`../../../../assets/icon/icon_${item.iconName}.png`)}/>
                          </div>
                          <div className={S['item-text']}>
                            <p>{item.categoryName}</p>
                            <span>{item.count}</span>
                          </div>
                        </div>
                      )): (
                        <h3 style={{textAlign: 'center'}}>
                          <span style={{fontSize: 20, color: '#f2a11c'}}><Icon style={{paddingRight: 10}} type="frown" />暂无待办事项</span>
                        </h3>
                      )
                    }
                  </div>
                </Spin>
              }
            </div>
            <div style={{visibility: rightVisibility}} onClick={this.rightScroll} className={S['right-icon']}>
              <Icon type="right" />
            </div>
          </div>
        </div>
        <Row style={{padding: '0 24px', margin: '24px 0 16px'}}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              paddingBottom: 15,
              borderBottom: '2px solid #f2a11c',
            }}
          >最新单据</span>
        </Row>
        <Spin spinning={billsLoading}>
          <Row 
            gutter={10}
            style={{
              background: '#f0f2f5',
              padding: '20px 20px 0',
              minHeight: `${matterList && matterList.length ? 'calc(100vh - 380px)' : 'calc(100vh - 325px)'}`
            }}
          >
            {
              billsList.length ? 
              billsList.map((item, i) => (
                <Col
                  key={i}
                  style={{
                    marginBottom: 16,
                  }}
                  xl={6}
                  lg={8}
                  md={12}
                  sm={24}
                >
                  <div className={S['card-item-info']}>
                    <div className={S['item-odd-status']}>
                      <span className={S['item-odd']}>
                        <Tooltip title={item.numberNo} placement='bottom'>
                          {item.numberNo}
                        </Tooltip>
                      </span>
                      <span className={S['item-status']}>{item.statusName}</span>
                    </div>
                    <div className={S['item-module-date']}>
                      <span className={S['item-module']}>{item.typeName}</span>
                      <span className={S['item-date']}>{item.createTime}</span>
                    </div>
                  </div>
                </Col>
              )) : (
                <h3 style={{textAlign: 'center'}}>
                  <span style={{fontSize: 20, color: '#f2a11c'}}><Icon style={{paddingRight: 10}} type="frown" />暂无最新单据</span>
                </h3>
              )
            }
          </Row>
        </Spin>
      </div>
    )
  }
}

export default connect(state=>state)(Workplace);