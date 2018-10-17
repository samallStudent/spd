import * as configMgt from '../../services/drugStorage/configMgt';
import {message} from 'antd';

export default {
  namespace: "drugStorageConfigMgt",
  state: {},
  effects: {
    //添加药品
    *OperDeptDrug({ payload, callback },{ put, call }){
      const data = yield call(configMgt.OperDeptDrug, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }
      if(callback) callback(data);
    },
    //删除药品
    *DeleteDeptDrug({ payload, callback },{ put, call }){
      const data = yield call(configMgt.DeleteDeptDrug, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      }
    },
    //药品目录详情
    *GetDrugInfo({ payload, callback },{ put, call }){
      const data = yield call(configMgt.GetDrugInfo, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }
      if(callback) callback(data);
    },
    //编辑
    *EditOperDeptInfo({ payload, callback },{ put, call }){
      const data = yield call(configMgt.EditOperDeptInfo, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }else{
        if(callback) callback(data);
      }
    },
    //补货单位下拉框
    *GetUnitInfo({ payload, callback },{ put, call }){
      const data = yield call(configMgt.GetUnitInfo, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }
      if(callback) callback(data);
    },
    *GetAllGoodsTypeInfo({ payload, callback },{ put, call }){
      const data = yield call(configMgt.getAllGoodsTypeInfo, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }
      if(callback) callback(data);
    },
    *getGoodsTypeInfo({ payload, callback },{ put, call }){
      const data = yield call(configMgt.getGoodsTypeInfo, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }
      if(callback) callback(data);
    },
    *getSupplier({ payload, callback },{ put, call }){
      const data = yield call(configMgt.getSupplier, payload);
      if(data.code !== 200){
        message.error(data.msg)
      }
      if(callback) callback(data);
    },
  },
  reducers: {},
}