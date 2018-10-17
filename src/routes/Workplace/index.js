import React, { PureComponent } from 'react';
import { connect } from 'dva';
import CardItem from '../../components/LoginCard';
const cardList = [];
@connect()
class Workplace extends PureComponent {
  onClick = (item,index) =>{
    this.props.history.push({
      pathname:'/login'
    })
  }
  render() {
    console.log(this.props,'props')
    return (
      <div style={{ display:'flex',justifyContent:'center',paddingTop: 110 }}>
         <CardItem 
          list={cardList}
          onClick={this.onClick}
          />
      </div>
    )
  }
}

export default connect(state=> state)(Workplace);