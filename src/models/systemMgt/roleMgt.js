/*
 * 角色管理
 */
import * as roleMgtService from '../../services/system/role/roleMgt';
import { message } from 'antd';

export default {
  namespace: 'systemRole',
  state:{
    
  },
  reducers: {
  },
  effects:{
    *RoleSave({ payload, callback },{ put, call }){
      const data = yield call(roleMgtService.RoleSave, payload);
      if(data.code !== 200){
        message.error(data.msg ||'操作失败')
      }
      if(callback) callback(data);
    },
    *RoleDelete({ payload, callback },{ put, call }){
      const data = yield call(roleMgtService.RoleDelete, payload);
      if(data.code !== 200){
        message.error(data.msg ||'删除失败')
      }
      if(callback) callback(data);
    },
    *RoleDetail({ payload, callback },{ put, call }){
      const data = yield call(roleMgtService.RoleDetail, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }
      if(callback) callback(data);
    },
    *allMenuList({payload, callback}, {call}) {
      const data = yield call(roleMgtService.allMenuList, payload);
      if(data.code === 200) {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    }
  },
  subscriptions: {}
}