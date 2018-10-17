/**
 * @file 补货管理 - 补货计划
 * @author chengyafang
 * @Date 2018/8/29 11:08
 */
import request from '../../utils/request';
import { _local } from '../../api/local';

// 补货计划 - 删除
export function ReplenishDelete(options) {
  return request(`${_local}/a/depot/depotplan/updateStatus`, {
    methods: 'POST',
    type: 'json',
    body: options
  })
}
// 补货计划 - 详情
export function ReplenishDetails(options) {
  return request(`${_local}/a/depot/depotplan/detail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}
//补货计划 - 添加产品
export function addDrug(options) {
  return request(`${_local}/a/depot/depotplan/addDrug`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
//补货计划 - 新建(编辑) - 保存(提交)
export function submit(options) {
  return request(`${_local}/a/depot/depotplan/save`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
// 状态
export function typelist(options) {
  return request(`${_local}/a/spd/dict/type`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
} 

// 目录外采购新建计划-- 采购部门
export function getModule(options) {
  return request(`${_local}/a/sys/sysdept/getByModule`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

/*  计划订单 */ 
// 供应商下拉框
export function supplierList(options) {
  return request(`${_local}/a/depot/supplier/all`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
// 订单状态
export function orderStatus(options) {
  return request(`${_local}/a/spd/dict/type`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

// 关闭订单
export function closeOrder(options) {
  return request(`${_local}/a/purchaseorder/closeOrder`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

 //订单状态更新
export function updateStatus(options) {
  return request(`${_local}/a/depot/depotplan/updateStatus`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}


// 计划订单 - 详情
export function planOrderDetail(options) {
  return request(`${_local}/a/purchaseorder/detail`, {
    method: 'GET',
    type: 'planCode',
    body: options
  })
}