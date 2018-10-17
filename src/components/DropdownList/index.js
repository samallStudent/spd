import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import { _local } from '../../api/local'
class DropdownList extends React.Component {
  selectHandler = (link) => {
    // console.log(link,'link')
    const uri = window.location.hash.substring(2, window.location.hash.length);
    if(uri !== link){
      if(link === '/login'){
        fetch(`${_local}/a/logout`,{
          method: 'GET',
          credentials: 'include',
          mode: 'cors',
        })
        .then(res => res.json)
        .then(data=>{
          window.sessionStorage.removeItem('key');
          window.sessionStorage.removeItem('deptName');
        })
      }
    }
    window.location.hash = link;
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
