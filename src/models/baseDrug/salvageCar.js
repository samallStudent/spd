import * as salvageCar from '../../services/baseDrug/salvageCar';
import { message } from 'antd';

export default {
    namespace: 'salvageCar',
    state: {},
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
        //抢救车库存-详情 - 表头
      *getRescuecarMedicineDetail({payload, callback}, {call}) {
          const data = yield call(salvageCar.getRescuecarMedicineDetail, payload);
          if(data.code === 200 && data.msg === 'success') {
              callback && callback(data.data);
          }else {
                message.error(data.msg);
          }
      },
      //新建退库抢救车货位
      *findDeptlist({payload, callback}, {call}) {
          const data = yield call(salvageCar.findDeptlist, payload);
          if(callback && typeof callback === 'function') {
            callback(data);
          };
      },
      //抢救车新建退库详情
      *rescuecarBackInfo({payload, callback}, {call}) {
          const data = yield call(salvageCar.rescuecarBackInfo, payload);
          if(callback && typeof callback === 'function') {
            callback(data);
          };
      },
    },
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
    },
  
  };
  