import request from '../../utils/request';
import { _local } from '../../api/local';

//药房药库 - 工作台选项卡
export function consoleDepotlist(options){
  return request(`${_local}/a/common/console/depotlist`,{ 
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

//全院管理 - 工作台选项卡
export function purchaseConsoleList(options) {
  return request(`${_local}/a/common/console/list`,{ 
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

//全院管理 - 工作台选项详细事项
export function commonConsoleDetail(options) {
  return request(`${_local}/a/common/console/detail`,{ 
    methods: 'GET',
    type: 'formData',
    body: options
  })
}

//药房药库 - 工作台待办详情
export function consoleDepotdetail(options) {
  return request(`${_local}/a/common/console/depotdetail`,{   
    methods: 'GET',
    type: 'formData',
    body: options
  })
}