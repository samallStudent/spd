import * as usersService from '../services/users';
import { message } from 'antd';

export default {
  namespace: 'users',
  state:{
    userInfo: {
      
    },
    currentMenuList: {},
    deptList: [],
    currentDept: {},
    localToken: window.sessionStorage.getItem("token") || '',    //本地token
  },
  reducers: {
    userInfo(state,action){
      let { payload } = action;
      let deptList = [];
      payload.deptInfo.map(item => deptList.push({ deptId: item.deptId,deptName: item.deptName }));
      const urlParams = new URL(window.location.href);
      const id = urlParams.searchParams.get('depeId');
      let dept;
      if(!!id) {
        let {deptName} = payload.deptInfo.filter(item => item.deptId === id)[0];
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
      // const urlParams = new URL(window.location.href);
      // urlParams.searchParams.set('depeId', action.payload.id);
      // window.history.replaceState(null, '', urlParams.href);
      return {
        ...state,
        currentDept: { deptId: action.payload.id,deptName: action.payload.deptName }
      };
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
    *userLogin({ payload, callback },{ put, call, select }){
      const data = yield call(usersService.userLogin, payload);
      const users = yield select(state => state.users);
      console.log(users);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
      if(data.code === 200 && data.msg === 'success'){
        yield put({ type: 'userInfo', payload: data.data })
      };
    },
    //修改密码
    *updatePassWordById({ payload, callback },{ put, call }){
      const data = yield call(usersService.updatePassWordById, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
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