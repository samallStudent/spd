import React, { PureComponent } from 'react';
import styles from './style.css';
import { connect } from 'dva';
class SubSystem extends PureComponent {
  state = {
    deptInfo: []
  }
  componentWillReceiveProps = nextProps =>{
    if(nextProps.users.userInfo.deptInfo.length){
      this.setState({ deptInfo: nextProps.users.userInfo.deptInfo })
    }
  }
 
  render() {
    /* console.log(this.props,'props');
    console.log(this.props.users.userInfo.deptInfo,'deptInfo'); */
    // let { deptInfo } = this.props.users.userInfo;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <a style={{ color: '#999'}}>退 出</a>
        </div>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <span>药品物流管理系统</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardList}>
              {
                /* deptInfo.map(item => (
                  <div key={item.deptId} className={styles.cardItem}>
                    <div className={styles.upperCon}>
                      <div className={styles.cardBackground}></div>
                      <div className={styles.icon}></div>
                    </div>
                    <div className={styles.main}>
                      <div className={styles.mainTitle}>{item.deptName}</div>
                      <a className={styles.enterBtn} onClick={()=>console.log(item,'item')}>进 入</a>
                    </div>
                  </div>
                )
                ) */
              }
              <div className={styles.cardItem} onClick={() => {
                this.props.history.push({ pathname: '/drugStorage/configMgt/drugDirectory' })
                }}>
              </div>
              <div className={styles.cardItemTwo} onClick={() => {
                this.props.history.push({ pathname: '/pharmacy/configMgt/drugDirectory' })
                }}>
              </div>
              <div className={styles.purchaseCard} onClick={() => {
                this.props.history.push({ pathname: '/purchase/replenishment/replenishmentPlan' })
                }}>
              </div>
              <div className={styles.systemMgtCard} onClick={() => {
                this.props.history.push({ pathname: '/sys/drugDirectory/directory' })
                }}>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(SubSystem)