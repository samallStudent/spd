import * as accreditService from '../../services/ysy/accredit';
import { message } from 'antd';


export default {
  namespace: 'accredit',
  state: {
    dataSource: [],
    subSystemList: [],
    modalSubSystemList: [],
    selectedSystem: {},// 选中的部署 / 机构信息
    loading: false,
    subLoading: false,
    dirtyClick: false,
    visible: false,
    baseData: {}
  },
  reducers: {
    // 部署列表
    GendeployList(state,action){
      return {
        ...state,
        dataSource: action.payload,
      }
    },
    //授权子系统列表
    searchSystemList(state,action){
      return {
        ...state,
        subSystemList: action.payload,
        modalSubSystemList: [...action.payload]
      }
    },
    targetDetail(state,action){
      return {
        ...state,
        baseData: action.payload
      }
    },
    loading(state,action){
      if(action.payload){
        return {
          ...state,
          subLoading: !state.subLoading
        }
      }else{
        return {
          ...state,
          loading: !state.loading
        }
      }
    },
    selectSystem(state,action){
      console.log(action.payload,'system');
      return {
        ...state,
        selectedSystem: action.payload
      }
    },
    modalVisible(state,action){
      return {
        ...state,
        visible: !state.visible
      }
    },
    changeFlag(state,action){
      let { modalSubSystemList } = state;
      // console.log(subSystemList,'subSystemList');
      // console.log(modalSubSystemList,'modalSubSystemList')
      let index = modalSubSystemList.findIndex((item,index,arr)=> item.subSystemId === action.payload.subSystemId);
      modalSubSystemList[index].relFlag = modalSubSystemList[index].relFlag === '00'? '01': '00';
      // console.log(modalSubSystemList[index],'modal')
      return {
        ...state,
        modalSubSystemList: modalSubSystemList
      }
    },
    dirtyClick(state){
      return {
        ...state,
        dirtyClick: !state.dirtyClick
      }
    }
  },
  effects: {
    *deployList({ payload },{ put,call }){
      yield put({ type: 'loading' });
      const data = yield call(accreditService.searchDeployList,{ ...payload });
      yield put({ type: 'loading' });
      if(data.status){
        yield put({ type: 'GendeployList',payload: data.result });
      }else{
        message.error(data.msg||'获取部署列表失败')
      }
    },
    // 部署信息 
    *showTargetDetail({ payload },{ put }){
      yield put({ type: 'targetDetail',payload })
    },
    // 查询子系统列表
    *searchSubSystemList({ payload },{ put,call }){
      yield put({ type: 'loading',payload: { key: 'subSystem' } });
      const data = yield call(accreditService.searchSubSystemList, {...payload});
      yield put({ type: 'loading',payload: { key: 'subSystem' } });
      if(data.status){
        // 保存部署id  orgId 
        yield put({ type: 'selectSystem', payload });
        yield put({ type: 'searchSystemList',payload: data.result })
      }else{
        message.error(data.msg||'查询子系统失败')
      }
    },
    *modifySubSystem({ payload },{ put,call, select }){
      yield put({ type: 'dirtyClick' });
      const data = yield call(accreditService.modifySubSystemList,{ ...payload });
      yield put({ type: 'dirtyClick' });
      if(data.status){
        message.success('编辑成功');
        yield put({ type: 'modalVisible' });
        // 查询子系统列表
        const stateData = yield select(state => state.accredit);
        const { selectedSystem } = stateData;
        yield put({ type: 'searchSubSystemList',payload: {...selectedSystem} });
      }else{
        message.error(data.msg || '编辑失败');
      }
    },
    *showModal({ payload },{ put }){
      yield put({ type: 'modalVisible' })
    },
    *flagChange({ payload },{ put }){
      yield put({ type: 'changeFlag',payload: payload });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/ysy/accredit') {
          //监听路由变化 触发 effect 
          console.log('授权管理')
        }
      });
    },
  }
}