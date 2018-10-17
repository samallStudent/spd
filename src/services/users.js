import request from '../utils/request';
import { _local } from '../api/local'

export function EncryptPassword(options){
  return request(`${_local}/a/entryPass/entryptPassword`,{ //密码加密
    method: 'POST',
    type: 'formData',
    credentials: 'include',
    body: options
  })
}
export function userLogin(options){
  let body = options.refresh ? {} : options;
  return request(`${_local}/a/login`,{ //登陆
    method: options.refresh ? 'GET': 'POST',
    type: 'formData',
    credentials: 'include',
    body: body
  })
}

export function cacheCurrentDept(options){
  return request(`${_local}/a/cacheCurrentDept/${options.id}`,{ //设置当前系统，系统切换
    method: 'GET',
    type: 'formData',
    credentials: 'include',
    body: {}
  })
}


