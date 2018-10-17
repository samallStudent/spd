/* 药库管理- 配置管理 */
import request from '../../utils/request';
import { _local } from '../../api/local';


//药库药品目录 - 补货单位下拉框
export function GetUnitInfo(options) {
  return request(`${_local}/a/depot/druginfo/getUnitInfo`,{ 
    method: 'GET',
    type: 'json',
    body: options
  })
};


//药库药品目录 - 添加药品
export function OperDeptDrug(options) {
  return request(`${_local}/a/depot/druginfo/operDeptDrug`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
};

//药库药品目录 - 移除药品
export function DeleteDeptDrug(options) {
  return request(`${_local}/a/depot/druginfo/deleteDeptDrug`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
};

//药库药品目录 - 药品详情
export function GetDrugInfo(options) {
  return request(`${_local}/a/depot/druginfo/getDrugInfo`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
};
//药库药品目录 - 编辑药品
export function EditOperDeptInfo(options) {
  return request(`${_local}/a/depot/druginfo/operDeptInfo`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
};
//药库药品目录 - 补货指示货位  [公用方法]
//positionType 货位类型(1:补货指示货位、2:拆零发药货位、3:预拆零发药、4:发药机货位、5:基数药货位)
export function getGoodsTypeInfo(options) {
  return request(`${_local}/a/dept/getLocationInfo`,{ 
    method: 'POST',
    type: 'formData',
    body: options
  })
};

//药房药品目录 - 指示货位 *4 [公用方法]
/* 货位类型(
  1:补货指示货位、replan
  2:拆零发药货位、  advance
  3:预拆零发药、   scattered
  4:发药机货位、 dispensing
  5:基数药货位) 
*/
export function getAllGoodsTypeInfo(options) {
  return request(`${_local}/a/dept/getRoomLocation`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
};




//药库药品目录 - 供应商信息
//hisDrugCode 供应商信息
export function getSupplier(options) {
  return request(`${_local}/a/depot/supplier/getSupplier`,{ 
    method: 'GET',
    type: 'formData',
    body: options
  })
};