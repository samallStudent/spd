/* 采购结算 - 结算管理 */
import request from '../../utils/request';
import { _local } from '../../api/local';
/*-- 发票查询 --*/
export function invoiceDetail(options) {
  return request(`${_local}/a/invoice/detail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
};
//临效期
export function getTimeList(options) {
  return request(`${_local}/a/ypjxq/statics/getTimeList`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//结算分析列表
export function settleStaticsList(options) {
  return request(`${_local}/a/settle/statics/list`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

//供应商家列表
export function supplierAll(options) {
  return request(`${_local}/a/depot/supplier/all`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

//结算分析列表-导出
export function staticsExport(options) {
  return request(`${_local}/a/settle/statics/export`, {
    method: 'POST',
    type: 'json',
    export: true,
    body: options
  })
}
//部门
export function getDeptByParam(options) {
  return request(`${_local}/a/sys/sysdept/getDeptByParam`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
export function getDeptInfoNoAdmin(options) {
  return request(`${_local}/a/sys/sysdept/getDeptInfoNoAdmin`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

//科室退库分析footer
export function listCount(options) {
  return request(`${_local}/a/statics/kstk/listCount`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

//科室退库分析导出
export function kstkExport(options) {
  return request(`${_local}/a/statics/kstk/export`, {
    method: 'POST',
    type: 'json',
    export: true,
    body: options
  })
}

//近效期导出
export function ypjxqExport(options) {
  return request(`${_local}/a/ypjxq/statics/export`, {
    method: 'POST',
    type: 'json',
    export: true,
    body: options
  })
}

//药品分析导出
export function medicineStandingExport(options) {
  return request(`${_local}/a/statics/medicineStanding/export`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}
//损益分析导出
export function profitLossExport(options) {
  return request(`${_local}/a/excessive/statics/staticsExport`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}
//损益分析详情
export function profitLossDetailHead(options) {
  return request(`${_local}/a/excessive/statics/get`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//损益分析表格footer
export function getStatics(options) {
  return request(`${_local}/a/excessive/statics/getStatics`, {
    method: 'POST',
    type: 'formData',
    body: options
  })  
}
//供应商退货分析导出
export function supplierReturnExport(options) {
  return request(`${_local}/a/statics/supplierReturn/export`, {
    method: 'POST',
    type: 'json',
    export: true,
    body: options
  })
}

//订单执行情况详情头部
export function orderExecuteDetail(options) {
  return request(`${_local}/a/orderexecute/detail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//订单执行情况导出
export function orderExecuteExport(options) {
  return request(`${_local}/a/orderexecute/export`, {
    method: 'POST',
    type: 'json',
    export: true,
    body: options
  })
}

//供应商供货分析表格页脚
export function countSupplierOrder(options) {
  return request(`${_local}/a/orderexecute/countSupplierOrder`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

//订单追溯详情头部
export function traceDetail(options) {
  return request(`${_local}/a/orderexecute/traceDetail`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

//订单追溯导出
export function exportTrace(options) {
  return request(`${_local}/a/orderexecute/exportTrace`, {
    method: 'POST',
    type: 'json',
    body: options,
    export: true
  })
}

//供应商供货分析footer
export function supplierAnalyze(options) {
  return request(`${_local}/a/orderexecute/totals`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

//供应商供货分析导出
export function exportSupplierAnalyze(options) {
  return request(`${_local}/a/orderexecute/exportsupplierAnalyze`, {
    method: 'POST',
    type: 'json',
    body: options,
    export: true
  })
}
//药房药库部门
export function getDeptInfo(options) {
  return request(`${_local}/a/sys/sysdept/getDeptInfo`, {
    method: 'POST',
    type: 'formData',
    body: options,
  })
}

//供应商排行导出
export function gysphExport(options) {
  return request(`${_local}/a/gysph/statics/export`, {
    method: 'POST',
    type: 'formData',
    body: options,
    export: true
  })
}

//绩效信息表部门列表
export function operationlogDeptList(options) {
  return request(`${_local}/a/operationlog/dept`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
};

//绩效信息表部门联动菜单
export function operationlogMenu(options) {
  return request(`${_local}/a/operationlog/menu`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}
//绩效信息表 一级菜单联动
export function operationSecmenu(options) {
  return request(`${_local}/a/operationlog/secmenu`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//批号追溯详情头部－基本信息
export function batchGetDrugInfo(options) {
    return request(`${_local}/a/common/trace/getDrugInfo`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}

//批号追溯详情－当前库存
export function batchGetStore(options) {
    return request(`${_local}/a/common/trace/getStore`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}

//批号追溯详情－采购验收记录
export function batchGetPlanAndCheck(options) {
    return request(`${_local}/a/common/trace/getPlanAndCheck`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}

//批号追溯详情－院内流通记录
export function batchMedCirculate(options) {
    return request(`${_local}/a/common/trace/medCirculate`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}

//批号追溯详情－发药记录
export function batchGetDispensing(options) {
    return request(`${_local}/a/common/trace/getDispensing`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}

//批号追溯详情－非发药消耗
export function batchGetMakeUp(options) {
  return request(`${_local}/a/common/trace/getMakeUp`, {
      method: 'POST',
      type: 'formData',
      body: options
  })
}

//库存查询详情头部
export function getRoomRepertoryDetail(options) {
  return request(`${_local}/a/StoreDetail/getRoomRepertoryDetail`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//台账供应商
export function getSuppliers(options) {
  return request(`${_local}/a/statics/medicineStanding/getSuppliers`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//台账部门
export function getDepts(options) {
  return request(`${_local}/a/statics/medicineStanding/getDepts`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//调价查询详情头部
export function getPriceStaticGet(options) {
  return request(`${_local}/a/priceStatic/get`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
//财务分析
export function staticsStoreList(options) {
  return request(`${_local}/a/statics/store/list`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

//财务分析部门
export function queryHisDept(options) {
  return request(`${_local}/a/sys/sysdept/queryHisDept`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

//财务分析到处
export function storeExport(options) {
  return request(`${_local}/a/statics/store/export`, {
    method: 'POST',
    type: 'json',
    body: options,
    export: true
  })
}

//订单追溯
export function orderFlow(options) {
  return request(`${_local}/a/orderexecute/orderflow`, {
    method: 'GET',
    type: 'formData',
    body: options,
  })
}

//药剂科 -- 库存查询  -- 导出
export function stockExport(options) {
  return request(`${_local}/a/statics/storeSelect/exportAll`, {
    method: 'POST',
    type: 'json',
    export: true,
    body: options,
  })
}