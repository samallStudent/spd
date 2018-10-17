import * as checkDecrease from '../../services/checkDecrease';

/*-- 盘点损益 --*/

export default {
  namespace: 'checkDecrease',
  state: {},
  reducers: {},
  effects: {
    /*-- 新建盘点 --*/
    //新建
    *createCheckbill({callback, payload}, {call}) {
      const data = yield call(checkDecrease.createCheckbill, payload);
      callback && callback(data);
    },
    //导出
    *checkBillExport({callback, payload}, {call}) {
      const data = yield call(checkDecrease.checkBillExport, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      }; 
    },
    //删除
    *deleteCheckBill({callback, payload}, {call}) {
      const data = yield call(checkDecrease.deleteCheckBill, payload);
      callback && callback(data);
    },
    //详情头部
    *getCheckbill({callback, payload}, {call}) {
      const data = yield call(checkDecrease.getCheckbill, payload);
      callback && callback(data);
    },
    //盘点
    *beginCheck({callback, payload}, {call}) {
      const data = yield call(checkDecrease.beginCheck, payload);
      callback && callback(data);
    },
    //新增批号
    *createBatchNo({callback, payload}, {call}) {
      const data = yield call(checkDecrease.createBatchNo, payload);
      callback && callback(data);
    },
    //提交
    *submitCheck({callback, payload}, {call}) {
      const data = yield call(checkDecrease.submitCheck, payload);
      callback && callback(data);
    },
    /**-- end --**/

    /*-- 盘点审核 --*/
    *auditPassOrNo({callback, payload}, {call}) {
      const data = yield call(checkDecrease.auditPassOrNo, payload);
      callback && callback(data);
    },
    //导出
    *checkBillSheveExport({callback, payload}, {call}) {
      const data = yield call(checkDecrease.checkBillSheveExport, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      }; 
    },
    /*-- end --*/

    /*-- 盘点损益 --*/
    *handlerProfitAndLoss({callback, payload}, {call}) {
      const data = yield call(checkDecrease.handlerProfitAndLoss, payload);
      callback && callback(data);
    },
    /*-- end --*/

    /*-- 损益记录 --*/
    *getCausticexcessive({callback, payload}, {call}) {
      const data = yield call(checkDecrease.getCausticexcessive, payload);
      callback && callback(data);
    },
    //导出
    *excessiveExport({callback, payload}, {call}) {
      const data = yield call(checkDecrease.excessiveExport, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      }; 
    }
  }
}