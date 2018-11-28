import request from '../../utils/request';
import { _local } from '../../api/local';
 //抢救车库存-详情 - 表头
export function getRescuecarMedicineDetail(options) {
  return request(`${_local}/a/rescuecardetail/getRescuecarMedicineDetail`, {
    method: 'POST',
    type: 'formData',
    body: options 
  })
}

 //抢救车库存-货位-下拉框
 export function findDeptlist(options) {
  return request(`${_local}/a/rescuecardetail/findDeptlist`, {
    method: 'GET',
    type: 'formData',
    body: options 
  })
}

//抢救车新建退库详情
export function rescuecarBackInfo(options) {
  return request(`${_local}/a/rescueCar/rescuecarBack/rescuecarBackInfo`, {
    method: 'POST',
    type: 'formData',
    body: options 
  })
}

//抢救车新建退库确认
export function rescueCarBackSubmit(options) {
  return request(`${_local}/a/rescueCar/rescuecarBack/backSubmit`, {
    method: 'POST',
    type: 'json',
    body: options 
  })
}

//新建申领抢救车下拉
export function applyRescuecarList(options) {
  return request(`${_local}/a/rescuecarapply/rescuecarlist`, {
    method: 'GET',
    type: 'formData',
    body: options 
  })
}

//抢救车申领详情
export function rescuecarApplyDetail(options) {
  return request(`${_local}/a/rescuecarapply/detail`, {
    method: 'GET',
    type: 'formData',
    body: options 
  })
}

//抢救车-台账-供应商
export function getSuppliers(options) {
  return request(`${_local}/a/statics/rescuecar/getSuppliers`, {
    method: 'GET',
    type: 'json',
    body: options 
  })
}

//抢救车-台账-抢救车货位
export function getDepts(options) {
  return request(`${_local}/a/rescuecarapply/rescuecarlist`, {
    method: 'GET',
    type: 'json',
    body: options 
  })
}

//抢救车-台账-类型
export function getType(options) {
  return request(`${_local}/a/spd/dict/type`, {
    method: 'POST',
    type: 'json',
    body: options 
  })
}

//抢救车-台账-导出
export function exportList(options) {
  return request(`${_local}/a/statics/rescuecar/export`, {
    method: 'POST',
    type: 'json',
    body: options ,
    export: true
  })
}

//申领确认添加产品
export function rescuecarApplyAddDrug(options) {
  return request(`${_local}/a/rescuecarapply/addDrug`, {
    method: 'POST',
    type: 'json',
    body: options ,
  })
}

//新建申领确认提交
export function rescuecarApplySave(options) {
  return request(`${_local}/a/rescuecarapply/save`, {
    method: 'POST',
    type: 'json',
    body: options ,
  })
}

//抢救车药品验收
export function rescuecarSaveCheck(options) {
  return request(`${_local}/a/checkacceptdetail/rescuecar`, {
    method: 'POST',
    type: 'json',
    body: options ,
  })
}