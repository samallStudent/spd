import * as settlementMgt from '../../services/purchase/settlementMgt';
/* 采购结算 -  结算管理 */
export default {
  namespace: 'settlementMgt',
  state: {},
  reducers: {},
  effects: {
    /*-- 结算单 --*/
    //结算单详情
    *settleDetail({payload, callback}, {call}) {
      const data = yield call(settlementMgt.settleDetail, payload);
      callback && callback(data);
    },
    //导出
    *settleExport({payload, callback}, {call}) {
      const data = yield call(settlementMgt.settleExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    /*-- end --*/
    /*-- 日对账单 --*/
    *dailyDetail({payload, callback}, {call}) {
      const data = yield call(settlementMgt.dailyDetail, payload);
      callback && callback(data);
    },
    //导出
    *billExport({payload, callback}, {call}) {
      const data = yield call(settlementMgt.billExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    }
    /*-- end --*/
  }
}