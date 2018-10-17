import * as usersService from '../services/users';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'users',
  state:{
    userInfo: {
      
    },
    currentMenuList: {},
    deptList: [],
    currentDept: {}
  },
  reducers: {
    userInfo(state,action){
      let { payload } = action;
      let deptList = [];
      payload.deptInfo.map(item => deptList.push({ deptId: item.deptId,deptName: item.deptName }));
      let id = window.sessionStorage.getItem('key');
      let deptName = window.sessionStorage.getItem('deptName');
      let dept;
      if(id && deptName) {
        dept = {
          deptId: id,
          deptName
        };
      }else {
        dept = payload.deptInfo[0];
      }
      return {
        ...state,
        userInfo: payload,
        currentDept: { deptId: dept.deptId, deptName: dept.deptName },
        deptList,
      }
    },
    saveCurrentMenu(state,action){
      return {
        ...state,
        currentMenuList: action.payload.menu
      }
    },
    setCurrentDeptInfo(state,action){
      return {
        ...state,
        currentDept: { deptId: action.payload.id,deptName: action.payload.deptName }
      }
    }
  },
  effects:{
    // 密码加密
    *EncryptPassword({ payload, callback },{ put, call }){
      const data = yield call(usersService.EncryptPassword, payload);
      if(data.code !== 200){
        message.error(data.msg ||'密码加密失败')
      }
      if(callback) callback(data.data);
    },
    // 用户登陆
    *userLogin({ payload, callback },{ put, call }){
      const data = yield call(usersService.userLogin, payload);
      
      if(data.code === 200 && data.msg === 'success'){
        yield put({ type: 'userInfo', payload: data.data });
        callback && callback(data.data);
      }else if(data.code === 500) {
        callback && callback(data.data);
      }else {
        message.warning('会话失效，请重新登录');
        window.sessionStorage.removeItem('key');
        window.sessionStorage.removeItem('deptName');
        yield put(routerRedux.push('/login'));
        // if(callback) callback();
      }
    },
    *setCurrentMenu({ payload },{ put }){
      yield put({ type: 'saveCurrentMenu', payload })
    },
    // 设置当前系统
    *setCurrentDept({payload,callback},{ call, put }){
      const data = yield call(usersService.cacheCurrentDept,payload);
      if(data.code === 200 && data.msg === 'success'){
        message.success('切换子系统成功');
        yield put({ type: 'setCurrentDeptInfo', payload });
        callback && callback();
      }else{
        return message.error(data.msg ||'系统切换失败')
      }
      if(callback) callback();
    }
  },
  subscriptions: {
    
  }
}