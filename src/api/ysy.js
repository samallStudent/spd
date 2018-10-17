import { _local } from './local';

export default {
  QUERYMENULIST: `${_local}/menu/queryMenuList`, // 查询 菜单管理菜单列表

  FINDSUBSYSTEMOCNFIGLIST: `${_local}/Configure/findSubSystemConfigList`, // 查询 子系统下配置管理列表

  SEARCHMENULIST: `${_local}/subSystem/searchMenuListBySubSystem`, // 子系统管理 查询子系统下的菜单列表

  SEARCHDEPLOYLIST: `${_local}/deploy/searchDeployList`, // 部署管理 部署列表查询

  SEARCHADMINLIST: `${_local}/user/searchAdminList`, // 部署管理 部署列表查询

  ITEMSDATADETAILS_LIST: `${_local}/staticData/searchStaticData`,//数据字典内容查询

  ITEMSDATA_LIST: `${_local}/staticData/searchStaticInfo`,//查询所有数据字典类型

  USERLOGIN: `${_local}/login/subSystemLogin` // 用户登陆
}