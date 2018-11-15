import * as workbenchService from '../../services/common/workbench';

export default {
  namespace: 'workbench',
  state: {
  },
  effects: {
    //药房药库 - 工作台选项卡
    *consoleDepotlist({payload, callback},{ put, call }){
      const data = yield call(workbenchService.consoleDepotlist);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    //全院 - 工作台选项卡
    *purchaseConsoleList({payload, callback},{ put, call }){
      const data = yield call(workbenchService.purchaseConsoleList);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    //全院管理 - 工作台选项详细事项
    *commonConsoleDetail({payload, callback},{ put, call }){
      const data = yield call(workbenchService.commonConsoleDetail, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    //药房药库 - 工作台待办事项
    *consoleDepotdetail({payload, callback},{ put, call }){
      const data = yield call(workbenchService.consoleDepotdetail, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
  },
  subscriptions: {
  }
}