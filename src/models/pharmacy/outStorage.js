/*-- 药房 - 配置管理 --*/
import * as outStorage from '../../services/pharmacy/outStorage';

export default {
  namespace: 'outStorage',
  state: {
    
  },
  reducers: {
    
  },
  effects: {
    /* 配置管理 -  */
    *billoutsotreDetail({payload, callback}, {call}) {
      const data = yield call(outStorage.billoutsotreDetail, payload);
      callback && callback(data);
    },
    *outStorageExport({payload, callback}, {call}) {
      const data = yield call(outStorage.outStorageExport, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    /*-- end --*/
    /*--创世新增2018-12-14-S--*/
    *reviewSave({payload, callback}, {call}) {
      const data = yield call(outStorage.reviewSave, payload);
      if(callback && typeof callback === 'function') {
          callback(data);
      };
    },
    *reviewSearch({payload, callback}, {call}) {
        const data = yield call(outStorage.reviewSearch, payload);
        if(callback && typeof callback === 'function') {
            callback(data);
        };
    }
    /*--创世新增2018-12-14-E--*/
  }
}