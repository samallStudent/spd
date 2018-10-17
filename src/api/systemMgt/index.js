/*
 * 系统管理-
 */

import {_local} from '../local';

 export const  systemMgt  = {
  RoleList:`${_local}/a/spd/sys/role/list`, //角色管理列表
  MenuList:`${_local}/a/spd/sys/menu/list`,//菜单管理列表
  SupplierList:`${_local}/a/depot/supplier/list`,//组织机构-供应商管理
  DeptList:`${_local}/a/sys/sysdept/getDeptListInfo`,//组织机构-部门管理
  findHisDept:`${_local}/a/sys/sysdept/findHisDept`,//组织机构-部门管理-新增部门-获取医院科室table
  getGoodsList:`${_local}/a/sys/goods/list`,//部门管理 - 新增部门 - 基数药 - 货位table 
  goodsAllocation:`${_local}/a/dept/getLocationPageInfo`,//部门-货位
  getGoodsLocationInfo:`${_local}/a/dept/getLocationInfo`,//部门- 新增部门 - 基数药 货位table -正在使用ing
  
  // 组织机构--用户管理
  FINDUSERLIST:`${_local}/a/his/findUserList`,  //用户管理列表
  
  // 系统设置-字典管理列表
  DICTIONARYLIST: `${_local}/a/spd/dict/list`,

  // 药品目录
  MEDICINEMATERIAL_LIST:`${_local}/a/his/hisctmedicinematerial/list`,  //药品目录基本信息列表
 }
