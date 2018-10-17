import * as goodsAdjust from '../../services/drugStorage/goodsAdjust';
import {message} from 'antd';
export default {
  namespace: "goodsAdjust",
  state: {
  },
  effects: {
    //货位移动 - 详情
    *goodsDetail({payload, callback}, {call}) {
      const data = yield call(goodsAdjust.goodsDetail, payload);
      console.log(data, '详情');
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    }
  },
  reducers: {
  },
}