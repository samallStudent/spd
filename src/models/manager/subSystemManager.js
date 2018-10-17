import * as subMgtService from '../../services/manager/subSystemMgt';
import { message } from 'antd';

export default {
  namespace: 'subSystemManager',
  state: {
    
  },
  reducers: {
   
  },
  effects: {
    // 重置密码
    *resetPwd({ payload,callback },{ call }){
      const data = yield call(subMgtService.resetUserPwd, payload);
      if(data.status){
        message.success('重置密码成功');
        if (callback) callback();
      }else{
        message.error(data.msg||'重置密码失败')
      }
    },
    // 删除用户
    *deleteUser({ payload,callback },{ call }){
      const data = yield call(subMgtService.deleteUser, payload);
      if(data.status){
        message.success('删除成功');
        if (callback) callback();
      }else{
        message.error(data.msg||'删除失败')
      }
    },
    *addOrupdate({ payload,callback },{ call }){
      const data = yield call(subMgtService.addOrUpdate, payload);
      if(data.status){
        message.success('操作成功');
        if (callback) callback();
      }else{
        message.error(data.msg||'操作失败')
      }
    }
  },
  subscriptions: {
    
  }
}