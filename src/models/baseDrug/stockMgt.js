/*-- 基数药 - 配置管理 --*/
import * as stockMgt from '../../services/baseDrug/stockMgt';
import { message } from 'antd';

export default {
  namespace: 'stockMgt',
  state: {},
  reducers: {
    
  },
  effects: {
    /*-- 库存查询 --*/
    //详情 - 表头
    *getBaseMedicineDetail({payload, callback}, {call}) {
      const data = yield call(stockMgt.getBaseMedicineDetail, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //详情 - 列表
    *getBaseMedicineDetailList({payload, callback}, {call}) {
      const data = yield call(stockMgt.getBaseMedicineDetailList, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //导出
    *exportBaseDrug({payload, callback}, {call}) {
      const data = yield call(stockMgt.exportBaseDrug, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    }
    /*-- end --*/
  },
}