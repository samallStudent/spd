import * as drugPricing from '../../services/purchase/drugPricing';
/* 采购结算 -  结算管理 */
export default {
  namespace: 'drugPricing',
  state: {},
  reducers: {},
  effects: {
    //调价确认 详情头部
    *checkpriceGetDetail({payload, callback}, {call}) {
        const data = yield call(drugPricing.checkpriceGetDetail, payload);
        if(typeof callback === 'function') {
            callback && callback(data);
        };
    },
  }
}