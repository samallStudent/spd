/* 药库 - 出库 */

import {_local} from '../local';
export const outStorage = {

  // 配货列表
  FINDDISTRIBUTE_LIST: `${_local}/a/commondistribute/list`,    //拣货列表

  // 退货列表
  FINDCOMMONBACK_LIST: `${_local}/a/commonback/back/list`,    //退货列表

  
  BACKSTORAGE_ADDPRODUCT_LIST: `${_local}/a/commonback/backdetail/addlist`,    // 退货添加产品列表

  ROOMRECALL_LIST: `${_local}/a/roomrecall/list`,    // 召回及锁定，召回及锁定审核列表

  ROOMRECALL_LOCK_LIST: `${_local}/a/roomrecall/lockList`,    //药房锁定列表
  ROOMRECALL_LOCK_SHEVE_LIST: `${_local}/a/roomrecall/lockSheveList`,    //药房锁定审核列表

  RECALLORLOCKADDPRODUCT_LIST: `${_local}/a/roomrecalldetail/selectProduct`,    // 召回及锁定，召回及锁定添加产品列表
  RECALLORLOCKADDPRODUCT_LOCK_LIST: `${_local}/a/roomrecalldetail/selectLockProduct`, //锁定添加产品列表
  /* 拣货下架 */
  FINDPICKINGORDER_LIT: `${_local}/a/common/pickingorder/list`,    //拣货列表
  /* 出库单管理 */
  OUTSTORELIST: `${_local}/a/common/outstore/list`,     //出库单列表
  GETFILTERDRUGINFO: `${_local}/a/common/outstoredetail/getFilterDrugInfo`,  //新建出库添加产品列表
  PRINT_DETAIL: `${_local}/a/outStoreDetail/print/printDetail`,     //出库打印
  OUT_DETAIL: `${_local}/a/deliver/print/exportAsPrint`,     //出库导出excel
  PICKING_PRINT: `${_local}/a/pickingDetail/print/printDetail`,     //拣货下架打印
  PRINT_BACK_DETAIL: `${_local}/a/backsdetail/print/printBackDetail`,     //退货打印
  ROOMRECALL_SHEVE_LIST: `${_local}/a/roomrecall/sheveList`,      //全院管理召回锁定复核列表
  QUERY_DRUG_BY_LIST: `${_local}/a/common/queryDrugByList`,
  PICKING_DETAIL_LIST: `${_local}/a/common/pickingorderdetail/detailList`,  //拣货下架详情分页
}