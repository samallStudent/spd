/*-- 盘点损益 --*/
import request from '../../utils/request';
import { _local } from '../../api/local';

/*-- 新建盘点 --*/
//新建
export function createCheckbill(options) {
  return request(`${_local}/a/checkbill/create`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//导出
export function checkBillExport(options) {
  return request(`${_local}/a/excessive/statics/checkBillExport`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  }) 
}
//删除
export function deleteCheckBill(options) {
  return request(`${_local}/a/checkbill/delete`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
//详情头部
export function getCheckbill(options) {
  return request(`${_local}/a/checkbill/get`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//盘点
export function beginCheck(options) {
  return request(`${_local}/a/checkbill/beginCheck`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//新增批号
export function createBatchNo(options) {
  return request(`${_local}/a/checkbill/createBatchNo`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//提交
export function submitCheck(options) {
  return request(`${_local}/a/checkbill/submitCheck`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
/*-- end --*/

/*-- 盘点审核 --*/
export function auditPassOrNo(options) {
  return request(`${_local}/a/checkbill/auditPassOrNo`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
export function checkBillSheveExport(options) {
  return request(`${_local}/a/excessive/statics/checkBillSheveExport`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}
/*-- end --*/

/*-- 盘点损益 --*/
export function handlerProfitAndLoss(options) {
  return request(`${_local}/a/checkbill/handlerProfitAndLoss`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
/*-- end --*/

/*-- 损益记录 --*/
export function getCausticexcessive(options) {
  return request(`${_local}/a/causticexcessive/get`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}
//导出
export function excessiveExport(options) {
  return request(`${_local}/a/excessive/statics/excessiveExport`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}
/*-- end --*/