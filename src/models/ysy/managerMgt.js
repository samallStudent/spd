import * as managerService from '../../services/ysy/managerMgt';
import { message } from 'antd';

export default {
  namespace: 'managerMgt',
  state: {
    dataSource: [],
    tableLoading: false,
  },
  reducers: {
   
  },
  effects: {
    //重置密码
    *resetPwd({ payload, callback },{ call }){
      const data = yield call(managerService.modifyAdminInfo,{ ...payload });
      if(data.status){
        message.success('重置密码成功');
        if (callback) callback()
      }else{
        message.error(data.msg||'重置密码失败')
      }
    },
    // 修改用户信息
    *modifyAdmin({ payload,callback },{ call }){
      const data = yield call(managerService.modifyAdminInfo, payload);
      if(data.status){
        message.success('修改成功！');
        if (callback) callback();
      }else{
        message.error(data.msg);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/managerMgt') {
          //监听路由变化 触发 effect 
          console.log('managerMgt')
        }
      });
    },
  }
}