import request from '../../utils/request';
import { _local } from '../../api/local';
 //抢救车库存-详情 - 表头
export function getRescuecarMedicineDetail(options) {
  return request(`${_local}/a/rescuecardetail/getRescuecarMedicineDetail`, {
    method: 'POST',
    type: 'formData',
    body: options 
  })
}

 //抢救车库存-货位-下拉框
 export function findDeptlist(options) {
  return request(`${_local}/a/rescuecardetail/findDeptlist`, {
    method: 'POST',
    type: 'formData',
    body: options 
  })
}