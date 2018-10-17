import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import Profile from '../../components/profile'
import Notice from '../../components/notice';
import Search from '../../components/Search';
import styles from './style.css';

class HeaderTop extends PureComponent{
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }
  render(){
    return (
        <Row>
          <Col xs={8} sm={6} md={4} lg={4} key={1}>
            <a className={styles.logo}>
              <img src={require('../../assets/aaa.png')} style={{ width: '100%',height: '100%'}} alt='logo'/>
            </a>
          </Col>
          <Col xs={8} sm={12} md={18} lg={10} key={2}>
          </Col>
          <Col xs={8} sm={6} md={2} lg={10} style={{textAlign:'right',paddingRight: 8}} key={3}>
            <div style={{ display:'flex',justifyContent:'flex-end' }}>
              <Search/>
              <Notice/>
              <Profile userName={'供货商'}/>
            </div>
          </Col>
        </Row>
    )
  }
}
export default HeaderTop;