import React, { PureComponent } from 'react';
import { Icon, Input } from 'antd';
import style from './style.css';

const IconStyle = {
  fontSize: 18,
  marginLeft: 8
}

class Search extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      visible: false
    }
  }
  render() {
    const { visible } = this.state;
    return (
        <div className={style.seachWrapper}>
          {
            visible
            &&
            <Input placeholder='搜索' style={{ width: 240 }}/>
          }
          <Icon type='search' style={{...IconStyle}} onClick={()=> this.setState({ visible: true })}/>
          {
            visible
            &&
            <Icon type='close' style={{...IconStyle}} onClick={()=> this.setState({ visible: false })}/>
          }
        </div>
    )
  }
}

export default Search;