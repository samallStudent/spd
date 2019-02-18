/* 人员工作统计 */
import request from '../../utils/request';
import { _local } from '../../api/local';
/*-- 人员工作统计-补货单 --*/
export function getdeptList(options) {
    return request(`${_local}/reportform/back/getdeptList`, {
        method: 'POST',
        type: 'json',
        body: options
    })
};