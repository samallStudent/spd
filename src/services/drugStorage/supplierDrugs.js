/*
 * @Author: wwb 供应商价格
 */

import request from '../../utils/request';
import { _local } from '../../api/local';

/*  供应商下拉框  */

export function genSupplierList(options) {
  return request(`${_local}/a/depot/supplier/all`,{
    method: 'POST',
    type: 'formData',
    body: options
  })
}

/* 药品详情 */
export function genDetail(options) {
  return request(`${_local}/a/supplier/price/getMedicineInfo`,{
    method: 'GET',
    type: 'formData',
    body: options
  })
}
//修改采购方式
export function updateSupplierRefPrice(options) {
  return request(`${_local}/a/supplier/price/updateSupplierRefPrice`,{
    method: 'POST',
    type: 'formData',
    body: options
  })
}


