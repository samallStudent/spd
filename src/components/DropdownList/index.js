import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import { _local } from '../../api/local'
class DropdownList extends React.Component {
  selectHandler = (link) => {
    // console.log(link,'link')
    if(link === '/login') {
      const uri = window.location.hash.substring(2, window.location.hash.length);
      if(uri !== link){
        if(link === '/login'){
          fetch(`${_local}/a/logout`,{
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
          })
          .then(res => res.json);
        };
      };
      window.location.hash = link;
      const urlParams = new URL(window.location.href);
      urlParams.searchParams.delete('depeId');
      window.history.pushState(null, '', urlParams.href);
    };
    if(link === '/changePassword') {
      this.props.changePassword();
    };
  }
  menus = () => {
    return (
      <Menu style={this.props.style}>
        {
          this.props.list.map( (item, index) => {
            return (
              <Menu.Item key={index}>
                <a onClick={this.selectHandler.bind(this, item.link)}>{item.text}</a>
              </Menu.Item>
            )
          })
        }
      </Menu>
    )
  }
  render() {
    return (
      <Dropdown overlay={this.menus()} trigger={['click']} style={this.props.style}>
          <a>
            {this.props.text || 'down'} <Icon type="down" />
          </a>
      </Dropdown>
    )
  }
}
export default DropdownList;
