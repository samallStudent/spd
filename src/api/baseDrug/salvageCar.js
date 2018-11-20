/*基数药-抢救车*/
//const MOC_LOCAL = 'http://yapi.demo.qunar.com/mock/29024/';
import {_local} from '../local';

export default {
    /* 库存查询 */
    GET_SALVGECAR_LIST: `${_local}/a/rescuecardetail/rescuecarMedicineList`,   //列表

    /*通用名商品名模糊查询*/
    QUERY_DRUGBY_LIST: `${_local}/a/common/queryDrugByList`,

    /* 库存详情查询头部*/
    GET_RESCUECAR_MEDICEINE_DETAIL:`${_local}/a/rescuecardetail/getRescuecarMedicineDetail`,   

    /* 库存详情查询列表*/
    GET_RESCUECAR_MEDICEINE_DETAIL_LIST:`${_local}/a/rescuecardetail/getRescuecarMedicineDetailList`,   

    /* 抢救车新建退库列表 */
    GET_RESCUECAR_BACK_LIST: `${_local}/a/rescueCar/rescuecarBack/rescuecarBackList`,
  }
