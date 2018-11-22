import * as salvageCar from '../../services/baseDrug/salvageCar';

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
        if(callback && typeof callback === 'function') {
          callback(data);
        };
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
      //抢救车申领详情
      *rescuecarApplyDetail({payload, callback}, {call}) {
        const data = yield call(salvageCar.rescuecarApplyDetail, payload);
        if(callback && typeof callback === 'function') {
          callback(data);
        };
      },
       //抢救车--台账--供应商
       *getSuppliers({payload, callback}, {call}) {
        const data = yield call(salvageCar.getSuppliers, payload);
        if(callback && typeof callback === 'function') {
          callback(data);
        };
      },
      //抢救车--台账--抢救车货位
      *getDepts({payload, callback}, {call}) {
        const data = yield call(salvageCar.getDepts, payload);
        if(callback && typeof callback === 'function') {
          callback(data);
        };
      },
      //抢救车--台账--类型
      *getType({payload, callback}, {call}) {
        const data = yield call(salvageCar.getType, payload);
        if(callback && typeof callback === 'function') {
          callback(data);
        };
      },
       //抢救车--台账--导出
       *exportList({payload, callback}, {call}) {
        const data = yield call(salvageCar.exportList, payload);
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
  