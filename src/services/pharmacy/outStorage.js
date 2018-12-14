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


//创世新增2018-12-14-S
//发药复核操作人保存
export function reviewSave(options) {
  return request(`${_local}/a/billoutsotre/confirmDispensing`, {
      method: 'POST',
      type: 'formData',
      body: options
  })
}

//发药复核操作人搜索
export function reviewSearch(options) {
  return request(`${_local}/a/sys/user/findByLoginName`, {
      method: 'POST',
      type: 'formData',
      body: options
  })
}

//创世新增2018-12-14-E