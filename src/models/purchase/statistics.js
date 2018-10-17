import * as statistics from '../../services/purchase/statistics';
/* 采购结算 -  统计 & 发票 */
export default {
  namespace: 'statistics',
  state: {},
  reducers: {},
  effects: {
    //发票查询详情
    *invoiceDetail({payload, callback}, {call}) {
      const data = yield call(statistics.invoiceDetail, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //近效期临效期
    *getTimeList({payload, callback}, {call}) {
      const data = yield call(statistics.getTimeList, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //结算分析
    *settleStaticsList({payload, callback}, {call}) {
      const data = yield call(statistics.settleStaticsList, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //供应商列表
    *supplierAll({payload, callback}, {call}) {
      const data = yield call(statistics.supplierAll, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //结算分析列表-导出
    *staticsExport({payload, callback}, {call}) {
      const data = yield call(statistics.staticsExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //部门列表
    *getDeptByParam({payload, callback}, {call}) {
      const data = yield call(statistics.getDeptByParam, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //科室退库表格footer
    *listCount({payload, callback}, {call}) {
      const data = yield call(statistics.listCount, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //科室退库分析导出
    *kstkExport({payload, callback}, {call}) {
      const data = yield call(statistics.kstkExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //近效期导出
    *ypjxqExport({payload, callback}, {call}) {
      const data = yield call(statistics.ypjxqExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //药品分析导出
    *medicineStandingExport({payload, callback}, {call}) {
      const data = yield call(statistics.medicineStandingExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //损益分析 - 导出
    *profitLossExport({payload, callback}, {call}) {
      const data = yield call(statistics.profitLossExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //损益分析详情
    *profitLossDetailHead({payload, callback}, {call}) {
      const data = yield call(statistics.profitLossDetailHead, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //损益分析列表footer
    *getStatics({payload, callback}, {call}) {
      const data = yield call(statistics.getStatics, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //供应商退货分析导出
    *supplierReturnExport({payload, callback}, {call}) {
      const data = yield call(statistics.supplierReturnExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    }
  }
}