/**
 * @author QER
 * @date 19/2/22
 * @Description: 接口监控
*/
import request from '../../../utils/request';
import { _local } from '../../../api/local';
// 接口分类
export function getAllMethodType(options){
    return request(`${_local}/a/interfacelog/getAllMethodType`,{
        method: 'GET',
        type: 'formData',
        body: options
    })
}
// 接口
export function getRequestMethods(options){
    return request(`${_local}/a/interfacelog/getRequestMethods`,{
        method: 'GET',
        type: 'formData',
        body: options
    })
}
//今日调用汇总
export function getLogCountByDate(options){
    return request(`${_local}/a/interfacelog/getLogCountByDate`,{
        method: 'POST',
        type: 'formData',
        body: options
    })
}
//重发接口
export function reSend(options){
    return request(`${_local}/a/interfacelog/reSend`,{
        method: 'POST',
        type: 'formData',
        body: options
    })
}
//处理完毕接口
export function handleLog(options){
    return request(`${_local}/a/interfacelog/handleLog`,{
        method: 'POST',
        type: 'formData',
        body: options
    })
}