/*
 * @Author: yuwei  系统管理-组织机构-供应商管理
 * @Date: 2018-08-27 10:06:37 
* @Last Modified time: 2018-08-27 10:06:37 
 */
import request from '../../../utils/request';
import { _local } from '../../../api/local';


//供应商保存
export function SupplierSave(options){
  return request(`${_local}/a/depot/supplier/save`,{
    methods: 'POST',
    type: 'formData',
    body: options
  })
}
//删除供应商
export function SupplierDelete(options){
  return request(`${_local}/a/depot/supplier/delete`,{
    methods: 'POST',
    type: 'formData',
    body: options
  })
}