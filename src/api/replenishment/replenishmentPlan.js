/**
 * @file 菜头结算 - 补货计划
 */
import {_local} from '../local';

export  const replenishmentPlan = {
    PLANLIST: `${_local}/a/depot/depotplan/list`, //补货计划列表
    PURCHASEORDERLIST: `${_local}/a/purchaseorder/list`, //计划订单列表
    QUERYDRUGBYDEPT: `${_local}/a/depot/depotplan/queryDrugByDept`,  //添加产品查询产品信息列表
    QUERYDRUGBYDEPTDETAIL: `http://127.0.0.1:8080/medicinal-web/a/depot/depotplan/detailbydrugname`,  //添加产品详情查询产品信息列表
    QUERY_DRUG_BY_LIST: `${_local}/a/common/queryDrugByList`,  //添加产品 - 下拉框
    PRINT_DETAIL: `${_local}/a/orderdetail/print/printDetail`,      //订单管理打印
    PLAN_DETAIL_PRINT: `${_local}/a/plandetail/print/printDetail`,      //补货计划打印
}