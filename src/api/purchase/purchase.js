/*-- 结算管理 --*/
import {_local} from '../local';

//公共

export const common = {
  QUERY_DRUG_BY_LIST: `${_local}/a/common/queryDrugByList`,   //通用名|产品名 查询药品列表
}

//结算单
export const settlementMgt = {
  SETTLE_LIST: `${_local}/a/settle/list`,       //结算单管理列表
  DETAIL_LIST: `${_local}/a/settle/detailList`, //结算单详情列表
  PRINT_DELIVERY_DETAIL: `${_local}/a/settlebill/print/printDeliveryDetail`,  //结算单打印
};

//日对账单
export const dayStatements = {
  DAILY_LIST: `${_local}/a/bill/balance/dailyList`,   //日对账单列表
  DAILY_DETAIL_LIST: `${_local}/a/bill/balance/dailyDetailList`,//日对账单详情列表
  GENERATOR_DAILY_LIST: `${_local}/a/bill/balance/generatorDailyList`,//生成对账单列表printDeliveryDetail
  PRINT_DELIVERY_DETAIL: `${_local}/a/dailybill/print/printDeliveryDetail`,   //打印
}

//发票查询
export const invoiceQueryMenu = {
  INVOICE_LIST: `${_local}/a/invoice/list`,     //发票查询列表
}

//统计分析
export const statisticAnalysis = {
  STATICS_LIST: `${_local}/a/ypjxq/statics/list`,   //近效期列表
  GET_DEPT_BY_PARAM: `${_local}/a/sys/sysdept/getDeptByParam`,    //供应商下拉
  KSTK_LIST: `${_local}/a/statics/kstk/list`,             //科室退库分析列表
  DRUG_LEDGER: `${_local}/a/statics/medicineStanding/drugLedger`, //药品台账列表
  EXCESSIVE_LIST: `${_local}/a/excessive/statics/list`,           //损益分析列表
  PROFIT_LOSS_DETAIL_LIST: `${_local}/a/excessive/statics/getDetail`,   //损益分析详情列表
  SUPPLIER_RETURN_LIST: `${_local}/a/statics/supplierReturn/list`,  //供应商退货分析列表
}