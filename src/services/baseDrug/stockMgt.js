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