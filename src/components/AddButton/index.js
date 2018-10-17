/**
 * Create By Vania 2018-05-31
 */
import React, { PureComponent } from 'react';
import styles from './button.css';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
/**
 * @class
 * @extends PureComponent
 * @description 全局添加按钮
 * @example 
 * @returns AddButton Components
 */
class AddButton extends PureComponent {
  static defaultProps = {
    color: '#1890ff',
    fontSize: '50px',
    icon: 'plus-circle'
  };
  static propTypes = {
    style: PropTypes.object,
    onClick: PropTypes.func
  };
  render() {
    const { onClick, top, right, color, fontSize, icon } = this.props;
    return (
      <div className={`${styles.add_btn}`} style={{ top, right }}>
        <Icon type={icon} onClick={onClick} style={{ color, fontSize }} className={styles.add_icon}/>
      </div>
    )
  }
}

export default AddButton;