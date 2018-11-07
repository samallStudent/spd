import * as supplierDrugsService from '../../services/drugStorage/supplierDrugs';
import { message } from 'antd';

export default {
  namespace: "supplierDrugs",
  state: {},
  effects: {
    // 供应商下拉框
    *genSupplier({ payload,callback },{ call }){
      const data = yield call(supplierDrugsService.genSupplierList, payload);
      if(callback && typeof callback === 'function'){
        callback(data);
      }
    },
    // 药品详情查询
    *genDrugDetail({ payload,callback },{ call }){
      const data = yield call(supplierDrugsService.genDetail, payload);
      if(data.code !== 200){
        return message.error(data.msg)
      }
      if(callback) callback(data)
    },
    //修改采购方式
    *updateSupplierRefPrice({ payload,callback },{ call }){
      const data = yield call(supplierDrugsService.updateSupplierRefPrice, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    
  },
  reducers: {},
}