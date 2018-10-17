import request from '../../utils/request';
import { _local } from '../../api/local'


export function searchStaticByOrgId(options){
  return request(`${_local}/staticData/searchStaticByOrgId`,{ //查询本机构的数据字典类型
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

export function updateStaticData(options){
  return request(`${_local}/staticData/updateStaticData`,{ //数据字典内容编辑
    methods: 'POST',
    type: 'formData',
    body: options
  })
}

export function insertData(options){
  return request(`${_local}/staticData/insertStaticData`,{ //数据字典内容 新增
    methods: 'POST',
    type: 'formData',
    body: options
  })
}