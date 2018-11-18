/* 采购结算 - 结算管理 */
import request from '../../utils/request';
import { _local } from '../../api/local';
//药品调价 - 详情头部
export function checkpriceGetDetail(options) {
  return request(`${_local}/a/checkprice/getDetail`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

//药品调价 - 提交调价
export function checkpriceDetaiConfrim(options) {
  return request(`${_local}/a/checkpricedetail/confrim`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}