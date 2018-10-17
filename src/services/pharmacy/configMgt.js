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