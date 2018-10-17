/*
    药库 - 入库单管理

*/


import {_local} from '../local';
export default {
  /* 入库单 */
  depotinstoreList: `${_local}/a/common/instore/list`,    //库存列表
  depotinstoreInfo: `${_local}/a/depot/depotinstore/info`,    //库存详情
  /* 配送单 */
  depotdistributeList: `${_local}/a/checkaccept/list`,  //配送单列表
  SUPPLIER_LIST: `${_local}/a/depot/supplier/all`,    //供应商下拉
  /* 上架 */
  shelfList: `${_local}/a/depot/shelfList/selectShelf`,           //上架列表
  PRINT_INSTORE_DETAIL: `${_local}/a/instoredetail/print/printInstoreDetail`,   //入库管理打印
  PRINT_DETAIL: `${_local}/a/deliver/print/printDetail`,      //药库验收打印
}