import * as subSystemService from '../../services/ysy/subSystem';
import * as menuService from '../../services/ysy/menu';
import { message } from 'antd';

export default {
  namespace: 'subSystem',
  state: {
    menuInfo: {},
    menuData: []
  },
  reducers: {
    fetchSubsystem(state,action){
      return {
        ...state,
        menuData: action.payload
      }
    },
    menuDetail(state,action){
      return {
        ...state,
        menuInfo: action.payload
      }
    }
  },
  effects: {
    /* 获取子系统列表 */
    *fetchSubsystemList({ payload, callback },{ put,call }){
      const data = yield call(subSystemService.searchSubSystemTrees, payload);
      if(data.status){
        yield put({ type: 'fetchSubsystem',payload: data.result });
        if (callback) callback();
      }else{
        message.error(data.msg||'请求错误')
      }
    },
    /* 
      添加子系统
    */
    *addSubSystem({ payload, callback },{ put, call }){
      console.log(payload,'payload')
      const data = yield call(subSystemService.addSubSystem,payload);
      if(data.status){
        message.success('添加成功');
        if (callback) callback();
        yield put({ type: 'fetchSubsystemList' });
      }else{
        message.error(data.msg||'添加子系统失败')
      }
    },
    // 删除子系统
    *deletSubsystem({ payload, callback },{ put, call }){
      const data = yield call(subSystemService.deleteSubSystem,payload);
      if(data.status){
        message.success('删除成功');
        if (callback) callback();
        yield put({ type: 'fetchSubsystemList' });
      }else{
        message.error(data.msg||'删除失败')
      }
    },
    // 修改菜单
    *modifySystem({ payload,callback },{ put, call }){
      const data = yield call(subSystemService.updateSubSystem, payload);
      if(data.status){
        message.success('编辑成功');
        if (callback) callback();
        yield put({ type: 'fetchSubsystemList' });
      }else{
        message.error(data.msg||'编辑失败')
      }
    },
    // 根据menuId 菜单编号 查找菜单信息
    *findMenuById({ payload },{ put, call }){
      const data = yield call(subSystemService.findMenuById, payload);
      if(data.status){
        if(data.result.menuId){
          yield put({ type: 'menuDetail',payload: data.result });
        }else{
          message.warning('暂无信息');
        }
      }else{
        message.error(data.msg|| '查找菜单信息失败')
      }
    },
    // 添菜单
    *addMenu({ payload,callback },{ put,call }){
      const data = yield call(subSystemService.addMenu, payload);
      if(data.status){
        message.success('添加菜单成功');
        if (callback) callback();
      }else{
        message.error(data.msg || '添加菜单失败')
      }
    },
    // 与后台交互改菜单信息
    *modifyMenu({ payload, callback },{ put,call }){
      console.log(payload,'payload')
      const data = yield call(menuService.modifyMenu,payload);
      if(data.status){
        message.success('修改成功');
        if (callback) callback()
      }else{
        message.error(data.msg|| '修改失败');
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/app/subSystem') {
          //监听路由变化 触发 effect 
          console.log('subSystem')
        }
      });
    },
  }
}