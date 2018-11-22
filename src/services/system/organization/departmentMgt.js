/*
 * @Author: yuwei  系统管理-组织机构-部门管理
 * @Date: 2018-08-27 10:06:37 
* @Last Modified time: 2018-08-27 10:06:37 
 */
import request from '../../../utils/request';
import { _local } from '../../../api/local';


//操作部门信息（添加、修改）
export function OperSysDept(options){
  return request(`${_local}/a/sys/sysdept/saveOrUpdateDept`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
}

//部门管理 - 详情
export function DepartmentDetails(options){
  return request(`${_local}/a/sys/sysdept/detail`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//部门管理 - 新增部门 - 选择货位 -table数据

export function GetGoodsList(options){
  return request(`${_local}/a/sys/goods/list`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
}

 //部门管理-货位-新增货位 -获取所有货位类型
export function GetGoodsType(options){
  return request(`${_local}/a/dept/getLocationType`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
}

 //部门管理-货位-新增货位 -新增货位时：责任人接口
 export function GetUserList(options){
  return request(`${_local}/a/his/searchUserList`,{ 
    method: 'POST',
    type: 'formData',
    body: options
  })
}
// 新增货位
export function saveOrUpdate(options){
  return request(`${_local}/a/dept/saveOrUpdate`,{ 
    method: 'POST',
    type: 'formData',
    body: options
  })
}