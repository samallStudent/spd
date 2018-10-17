/*
 * @Author: wwb 
 * @Date: 2018-08-27 20:02:14 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-30 09:19:11
 */
import request from '../../../utils/request';
import { _local } from '../../../api/local';

export function resetPwd(options){
  return request(`${_local}/a/his/updatePassWord`,{ //用户管理重置密码
    method: 'POST',
    type: 'formData',
    body: options
  })
}

export function getAllDeptByCondition(options){
  return request(`${_local}/a/his/dept/getAllDeptByCondition`,{ //用户管理所属科室
    method: 'POST',
    type: 'formData',
    body: options
  })
}

export function getAllDepts(options){
  return request(`${_local}/a/sys/sysdept/getAllDepts`,{ //用户管理所属部门
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function getRoleInfo(options){
  return request(`${_local}/a/his/getRoleInfo`,{ //用户管理--获取所有得角色信息
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function findUserInfo(options){
  return request(`${_local}/a/his/findUserInfo`,{ //用户管理--获取角色信息详情
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function getFilterCareProv(options){
  return request(`${_local}/a/his/getFilterCareProv`,{ //用户管理--获取用户信息
    method: 'POST',
    type: 'formData',
    body: options
  })
}

export function operUserInfo(options){
  return request(`${_local}/a/his/operUserInfo`,{ //用户管理--编辑用户信息
    method: 'POST',
    type: 'json',
    body: options
  })
}