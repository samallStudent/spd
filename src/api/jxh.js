import { _local } from './local';

export default {
 GETSUBSYSTEMS : `${_local}/hscmSubSystemController/getSubSystems`,// 查询机构管理员的子系统列表

 FINDSUBSYSTEMMANAGER : `${_local}/hscmSubSystemController/findSubSystemsManager`,// 精细化--子系统管理员 子系统管理员列表

 DEPT_LIST: `${_local}/departmentController/findOrgDeptList4kehu`,//查询科室信息列表

 
}