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
    },
    //订单执行情况详情头部
    *orderExecuteDetail({payload, callback}, {call}) {
      const data = yield call(statistics.orderExecuteDetail, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //订单执行情况导出
    *orderExecuteExport({payload, callback}, {call}) {
      const data = yield call(statistics.orderExecuteExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //供应商退货分析表格页脚
    *countSupplierOrder({payload, callback}, {call}) {
      const data = yield call(statistics.countSupplierOrder, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //订单追溯详情头部
    *traceDetail({payload, callback}, {call}) {
      const data = yield call(statistics.traceDetail, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //订单追溯导出
    *exportTrace({payload, callback}, {call}) {
      const data = yield call(statistics.exportTrace, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //供应商供货分析footer
    *supplierAnalyze({payload, callback}, {call}) {
      const data = yield call(statistics.supplierAnalyze, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //供应商供货分析导出
    *exportSupplierAnalyze({payload, callback}, {call}) {
      const data = yield call(statistics.exportSupplierAnalyze, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    *getDeptInfo({payload, callback}, {call}) {
      const data = yield call(statistics.getDeptInfo, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //供应商排行导出
    *gysphExport({payload, callback}, {call}) {
      const data = yield call(statistics.gysphExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //绩效信息表部门
    *operationlogDeptList({payload, callback}, {call}) {
      const data = yield call(statistics.operationlogDeptList, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //绩效信息表部门联动菜单
    *operationlogMenu({payload, callback}, {call}) {
      const data = yield call(statistics.operationlogMenu, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //批号追溯详情头部－基本信息
    *batchGetDrugInfo({payload, callback}, {call}) {
        const data = yield call(statistics.batchGetDrugInfo, payload);
        if(typeof callback === 'function') {
            callback && callback(data);
        };
    },
    //批号追溯详情－当前库存
    *batchGetStore({payload, callback}, {call}) {
      const data = yield call(statistics.batchGetStore, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    //批号追溯详情－采购验收记录
    *batchGetPlanAndCheck({payload, callback}, {call}) {
        const data = yield call(statistics.batchGetPlanAndCheck, payload);
        if(typeof callback === 'function') {
            callback && callback(data);
        };
    },
    //批号追溯详情－院内流通记录
    *batchMedCirculate({payload, callback}, {call}) {
        const data = yield call(statistics.batchMedCirculate, 
    payload);
        if(typeof callback === 'function') {
            callback && callback(data);
        };
    },
    //批号追溯详情－发药记录
    *batchGetDispensing({payload, callback}, {call}) {
        const data = yield call(statistics.batchGetDispensing, payload);
        if(typeof callback === 'function') {
            callback && callback(data);
        };
    },
    //批号追溯详情－非发药消耗
    *batchGetMakeUp({payload, callback}, {call}) {
        const data = yield call(statistics.batchGetMakeUp, payload);
        if(typeof callback === 'function') {
            callback && callback(data);
        };
    },
    //库存查询表头
    *getRoomRepertoryDetail({payload, callback}, {call}) {
        const data = yield call(statistics.getRoomRepertoryDetail, payload);
        if(typeof callback === 'function') {
            callback && callback(data);
        };
    },
  } 
}