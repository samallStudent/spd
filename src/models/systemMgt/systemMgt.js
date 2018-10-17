/*
 * 系统管理 - 系统设置
 */
import * as sysSettingService from '../../services/system/sys/menu';
import { message } from 'antd';
export default {
  namespace: 'sysSetting',
  state:{},
  reducers: {},
  effects:{
    //系统设置-菜单管理-新增
    *MenuSave({ payload, callback },{ put, call }){
      const data = yield call(sysSettingService.MenuSave, payload);
      if(data.code === 200 && data.msg === 'success'){
        message.success('操作成功');
      }else{
        return message.error(data.msg)
      }
      if(callback) callback(data);
      
    },
    //系统设置-菜单管理-列表
    *MenuList({ payload, callback },{ put, call }){
      const data = yield call(sysSettingService.MenuList, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }
      if(callback) callback(data);
    },
    //系统设置-菜单管理-删除
    *MenuDelete({ payload, callback },{ put, call }){
      const data = yield call(sysSettingService.MenuDelete, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }
      if(callback) callback(data);
    },
    //系统设置-菜单管理-详情
    *MenuDetail({ payload, callback },{ put, call }){
      const data = yield call(sysSettingService.MenuDetail, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }
      if(callback) callback(data);
    },
  },
  subscriptions: {}
}