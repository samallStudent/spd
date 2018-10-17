import request from '../../utils/request';

export function searchAdminList(options) {
  return request(`/user/searchAdminList`, {//查询管理员列表
    method: 'POST',
    type: 'formData',
    body: options
  });
}

export function modifyAdminInfo(options) {
  return request(`/user/modifyAdminInfo`, {//编辑管理员信息
    method: 'POST',
    type: 'formData',
    body: options
  });
}

