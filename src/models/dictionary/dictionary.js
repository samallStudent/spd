import * as dictionaryService from '../../services/dictionary/dictionary';
import { message } from 'antd';

export default {
  namespace: 'dictionary',
  state: {
    defaultExpandedKeys: '',
    defaultSelectedKeys: '',
    treeData: [],
  },
  reducers: {
    showTreeData(state,action){
      return {
        treeData: action.payload,
        defaultExpandedKeys: action.payload[0].staticId,
        defaultSelectedKeys: action.payload[0].children[0] === undefined ? action.payload[0].staticId:  action.payload[0].children[0].staticId
      }
    }
  },
  effects: {
    *searchTree({ payload,callback },{ put, call }){
      const data = yield call(dictionaryService.searchStaticByOrgId, payload);
      if(data.status){
        yield put({ type: 'showTreeData', payload: data.result });
        if (callback) callback();
      }else{
        message.error(data.msg|| '获取字典树菜单失败')
      }
    },
    // 编辑菜单
    *updateStaticData({ payload,callback },{ call }){
      const data = yield call(dictionaryService.updateStaticData, payload);
      if(data.status){
        message.success('编辑菜单成功');
        if (callback) callback();
      }else{
        message.error(data.msg||'编辑菜单失败')
      }
    },
    *insertData({ payload,callback },{ call }){
      const data = yield call(dictionaryService.insertData, payload);
      if(data.status){
        message.success('新增菜单成功');
        if (callback) callback();
      }else{
        message.error(data.msg||'新增菜单失败')
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/dictionary/dictionaryMgt') {
          //监听路由变化 触发 effect 
          console.log('字典管理')
        }
      });
    },
  }
}