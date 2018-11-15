/*
 * @Author: wwb 
 * @Date: 2018-08-28 15:46:26 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-28 17:37:44
 */

/* 药品目录 */
import request from '../../../utils/request';
import { _local } from '../../../api/local';

// 编辑查看详情
export function getMedicineInfo(options){
  return request(`${_local}/a/his/hisctmedicinematerial/getMedicineInfo`,{ //查询详情
    method: 'GET',
    type: 'type',
    body: options
  })
}

// 添加产品
export function operMedicineInfo(options){
  return request(`${_local}/a/his/hisctmedicinematerial/operMedicineInfo`,{ //添加产品
    method: 'POST',
    body: options
  })
}
//修改报告药标识
export function editMedicinalType(options) {
  return request(`${_local}/a/his/hisctmedicinematerial/editMedicinalType`,{ //查询详情
    method: 'POST',
    type: 'formData',
    body: options
  })
}