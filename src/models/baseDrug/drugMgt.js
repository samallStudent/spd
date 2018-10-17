/*-- 基数药 - 配置管理 --*/
import * as drugMgt from '../../services/baseDrug/drugMgt';
import { message } from 'antd';

export default {
  namespace: 'drugMgt',
  state: {},
  reducers: {
    
  },
  effects: {
    /*-- 药品目录 --*/
    //列表批量编辑
    *batchEditingMedicine({payload, callback}, {call}) {
      const data = yield call(drugMgt.batchEditingMedicine, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //详情
    *getHisMedicineInfo({payload, callback}, {call}) {
      const data = yield call(drugMgt.getHisMedicineInfo, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //补货单位下拉
    *getUnitInfo({payload, callback}, {call}) {
      const data = yield call(drugMgt.getUnitInfo, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //转换关系
    *getHisMedicineTransfor({payload, callback}, {call}) {
      const data = yield call(drugMgt.getHisMedicineTransfor, payload);
      if(data.code === 200) {
        callback && callback(data.data);
      }else {
        message.error(data.msg)
      }
    },
    //编辑保存
    *getHisMedicineBound({payload, callback}, {call}) {
      const data = yield call(drugMgt.getHisMedicineBound, payload);
      if(data.code === 200) {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    }
    /*-- end --*/
  },
}