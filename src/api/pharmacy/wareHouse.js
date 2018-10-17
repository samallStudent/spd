import {_local} from '../local';
//药房 - 申领入库
export const wareHouse = {
  APPLYLIST: `${_local}/a/apply/list`,    //药品申领列表
  QUERYDRUGBYDEPT: `${_local}/a/baseapply/queryDrugByDept`,    //基数药 - 药品申领 - 新建申领 - 添加产品列表
  QUERYDRUGBYDEPT_PHARMACY: `${_local}/a/common/queryDrugByDept`,//药房 - 药品申领 - 新建申领 - 添加产品列表
  CHECKACCEPT_LIST: `${_local}/a/checkaccept/list`,   //申领入库 - 验收列表
  FIND_STORE_PAGE: `${_local}/a/common/instore/list`,   //申领入库 - 入库单管理
  ROOMACCEPTANCE: `${_local}/a/checkaccept/shelfList`,   //申领入库 - 上架列表
  QUERY_DRUG_BY_LIST: `${_local}/a/common/queryDrugByList`,  //申领入库 - 新建申领-添加产品
  PRINT_INSTORE_DETAIL: `${_local}/a/instoredetail/print/printInstoreDetail`,   //入库单打印
  PRINT_ROOM_DETAIL: `${_local}/a/deliver/print/printRoomDetail`,     //药房验收打印
}

 // 药房 - 补登单据 
export const supplementDoc = {
  list: `${_local}/a/roommakeup/makeup/list`,  //补登单据列表
  addProductList:`${_local}/a/roomlocadjust/roomDrugList`,//补登单据新增产品列表
  addlist: `${_local}/a/roommakeupdetail/makeupdetail/addlist`, //补登入库单添加产品
}