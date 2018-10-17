/* 药房- 出库 */
import request from '../../utils/request';
import { _local } from '../../api/local';

export function billoutsotreDetail(options) {
  return request(`${_local}/a/billoutsotre/detail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function outStorageExport(options) {
  return request(`${_local}/a/billoutsotre/export`, {
    method: 'POST',
    export: true,
    type: 'formData',
    body: options
  })
}