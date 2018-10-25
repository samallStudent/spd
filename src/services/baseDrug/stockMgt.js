import request from '../../utils/request';
import { _local } from '../../api/local';

export function getBaseMedicineDetail(options) {
  return request(`${_local}/a/basemedicinedetail/getBaseMedicineDetail`, {
    method: 'POST',
    type: 'formData',
    body: options 
  })
}

export function getBaseMedicineDetailList(options) {
  return request(`${_local}/a/basemedicinedetail/getBaseMedicineDetailList`, {
    method: 'POST',
    type: 'formData',
    body: options 
  })
}

//打印
export function exportBaseDrug(options) {
  return request(`${_local}/a/statics/storeSelect/exportBaseDrug`, {
    method: 'POST',
    type: 'json',
    body: options,
    export: true
  })
}