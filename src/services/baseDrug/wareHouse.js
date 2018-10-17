import request from '../../utils/request';
import { _local } from '../../api/local';

export function getCheckDetail(options) {
  return request(`${_local}/a/basemedicinedetail/getCheckDetail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function saveCheck(options) {
  return request(`${_local}/a/checkacceptdetail/basemedic`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

export function baseapplyAddDrug(options) {
  return request(`${_local}/a/baseapply/addDrug`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

export function baseCheckPrint(options) {
  return request(`${_local}/a/deliver/print/printBasicMedicDetail`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  }) 
}