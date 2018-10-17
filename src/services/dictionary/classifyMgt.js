import request from '../../utils/request';
import { _local } from '../../api/local'


export function orgStaticInfo(options){
  return request(`${_local}/staticData/orgStaticInfo`,{ //查询机构字典下拉框
    methods: 'POST',
    type: 'formData',
    body: options
  })
}
