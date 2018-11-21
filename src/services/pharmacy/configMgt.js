/* 药房- 配置管理 */
import request from '../../utils/request';
import { _local } from '../../api/local';

/* 基数药目录 */

export function getDeptNameByCode(options) {
  return request(`${_local}/a/basemedicinedetail/getDeptNameByCode`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

export function pitchOnCardinalMedicine(options) {
  return request(`${_local}/a/basemedicinedetail/pitchOnCardinalMedicine`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

export function findBaseMedicineDeptlist(options) {
  return request(`${_local}/a/basemedicinedetail/findBaseMedicineDeptlist`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function MoveCardinalMedicineDetail(options) {
  return request(`${_local}/a/basemedicinedetail/MoveCardinalMedicineDetail`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

export function getHisMedicineBound(options) {
  return request(`${_local}/a/basemedicinedetail/getHisMedicineBound`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

/*-- end --*/
//抢救车目录管理抢救车下拉
export function findRoomDeptlist(options) {
  return request(`${_local}/a/rescuecardetail/findRoomDeptlist`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//抢救车目录详情
export function rescuecarGetDeptNameByCode(options) {
  return request(`${_local}/a/rescuecardetail/getDeptNameByCode`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

export function editRescuecarQuantity(options) {
  return request(`${_local}/a/rescuecardetail/getHisMedicineBound`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

export function findAllCardinalMedicineDeptList(options) {
  return request(`${_local}/a/basemedicinedetail/findAllCardinalMedicineDeptList`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

//抢救车目录药品新增
export function pitchOnCardinalRescuecar(options) {
  return request(`${_local}/a/rescuecardetail/pitchOnCardinalMedicine`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}