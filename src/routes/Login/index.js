import React, { PureComponent } from 'react';
import { Form, Button, Checkbox, Input, Icon, message } from 'antd';
import { connect } from 'dva';
import { menuFormat } from '../../utils/utils';
// import querystring from 'querystring';
import styles from './style.css';
const FormItem = Form.Item;
class Login extends PureComponent{
  state = {
    loading: false
  }
  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.setState({ loading: true });
        let { userName, password } = values;
        // this.userLogin(userName, password)
        this.props.dispatch({
          type: 'users/EncryptPassword',
          payload: { password },
          callback: (data) =>{
            let newPassword = data.password;
            this.userLogin(userName,newPassword);
          }
        }) 
      }
    })
  }
  userLogin = (username,password) =>{
    let { dispatch, history } = this.props;
    dispatch({
      type: 'users/userLogin',
      payload: { username, password },
      callback: (data) => {
        this.setState({ loading: false });
        if(!data) {
          return message.warning('用户或密码错误, 请重试.');
        };
        if(data.deptInfo && data.deptInfo.length){
          // 正式数据
          let deptInfo = data.deptInfo;
          let { menuList } = deptInfo[0];
          console.log(menuList, 'menuList');
          
          let tree = menuFormat(menuList, true, 1) ;
          console.log(tree,'ret');
          // console.log(JSON.stringify(tree))
          let subChildren = tree[0].children[0].children[0];
          // console.log(subChildren,'subChildren')
          let href = subChildren.children ? subChildren.children[0].href: subChildren.href;
          href =  href && href[href.length -1] === '/'? href.substring(0,href.length-1): href;
          this.props.dispatch({
            type: 'users/setCurrentMenu',
            payload: { menu : tree[0].children[0] },
          });
          window.sessionStorage.setItem('key', data.deptInfo[0].deptId);
          window.sessionStorage.setItem('deptName', data.deptInfo[0].deptName);
          // href = href.split('/');
          // href.splice(2, 0, deptInfo[0].deptId);
          // href = href.join('/');
          history.push({ pathname: href ? href: '/error' })
          // history.push({ pathname: '/subSystem' })
          // history.push({ pathname: '/sys/drugDirectory/directory' })

        };
      }
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const wrapperLayout = {
      wrapperCol:{ span: 15, offset: 5 }
    }
    return (
      <div className={styles['container']}>
         <div className={styles['ysy-Login-bg']} style={{ width: '62%' }}></div>
         <div className={styles['ysy-Login-form']} style={{ width: '38%' }}>
            <div className={styles['ysy-Login-form-top']}>
              {/* <span className={styles['ysy-orgName']}>{orgName}</span> */}
              <span className={styles['ysy-lgo']}></span>
              {/* <span className={styles['ysy-login-logo']}></span> */}
            </div>
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...wrapperLayout}>
                {getFieldDecorator('userName', {
                  rules: [{required: true, message: '请输入用户名!'}],
                  })(
                    <Input addonBefore={<Icon type='user'/>} placeholder='用户名'/>
                )}
              </FormItem>
              <FormItem {...wrapperLayout}>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }],
                })(
                  <Input addonBefore={<Icon type="lock" />} type="password" placeholder="密码" />
                )}
              </FormItem>
              <FormItem  {...wrapperLayout}>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                  })(
                    <Checkbox>记住用户名和密码</Checkbox>
                  )}
                  <Button type="primary" htmlType="submit" className={styles["login-form-button"]} loading={this.state.loading}>
                    登录
                  </Button>
              </FormItem>
            </Form>
            <div style={{ textAlign:'center',fontSize: 12,height: 70,paddingTop: 50  }}>
              {/* <span>版权所有&nbsp;@普华信联&nbsp;( 武汉 )&nbsp;科技有限公司&nbsp;保留一切权力</span> */}
            </div>
         </div>
      </div>
    )
  }
}
export default connect( state => state)(Form.create()(Login));

