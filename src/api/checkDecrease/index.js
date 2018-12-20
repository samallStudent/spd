/*-- 盘点损益 --*/
import {_local} from '../local';

export const common = {
  CHECKBILL_LIST: `${_local}/a/checkbill/list`,   //盘点列表
  SUPPLIER_LIST: `${_local}/a/depot/supplier/all`,     //供应商下拉
  QUERY_DRUG_BY_LIST: `${_local}/a/common/queryDrugByList`,  //搜索
  SHEVE_LIST: `${_local}/a/checkbill/sheveList`,        //全院盘点审核
  QUERY_DEPT_LOCATION_INFO: `${_local}/a/dept/queryDeptLocationInfo`, //查询部门下货位
}
/*-- 新建盘点 --*/
export const checkDecrease = {
  GET_LIST_BY_BILLNO: `${_local}/a/checkbilldetail/getListByBillNo`,    //详情底部
  CHECK_BILL_PRINT: `${_local}/a/checkbill/print/checkBillPrint`,   //新建盘点打印
  CHECK_BILL_SHEVE_PRINT: `${_local}/a/checkbill/print/checkBillShevePrint`,    //盘点审核打印
}



/*-- 损益记录 --*/
export const profiLossRecord = {
  CAUSTICEXCESSIVE_LIST: `${_local}/a/causticexcessive/list`,     //列表
  GET_LIST_BY_BILLNO: `${_local}/a/causticexcessive/getListByBillNo`,  //详情底部
  CAUSTIC_EXCESSIVE_PRINT: `${_local}/a/checkbill/print/causticExcessivePrint`,   //损益记录打印
}

