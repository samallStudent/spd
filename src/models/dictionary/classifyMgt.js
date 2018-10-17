import * as classifyService from '../../services/dictionary/classifyMgt';
// import { message } from 'antd';

export default {
  namespace: 'classify',
  state: {
    selectDatas: []
  },
  reducers: {
    orgInfo(state,action){
      return {
        ...state,
        selectDatas: action.payload
      }
    }
  },
  effects: {
    *orgStaticInfo({ payload },{ put, call }){
      const data = yield call(classifyService.orgStaticInfo, payload);
      if(data.status){
        yield put({ type: 'orgInfo',payload: data.result });
      }
    }
    
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/dictionary/classifyMgt') {
          //监听路由变化 触发 effect 
          console.log('分类管理')
        }
      });
    },
  }
}