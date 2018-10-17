import React, { PureComponent } from 'react';
import { Avatar } from 'antd';
import DropdownList from '../DropdownList';
import styles from './style.css';

class Profile extends PureComponent {
  render() {
    return (
        <div className={styles.profile}>
          <div className={styles.avatarWraper}>
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
          </div>
          <DropdownList
              list={[
               /*  {link: '/persons/personal', text: '设置'}, 
                {link: '/message/inbox', text: '收件箱'}, */
                {link: '/login', text: '退出'}
              ]}
              style={{width: 100}}
              text={this.props.userName}
          />
        </div>
    )
  }
}

export default Profile;