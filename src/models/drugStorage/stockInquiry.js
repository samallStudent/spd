import * as stockInquiry from '../../services/drugStorage/stockInquiry';
import {message} from 'antd';

export default {
  namespace: "stockInquiry",
  state: {
  },
  effects: {
    //库存查询 - 详情头部
    *repertoryDetail({payload, callback}, {call}) {
      const data = yield call(stockInquiry.repertoryDetail, payload);
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