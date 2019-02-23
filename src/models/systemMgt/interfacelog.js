/**
 * @author QER
 * @date 19/2/22
 * @Description: 接口监控
 */
import * as interfacelogService from '../../services/system/interfacelog';
import { message } from 'antd';
export default {
    namespace: 'interfacelog',
    state:{

    },
    reducers: {
    },
    effects:{
        *getAllMethodType({ payload, callback },{ put, call }){
            const data = yield call(interfacelogService.getAllMethodType, payload);
            if(callback && typeof callback === 'function'){
                callback(data);
            }
        },
        *getRequestMethods({ payload, callback },{ put, call }){
            const data = yield call(interfacelogService.getRequestMethods, payload);
            if(callback && typeof callback === 'function'){
                callback(data);
            }
        }
    },
    subscriptions: {}
}