import React, { PureComponent } from 'react';
import { Avatar, Modal, Form, Input, message } from 'antd';
import DropdownList from '../DropdownList';
import styles from './style.css';
import {connect} from 'dva';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },//5
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },//17
  },
};
class Profile extends PureComponent {
  state = {
    visible: false
  }
  changePassword = () => {
    this.setState({
      visible: true
    });
  }
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if(!err) {
        this.props.dispatch({
          type: 'users/updatePassWordById',
          payload: values,
          callback: ({code, msg, data}) => { 
            if(code === 200) {
              message.success('修改成功, 请重新登录');
              this.dropdownList.selectHandler('/login');
            }else {
              message.error(msg);
            };
          }
        })
      }
    });
  }
  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
        <div className={styles.profile}>
          <div className={styles.avatarWraper}>
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
          </div>
          <DropdownList
            ref={(dropdownList) => this.dropdownList = dropdownList}
            list={[
              {link: '/changePassword', text: '修改密码'},
              {link: '/login', text: '退出'},
            ]}
            style={{width: 100}}
            changePassword={this.changePassword}
            text={this.props.userName}
          />
          <Modal
            title="修改密码"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form>
              <FormItem {...formItemLayout} label={`原密码`}>
                {
                  getFieldDecorator(`oldPassWord`,{
                    initialValue: '',
                    rules: [{ required: true,message: '请输入原密码' }]
                  })(
                    <Input type="password" placeholder='请输入'/>
                  )
                }
              </FormItem>
              <FormItem {...formItemLayout} label={`新密码`}>
                {
                  getFieldDecorator(`newPassWord`,{
                    initialValue: '',
                    rules: [
                      { required: true,message: '请输入新密码' },
                      { max: 15, message: '最大长度不能超过15个字符' },
                      { min: 6, message: '最小长度不能小于6个字符' }
                    ]
                  })(
                    <Input type="password" placeholder='请输入'/>
                  )
                }
              </FormItem>
              <FormItem {...formItemLayout} label={`确认新密码`}>
                {
                  getFieldDecorator(`newPassWordAgain`,{
                    initialValue: '',
                    rules: [
                      { required: true,message: '确认新密码' },
                      { min: 6, message: '最小长度不能小于6个字符' },
                      { max: 15, message: '最大长度不能超过15个字符' }
                    ]
                  })(
                    <Input type="password" placeholder='请输入'/>
                  )
                }
              </FormItem>
            </Form>
          </Modal>
        </div>
    )
  }
}

export default connect(state => state)(Form.create()(Profile));