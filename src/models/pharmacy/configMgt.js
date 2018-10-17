/*-- 药房 - 配置管理 --*/
import * as configMgt from '../../services/pharmacy/configMgt';
import { message } from 'antd';

export default {
  namespace: 'configMgt',
  state: {
    
  },
  reducers: {
    
  },
  effects: {
    /* 基数药目录管理 */
    //获取详情部门
    *getDeptNameByCode({payload, callback}, {call}) {
      const data = yield call(configMgt.getDeptNameByCode, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //确认添加产品
    *pitchOnCardinalMedicine({payload, callback}, {call}) {
      const data = yield call(configMgt.pitchOnCardinalMedicine, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg)
      }
    },
    //基数药部门下拉框
    *findBaseMedicineDeptlist({payload, callback}, {call}) {
      const data = yield call(configMgt.findBaseMedicineDeptlist, payload);
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //基数药目录移除
    *MoveCardinalMedicineDetail({payload, callback}, {call}) {
      const data = yield call(configMgt.MoveCardinalMedicineDetail, payload);
      if(data.code === 200) {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
    //基数药编辑库存基数保存
    *getHisMedicineBound({payload, callback}, {call}) {
      const data = yield call(configMgt.getHisMedicineBound, payload);
      if(typeof callback === 'function') {
        callback(data);
      }
    }
    /*-- end --*/
  }
}