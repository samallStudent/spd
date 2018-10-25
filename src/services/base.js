import request from '../utils/request';
import { _local } from '../api/local';


//选择产品时-根据关键字获取下拉框
export function SearchProductSelect(options){
  return request(`${_local}/a/common/queryDrugByList`,{ 
    method: 'POST',
    type: 'formData',
    body: options
  })
}


//补货单据-新增出库/入库
export function InsertMakeup(options){
  return request(`${_local}/a/roommakeupdetail/makeupdetail/insertmakeup`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
}
//药品药库基数药 - 药品目录 - 导出
export function deptExport(options) {
  return request(`${_local}/a/his/hisctmedicinematerial/export`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}

//补登 - 新建补登异常入库单
export function addAbnormalDataSource(options) {
  return request(`${_local}/a/medHisBackDetail/medhisbackdetail/druglist`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

//补登 - 新建异常入库单 - 确认
export function confrimList(options) {
  return request(`${_local}/a/medHisBackDetail/medhisbackdetail/confrimList`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
//补登 - 新建异常出库单 - 确认
export function submitBadFlowList(options) {
  return request(`${_local}/a/bill/balance/submitBadFlowList`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}