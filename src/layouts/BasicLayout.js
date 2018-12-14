import React, { PureComponent } from 'react';
import { Route, Switch, Redirect } from 'dva/router';
import { Layout, Icon, Row, Col, Tooltip, Menu, Dropdown, Spin, Affix, message } from 'antd';//Affix
import { connect } from 'dva';
import Profile from '../components/profile'
import SiderMenu from '../components/SiderMenu';
import { menuFormat } from '../utils/utils';
// import browser from 'browser';
import styles from './style.css';
const { Header, Content, Sider } = Layout;
class BasicLayout extends PureComponent {
  state = {
    collapsed: false,
    title: '',
    hasDept: true,
    pathname: '',
    deptId: [this.props.users.currentDept.deptId]
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.users.currentDept.deptId !== nextProps.users.currentDept.deptId) {
      this.setState({
        deptId: [nextProps.users.currentDept.deptId],
      });
    }
  }
  componentWillMount = () =>{
    let { dispatch, users } = this.props;
    let { userInfo } = users;
    if(!userInfo.id && !userInfo.loginName){
      this.setState({hasDept: false});
      dispatch({
        type: 'users/userLogin',
        payload: { refresh: true },
        callback: (data) =>{
          if(data.deptInfo && data.deptInfo.length){
            let deptInfo = data.deptInfo;
            let { menuList } = deptInfo[0];
            let tree = menuFormat(menuList,true,1);
            const urlParams = new URL(window.location.href);
            const id = urlParams.searchParams.get('depeId');
            const filterDeptInfo = deptInfo.filter(item => item.deptId === id);
            const deptName = filterDeptInfo[0].deptName;
            if(filterDeptInfo.length === 0) {
              message.error('该部门不存在，请勿直接修改地址栏')
              this.props.history.go(-1);
            };
            if(id && deptName) {
              console.log('刷新');
              dispatch({
                type: 'users/setCurrentDept',
                payload: { id, deptName },
                callback: () => {
                  this.setState({
                    hasDept: true
                  });
                  let currMenuList = filterDeptInfo[0].menuList;
                  let tree = menuFormat(currMenuList, true, 1 );
                  let menu = tree[0].children[0];
                  dispatch({
                    type: 'users/setCurrentMenu',
                    payload: { menu : menu }
                  });
                }
              });
            }else {
              console.log('登录');
              dispatch({
                type: 'users/setCurrentMenu',
                payload: { menu : tree[0].children[0] },
              });
              this.setState({
                hasDept: true
              });
            };
          }
        }
      })
    }
  }
  componentDidMount = () => {
    this.unListen = this.props.history.listen(({pathname}) => {
      const [deptId] = this.state.deptId;
      pathname = pathname.split('/');
      if(pathname.length > 2) {
        pathname.length = 4;
      };
      pathname = pathname.join('/');
      if(!this.props.users.userInfo.deptInfo) return;
      const {deptInfo} = this.props.users.userInfo;
      const currentMenuList = deptInfo.filter(item => item.deptId === deptId)[0].menuList;
      const routerJurisdiction = currentMenuList.some(item => item.href === pathname);
      if(!routerJurisdiction && pathname !== '/error' && pathname !== '/login') {
        this.props.history.replace('/error');
      };
    });
  }
  componentWillUnMount = () => {
    if(this.unListen && typeof this.unListen === 'function') {
      this.unListen();
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  handleClick = (e) =>{
    let { dispatch, users } = this.props;
    if(e.key === this.state.deptId[0]) return;
    let { deptInfo } = users.userInfo;
    let currMenuList = deptInfo.filter(item => item.deptId === e.key)[0].menuList;
    let tree = menuFormat(currMenuList, true, 1 );
    let menu = tree[0].children[0];

    // menu.children[0].children[0].href = menu.children[0].children[0].href.split('/');
    // menu.children[0].children[0].href.splice(2, 0, e.key);
    // menu.children[0].children[0].href = menu.children[0].children[0].href.join('/');

    // if(menu.children[0].children[0].href === this.props.location.pathname) {      //如果切换时路由相同，必须重新渲染
    //   this.setState({
    //     hasDept: false
    //   });
    // // }
    // window.sessionStorage.setItem('key', e.key);
    // window.sessionStorage.setItem('deptName', e.item.props.children);
    let pathnameArr = window.location.href.split('#');
    pathnameArr[1] = menu.children[0].children[0].href;
    let href = window.location.href;
    href = href.split('#');
    href[1] = menu.children[0].children[0].href;
    href = href.join('#');
    const urlParams = new URL(href);
    urlParams.searchParams.set('depeId', e.key);
    // window.history.pushState(null, '', urlParams.href);
    window.location.href = urlParams.href;
    dispatch({
      type: 'users/setCurrentDept',
      payload: { id: e.key, deptName: e.item.props.children },
      callback: () =>{
        // 切换子系统  清除查询条件并重置显示隐藏
        dispatch({
          type: 'base/clearQueryConditions'
        });
        dispatch({
          type: 'base/restoreShowHide'
        });
        dispatch({
          type: 'users/setCurrentMenu',
          payload: { menu : menu }
        });
        // if(menu.children[0].children[0].href !== this.props.location.pathname) {
          
          // history.push({
          //   pathname: menu.children[0].children[0].href,
          // });
        // }else {
        //   this.setState({
        //     hasDept: true
        //   });
        // }
      }
    })
  }
  
  menu = (list) => {
    let {deptId} = this.state;
    return (
      <Menu
        style={{
          maxHeight: 300, 
          overflow: 'auto'
        }}
        selectable
        onClick={this.handleClick}
        selectedKeys={deptId}
      >
      {
        list.map((item,index) =>{
          return <Menu.Item key={item.deptId} name={item.deptName} >{ item.deptName }</Menu.Item>
        })
      }
    </Menu>
    )
  }
  render() {
    const { getRouteData, location } = this.props;
    let { userInfo, currentDept, deptList } = this.props.users;
    const { title, hasDept } = this.state;
    let pathname = location.pathname.split('/');
    return (
      <Layout>
        {/* <Affix offsetTop={0}> */}

        <Affix offsetTop={0} className={`${styles.affix}`}>
          <Header className={`${styles.header}`}>
            <Row>
              <Col style={{ width: this.state.collapsed ? 80: 232 , float: 'left'}}>
                <div className='logoWrapper'>
                  <div className='logo'></div>
                </div>
              </Col>
              <Col span={4} style={{ paddingLeft: 16 }}>
                {
                  currentDept.deptId &&
                  <Dropdown overlay={this.menu(deptList)} trigger={['click']}>
                    <Tooltip title='子系统切换' placement='right'>
                      <a className="ant-dropdown-link">
                        {currentDept.deptName} <Icon type="down" style={{ marginLeft: 8 }}/>
                      </a>
                    </Tooltip>
                  </Dropdown>
                }
              </Col>
              <Col span={14} style={{textAlign: 'right', float: 'right'}}>
                <div className={styles.profile}>
                  {/* <div>
                    <Tooltip title="子系统切换">
                      <Icon type="sync" className={styles.icon} onClick={() => this.props.history.push({
                        pathname: '/subSystem'
                      })}/> 
                    </Tooltip>
                  </div> */}
                  <Profile userName={userInfo.name}/>
                </div>
              </Col>
            </Row>
          </Header>
        </Affix>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            width={232}
            collapsed={this.state.collapsed}
            className={styles.sider}
            style={{
              background: '#fff'
            }}
            >
            <SiderMenu 
              history={this.props.history}
              collapsed={this.state.collapsed}
              title={this.state.title}
              cb={(title)=> this.setState({ title })}
            />
            <div 
              onClick={this.toggle} 
              className={styles.triggerWrapp}
              style={{ width: this.state.collapsed ? 80: 232 }}
            >
              <Icon
                className={styles.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                />
            </div>
          </Sider>
          <Layout  style={{ marginLeft: this.state.collapsed ? 80: 232 }}>
            {/* </Affix> */}
            <Content>
              <Header className={`${styles.subHeader}`}>
                  {
                    pathname.length > 5 && 
                    <Tooltip title='返回' placement='bottom'>
                      <a onClick={()=>this.props.history.go(-1)}>
                        <Icon type="arrow-left" theme="outlined" style={{ fontSize: 18, marginRight: 16 }}/>
                      </a>
                    </Tooltip>
                  }
                <span>{title}</span>
              </Header>
              {hasDept ? (
                <Content className={`${styles.content}`}>
                  <Switch>
                    {
                      getRouteData('BasicLayout').map(item =>
                        (
                          <Route
                            exact={item.exact}
                            key={item.path}
                            path={item.path}
                            component={item.component}
                          />
                        )
                      )
                    }
                    <Route render={()=> (
                        <Redirect to='/error' />
                    )}/>
                  </Switch>
                </Content>
              ) : <Spin><div className={styles.content} style={{background: '#fff'}}></div></Spin>}
            </Content>
          </Layout>  
        </Layout>
      </Layout>  
    )
  }
}
export default connect(state => state)(BasicLayout);