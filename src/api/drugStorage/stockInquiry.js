/*药库 - 库存*/

import {_local} from '../local';

export default {
  queryDrugByDept: `${_local}/a/StoreDetail/list`,      //库存列表
  getDetailList: `${_local}/a/StoreDetail/getRoomRepertoryDetailList`,    //库存详情列表
  getDetail: `${_local}/StoreDetail/getRoomRepertoryDetail`,    //库存详情头部
  locList : `${_local}/a/StoreDetail/locList`,               // 货位下拉列表
}