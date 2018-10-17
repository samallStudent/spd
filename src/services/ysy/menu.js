import request from '../../utils/request';

export function queryMenuList(options){
  return request('/menu/queryMenuList',{ //查询菜单列表
    methods: 'POST',
    type: 'formData',
    body: options
  })
}


export function modifyMenu(options){
  return request('/menu/modifyMenu',{ //编辑菜单
    methods: 'POST',
    type: 'formData',
    body: options
  })
}