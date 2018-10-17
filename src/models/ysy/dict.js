/*
 * 系统管理 - 系统设置 - 字典管理
 */
import * as sysDictService from '../../services/system/sys/dict';
import { message } from 'antd';

export default {
    namespace: 'Dictionary',
    state: {},
    reducers: {},
    effects: {
        //系统设置-系统管理-字典管理-新增/编辑
        *DictSave({ payload, callback }, { put, call }) {
            const data = yield call(sysDictService.DictSave, payload);
            if (data.code === 200) {
                message.success('操作成功！');
            } else {
                message.error(data.msg);
            }
            if (callback) {
                callback();
            }
        },
        //系统设置-系统管理-字典管理-类型下拉框
        *DictTypeList({ payload, callback }, { put, call }) {
            const data = yield call(sysDictService.DictTypeList, payload);
            if (data.code !== 200) {
                message.error(data.msg);
            }
            if (callback) {
                callback(data.data);
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/ysy/dict') {
                    //监听路由变化 触发 effect 
                    console.log('字典管理');
                }
            });
        },
    }
}