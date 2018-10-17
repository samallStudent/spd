import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import styles from './style.css';
import PropTypes from 'prop-types';
import { Route, Switch, Link } from 'dva/router';
import { connect } from 'dva';
const { Header, Sider, Content } = Layout;


class WorkplaceLayout extends PureComponent {
  state = {
    collapsed: false,
  };
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  getChildContext() {
    const { location, navData, getRouteData } = this.props;
    const routeData = getRouteData('WorkplaceLayout');
    const firstMenuData = navData.reduce((arr, current) => arr.concat(current.children), []);
    const menuData = this.getMenuData(firstMenuData, '');
    const breadcrumbNameMap = {};
    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = item.name;
    });
    return { location, breadcrumbNameMap };
  }
  getMenuData = (data, parentPath) => {
    let arr = [];
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name });
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`));
      }
    });
    return arr;
  }
  render() {
    const pathname = this.props.history.location.pathname;
    let path = '';
    if (pathname) {
      path = `/${pathname.split('/')[1]}/${pathname.split('/')[2]}`
    }
    return (
      <Layout className={`${styles.layout}`}>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className={styles.logo_text} >
            V-HOME
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={[path]}>
            <Menu.Item key="/app/user">
              <Link to='/app/user'>
                <Icon type="user" />
                <span>用户管理</span>
              </Link>  
            </Menu.Item>
            <Menu.Item key="/app/publish">
              <Link to='/app/publish/list'>
                <Icon type="book" />
                <span>文章管理</span>
              </Link>  
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className={`${styles.layout}`}>
          <Header style={{ background: '#fff', padding: 0,boxShadow:' 0px 2px 8px #e4e5e7' }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <div className={`${styles.contentTitle}`}>这里是标题</div>
          <Content className={`${styles.content}`}>
            <Switch>
              {
                this.props.getRouteData('WorkplaceLayout').map(item =>
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
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default connect()(WorkplaceLayout);