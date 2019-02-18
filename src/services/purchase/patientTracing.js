/* 采购结算 - 结算管理 */
import request from '../../utils/request';
import { _local } from '../../api/local';

export function post(url,options){
    return request(`${_local}${url}`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}
export function get(url,options){
    return request(`${_local}${url}`, {
        method: 'GET',
        type: 'json',
        body: options
    })
}
//批号追溯详情－当前库存
export function batchGetStore(options) {
    return request(`${_local}/a/common/trace/getStore`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}
//批号追溯详情－采购验收记录
export function batchGetPlanAndCheck(options) {
    return request(`${_local}/a/common/trace/getPlanAndCheck`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}
//批号追溯详情－院内流通记录
export function batchMedCirculate(options) {
    return request(`${_local}/a/common/trace/medCirculate`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}
//批号追溯详情－发药记录
export function batchGetDispensing(options) {
    return request(`${_local}/a/common/trace/getDispensing`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}

//批号追溯详情－非发药消耗
export function batchGetMakeUp(options) {
  return request(`${_local}/a/common/trace/getMakeUp`, {
      method: 'POST',
      type: 'formData',
      body: options
  })
}

//批号追溯详情头部－基本信息
export function batchGetDrugInfo(options) {
    return request(`${_local}/a/common/trace/getDrugInfo`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}