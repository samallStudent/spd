import * as menuService from '../../services/ysy/menu';
import { message } from 'antd';

export default {
  namespace: 'menu',
  state: {
    dataSource: [],
  },
  reducers: {
    
  },
  effects: {
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
        if (pathname === '/ysy/menu') {
          //监听路由变化 触发 effect 
          console.log('菜单管理')
        }
      });
    },
  }
}