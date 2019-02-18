import * as reportform from '../../services/purchase/reportform';
/* 采购结算 -  统计 & 发票 */
export default {
    namespace: 'reportform',
    state: {},
    reducers: {},
    effects: {
        //发票查询详情
        *getdeptList({payload, callback}, {call}) {
            const data = yield call(reportform.getdeptList, payload);
            if(typeof callback === 'function') {
                callback && callback(data);
            };
        },

    }
}