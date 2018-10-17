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
    *finish({payload, callback}, {call}) {
      const data = yield call(wareHouse.finish, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data);
      }else {
        message.error(data.msg);
      }
    },
  },
  subscriptions: {
    
  }
}