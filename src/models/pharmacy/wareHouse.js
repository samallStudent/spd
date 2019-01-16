import * as wareHouse from '../../services/pharmacy/wareHouse';
import { message } from 'antd';

export default {
  namespace: 'pharmacy',
  state: {
    
  },
  reducers: {
    
  },
  effects: {
    //药品申领详情
    *drugsForInfo({payload, callback}, {put, call}) {
      const data = yield call(wareHouse.drugsForInfo, payload);
      if(data.code === 200 && data.msg === "success") {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //基数药药品申领详情
    *baseDrugsForInfo({payload, callback}, {put, call}) {
      const data = yield call(wareHouse.baseDrugsForInfo, payload);
      if(data.code === 200 && data.msg === "success") {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    *DeleteMakeup({payload, callback}, {put, call}) {
      const data = yield call(wareHouse.DeleteMakeup, payload);
      if(data.code === 200 && data.msg === "success") {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    *GETMakeupDetail({payload, callback}, {put, call}) {
      const data = yield call(wareHouse.GETMakeupDetail, payload);
      if(data.code === 200 && data.msg === "success") {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    *findStoreDetail({payload, callback}, {put, call}) {
      const data = yield call(wareHouse.findStorePage, payload);
      if(data.code === 200 && data.msg === "success") {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    *CheckMakeupDetail({payload, callback}, {put, call}) {
      const data = yield call(wareHouse.CheckMakeupDetail, payload);
      if(data.code === 200 && data.msg === "success") {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    *SubmitAgainMakeupDetail({payload, callback}, {put, call}) {
      const data = yield call(wareHouse.SubmitAgainMakeupDetail, payload);
      if(data.code === 200 && data.msg === "success") {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //入库单管理详情
    *findStorePage({payload, callback}, {put, call}) {
      const data = yield call(wareHouse.GETMakeupDetail, payload);
      if(data.code === 200 && data.msg === "success") {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //上架详情
    *roomacceptanceInfo({payload, callback}, {call}) {
      const data = yield call(wareHouse.roomacceptanceInfo, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      };
    },
    //上架详情头部
    *shelfInfoHead({payload, callback}, {call}) {
      const data = yield call(wareHouse.shelfInfoHead, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    *finish({payload, callback}, {call}) {
      const data = yield call(wareHouse.finish, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data);
      }else {
        message.error(data.msg);
      }
    },
    *makeDetail({payload, callback}, {call}) {
      const data = yield call(wareHouse.makeDetail, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    //全院管理 - 发药单补登 - 部门
    *getDeptByParam({payload, callback}, {call}) {
      const data = yield call(wareHouse.getDeptByParam, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    //全院管理 - 发药单补登 - 批量发送
    *batchSend({payload, callback}, {call}) {
      const data = yield call(wareHouse.batchSend, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
  },
  subscriptions: {
    
  }
}