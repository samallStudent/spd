import request from '../../utils/request';
import { _local } from '../../api/local'


export function updateSubSystems(options){
  return request(`${_local}/hscmSubSystemController/updateSubSystems`,{ //精细化-- 子系统管理 编辑系统别名和备注
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

export function getSubSystemsManager(options){
  return request(`${_local}/hscmSubSystemController/getSubSystemsManager`,{ //精细化-- 子系统管理 子系统管理员关联列表
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

export function addUser(options){
  return request(`${_local}/hscmSubSystemController/moveInSubSystemsManager`,{ //精细化-- 子系统管理 子系统管理员添加已选
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

export function removeUser(options){
  return request(`${_local}/hscmSubSystemController/moveOutSubSystemsManager`,{ //精细化-- 子系统管理 子系统管理员移除人员
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

export function getSubSystemsMenus(options){
  return request(`${_local}/hscmSubSystemController/getSubSystemsMenus`,{ //精细化-- 子系统管理 系统菜单列表
    methods: 'POST',
    type: 'formData',
    body: options
  })
}
/* 
  子系统管理员相关
*/
export function resetUserPwd(options){
  return request(`${_local}/hscmSubSystemController/resetUserPwd`,{ //精细化-- 子系统管理员  重置密码
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

export function deleteUser(options){
  return request(`${_local}/hscmSubSystemController/deleteUser`,{ //精细化-- 子系统管理员  删除用户
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

export function addOrUpdate(options){
  return request(`${_local}/hscmSubSystemController/addOrUpdateSubSystemsUser`,{ //精细化-- 子系统管理员  添加/编辑子系统管理员账号
    methods: 'POST',
    type: 'formData',
    body: options
  })
}
/* 
  科室管理相关
*/
export function insertOrmodify(options){
  return request(`${_local}/departmentController/insertOrgDept`,{ //精细化-- 科室管理  编辑/新增 机构科室
    methods: 'POST',
    body: options
  })
}

export function searchDeptAddress(options){
  return request(`${_local}/departmentController/searchDeptAddress`,{ //精细化-- 科室管理  查询科室地址
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

export function saveDeptAddress(options){
  return request(`${_local}/departmentController/saveDeptAddress`,{ //精细化-- 科室管理  修改科室地址
    methods: 'POST',
    type: 'formData',
    body: options
  })
}
export function deleteDeptAddress(options){
  return request(`${_local}/departmentController/deleteDeptAddress`,{ //精细化-- 科室管理  删除科室地址
    methods: 'POST',
    type: 'formData',
    body: options
  })
}