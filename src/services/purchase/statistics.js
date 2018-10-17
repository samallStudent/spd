/* 采购结算 - 结算管理 */
import request from '../../utils/request';
import { _local } from '../../api/local';
/*-- 发票查询 --*/
export function invoiceDetail(options) {
  return request(`${_local}/a/invoice/detail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
};
//临效期
export function getTimeList(options) {
  return request(`${_local}/a/ypjxq/statics/getTimeList`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//结算分析列表
export function settleStaticsList(options) {
  return request(`${_local}/a/settle/statics/list`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

//供应商家列表
export function supplierAll(options) {
  return request(`${_local}/a/depot/supplier/all`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

//结算分析列表-导出
export function staticsExport(options) {
  return request(`${_local}/a/settle/statics/export`, {
    method: 'POST',
    type: 'json',
    export: true,
    body: options
  })
}
//部门
export function getDeptByParam(options) {
  return request(`${_local}/a/sys/sysdept/getDeptByParam`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

//科室退库分析footer
export function listCount(options) {
  return request(`${_local}/a/statics/kstk/listCount`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

//科室退库分析导出
export function kstkExport(options) {
  return request(`${_local}/a/statics/kstk/export`, {
    method: 'POST',
    type: 'json',
    export: true,
    body: options
  })
}

//近效期导出
export function ypjxqExport(options) {
  return request(`${_local}/a/ypjxq/statics/export`, {
    method: 'POST',
    type: 'json',
    export: true,
    body: options
  })
}

//药品分析导出
export function medicineStandingExport(options) {
  return request(`${_local}/a/statics/medicineStanding/export`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}
//损益分析导出
export function profitLossExport(options) {
  return request(`${_local}/a/excessive/statics/staticsExport`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}
//损益分析详情
export function profitLossDetailHead(options) {
  return request(`${_local}/a/excessive/statics/get`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//损益分析表格footer
export function getStatics(options) {
  return request(`${_local}/a/excessive/statics/getStatics`, {
    method: 'POST',
    type: 'formData',
    body: options
  })  
}
//供应商退货分析导出
export function supplierReturnExport(options) {
  return request(`${_local}/a/statics/supplierReturn/export`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}