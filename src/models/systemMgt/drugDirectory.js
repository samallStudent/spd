/*
 * 系统管理 - 组织机构
 */
import * as drugDirectoryService from '../../services/system/drugDirectory/directory';
import { message } from 'antd';

export default {
  namespace: 'drugDirectory',
  state:{
    
  },
  reducers: {
  },
  effects:{
    *getMedicineInfo({ payload, callback },{ put, call }){
      const data = yield call(drugDirectoryService.getMedicineInfo, payload);
      if(data.code !== 200 ){
        message.error(data.msg||'编辑查看详情错误');
      }
      if(callback) callback(data.data);
    },
    *addMedicine({ payload, callback },{ put, call }){
      const data = yield call(drugDirectoryService.operMedicineInfo, payload);
      if(data.code === 200 ){
        message.success('添加成功');
      }else{
        message.error(data.msg||'添加失败');
      }
      if(callback) callback();
    },
  },
  subscriptions: {}
}