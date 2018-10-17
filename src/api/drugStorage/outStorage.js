/* 药库 - 出库 */

import {_local} from '../local';
export const outStorage = {

  // 配货列表
  FINDDISTRIBUTE_LIST: `${_local}/a/commondistribute/list`,    //拣货列表

  // 退货列表
  FINDCOMMONBACK_LIST: `${_local}/a/commonback/back/list`,    //退货列表

  
  BACKSTORAGE_ADDPRODUCT_LIST: `${_local}/a/commonback/backdetail/addlist`,    // 退货添加产品列表

  ROOMRECALL_LIST: `${_local}/a/roomrecall/list`,    // 召回及锁定，召回及锁定审核列表

  RECALLORLOCKADDPRODUCT_LIST: `${_local}/a/roomrecalldetail/selectProduct`,    // 召回及锁定，召回及锁定添加产品列表

  /* 拣货下架 */
  FINDPICKINGORDER_LIT: `${_local}/a/common/pickingorder/list`,    //拣货列表
  /* 出库单管理 */
  OUTSTORELIST: `${_local}/a/common/outstore/list`,     //出库单列表
  GETFILTERDRUGINFO: `${_local}/a/common/outstoredetail/getFilterDrugInfo`,  //新建出库添加产品列表
  PRINT_DETAIL: `${_local}/a/outStoreDetail/print/printDetail`,     //出库打印
  PICKING_PRINT: `${_local}/a/pickingDetail/print`,     //拣货下架打印
  PRINT_BACK_DETAIL: `${_local}/a/backsdetail/print/printBackDetail`,     //退货打印
}