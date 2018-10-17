import * as configService from '../../services/configMgt/subSystemConfig';
import { message } from 'antd';

export default {
  namespace: 'subSystemConfig',
  state: {
    subSystemOptions: [],
    subSystemId: '',
  },
  reducers: {
    subSystemSelector(state,action){
      return {
        ...state,
        subSystemOptions: action.payload,
        subSystemId: action.payload[0].value
      }
    },
    subSystemIdChange(state,action){
      return {
        ...state,
        subSystemId: action.payload
      }
    },
  },
  effects: {
    *subSystemList({ payload },{ put, call }){
      const data = yield call(configService.findSubSystemSelector);
      if(data.length){
        yield put({ type: 'subSystemSelector',payload: data });
      }else{
        message.warning('暂无子系统,请添加')
      }
    },
    *subSystemId({ payload },{ put }){
      yield put({ type: 'subSystemIdChange', payload })
    },
    //保存子系统配置 ,新建子系统
    *saveConfig({ payload, callback },{ call }){
      const data = yield call(configService.saveSubSystemConfig, payload);
      if(data.status){
        message.success('保存成功');
      }else{
        message.error(data.msg|| '保存失败');
      }
      if(callback) callback() 
    },
    
    *deleteRecord({ payload, callback },{ call }){
      const data = yield call(configService.deleteSubSystemConfig, payload);
      if(data.status){
        message.success('删除成功');
      }else{
        message.error(data.msg|| '删除失败');
      }
      if (callback) callback()
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/configure/subSystemConfigure') {
          //监听路由变化 触发 effect 
          console.log('子系统配置')
        }
      });
    },
  }
}