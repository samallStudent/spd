/*
 * @Author: xuhao 药库 - 入库
 */

import request from '../../utils/request';
import { _local } from '../../api/local';

/* 配送单验收 */

export function detailsInfo(options) {
  return request(`${_local}/a/checkaccept/detail`,{ //配送单详情
    method: 'POST',
    type: 'formData',
    body: options
  })
};
/* 配送单验收 - 头部*/
export function checkDetailHead(options) {
  return request(`${_local}/a/exam/detailhead`,{ //配送单详情
    method: 'POST',
    type: 'formData',
    body: options
  })
};
/* 上架 */
export function putawayInfo(options) {
  return request(`${_local}/a/checkacceptdetail/shelfInfo`,{ //上架列表详情
    method: 'GET',
    type: 'formData',
    body: options
  })
};
/* 入库管理 */
export function getsupplierList(options) {     //供应商下拉框
  return request(`${_local}/a/depot/supplier/all`, {    
    method: 'POST',
    type: 'formData',
    body: options
  })
}

export function getPutStorageInfo(options) {    //入库单详情
  return request(`${_local}/a/common/instore/info`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
};

export function saveCheck(options) {       //确认验收
  return request(`${_local}/a/checkacceptdetail/checkList`, {
    method: 'POST',
    type: 'json',
    body: options
  })
};

export function putSaveCheck(options) {   //上架完成
  return request(`${_local}/a/depot/shelfList/finish`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

/*出库单管理*/
//出库单详情
export function outStoreDetailInfo(options) {
  return request(`${_local}/a/common/outstoredetail/outStoreDetailInfo`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//出库单复核通过
export function checkOutStore(options) {
  return request(`${_local}/a/common/outstoredetail/checkOutStore`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

export function instoreExport(options) {
  return request(`${_local}/a/instoredetail/print/printInstoreDetail`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })  
}

export function findOriginDept(options) {
  return request(`${_local}/a/checkaccept/findOriginDept`, {
    method: 'GET',
    type: 'formData', 
    body: options
  })  
}