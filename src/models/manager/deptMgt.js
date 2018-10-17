import * as subMgtService from '../../services/manager/subSystemMgt';
import { message } from 'antd';

export default {
  namespace: 'deptMgt',
  state: {
    count: 0,
    addressData: []
  },
  reducers: {
    deptAddress(state,action){
      return {
        ...state,
        count: action.payload.length,
        addressData: action.payload
      }
    },
    editableChange(state,action){
      return {
        ...state,
        addressData: action.payload
      }
    },
    AddAddress(state,action){
      return {
        ...state,
        count: Number(state.count) + 1,
        addressData: [...state.addressData, action.payload]
      }
    },
    DeleteAddress(state,action){
      return {
        ...state,
        count: Number(state.count) -1,
        addressData: action.payload
      }
    }
  },
  effects: {
    // 新增科室，编辑科室
    *insertOrmodify({ payload,callback },{ call }){
      const data = yield call(subMgtService.insertOrmodify, payload);
      if(data.status){
        message.success('操作成功');
        if (callback) callback();
      }else{
        message.error(data.msg||'操作失败')
      }
    },
    // 科室地址列表
    *searchDeptAddress({ payload, callback },{ put, call }){
      const data = yield call(subMgtService.searchDeptAddress, payload);
      if(data.status){
        let addressData = data.result;
        if(addressData.length){
          addressData.map((item,index) =>{
            return addressData[index]['key'] = item.addrGuid;
          })
          yield put({ type: 'deptAddress', payload: addressData });
          if (callback) callback();
        }
      }else{
        message.error(data.msg||'获取科室地址失败')
      }
    },
    *editable({ payload },{ select, put }){
      const stateData = yield select(state=> state.deptMgt);
      const { addressData } = stateData;
      let target = addressData.filter(item=> item.addrGuid === payload.addrGuid)[0];
      let index = addressData.findIndex(item => item.addrGuid === payload.addrGuid);
      addressData[index] = target;
      yield put({ type: 'editableChange',payload: addressData })
    },
    // 同步方法 修改科室地址信息 
    *updateAddress({ payload },{  select, put }){
      const stateData = yield select(state=> state.deptMgt);
      const { addressData } = stateData;
      let index = addressData.findIndex(item => item.addrGuid === payload.addrGuid);
      addressData[index] = payload;
      yield put({ type: 'editableChange',payload: addressData })
    },
    // 修改科室地址 保存
    *modifyAddress({ payload,callback },{ call }){
      const data = yield call(subMgtService.saveDeptAddress, payload);
      if(data.status){
        message.success('修改成功');
        if (callback) callback();
      }else{
        message.error(data.msg||'修改失败')
      }
    },
    // 删除科室地址
    *deleteAddress({ payload,callback },{ call }){
      const data = yield call(subMgtService.deleteDeptAddress, payload);
      if(data.status){
        message.success('删除成功');
        if (callback) callback();
      }else{
        message.error(data.msg||'删除失败')
      }
    },
    *addAddress({ payload },{ put }){
      yield put({ type: 'AddAddress',payload })
    },
    *delete({ payload},{ put }){
      yield put({ type: 'DeleteAddress', payload })
    }
  },
  subscriptions: {
    
  }
}