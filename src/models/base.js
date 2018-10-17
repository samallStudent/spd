/* 
  全局公共 model
*/
import * as base from '../services/base';
import * as replenishment from '../services/replenishment/replenish';
import * as pharmacy from '../services/pharmacy/wareHouse';
import * as wareHouse from '../services/drugStorage/wareHouse';
import * as outStorageService from '../services/drugStorage/outStorage';
import * as goodsAdjust from '../services/drugStorage/goodsAdjust';
import * as baseDrug from '../services/baseDrug/wareHouse';
import * as settlementMgt from '../services/purchase/settlementMgt';
import { message } from 'antd';

export default {
  namespace: 'base',
  state:{
    replenishDetailsInfo: {},
    // 查询条件
    queryConditons: {},
    //搜索栏显示隐藏
    display: 'none'    
  },
  effects:{
    //药房药库基数药 - 药品目录 - 导出
    *deptExport({payload, callback}, {call}) {
      const data = yield call(base.deptExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      }
    },
    //基数药 - 验收 - 新增验收 - 搜索
    *getCheckDetail({payload, callback}, {call}) {
      const data = yield call(baseDrug.getCheckDetail, payload);
      if(data.code === 200) {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //采购结算 - 结算管理 - 日对账单 - 生成对账 - 确认
    *push2Hrp({payload, callback}, {call}) {
      const data = yield call(settlementMgt.push2Hrp, payload);
      callback && callback(data);
    },
    //货位移动 - 添加产品弹窗确认
    *drugInformation({payload, callback}, {call}) {
      const data = yield call(goodsAdjust.drugInformation, payload);
      console.log(data, '确认');
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    *confirmAdjust({payload, callback}, {call}) {
      const data = yield call(goodsAdjust.confirmAdjust, payload);
      console.log(data, '提交');
      if(data.code === 200 && data.msg === 'success') {
        callback && callback()
      }else {
        message.error(data.msg);
      }
    },
    //公共模块 验收 - 详情
    *deliverRequest({ payload, callback },{ put, call }) {
      const data = yield call(wareHouse.detailsInfo, payload);
      if(data.code === 200) {
        callback && callback(data.data);
      };
      if(data.code === 500) {
        message.warning('未能找到该单号');
      }
    },
    //药库 - 入库 - 配送单详情 - 确认验收
    *drugStorageSaveCheck({ payload, callback }, {put, call}) {
      const data = yield call(wareHouse.saveCheck, payload);
      if(data.code === 200) {
        callback && callback(data);
      }
    },
    //药品确认验收
    *saveCheck({payload, callback}, {call}) {
      const data = yield call(pharmacy.saveCheck, payload);
      console.log(data, '验收');
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //基数药验收 - 确认验收
    *baseSaveCheck({payload, callback}, {call}) {
      const data = yield call(baseDrug.saveCheck, payload);
      console.log(data, '验收');
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    // 采购部门
    *getModule({ payload,callback },{ call }){
      const data = yield call(replenishment.getModule, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取采购部门失败')
      }
      if(callback) callback(data.data)
    },
    //药品申领 - 查询补货部门
    *selectApplyDept({payload, callback}, {call}) {
      const data = yield call(pharmacy.selectApplyDept, payload);
      if(data.code !== 200){
        message.error(data.msg);
        return;
      }; 
      callback && callback(data.data);
    },
    //药品申领 - 保存提交
    *applySubmit({payload, callback}, {call}) {
      const data = yield call(pharmacy.applySubmit, payload);
      if(data.code !== 200) {
        message.error(data.msg);
        return;
      };
      callback && callback();
    },
    //基数药申领 - 保存提交
    *baseapplySave({payload, callback}, {call}) {
      const data = yield call(pharmacy.baseapplySave, payload);
      if(data.code !== 200) {
        message.error(data.msg);
        return;
      };
      callback && callback();
    },
    //药品申领 - 新建申领 - 添加产品
    *applyAddDrug({payload, callback}, {call}) {
      const data = yield call(pharmacy.applyAddDrug, payload);
      console.log(data, '添加产品');
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //基数药申领 - 新建申领 - 添加产品
    *baseapplyAddDrug({payload, callback}, {call}) {
      const data = yield call(baseDrug.baseapplyAddDrug, payload);
      console.log(data, '添加产品');
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    // 补货计划 - 详情
    *ReplenishDetails({ payload, callback },{ put, call }){
      const data = yield call(replenishment.ReplenishDetails, payload);
      if (data.code === 200 && data.msg === 'success') {
          callback && callback(data.data);
      } else {
        message.error(data.msg);
      }
    },
    //补货计划 - 新建(编辑) - 添加产品
    *addDrug({payload, callback}, {put, call}) { 
      const data = yield call(replenishment.addDrug, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //补货计划 - 新建(编辑) - 提交(保存)
    *submit({payload, callback}, {put, call}) {
      const data = yield call(replenishment.submit, payload);
      console.log(data, '保存');
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //出库单管理 - 新建 - 申领部门
    *findAllDeptsAndType({callback}, {call}) {
      const data = yield call(outStorageService.findAllDeptsAndType);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //出库单管理 - 申领部门
    *findAllDepts({callback}, {call}) {
      const data = yield call(outStorageService.findAllDepts);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //药品申领出库 - 新建出库保存
    *confirmOutStore({payload, callback}, {call}) {
      const data = yield call(outStorageService.confirmOutStore, payload);
      console.log(data, '保存');
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data);
      }else {
        message.error(data.msg);
      }
    },

    // 退货 详情
    *getBackStorageDetail({ payload,callback },{ call }){
      const data = yield call(outStorageService.genBackDetail, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取退货单详情失败')
      }
      if(callback) callback(data.data)
    },

    // 确认退货
    *submitBackStorage({ payload,callback },{ call }){
      const data = yield call(outStorageService.backStorage, payload);
      if(data.code !== 200){
        return message.error(data.msg||'退货操作失败')
      }
      if(callback) callback(data.data)
    },
    // 确认召回 或确认锁定
    *createRecallOrLocked({ payload,callback },{ call }){
      const data = yield call(outStorageService.createRecallOrLocked, payload);
      if(data.code !== 200){
        return message.error(data.msg||'操作失败')
      }
      if(callback) callback(data.data)
    },

    //补登单据 - 新建出库单
    *InsertMakeup({ payload,callback },{ call }){
      const data = yield call(base.InsertMakeup, payload);
      if(data.code !== 200){
        return message.error(data.msg)
      }
      if(callback) callback(data.data)
    },

    // 状态 类型 字典
    *orderStatusOrorderType({ payload,callback },{ call }){
      const data = yield call(replenishment.orderStatus, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取订单状态失败')
      }
      if(callback) callback(data.data)
    },
    //公用---产品搜索下拉框
    *SearchProductSelect({ payload,callback },{ call }){
      const data = yield call(base.SearchProductSelect, payload);
      if(data.code !== 200){
        return message.error(data.msg)
      }
      if(callback) callback(data.data)
    },
    // 存储查询条件
    *setQueryConditions({ payload },{ put }){
      yield put({ type: 'queryConditions', payload: payload });
    },
    // 删除存储条件
    *clearQueryConditions({ payload },{ put }){
      yield put({ type: 'clearConditions' });
    }
  },
  reducers: {
    queryConditions(state, action){
      const key = window.location.href.split('#')[1];
      return {
        ...state,
        queryConditons: {
          key, ...state.queryConditons, ...action.payload
        }
      }
    },
    updateConditions(state, action) {
      const key = window.location.href.split('#')[1];
      return {
        ...state,
        queryConditons: {
          key, 
          ...state.queryConditons, 
          ...action.payload,
          pageNo: 1
        }
      }
    },
    clearConditions(state, action){
      return {
        ...state,
        queryConditons: {}
      }
    },
    setShowHide(state, action) {
      return {
        ...state,
        display: state.display === 'none' ? 'block' : 'none'
      }
    },
    restoreShowHide(state, action) {
      return {
        ...state,
        display: 'none'
      };
    }
  },
  subscriptions: {
    
  }
}