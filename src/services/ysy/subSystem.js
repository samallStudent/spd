import request from '../../utils/request';

export function searchSubSystemTrees(options) {
  return request(`/subSystem/searchSubSystemTreeTis`, { //查询子系统列表
    method: 'POST',
    type: 'formData',
    body: options
  });
}
export function addSubSystem(options) {
  return request(`/subSystem/addSubSystem`, { //新建子系统
    method: 'POST',
    type: 'formData',
    body: options
  }); 
}

export function updateSubSystem(options) {
  return request(`/subSystem/updateSubSystem`, { //编辑子系统
    method: 'POST',
    type: 'formData',
    body: options
  }); 
}

export function deleteSubSystem(options) {
  return request(`/subSystem/deleteSubSystem`, {  //删除子系统
    method: 'POST',
    type: 'formData',
    body: options
  });
}

export function searchMenuListBySubSystem(options) {
  return request(`/subSystem/searchMenuListBySubSystem`, {//查询子系统下的菜单列表
    method: 'POST',
    type: 'formData',
    body: options
  }); 
}

export function findMenuById(options) {
  return request(`menu/findMenuById`, { //根据输入id 查询菜单信息
    method: 'POST',
    type: 'formData',
    body: options
  }); 
}

export function addMenu(options) {
  return request(`subSystem/addMenu`, { //子系统下添加新菜单
    method: 'POST',
    type: 'formData',
    body: options
  }); 
}