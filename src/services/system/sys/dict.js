/**
 * @file 系统管理-系统设置-字典管理
 * @author chengyafang
 * @Date 2018/8/28 19:07
 */

import request from '../../../utils/request';
import { _local } from '../../../api/local';

//新增/编辑
export function DictSave(options) {
  return request(`${_local}/a/spd/dict/save`, {
    methods: 'POST',
    type: 'formData',
    //   credentials: 'omit',
    body: options
  })
}
//类型下拉框
export function DictTypeList(options) {
  return request(`${_local}/a/spd/dict/typelist`, {
    methods: 'POST',
    type: 'formData',
    //   credentials: 'omit',
    body: options
  })
}

