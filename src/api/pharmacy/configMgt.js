import {_local} from '../local';

export const baseMgt = {
  FIND_CARDINAL_MADICINE: `${_local}/a/basemedicinedetail/findCardinalMedicineList`,  //列表
  ADD_CARDINAL_MEDICINE: `${_local}/a/basemedicinedetail/addCardinalMedicine`,    //药品 - 增加列表
  FIND_ALL_CARDINAL_MADICINE_LIST: `${_local}/a/basemedicinedetail/findAllCardinalMedicineList`,    //全院管理 - 基数药目录 - 列表
  FIND_RESCUECAR_MADICINE_LIST: `${_local}/a/rescuecardetail/findRescuecarMedicineList`,    //抢救车目录管理
  FIND_RESCUECA_CARDINAL_MADICINE: `${_local}/a/rescuecardetail/findCardinalMedicineDetail`,    //抢救车目录管理详情底部列表
  ADD_RESCUECAR_MEDICINE: `${_local}/a/rescuecardetail/addCardinalMedicine`,      //抢救车目录管理添加药品
}