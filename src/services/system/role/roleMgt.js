/*
 * @Author: yuwei 系统管理 - 角色管理-角色管理
 * @Date: 2018-08-27 16:07:56 
* @Last Modified time: 2018-08-27 16:07:56 
 */

import request from '../../../utils/request';
import { _local } from '../../../api/local';


//新增角色
export function RoleSave(options){
  return request(`${_local}/a/spd/sys/role/save`,{ 
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//删除角色
export function RoleDelete(options){
  return request(`${_local}/a/spd/sys/role/delete`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
}
//角色详情
export function RoleDetail(options){
  return request(`${_local}/a/spd/sys/role/detail`,{ //新增角色
    method: 'GET',
    type: 'formData',
    body: options
  })
}
//角色详情列表
export function allMenuList(options) {
  return request(`${_local}/a/spd/sys/menu/allMenuList`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}