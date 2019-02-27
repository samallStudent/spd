/*
 * @Author: wwb 
 * @Date: 2018-08-31 21:28:10 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-09-06 19:08:43
 */

import request from '../../utils/request';
import { _local } from '../../api/local';

/*  出库   */
// 受理配货

export function genDeptList(options) { // 已申领部门
  return request(`${_local}/a/commondistribute/applyDeptList`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
};

// 受理配货 详情
export function distributeDetail(options) { // 配货单据详情
  return request(`${_local}/a/commondistribute/distributeDetail`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
};

// 受理配货 单条配货详情
export function getSingleDetail(options) { // 配货单据详情
  return request(`${_local}/a/commondistribute/singleQuery`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
};

// 受理配货 配货信息变更
export function singUpdate(options) { //
  return request(`${_local}/a/commondistribute/singleUpdate`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
};


// 受理配货 配货状体变更事件
export function distributeEvent(options) { // 配货单据详情
  return request(`${_local}/a/commondistribute/distributeEvent`,{ 
    method: 'POST',
    type: 'formData',
    body: options
  })
};

/* 拣货 */

export function findApplyDepts(options) { // 拣货申请部门
  return request(`${_local}/a/common/pickingorder/findAllDepts`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
};

// 
export function getPickingDetail(options) { // 拣货详情
  return request(`${_local}/a/common/pickingorderdetail/getPickingDetail`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
};

export function getPickingDetailPad(options) {
  return request(`${_local}/a/common/pickingorderdetail/getPickingDetailPad`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function finishPicking(options) { // 确认拣货
  return request(`${_local}/a/common/pickingorder/finishPicking`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
};


/*出库单管理*/
//出库单详情
export function outStoreDetailInfo(options) {
  return request(`${_local}/a/common/outstoredetail/detailInfo`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//出库单删除 
export function deleteOutStore(options) {
  return request(`${_local}/a//common/outstore/deleteOutStore`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
//出库单详情通过与未通过
export function outStoreDetailList(options) {
    return request(`${_local}/a/common/outstoredetail/outStoreDetailList`, {
        method: 'POST',
        type: 'json',
        body: options
    })
};
//出库单复核通过
export function checkOutStore(options) {
  return request(`${_local}/a/common/outstoredetail/checkOutStore`, {
    method: 'POST',
    type: 'json',
    body: options
  })
};
//出库单不通过
export function rejectOutStore(options) {
  return request(`${_local}/a/common/outstoredetail/rejectOutStore`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
//出库单 - 新建申领下拉框
export function findAllDeptsAndType(options) {
  return request(`${_local}/a/common/outstore/findAllDeptsAndType`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//出库单管理 - 申领下拉框
export function findAllDepts(options) {
  return request(`${_local}/a/common/outstore/findAllDepts`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//出库单管理 - 申领下拉框 严峻的接口修改
export function findAllDeptsList(options) {
  return request(`${_local}/a/common/outstore/findAllDeptList`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//出库单新建出库单保存
export function confirmOutStore(options) {
  return request(`${_local}/a/common/outstore/confirmOutStore`,{
    method: 'POST',
    type: 'json',
    body: options
  })
}
 //  出库 -- 退货
 // 供应商
 export function genSupplierList(options) {
  return request(`${_local}/a/depot/supplier/all`,{
    method: 'POST',
    type: 'formData',
    body: options
  })
}

// 退货详情
export function genBackDetail(options) {
  return request(`${_local}/a/commonback/back/info`,{
    method: 'POST',
    type: 'formData',
    body: options
  })
}

// 退货 确认操作
export function backStorage(options) {
  return request(`${_local}/a/commonback/backdetail/backSubmit`,{
    method: 'POST',
    type: 'json',
    body: options
  })
}
// 退货 确认操作
export function backSubmit(options) {
  return request(`${_local}/a/basemedicine/baseBack/backSubmit`,{
    method: 'POST',
    type: 'json',
    body: options
  })
}

/* 召回及锁定 */  
// 删除召回单据
export function deleteRecall(options) {
  return request(`${_local}/a/roomrecall/delete`,{
    method: 'POST',
    type: 'json',
    body: options
  })
}
// 详情
export function genDetail(options) {
  return request(`${_local}/a/roomrecall/getDetail`,{
    method: 'POST',
    type: 'formData',
    body: options
  })
}
// 确认锁定 或 确认审核
export function createRecallOrLocked(options) {
  return request(`${_local}/a/roomrecall/create`,{
    method: 'POST',
    type: 'json',
    body: options
  })
}

export function createLock(options) {
  return request(`${_local}/a/roomrecall/createLock`,{
    method: 'POST',
    type: 'json',
    body: options
  })
}
// 取消锁定
export function cancelLocked(options) {
  return request(`${_local}/a/roomrecall/cancelLock`,{
    method: 'POST',
    type: 'formData',
    body: options
  })
}

 /*  召回审核  */
// 批量通过
export function batchAudit(options) {
  return request(`${_local}/a/roomrecall/batchThroughAudit`,{
    method: 'POST',
    type: 'json',
    body: options
  })
}
//锁定审核通过
export function batchThroughAuditLock(options) {
  return request(`${_local}/a/roomrecall/batchThroughAuditLock`,{
    method: 'POST',
    type: 'json',
    body: options
  })
}
 // 召回审核不通过
export function reject(options) {
  return request(`${_local}/a/roomrecall/reject`,{
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//药房锁定 审核不通过
export function rejectLock(options) {
  return request(`${_local}/a/roomrecall/rejectLock`,{
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//发起部门
export function getDeptInfoAndStore(options) {
  return request(`${_local}/a/sys/sysdept/getDeptInfoAndStore`,{
    method: 'POST',
    type: 'formData',
    body: options
  })
}

export function findDepotDeptlist(options) {
  return request(`${_local}/a/commonback/backdetail/findDepotDeptlist`,{
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function exportOutStorageDetalis(options) {
  return request(`${_local}/a/statics/back/export`,{
    method: 'POST',
    type: 'json',
    body: options,
    export: true
  })
}
