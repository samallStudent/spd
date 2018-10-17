/* 药房- 申领入库 */
import request from '../../utils/request';
import { _local } from '../../api/local';

export function drugsForInfo(options) {
  return request(`${_local}/a/apply/detail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
};

export function baseDrugsForInfo(options) {
  return request(`${_local}/a/baseapply/detail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function selectApplyDept(options) {
  return request(`${_local}/a/apply/selectApplyDept`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
};

export function applySubmit(options) {
  return request(`${_local}/a/apply/save`, {
    method: 'POST',
    type: 'json',
    body: options
  })
};

export function saveCheck(options) {
  return request(`${_local}/a/checkacceptdetail/checkList`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

export function applyAddDrug(options) {
  return request(`${_local}/a/apply/addDrug`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

/* 补登单据 */
/* 删除 */
export function DeleteMakeup(options) {
  return request(`${_local}/a/roommakeup/makeup/delete`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
//补货单据-查详情
export function GETMakeupDetail(options){
  return request(`${_local}/a/roommakeup/makeup/info`,{ 
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//补货单据-审核
export function CheckMakeupDetail(options){
  return request(`${_local}/a/roommakeup/makeup/makeupSumit`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
}
//补货单据-再次提交
export function SubmitAgainMakeupDetail(options){
  return request(`${_local}/a/roommakeupdetail/makeupdetail/submitAgain`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
}
//药库 - 入库单详情
export function findStorePage(options) {
  return request(`${_local}/a/common/instore/info`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
};

export function roomacceptanceInfo(options) {
  return request(`${_local}/a/checkacceptdetail/shelfInfo`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function finish(options) {
  return request(`${_local}/a/checkacceptdetail/finish`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

export function baseapplySave(options) {
  return request(`${_local}/a/baseapply/save`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}