import React, { PureComponent } from 'react';
import styles from './style.css';
import PropTypes from 'prop-types';

class CardItem extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      list: [{
        title: "总务物资管理系统",
        subTitle: 'Supersystem'
      }]
    }
  }
  static propTypes = {
    onClick: PropTypes.func,
    list: PropTypes.array
  };
  render(){
    const { onClick, list } = this.props;
    return (
      <div className={styles.cardItemWrapper}>
        {
          list.map((item,index) => <div key={index} className={styles.cardWrapper}>
              <div className={styles.cardLogo}>
                <img src={require('../../assets/card.png')} alt='cardLogo'/>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.title}>{`${item.title}`}</h3>
                <p className={styles.subTitle}>{`${item.subTitle}`}</p>
                <a className={styles.button} onClick={()=>onClick(item,index)}>
                  未选择
                </a>
              </div>
          </div>)
        }
      </div>
    )
  }
}
export default CardItem;