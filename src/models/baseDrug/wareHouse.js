/*-- 基数药 - 申领入库 --*/
import * as wareHouse from '../../services/baseDrug/wareHouse';
import { message } from 'antd';

export default {
  namespace: 'wareHouse',
  state: {},
  reducers: {
    
  },
  effects: {
    /*-- 验收 --*/
    *getCheckDetail({payload, callback}, {call}) {
      const data = yield call(wareHouse.getCheckDetail, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //打印
    *baseCheckPrint({payload, callback}, {call}) {
      const data = yield call(wareHouse.baseCheckPrint, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      }
    }
    /*-- end --*/
  },
}