import * as subMgtService from '../../services/manager/subSystemMgt';
import { message } from 'antd';

export default {
  namespace: 'subSystemMgt',
  state: {
    leftDataSource: [],// 模态框管理员关联列表 左侧列表  已选
    rightDataSource: [], // 右侧列表  未选 
    leftSearchData: [],
    rightCacheData: [],
    systemMenuList: []
  },
  reducers: {
    managerData(state,action){
      let leftDataSource = [], rightDataSource = [],rightCacheData = [], leftCacheData = [];
      action.payload.map(item=>{
        if(item.isSelected === '0'){
          rightDataSource.push(item);
          rightCacheData.push(item);
        }else{
          leftDataSource.push(item);
          leftCacheData.push(item);
        }
        return null;
      });
      return {
        ...state,
        leftDataSource,
        leftCacheData,
        rightDataSource,
        rightCacheData
      }
    },
    systemMenu(state,action){
      return {
        ...state,
        systemMenuList: action.payload
      }
    },
    searchData(state,action){
      if(action.payload.dir === 'left'){
        return {
          ...state,
          leftDataSource: action.payload.dataSource
        }
      }else{
        return {
          ...state,
          rightDataSource: action.payload.dataSource
        }
      }
    },
    novalueSearch(state,action){
      if(action.payload.dir === 'left'){
        return {
          ...state,
          leftDataSource: state.leftCacheData
        }
      }else{
        return {
          ...state,
          rightDataSource: state.rightCacheData
        }
      }
    }
  },
  effects: {
    // 修改 系统别名  备注 
    *updateSubSystems({ payload, callback },{ call }){
      const data = yield call(subMgtService.updateSubSystems, payload);
      if(data.status){
        message.success('编辑成功');
        if (callback) callback();
      }else{
        message.error(data.msg|| '编辑失败')
      }
    },
    // 获取管理员关联列表 
    *getSubSystemsManager({ payload,callback },{ put, call }){
      const data = yield call(subMgtService.getSubSystemsManager, payload);
      if(data.status){
        yield put({ type: 'managerData',payload: data.result });
        if (callback) callback();
      }else{
        message.error(data.msg||'获取管理员关联列表失败')
      }
    },
    *modalSearch({ payload,callback },{ select, put }){
      const stateData = yield select(state=> state.subSystemMgt);
      let { leftDataSource,rightDataSource } = stateData;
      let newleftData = [], newRightData = []
      if(payload.dir === 'left'){
        if(payload.searchName){
          newleftData =  leftDataSource.filter(item=> item.userName.includes(payload.searchName));
          yield put({ type: 'searchData',payload: { dataSource: newleftData, dir: 'left'} })
        }else{
          yield put({ type: 'novalueSearch',payload: { dir: 'left' } })
        }
      }else{
        if(payload.searchName){
          newRightData = rightDataSource.filter(item=> item.userName.includes(payload.searchName));
          yield put({ type: 'searchData',payload: { dataSource: newRightData, dir: 'right' } })
        }else{
          yield put({ type: 'novalueSearch',payload: { dir: 'right'} })
        }
      }
      if (callback) callback();
    },
    // 管理员添加人员
    *addUser({ payload,callback },{ put, call }){
      const data = yield call(subMgtService.addUser,payload);
      if(data.status){
        message.success('添加人员成功');
        yield put({ type: 'getSubSystemsManager',payload: { deployOrgSubSystemGuid: payload.deployOrgSubSystemGuid }});
        if (callback) callback();
      }else{
        message.error(data.msg||'添加人员失败');
      }
    },
    // 管理人员移除
    *removeUser({ payload,callback },{ put,call }){
      const data = yield call(subMgtService.removeUser, payload);
      if(data.status){
        message.success('移除人员成功');
        yield put({ type: 'getSubSystemsManager',payload: { deployOrgSubSystemGuid: payload.deployOrgSubSystemGuid }});
        if (callback) callback();
      }else{
        message.error(data.msg||'移除人员失败');
      }
    },
    // 系统菜单
    *getSubsystemMenu({ payload,callback },{ put,call }){
      const data = yield call(subMgtService.getSubSystemsMenus, payload);
      if(data.status){
        yield put({ type: 'systemMenu',payload: data.result });
        if(callback) callback()
      }else{
        message.error(data.msg||'获取系统菜单失败')
      }
    }
  },
  subscriptions: {
   
  }
}