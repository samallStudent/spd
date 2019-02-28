import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}`)),
  component,
});

// nav data
/* export const getNavData2 = app => [
  {
    component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    path: '/',
    name: '工作台',
    children: [
      {
        name: "工作台",
        icon: 'workplace',
        path: 'home',
        component: dynamicWrapper(app, [], () => import('../routes/Workplace'))
      },
      {
        name: "医商云",
        icon: 'add',
        path: 'ysy',
        children: [{
          name: '菜单管理',
          icon: 'add',
          path: '/menu',
          component: dynamicWrapper(app, ['ysy/menu'], () => import('../routes/YSY/menu')),
        },{
          name: "子系统管理",
          icon: 'add',
          path: '/subSystem',
          component: dynamicWrapper(app, ['ysy/subSystem'], () => import('../routes/YSY/subSystem'))
        },{
          name: "部署管理",
          icon: 'add',
          path: '/arrange',
          component: dynamicWrapper(app, ['ysy/arrange'], () => import('../routes/YSY/arrange'))
        },{
          name: "授权管理",
          icon: 'add',
          path: '/accredit',
          component: dynamicWrapper(app, ['ysy/accredit'], () => import('../routes/YSY/accredit'))
        },{
          name: "管理员管理",
          icon: 'add',
          path: '/managerMgt',
          component: dynamicWrapper(app, ['ysy/managerMgt'], () => import('../routes/YSY/managerMgt'))
        }]
      },
      {
        name: "子系统配置",
        icon: 'setting',
        path: '/configure',
        children: [{
          name: "子系统配置",
          icon: 'add',
          path: '/subSystemConfigure',
          component: dynamicWrapper(app, ['config/subSystemConfig'], () => import('../routes/Configure/subSystemConfig'))
        },{
          
        }],
      },
      {
        name: "数据字典",
        icon: 'setting',
        path: 'dictionary',
        children: [{
          name: "数据字典",
          icon: 'setting',
          path: '/dictionaryMgt',
          component: dynamicWrapper(app, ['dictionary/dictionary'], () => import('../routes/Dictionary/dictionary'))
        },{
          name: "分类管理",
          icon: 'setting',
          path: '/classifyMgt',
          component: dynamicWrapper(app, ['dictionary/classifyMgt'], () => import('../routes/Dictionary/classify'))
        }]
      },
      {
        name: '精细化',
        icon: 'setting',
        path: 'jxh',
        children: [
          {
            name: '管理员',
            icon: 'user',
            path: '/manager',
            children: [{
              name: '子系统管理',
              icon: 'setting',
              path: '/subSystemMgt',
              component: dynamicWrapper(app, ['manager/subSystemMgt'], () => import('../routes/Manager/subSystemMgt'))
            },{
              name: "子系统管理员",
              icon: 'setting',
              path: '/subSystemMgter',
              component: dynamicWrapper(app, ['manager/subSystemManager'], () => import('../routes/Manager/subSystemManager'))
            },{
              name: "科室管理",
              icon: 'setting',
              path: '/dpetMgt',
              component: dynamicWrapper(app, ['manager/deptMgt'], () => import('../routes/Manager/deptMgt'))
            }]
          },{
            name: '非临床科室子系统',
            icon: 'table',
            path: '/flcksSubSystem',
            children: [{
              name: "配置管理",
              icon: 'setting',
              path: '/configMgt',
              component: dynamicWrapper(app, ['manager/deptMgt'], () => import('../routes/NonClinicalDeptSystem'))
            }]
        },{
            name: '临床科室子系统',
            icon: 'table',
            path: '/lcksSubSystem',
            children: [{
              name: "配置管理",
              icon: 'setting',
              path: '/configMgt',
              component: dynamicWrapper(app, ['manager/deptMgt'], () => import('../routes/ClinicalDeptSystem'))
            }]
        },]
      },
      {
        name: '药库',
        icon: 'table',
        path: '/drugStorage',
        children: [{
          name: "配置管理",
          icon: 'setting',
          path: '/configMgt',
          component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/configMgt/drugConfigMgt'))
        },
        {
          name: "药库管理",
          icon: 'setting',
          path: '/drugStorageManage',
          component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/drugDirectory')),
          children: [
            {
              name: "药品目录",
              icon: 'setting',
              path: '/drugDirectory',
              component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/drugDirectory')),
              children:[
                {
                  name: "药品目录-编辑",
                  icon: 'setting',
                  path: '/edit',
                  component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/drugDirectory/edit'))
                }
              ]
            },
           
          ]
        },
        {
          name: "入库",
          icon: 'setting',
          path: '/warehouse',
          component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/psListCheck/index')),
        },
      ]},
      {
        name: '药房',
        icon: 'table',
        path: '/pharmacy',
        children: [{
          name: '配置管理',
          icon: 'setting',
          path: '/configMgt',
          component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/configMgt'))
        }]
      }
    ]
  },
]; */



export const getNavData = app => [
  {
  component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
  layout: 'BasicLayout',
  path: '/',
  name: '工作台',
  children: [
    /* *****************    配置管理   ************************* */
    {
      name: "404",//药库-配置管理
      icon: 'setting',
      path: '/error',
      component: dynamicWrapper(app, [], () => import('../routes/Error/error'))
    },
    {
      name: "配置管理",//药库-配置管理
      icon: 'setting',
      path: '/drugStorage/configMgt/drugDirectory',
      component: dynamicWrapper(app, ['drugStorage/configMgt'], () => import('../routes/DrugStorage/configMgt/drugDirectory'))
    },
    {
      name: "配置管理--编辑",//药库-配置管理
      icon: 'setting',
      path: '/drugStorage/configMgt/drugDirectory/edit/:id/:deptCode',
      component: dynamicWrapper(app, ['drugStorage/configMgt'], () => import('../routes/DrugStorage/configMgt/drugDirectory/edit'))
    },
    /* {
      name: "药库管理",//药库-药库管理
      icon: 'setting',
      path: '/drugStorage/drugStorageManage',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/drugDirectory')),
    },
    {
      name: "药品目录",//药库-药库管理-药品目录
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/drugDirectory',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/drugDirectory')),
    },
    {
      name: "药品目录-编辑",//药库-药库管理-药品目录-编辑
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/drugDirectory/edit',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/drugDirectory/edit'))
    },
    {
      name: "申请受理",//药库-药库管理-申请受理
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/applyAccept',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/applyAccept')),
    },
    {
      name: "申请受理详情",//药库-药库管理-申请受理
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/applyAccept/details',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/applyAccept/details')),
    },
    {
      name: "配货",//药库-药库管理-配货
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/picking',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/picking')),
    },
    {
      name: "配货详情",//药库-药库管理-配货详情
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/picking/details',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/picking/details')),
    },
    {
      name: "拣货下架",//药库-药库管理-拣货下架
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/pickSoldOut',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/pickSoldOut')),
    },
    {
      name: "拣货下架详情",//药库-药库管理-拣货下架详情
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/pickSoldOut/details',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/pickSoldOut/details')),
    },
    {
      name: "出库管理",//药库-药库管理-出库管理
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/output',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/output')),
    },
    {
      name: "出库管理-新增",//药库-药库管理-出库管理-新增
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/output/add',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/output/add')),
    },
    {
      name: "出库管理-详情",//药库-药库管理-出库管理-详情
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/output/details',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/output/details')),
    },
    {
      name: "退货",//药库-药库管理-退货
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/refund',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/refund')),
    },
    {
      name: "退货-新增",//药库-药库管理-退货-新增
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/refund/add',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/refund/add')),
    },
    {
      name: "退货-详情",//药库-药库管理-退货-详情
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/refund/details',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/refund/details')),
    },
    {
      name: "上架",//药库-药库管理-上架
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/putaway',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/putaway')),
    },
    {
      name: "新建入库",//药库-药库管理-新建入库
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/newLibrary',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/newLibrary')),
    },
    {
      name: "新建入库-新增",//药库-药库管理-新建入库-新增
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/newLibrary/add',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/newLibrary/add')),
    },
    {
      name: "新建入库-详情",//药库-药库管理-新建入库-详情
      icon: 'setting',
      path: '/drugStorage/drugStorageManage/newLibrary/details',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/manage/newLibrary/details')),
    }, */

    /* 
      入库 
    */
    {
      name: "配送单验收",
      icon: 'setting',
      path: '/drugStorage/wareHouse/psListCheck',
      component: dynamicWrapper(app, ['drugStorage/wareHouse'], () => import('../routes/DrugStorage/wareHouse/psListCheck')),
    },
    {
      name: '配送单验收--新建',
      iocn: 'setting',
      path: '/drugStorage/wareHouse/psListCheck/add',
      component: dynamicWrapper(app, ['drugStorage/wareHouse'], () => import('../routes/DrugStorage/wareHouse/psListCheck/add')),
    },
    {
      name: '配送单验收--详情',
      iocn: 'setting',
      path: '/drugStorage/wareHouse/psListCheck/detail/:id',
      component: dynamicWrapper(app, ['drugStorage/wareHouse'], () => import('../routes/DrugStorage/wareHouse/psListCheck/detail')),
    },
    {
      name: '出库单验收--详情',
      iocn: 'setting',
      path: '/drugStorage/wareHouse/psListCheck/outDetail/:id',
      component: dynamicWrapper(app, ['drugStorage/wareHouse'], () => import('../routes/DrugStorage/wareHouse/psListCheck/outDetail')),
    },
    {
      name: "上架",
      icon: 'setting',
      path: '/drugStorage/wareHouse/grounding',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/wareHouse/grounding')),
    },
    {
      name: "上架",
      icon: 'setting',
      path: '/drugStorage/wareHouse/grounding/detail/:id',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/DrugStorage/wareHouse/grounding/detail')),
    },
    {
      name: "入库单管理",
      icon: 'setting',
      path: '/drugStorage/wareHouse/wareHouseReceiptMgt',
      component: dynamicWrapper(app, ['drugStorage/wareHouse'], () => import('../routes/DrugStorage/wareHouse/wareHouseReceiptMgt')),
    },
    {
      name: "入库单详情",
      icon: 'setting',
      path: '/drugStorage/wareHouse/wareHouseReceiptMgt/detail/:id',
      component: dynamicWrapper(app, ['drugStorage/wareHouse'], () => import('../routes/DrugStorage/wareHouse/wareHouseReceiptMgt/detail')),
    },
    /* ***************  出库  ******************** */
    {
      name: "受理配货",
      icon: 'setting',
      path: '/drugStorage/outStorage/acceptDistribution',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/acceptDistribution')),
    },
    {
      name: "受理配货-详情",
      icon: 'setting',
      path: '/drugStorage/outStorage/acceptDistribution/details/:applyCode',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/acceptDistribution/details')),
    },
    {
      name: "拣货下架",
      icon: 'setting',
      path: '/drugStorage/outStorage/pickingUnderShelve',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/pickingUnderShelve')),
    },
    {
      name: "拣货下架-详情",
      icon: 'setting',
      path: '/drugStorage/outStorage/pickingUnderShelve/details/:pickingOrderNo/:pickingStatus/:pickingType',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/pickingUnderShelve/details')),
    },
    {
      name: "退货下架",
      icon: 'setting',
      path: '/drugStorage/outStorage/acceptAnyReturns',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/acceptAnyReturns')),
    },
    {
      name: "退货下架-详情",
      icon: 'setting',
      path: '/drugStorage/outStorage/acceptAnyReturns/details/:pickingOrderNo/:pickingStatus/:pickingType',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/acceptAnyReturns/details')),
    },
    {
      name: "出库/退货复核",
      icon: 'setting',
      path: '/drugStorage/outStorage/outReceiptMgt',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/outReceiptMgt')),
    },
    {
      name: "出库/退货复核-详情",
      icon: 'setting',
      path: '/drugStorage/outStorage/outReceiptMgt/details/:id',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/outReceiptMgt/details')),
    },
    {
      name: "全院管理 - 药库出库/退货复核",
      icon: 'setting',
      path: '/purchase/supplementDoc/outReceiptMgt',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Purchase/supplementDoc/outReceiptMgt')),
    },
    {
      name: "全院管理 - 药库出库/退货复核-详情",
      icon: 'setting',
      path: '/purchase/supplementDoc/outReceiptMgt/details/:id',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Purchase/supplementDoc/outReceiptMgt/details')),
    },
    {
      name: "手工出库",
      icon: 'setting',
      path: '/drugStorage/outStorage/withdraw',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/withdraw')),
    },
    {
      name: "手工出库-详情",
      icon: 'setting',
      path: '/drugStorage/outStorage/withdraw/details/:id',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/withdraw/details')),
    },
    {
      name: "出库单管理",
      icon: 'setting',
      path: '/drugStorage/outStorage/outReceiptMgt',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/outReceiptMgt')),
    },
    {
      name: "退货",
      icon: 'setting',
      path: '/drugStorage/outStorage/backStorage',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/backStorage')),
    },
    {
      name: "新增退货",
      icon: 'setting',
      path: '/drugStorage/outStorage/backStorage/add',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/backStorage/add')),
    },
    {
      name: "退货详情",
      icon: 'setting',
      path: '/drugStorage/outStorage/backStorage/details/:backNo',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/backStorage/details')),
    },
    {
      name: "召回及锁定",
      icon: 'setting',
      path: '/drugStorage/outStorage/recallAndLocked',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/recallAndLocked')),
    },


      //药库－供应商资质管理－企业资质
      {
          name: "企业资质",
          icon: 'setting',
          path: '/drugStorage/supplierFactor/supplier',
          component: dynamicWrapper(app, ['drugStorage/supplierFactor'], () => import('../routes/DrugStorage/supplierFactor/supplier')),
      },


      //药库－供应商资质管理－药品资质
      {
          name: "药品资质",
          icon: 'setting',
          path: '/drugStorage/supplierFactor/drug',
          component: dynamicWrapper(app, ['drugStorage/supplierFactor'], () => import('../routes/DrugStorage/supplierFactor/drug')),
      },

    //药剂科－供应商资质查询-企业资质查询
      {
          name: "企业资质查询",
          icon: 'setting',
          path: '/purchase/factorSearch/supplier',
          component: dynamicWrapper(app, [], () => import('../routes/Purchase/factorSearch/supplier')),
      },
//药剂科－供应商资质查询-药品资质查询
      {
          name: "药品资质查询",
          icon: 'setting',
          path: '/purchase/factorSearch/drug',
          component: dynamicWrapper(app, [], () => import('../routes/Purchase/factorSearch/drug')),
      },

      {
      name: "召回及锁定详情",
      icon: 'setting',
      path: '/drugStorage/outStorage/recallAndLocked/details/:recallNo/:recallStatus',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/recallAndLocked/details')),
    },
    {
      name: "召回及锁定审核",
      icon: 'setting',
      path: '/drugStorage/outStorage/recallAndLockedCheck',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/recallAndLockedCheck')),
    },
    {
      name: "召回及锁定审核详情",
      icon: 'setting',
      path: '/drugStorage/outStorage/recallAndLockedCheck/details/:recallNo/:recallStatus',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/DrugStorage/outStorage/recallAndLockedCheck/details')),
    },
    {
      name: "药房 - 锁定",
      icon: 'setting',
      path: '/pharmacy/outStorage/locked',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/locked')),
    },
    {
      name: "药房 - 锁定详情",
      icon: 'setting',
      path: '/pharmacy/outStorage/locked/details/:recallNo/:recallStatus',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/locked/details')),
    },
    {
      name: "药房 - 锁定审核",
      icon: 'setting',
      path: '/pharmacy/outStorage/lockedCheck',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/lockedCheck')),
    },
    {
      name: "药房 - 锁定审核详情",
      icon: 'setting',
      path: '/pharmacy/outStorage/lockedCheck/details/:recallNo/:recallStatus',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/lockedCheck/details')),
    },
    /* ********************      货位调整      ************************** */
    {
      name: "货位调整",
      icon: 'setting',
      path: '/drugStorage/goodsAdjust/adjust',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/goodsAdjust/adjust')),
    },
    {
      name: "货位调整-新增",
      icon: 'setting',
      path: '/drugStorage/goodsAdjust/adjust/add',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/goodsAdjust/adjust/add')),
    },
    {
      name: "货位调整-详情",
      icon: 'setting',
      path: '/drugStorage/goodsAdjust/adjust/detail/:id',
      component: dynamicWrapper(app, ['drugStorage/goodsAdjust'], () => import('../routes/DrugStorage/goodsAdjust/adjust/detail')),
    },
    // 药库 - 盘点损益 - 新建盘点
    {
      name: "新建盘点",
      icon: 'setting',
      path: '/drugStorage/checkDecrease/newInventory',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/DrugStorage/checkDecrease/newInventory')),
    },
    // 药库 - 盘点损益 - 新建盘点 - 详情(待确认)
    {
      name: "新建盘点-详情(待确认)",
      icon: 'setting',
      path: '/drugStorage/checkDecrease/newInventory/details/:id',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/DrugStorage/checkDecrease/newInventory/details')),
    },
    // 药库 - 盘点损益 - 盘点审核
    {
      name: "盘点审核",
      icon: 'setting',
      path: '/drugStorage/checkDecrease/inventoryAudit',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/DrugStorage/checkDecrease/inventoryAudit')),
    },
    // 药库 - 盘点损益 - 盘点审核 - 详情(待审核)
    {
      name: "盘点审核-详情(待审核)",
      icon: 'setting',
      path: '/drugStorage/checkDecrease/inventoryAudit/details/:id',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/DrugStorage/checkDecrease/inventoryAudit/details')),
    },
    // 药库 - 盘点损益 - 盘后调整
    {
      name: "盘后调整",
      icon: 'setting',
      path: '/drugStorage/checkDecrease/afterAdjustment',
      component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/checkDecrease/afterAdjustment')),
    },
    // 药库 - 盘点损益 - 盘后调整 - 详情
    {
      name: "盘后调整-详情",
      icon: 'setting',
      path: '/drugStorage/checkDecrease/afterAdjustment/details/:id',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/DrugStorage/checkDecrease/afterAdjustment/details')),
    },
    // 药库 - 盘点损益 - 损益记录
    {
      name: "损益记录",
      icon: 'setting',
      path: '/drugStorage/checkDecrease/profiLossRecord',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/DrugStorage/checkDecrease/profiLossRecord')),
    },
    // 药库 - 盘点损益 - 损益记录 - 详情
    {
      name: "损益记录-详情",
      icon: 'setting',
      path: '/drugStorage/checkDecrease/profiLossRecord/details/:id',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/DrugStorage/checkDecrease/profiLossRecord/details')),
    },

    //药库 - 库存查询
    {
      name: "库存查询",
      icon: "setting",
      path: '/drugStorage/stockMgt/stockInquiry',
      component: dynamicWrapper(app, ['drugStorage/stockInquiry'], () => import('../routes/DrugStorage/stockMgt/stockInquiry'))
    },


    //药库 - 库存查询 - 详情
    {
      name: '详情',
      icon: "setting",
      path: '/drugStorage/stockMgt/stockInquiry/details/:id',
      component: dynamicWrapper(app, ['drugStorage/stockInquiry'], () => import('../routes/DrugStorage/stockMgt/stockInquiry/details'))
    },
    //查询统计 - 结算分析
    {
      name: "结算分析",
      icon: 'setting',
      path: '/drugStorage/stockMgt/settlementAnalysis',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/settlementAnalysis')),
    },






    //查询统计 - 药品台账
    {
      name: "药品台账",
      icon: 'setting',
      path: '/drugStorage/stockMgt/drugLedger',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/drugLedger')),
    },
    //查询统计 - 近效期查询
    {
      name: "近效期查询",
      icon: 'setting',
      path: '/drugStorage/stockMgt/nearlyEffective',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/nearlyEffective')),
    },
    //查询统计 - 损益分析
    {
      name: "损益分析",
      icon: 'setting',
      path: '/drugStorage/stockMgt/profitLoss',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/profitLoss')),
    },
    //查询统计 - 损益分析 - 详情
    {
      name: "损益分析 - 详情",
      icon: 'setting',
      path: '/drugStorage/stockMgt/profitLoss/details/:id/:checkBillNo',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/profitLoss/details')),
    },
    //查询统计 - 科室退库分析 
    {
      name: "科室退库分析",
      icon: 'setting',
      path: '/drugStorage/stockMgt/sectionAnalysis',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/sectionAnalysis')),
    },
    //查询统计 - 订单执行情况 
    {
      name: "订单执行情况",
      icon: 'setting',
      path: '/drugStorage/stockMgt/orderFulfillment',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/orderFulfillment')),
    },
    //查询统计 - 订单执行情况 - 详情
    {
      name: "订单执行情况 - 详情",
      icon: 'setting',
      path: '/drugStorage/stockMgt/orderFulfillment/details/:id',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/orderFulfillment/details')),
    },
    //查询统计 - 订单追溯 
    {
      name: "订单追溯",
      icon: 'setting',
      path: '/drugStorage/stockMgt/orderRetrospect',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/orderRetrospect')),
    },
    //查询统计 - 订单追溯 - 详情
    {
      name: "订单追溯 - 详情",
      icon: 'setting',
      path: '/drugStorage/stockMgt/orderRetrospect/details/:id',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/orderRetrospect/details')),
    },
    //查询统计 - 供应商排行 
    {
      name: "供应商排行",
      icon: 'setting',
      path: '/drugStorage/stockMgt/supplierRank',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/supplierRank')),
    },
    //查询统计 - 供应商供货分析 
    {
      name: "供应商供货分析",
      icon: 'setting',
      path: '/drugStorage/stockMgt/supplierSupply',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/supplierSupply')),
    },
    //查询统计 - 供应商退货分析 
    {
      name: "供应商退货分析",
      icon: 'setting',
      path: '/drugStorage/stockMgt/supplierReturn',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/supplierReturn')),
    },
    //查询统计 - 财务指标 
    {
      name: "财务指标",
      icon: 'setting',
      path: '/drugStorage/stockMgt/financialTarget',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/DrugStorage/stockMgt/financialTarget')),
    },
    //药库 - 结算管理
    // {
    //   name: '结算管理',
    //   icon: 'setting',
    //   path: '/drugStorage/settlementMgt/',
    //   component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/settlementMgt'))
    // },
    // //药库 - 结算管理 - 详情
    // {
    //   name: '详情',
    //   icon: 'setting',
    //   path: '/drugStorage/settlementMgt/details',
    //   component: dynamicWrapper(app, [], () => import('../routes/DrugStorage/settlementMgt/details'))
    // },

    /*药房 */
    {
      name: '药房',
      icon: 'table',
      path: '/pharmacy',
      children: []
    },
    {
      name: '工作台',//药房-工作台
      icon: 'setting',
      path: '/pharmacy/workbenchMenu/workbench',
      component: dynamicWrapper(app, ['common/workbench'], () => import('../routes/Pharmacy/workbenchMenu/workbench'))
    },
    {
      name: '工作台',//全院-工作台
      icon: 'setting',
      path: '/purchase/workbenchMenu/workbench',
      component: dynamicWrapper(app, ['common/workbench'], () => import('../routes/Purchase/workbenchMenu/workbench'))
    },
    {
      name: '工作台',//药库-工作台
      icon: 'setting',
      path: '/drugStorage/workbenchMenu/workbench',
      component: dynamicWrapper(app, ['common/workbench'], () => import('../routes/DrugStorage/workbenchMenu/workbench'))
    },
    // 药房 - 盘点损益
    {
      name: "盘点损益",
      icon: 'setting',
      path: '/pharmacy/checkDecrease',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/checkDecrease/newInventory')),
    },
    // 药房 - 盘点损益 - 新建盘点
    {
      name: "新建盘点",
      icon: 'setting',
      path: '/pharmacy/checkDecrease/newInventory',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/Pharmacy/checkDecrease/newInventory')),
    },
    // 药房 - 盘点损益 - 新建盘点 - 详情(待确认)
    {
      name: "新建盘点-详情(待确认)",
      icon: 'setting',
      path: '/pharmacy/checkDecrease/newInventory/details/:id',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/Pharmacy/checkDecrease/newInventory/details')),
    },
    // 药房 - 盘点损益 - 新建盘点 - 详情(已确认)
    {
      name: "新建盘点-详情(已确认)",
      icon: 'setting',
      path: '/pharmacy/checkDecrease/newInventory/detailsConfirm',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/checkDecrease/newInventory/detailsConfirm')),
    },
    // 药房 - 盘点损益 - 盘点审核
    {
      name: "盘点审核",
      icon: 'setting',
      path: '/pharmacy/checkDecrease/inventoryAudit',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/Pharmacy/checkDecrease/inventoryAudit')),
    },
    // 药房 - 盘点损益 - 盘点审核 - 详情(待审核)
    {
      name: "盘点审核-详情(待审核)",
      icon: 'setting',
      path: '/pharmacy/checkDecrease/inventoryAudit/details/:id',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/Pharmacy/checkDecrease/inventoryAudit/details')),
    },
    // 药房 - 盘点损益 - 盘点审核 - 详情(已审核)
    {
      name: "盘点审核-详情(已审核)",
      icon: 'setting',
      path: '/pharmacy/checkDecrease/inventoryAudit/detailsConfirm',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/checkDecrease/inventoryAudit/detailsConfirm')),
    },
    // 药房 - 盘点损益 - 盘后调整
    {
      name: "盘后调整",
      icon: 'setting',
      path: '/pharmacy/checkDecrease/afterAdjustment',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/Pharmacy/checkDecrease/afterAdjustment')),
    },
    // 药房 - 盘点损益 - 盘后调整 - 详情
    {
      name: "盘后调整-详情",
      icon: 'setting',
      path: '/pharmacy/checkDecrease/afterAdjustment/details/:id',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/Pharmacy/checkDecrease/afterAdjustment/details')),
    },
    // 药房 - 盘点损益 - 损益记录
    {
      name: "损益记录",
      icon: 'setting',
      path: '/pharmacy/checkDecrease/profiLossRecord',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/Pharmacy/checkDecrease/profiLossRecord')),
    },
    // 药房 - 盘点损益 - 损益记录 - 详情
    {
      name: "损益记录-详情",
      icon: 'setting',
      path: '/pharmacy/checkDecrease/profiLossRecord/details/:id',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/Pharmacy/checkDecrease/profiLossRecord/details')),
    },
    /*****************药房 --药房管理 -- 开始***************************/
    {
      name: '药品目录',//药房-药品目录
      icon: 'setting',
      path: '/pharmacy/configMgt/drugDirectory',
      component: dynamicWrapper(app, ['drugStorage/configMgt'], () => import('../routes/Pharmacy/configMgt/drugDirectory'))
    },
    {
      name: '药品目录',//药房-药品目录
      icon: 'setting',
      path: '/pharmacy/configMgt/drugDirectory/edit/:id',
      component: dynamicWrapper(app, ['drugStorage/configMgt'], () => import('../routes/Pharmacy/configMgt/drugDirectory/edit'))
    },
    {
      name: '基数药目录管理',
      icon: 'setting',
      path: '/pharmacy/configMgt/baseMgt',
      component: dynamicWrapper(app, ['pharmacy/configMgt'], () => import('../routes/Pharmacy/configMgt/baseMgt'))
    },
    {
      name: '基数药目录管理 - 药品',
      icon: 'setting',
      path: '/pharmacy/configMgt/baseMgt/drug/:id',
      component: dynamicWrapper(app, ['pharmacy/configMgt'], () => import('../routes/Pharmacy/configMgt/baseMgt/drug'))
    },
    {
      name: '抢救车目录管理',
      icon: 'setting',
      path: '/pharmacy/configMgt/salvageList',
      component: dynamicWrapper(app, ['pharmacy/configMgt'], () => import('../routes/Pharmacy/configMgt/salvageList'))
    },
    {
      name: '抢救车目录管理 - 药品',
      icon: 'setting',
      path: '/pharmacy/configMgt/salvageList/drug/:id',
      component: dynamicWrapper(app, ['pharmacy/configMgt'], () => import('../routes/Pharmacy/configMgt/salvageList/drug'))
    },
    {
      name: '全院管理 - 基数药目录管理',
      icon: 'setting',
      path: '/sys/configMgt/baseMgt',
      component: dynamicWrapper(app, ['pharmacy/configMgt'], () => import('../routes/SystemMgt/baseMgt'))
    },
    {
      name: '全院管理 - 基数药目录管理 - 药品',
      icon: 'setting',
      path: '/sys/configMgt/baseMgt/drug/:id',
      component: dynamicWrapper(app, ['pharmacy/configMgt'], () => import('../routes/SystemMgt/baseMgt/drug'))
    },
    {
      name: '全院管理 - 盘点损益',
      icon: 'setting',
      path: '/purchase/checkDecrease/inventoryAudit',
      component: dynamicWrapper(app, ['checkDecrease/index', 'purchase/statistics'], () => import('../routes/Purchase/checkDecrease/inventoryAudit'))
    },
    {
      name: '全院管理 - 盘点损益 - 详情',
      icon: 'setting',
      path: '/purchase/checkDecrease/inventoryAudit/details/:id',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/Purchase/checkDecrease/inventoryAudit/details'))
    },
    {
      name: '全院管理 - 财务审核',
      icon: 'setting',
      path: '/purchase/checkDecrease/financialAudit',
      component: dynamicWrapper(app, ['checkDecrease/index', 'purchase/statistics'], () => import('../routes/Purchase/checkDecrease/financialAudit'))
    },
    {
      name: '全院管理 - 财务审核 - 详情',
      icon: 'setting',
      path: '/purchase/checkDecrease/financialAudit/details/:id',
      component: dynamicWrapper(app, ['checkDecrease/index'], () => import('../routes/Purchase/checkDecrease/financialAudit/details'))
    },
    {
      name: "全院管理 - 召回及锁定审核",
      icon: 'setting',
      path: '/purchase/outStorage/recallAndLockedCheck',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Purchase/outStorage/recallAndLockedCheck')),
    },
    {
      name: "全院管理 - 召回及锁定审核详情",
      icon: 'setting',
      path: '/purchase/outStorage/recallAndLockedCheck/details/:recallNo/:recallStatus',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Purchase/outStorage/recallAndLockedCheck/details')),
    },
    {
      name: '药房管理',//药房-药房管理
      icon: 'setting',
      path: '/pharmacy/manage',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/drugDirectory'))
    },
    {
      name: "药品目录",//药房-药房管理-药品目录
      icon: 'setting',
      path: '/pharmacy/manage/drugDirectory',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/drugDirectory')),
    },
    {
      name: "药品目录-编辑",//药房-药房管理-药品目录-编辑
      icon: 'setting',
      path: '/pharmacy/manage/drugDirectory/edit',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/drugDirectory/edit')),
    },
    {
      name: "退库",//药库-药房管理-退库
      icon: 'setting',
      path: '/pharmacy/manage/refund',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/refund')),
    },
    {
      name: "退库-新增",//药库-药房管理-退库-新增
      icon: 'setting',
      path: '/pharmacy/manage/refund/add',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/refund/add')),
    },
    {
      name: "退库-详情",//药库-药房管理-退库-详情
      icon: 'setting',
      path: '/pharmacy/manage/refund/details',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/refund/details')),
    },
    {
      name: "发药出库",//药库-药房管理-发药出库
      icon: 'setting',
      path: '/pharmacy/manage/output',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/output')),
    },
    {
      name: "发药出库-详情",//药库-药房管理-发药出库-详情
      icon: 'setting',
      path: '/pharmacy/manage/output/details',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/output/details')),
    },
    {
      name: "新建入库",//药库-药房管理-新建入库
      icon: 'setting',
      path: '/pharmacy/manage/newLibrary',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/newLibrary')),
    },
    {
      name: "新建入库-新增",//药库-药房管理-新建入库-新增
      icon: 'setting',
      path: '/pharmacy/manage/newLibrary/add',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/newLibrary/add')),
    },
    {
      name: "新建入库-详情",//药库-药房管理-新建入库-详情
      icon: 'setting',
      path: '/pharmacy/manage/newLibrary/details',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/newLibrary/details')),
    },
    {
      name: "上架",//药库-药房管理-上架
      icon: 'setting',
      path: '/pharmacy/manage/putaway',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/putaway')),
    },
    {
      name: "验收",//药库-药房管理-验收
      icon: 'setting',
      path: '/pharmacy/manage/acceptance',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/acceptance')),
    },
    {
      name: "验收-新增",//药库-药房管理-验收-新增
      icon: 'setting',
      path: '/pharmacy/manage/acceptance/add',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/acceptance/add')),
    },
    {
      name: "验收-编辑",//药库-药房管理-验收-编辑
      icon: 'setting',
      path: '/pharmacy/manage/acceptance/details',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/acceptance/details')),
    },
    {
      name: "药品申领 ",//药库-药房管理-药品申领 
      icon: 'setting',
      path: '/pharmacy/manage/drugsFor',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/drugsFor')),
    },
    {
      name: "药品申领 -新增",//药库-药房管理-药品申领 -新增
      icon: 'setting',
      path: '/pharmacy/manage/drugsFor/add',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/drugsFor/add')),
    },
    {
      name: "药品申领 -编辑",//药库-药房管理-药品申领 -编辑
      icon: 'setting',
      path: '/pharmacy/manage/drugsFor/details',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/manage/drugsFor/details')),
    },
     /*药房 --药房管理 -- 结束*/

     //药房 - 库存查询
    {
      name: "库存查询",
      icon: 'setting',
      path: '/pharmacy/stockMgt/stockInquiry',
      component: dynamicWrapper(app, ['drugStorage/stockInquiry'], () => import('../routes/Pharmacy/stockMgt/stockInquiry')),
    },
    //药房 - 库存查询 - 详情
    {
      name: "详情",
      icon: 'setting',
      path: '/pharmacy/stockMgt/stockInquiry/details/:id',
      component: dynamicWrapper(app, ['drugStorage/stockInquiry'], () => import('../routes/Pharmacy/stockMgt/stockInquiry/details')),
    }, 
    //药房 - 查询统计 - 药品台账
    {
      name: "药品台账",
      icon: 'setting',
      path: '/pharmacy/stockMgt/drugLedger',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Pharmacy/stockMgt/drugLedger')),
    },
    //药房 - 查询统计 - 近效期查询
    {
      name: "近效期查询",
      icon: 'setting',
      path: '/pharmacy/stockMgt/nearlyEffective',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Pharmacy/stockMgt/nearlyEffective')),
    },
    //药房 - 查询统计 - 损益分析
    {
      name: "损益分析",
      icon: 'setting',
      path: '/pharmacy/stockMgt/profitLoss',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Pharmacy/stockMgt/profitLoss')),
    },
    //药房 - 查询统计 - 损益分析 - 详情
    {
      name: "损益分析 - 详情",
      icon: 'setting',
      path: '/pharmacy/stockMgt/profitLoss/details/:id/:checkBillNo',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Pharmacy/stockMgt/profitLoss/details')),
    },
    //药房 - 查询统计 - 供应商排行 
    {
      name: "供应商排行",
      icon: 'setting',
      path: '/pharmacy/stockMgt/supplierRank',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Pharmacy/stockMgt/supplierRank')),
    },
    /*------药房------*/
    /*-----药房-申领入库--*/
    {
      name: "药品申领 ",//药库-申领入库-药品申领 
      icon: 'setting',
      path: '/pharmacy/wareHouse/drugsFor',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/wareHouse/drugsFor')),
    },
    {
      name: "药品申领 -新增",//药房-申领入库-药品申领 -新增
      icon: 'setting',
      path: '/pharmacy/wareHouse/drugsFor/add',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/wareHouse/drugsFor/add')),
    },
    {
      name: "药品申领 -详情",//药房-申领入库-药品申领 -详情
      icon: 'setting',
      path: '/pharmacy/wareHouse/drugsFor/details/:applyCode',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Pharmacy/wareHouse/drugsFor/details')),
    },
    {
      name: "验收",//药库-申领入库-验收
      icon: 'setting',
      path: '/pharmacy/wareHouse/acceptance',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/wareHouse/acceptance')),
    },
    {
      name: "验收-新增",//药库-申领入库-验收-新增
      icon: 'setting',
      path: '/pharmacy/wareHouse/acceptance/add',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/wareHouse/acceptance/add')),
    },
    {
      name: "验收-编辑",//药库-申领入库-验收-编辑
      icon: 'setting',
      path: '/pharmacy/wareHouse/acceptance/details/:id',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Pharmacy/wareHouse/acceptance/details')),
    },
    {
      name: "上架",//药库-申领入库-上架
      icon: 'setting',
      path: '/pharmacy/wareHouse/putaway',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/wareHouse/putaway')),
    },
    {
      name: "上架",//药库-申领入库-上架
      icon: 'setting',
      path: '/pharmacy/wareHouse/putaway/details/:id',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Pharmacy/wareHouse/putaway/details')),
    },
    {
      name: "新建入库",//药库-申领入库-新建入库
      icon: 'setting',
      path: '/pharmacy/wareHouse/newLibrary',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/wareHouse/newLibrary')),
    },
    {
      name: "新建入库-详情",//药库-申领入库-新建入库-详情
      icon: 'setting',
      path: '/pharmacy/wareHouse/newLibrary/details/:id',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Pharmacy/wareHouse/newLibrary/details')),
    },
     /*-----药房-出库--*/
     {
      name: "发药出库",//药库-出库-发药出库
      icon: 'setting',
      path: '/pharmacy/outStorage/output',
      component: dynamicWrapper(app, ['pharmacy/outStorage'], () => import('../routes/Pharmacy/outStorage/output')),
    },
    {
      name: "发药出库-详情",//药库-出库-发药出库-详情
      icon: 'setting',
      path: '/pharmacy/outStorage/output/details/:id',
      component: dynamicWrapper(app, ['pharmacy/outStorage'], () => import('../routes/Pharmacy/outStorage/output/details')),
    },
    {
      name: "退库",//药库-出库-退库
      icon: 'setting',
      path: '/pharmacy/outStorage/refund',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/outStorage/refund')),
    },
    {
      name: "退库-详情",//药库-出库-退库-详情
      icon: 'setting',
      path: '/pharmacy/outStorage/refund/details/:backNo',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/outStorage/refund/details')),
    },
    {
      name: "基数药 - 退库",
      icon: 'setting',
      path: '/baseDrug/outStorage/refund',
      component: dynamicWrapper(app, [], () => import('../routes/BaseDrug/outStorage/refund')),
    },
    {
      name: "基数药 - 退库-详情",
      icon: 'setting',
      path: '/baseDrug/outStorage/refund/details/:backNo',
      component: dynamicWrapper(app, [], () => import('../routes/BaseDrug/outStorage/refund/details')),
    },
    //药房-出库-受理配货
    {
      name: "受理配货",
      icon: 'setting',
      path: '/pharmacy/outStorage/acceptDistribution',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/acceptDistribution')),
    },
    // 药房-出库-受理配货-详情
    {
      name: "受理配货-详情",
      icon: 'setting',
      path: '/pharmacy/outStorage/acceptDistribution/details/:applyCode/:state',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/acceptDistribution/details')),
    },
    // 药房-出库-拣货下架
    {
      name: "拣货下架",
      icon: 'setting',
      path: '/pharmacy/outStorage/pickingUnderShelve',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/pickingUnderShelve')),
    },
    // 药房-出库-拣货下架-详情
    {
      name: "拣货下架-详情",
      icon: 'setting',
      path: '/pharmacy/outStorage/pickingUnderShelve/details/:pickingOrderNo/:pickingType',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/pickingUnderShelve/details')),
    },
    // 药房-出库-退库下架
    {
      name: "退库下架",
      icon: 'setting',
      path: '/pharmacy/outStorage/withdraw',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/withdraw')),
    },
    // 药房-出库-退库下架-详情
    {
      name: "退库下架-详情",
      icon: 'setting',
      path: '/pharmacy/outStorage/withdraw/details/:pickingOrderNo/:pickingStatus',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/withdraw/details')),
    },
    // 药房-出库-调拨出库
    {
      name: "调拨出库",
      icon: 'setting',
      path: '/pharmacy/outStorage/newOut',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/outStorage/newOut')),
    },
    // 药房-出库-调拨出库-详情
    {
      name: "调拨出库-详情",
      icon: 'setting',
      path: '/pharmacy/outStorage/newOut/details/:id',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/newOut/details')),
    },
    // 药房-出库-基数药补货
    {
      name: "基数药补货",
      icon: 'setting',
      path: '/pharmacy/outStorage/baseReplen',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/outStorage/baseReplen')),
    },
    // 药房-出库-基数药补货-详情
    {
      name: "基数药补货-详情",
      icon: 'setting',
      path: '/pharmacy/outStorage/baseReplen/details/:id',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/baseReplen/details')),
    },
    // 药房-出库/退库复核
    {
      name: "出库/退库复核",
      icon: 'setting',
      path: '/pharmacy/outStorage/pharmacyReview',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/outStorage/pharmacyReview')),
    },
    // 药房-出库/退库复核-详情
    {
      name: "出库/退库复核 - 详情",
      icon: 'setting',
      path: '/pharmacy/outStorage/pharmacyReview/details/:id',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Pharmacy/outStorage/pharmacyReview/details')),
    },
    // 全院管理 - 药房-出库/退库复核
    {
      name: "全院管理 - 药房 - 出库/退库复核",
      icon: 'setting',
      path: '/purchase/supplementDoc/pharmacyReview',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/supplementDoc/pharmacyReview')),
    },
    // 全院管理 - 药房-出库/退库复核-详情
    {
      name: "全院管理 - 药房 - 出库/退库复核 - 详情",
      icon: 'setting',
      path: '/purchase/supplementDoc/pharmacyReview/details/:id',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Purchase/supplementDoc/pharmacyReview/details')),
    },
    /* ********************      货位调整      ************************** */
    {
      name: "货位调整",
      icon: 'setting',
      path: '/pharmacy/goodsAdjust/adjust',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/goodsAdjust/adjust')),
    },
    {
      name: "货位调整-新增",
      icon: 'setting',
      path: '/pharmacy/goodsAdjust/adjust/add',
      component: dynamicWrapper(app, [], () => import('../routes/Pharmacy/goodsAdjust/adjust/add')),
    },
    {
      name: "货位调整-详情",
      icon: 'setting',
      path: '/pharmacy/goodsAdjust/adjust/detail/:id',
      component: dynamicWrapper(app, ['drugStorage/goodsAdjust'], () => import('../routes/Pharmacy/goodsAdjust/adjust/detail')),
    },
    /* ********************      补登单据      ************************** */
    {
      name: "补登单据",
      icon: 'setting',
      path: '/pharmacy/supplementDoc/supplementDocuments',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Pharmacy/supplementDoc/supplementDocuments')),
    },
    {
      name: "异常发药单处理",
      icon: 'setting',
      path: '/pharmacy/supplementDoc/exceptionHandling',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Pharmacy/supplementDoc/exceptionHandling')),
    },
    {
      name: "异常发药单处理-详情",
      icon: 'setting',
      path: '/pharmacy/supplementDoc/exceptionHandling/detail/:id',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Pharmacy/supplementDoc/exceptionHandling/detail')),
    },
    {
      name: "补登单据-详情",
      icon: 'setting',
      path: '/pharmacy/supplementDoc/supplementDocuments/detail/:id',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Pharmacy/supplementDoc/supplementDocuments/detail')),
    },
    {
      name: "补登单审核",
      icon: 'setting',
      path: '/pharmacy/supplementDoc/supplementDocCheck',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Pharmacy/supplementDoc/supplementDocCheck')),
    },
    {
      name: "补登单审核-详情",
      icon: 'setting',
      path: '/pharmacy/supplementDoc/supplementDocCheck/detail/:id',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Pharmacy/supplementDoc/supplementDocCheck/detail')),
    },
    {
      name: "全院管理 - 补登单审核",
      icon: 'setting',
      path: '/purchase/supplementDoc/supplementDocCheck',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Purchase/supplementDoc/supplementDocCheck')),
    },
    {
      name: "全院管理 - 补登单审核 - 详情",
      icon: 'setting',
      path: '/purchase/supplementDoc/supplementDocCheck/detail/:id',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Purchase/supplementDoc/supplementDocCheck/detail')),
    },
    /* ***************  系统管理  ******************* */
    {
      name: "系统管理-药品目录",
      icon: 'setting',
      path: '/sys/drugDirectory/directory',
      component: dynamicWrapper(app, ['systemMgt/drugDirectory'], () => import('../routes/SystemMgt/drugDirectory')),
    },
    {
      name: "系统管理-药品目录--编辑",
      icon: 'setting',
      path: '/sys/drugDirectory/directory/edit/:hisDrugCode',
      component: dynamicWrapper(app, ['systemMgt/drugDirectory'], () => import('../routes/SystemMgt/drugDirectory/edit')),
    },
    {
      name: "系统管理 - 部门药品管理",
      icon: 'setting',
      path: '/sys/deptDrugControl/directory',
      component: dynamicWrapper(app, ['drugStorage/configMgt'], () => import('../routes/SystemMgt/deptDrugControl')),
    },
    {
      name: "系统管理 - 部门药品管理 - 药房编辑",
      icon: 'setting',
      path: '/sys/deptDrugControl/directory/pharmacyEdit/:id/:deptCode',
      component: dynamicWrapper(app, ['drugStorage/configMgt'], () => import('../routes/SystemMgt/deptDrugControl/pharmacyEdit')),
    },
    {
      name: "系统管理 - 部门药品管理 - 药库编辑",
      icon: 'setting',
      path: '/sys/deptDrugControl/directory/drugStorageEdit/:id/:deptCode',
      component: dynamicWrapper(app, ['drugStorage/configMgt'], () => import('../routes/SystemMgt/deptDrugControl/drugStorageEdit')),
    },
    {
      name: "系统管理 - 供应商药品",
      icon: 'setting',
      path: '/sys/drugDirectory/supplierDrugs',
      component: dynamicWrapper(app, ['drugStorage/supplierDrugs'], () => import('../routes/SystemMgt/supplierDrugs')),
    },
    {
      name: "系统管理 - 供应商药品 - 编辑",
      icon: 'setting',
      path: '/sys/drugDirectory/supplierDrugs/edit/:id/:code',
      component: dynamicWrapper(app, ['drugStorage/supplierDrugs'], () => import('../routes/SystemMgt/supplierDrugs/edit')),
    },
    /* ******************   组织机构     *********************** */
    {
      name: "供应商管理",
      icon: 'setting',
      path: '/sys/organization/supplierMgt',
      component: dynamicWrapper(app, ['systemMgt/organization'], () => import('../routes/SystemMgt/organization/supplierMgt')),
    },
    // 组织机构 -- 部门管理
    {
      name: "部门管理",
      icon: 'setting',
      path: '/sys/organization/departmentMgt',
      component: dynamicWrapper(app, ['systemMgt/organization'], () => import('../routes/SystemMgt/organization/departmentMgt')),
    },
    {
      name: "部门管理-编辑",
      icon: 'setting',
      path: '/sys/organization/departmentMgt/edit/:id',
      component: dynamicWrapper(app, ['systemMgt/organization'], () => import('../routes/SystemMgt/organization/departmentMgt/edit')),
    },
    {
      name: "部门管理-货位",
      icon: 'setting',
      path: '/sys/organization/departmentMgt/goodsAllocation/:id',
      component: dynamicWrapper(app, ['systemMgt/organization'], () => import('../routes/SystemMgt/organization/departmentMgt/goodsAllocation')),
    },
    // 组织机构 -- 用户管理
    {
      name: "用门管理",
      icon: 'setting',
      path: '/sys/organization/userMgt',
      component: dynamicWrapper(app, ['systemMgt/organization'], () => import('../routes/SystemMgt/organization/userMgt')),
    },
    {
      name: "用户管理--添加",
      icon: 'setting',
      path: '/sys/organization/userMgt/add',
      component: dynamicWrapper(app, ['systemMgt/organization'], () => import('../routes/SystemMgt/organization/userMgt/add')),
    },
    {
      name: "用户管理--编辑",
      icon: 'setting',
      path: '/sys/organization/userMgt/edit/:loginName',
      component: dynamicWrapper(app, ['systemMgt/organization'], () => import('../routes/SystemMgt/organization/userMgt/edit')),
    },
    /* *********************** 系统管理  角色管理     ******************** */
    {
      name: "角色管理",
      icon: 'setting',
      path: '/sys/role/roleMgt',
      component: dynamicWrapper(app, ['systemMgt/roleMgt'], () => import('../routes/SystemMgt/role/roleMgt')),
    },
    {
      name: "角色管理-新增",
      icon: 'setting',
      path: '/sys/role/roleMgt/add',
      component: dynamicWrapper(app, ['systemMgt/roleMgt'], () => import('../routes/SystemMgt/role/roleMgt/add')),
    },
    {
      name: "角色管理-编辑",
      icon: 'setting',
      path: '/sys/role/roleMgt/edit/:id',
      component: dynamicWrapper(app, ['systemMgt/roleMgt'], () => import('../routes/SystemMgt/role/roleMgt/edit')),
    },
     /* *********************** 系统管理 系统设置     ******************** */
    {
      name: "菜单管理",
      icon: 'setting',
      path: '/sys/menu/menuMgt',
      component: dynamicWrapper(app, ['systemMgt/systemMgt'], () => import('../routes/SystemMgt/setting/menuMgt')),
    },
    {
      name: "菜单管理-新增",
      icon: 'setting',
      path: '/sys/menu/menuMgt/add',
      component: dynamicWrapper(app, ['systemMgt/systemMgt'], () => import('../routes/SystemMgt/setting/menuMgt/add')),
    },
    {
      name: "菜单管理-编辑",
      icon: 'setting',
      path: '/sys/menu/menuMgt/add/:id',
      component: dynamicWrapper(app, ['systemMgt/systemMgt'], () => import('../routes/SystemMgt/setting/menuMgt/add')),
    },
    {
      name: "字典管理",
      icon: 'setting',
      path: '/sys/menu/dictMgt',
      component: dynamicWrapper(app, ['ysy/dict'], () => import('../routes/SystemMgt/setting/itemsData')),
    },
      /**
       * @author QER
       * @date 19/2/22
       * @Description: 接口监控
      */
      {
          name: "接口监控",
          icon: 'setting',
          path: '/sys/menu/interfacelog',
          component: dynamicWrapper(app, ['systemMgt/interfacelog'], () => import('../routes/SystemMgt/interfacelog')),
      },
     /* ********************   采购结算 子系统    ******************************* */
    {
      name: "全院管理-药品调价--调价确认",
      icon: 'setting',
      path: '/purchase/drugPricing/pricingConfirmation',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/drugPricing/pricingConfirmation')),
    },
    {
      name: "全院管理-药品调价--调价确认",
      icon: 'setting',
      path: '/purchase/drugPricing/pricingConfirmation/details/:id',
      component: dynamicWrapper(app, ['purchase/drugPricing'], () => import('../routes/Purchase/drugPricing/pricingConfirmation/details')),
    },
    {
      name: "采购结算-补货管理--补货计划",
      icon: 'setting',
      path: '/purchase/replenishment/replenishmentPlan',
      component: dynamicWrapper(app, ['replenishment/replenish'], () => import('../routes/Purchase/replenishment/replenishmentPlan')),
    },
    {
      name: "采购结算-补货管理--补货计划--详情",
      icon: 'setting',
      path: '/purchase/replenishment/replenishmentPlan/detail/:planCode/:drugCommonName',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/replenishment/replenishmentPlan/detail')),
    },

    {
      name: "自采管理-自采管理--采购计划",
      icon: 'setting',
      path: '/purchase/sinceMining/replenishmentPlan',
      component: dynamicWrapper(app, ['replenishment/replenish'], () => import('../routes/Purchase/sinceMining/replenishmentPlan')),
    },
    {
      name: "自采管理-自采管理--采购计划--详情",
      icon: 'setting',
      path: '/purchase/sinceMining/replenishmentPlan/detail/:planCode',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/sinceMining/replenishmentPlan/detail')),
    },
    {
      name: "采购结算-补货管理--目录外补货",
      icon: 'setting',
      path: '/purchase/replenishment/outCatalogPurchase',
      component: dynamicWrapper(app, ['replenishment/replenish'], () => import('../routes/Purchase/replenishment/outCatalogPurchase')),
    },
    {
      name: "采购结算-补货管理--目录外补货--详情",
      icon: 'setting',
      path: '/purchase/replenishment/outCatalogPurchase/detail/:planCode',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/replenishment/outCatalogPurchase/detail')),
    },
    {
      name: "采购结算-自采管理--目录外采购",
      icon: 'setting',
      path: '/purchase/sinceMining/outCatalogPurchase',
      component: dynamicWrapper(app, ['replenishment/replenish'], () => import('../routes/Purchase/sinceMining/outCatalogPurchase')),
    },
    {
      name: "采购结算-自采管理--目录外采购--详情",
      icon: 'setting',
      path: '/purchase/sinceMining/outCatalogPurchase/detail/:planCode',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/sinceMining/outCatalogPurchase/detail')),
    },
    {
      name: "采购结算-自采管理--自采库存查询",
      icon: 'setting',
      path: '/purchase/sinceMining/sinceMiningStore',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/sinceMining/sinceMiningStore')),
    },
    {
      name: "采购结算-自采管理--自采库存查询--详情",
      icon: 'setting',
      path: '/purchase/sinceMining/sinceMiningStore/details/:id',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/sinceMining/sinceMiningStore/details')),
    },
    {
      name: "采购结算-补货管理--计划审核",
      icon: 'setting',
      path: '/purchase/replenishment/planCheck',
      component: dynamicWrapper(app, ['replenishment/replenish'], () => import('../routes/Purchase/replenishment/planCheck')),
    },
    {
      name: "采购结算-补货管理--计划审核--详情",
      icon: 'setting',
      path: '/purchase/replenishment/planCheck/detail/:planCode/:auditStatus',
      component: dynamicWrapper(app, ['replenishment/replenish'], () => import('../routes/Purchase/replenishment/planCheck/detail')),
    },
    {
      name: "采购结算-补货管理--自采计划审核",
      icon: 'setting',
      path: '/purchase/replenishment/sinceMiningPlanCheck',
      component: dynamicWrapper(app, ['replenishment/replenish'], () => import('../routes/Purchase/replenishment/sinceMiningPlanCheck')),
    },
    {
      name: "采购结算-补货管理--自采计划审核--详情",
      icon: 'setting',
      path: '/purchase/replenishment/sinceMiningPlanCheck/detail/:planCode/:auditStatus',
      component: dynamicWrapper(app, ['replenishment/replenish'], () => import('../routes/Purchase/replenishment/sinceMiningPlanCheck/detail')),
    },
    {
      name: "采购结算-补货管理--计划订单",
      icon: 'setting',
      path: '/purchase/replenishment/planOrder',
      component: dynamicWrapper(app, ['replenishment/replenish'], () => import('../routes/Purchase/replenishment/planOrder')),
    },
    {
      name: "采购结算-补货管理--计划订单--详情",
      icon: 'setting',
      path: '/purchase/replenishment/planOrder/detail/:orderCode',
      component: dynamicWrapper(app, ['replenishment/replenish'], () => import('../routes/Purchase/replenishment/planOrder/detail')),
    },
    //采购结算 - 结算管理 - 日对账单
    {
      name: "结算管理",
      icon: 'setting',
      path: '/purchase/settlementMgt/dayStatements',
      component: dynamicWrapper(app, ['purchase/settlementMgt'], () => import('../routes/Purchase/settlementMgt/dayStatements')),
    },
    //采购结算 - 结算管理 - 日对账单 - 详情
    {
      name: "日对账单-详情",
      icon: 'setting',
      path: '/purchase/settlementMgt/dayStatements/details/:id',
      component: dynamicWrapper(app, ['purchase/settlementMgt'], () => import('../routes/Purchase/settlementMgt/dayStatements/details')),
    },
    //采购结算 - 结算管理 - 结算单
    {
      name: "结算管理",
      icon: 'setting',
      path: '/purchase/settlementMgt/statements',
      component: dynamicWrapper(app, ['purchase/settlementMgt'], () => import('../routes/Purchase/settlementMgt/statements')),
    },
    //采购结算 - 结算管理 - 结算单 - 详情
    {
      name: "结算管理-详情",
      icon: 'setting',
      path: '/purchase/settlementMgt/statements/details/:id',
      component: dynamicWrapper(app, ['purchase/settlementMgt'], () => import('../routes/Purchase/settlementMgt/statements/details')),
    },
    //采购结算 - 单据复核 - 发药单补登
    {
      name: "发药单补登",
      icon: 'setting',
      path: '/purchase/supplementDoc/dispensing',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Purchase/supplementDoc/dispensing')),
    },
    //采购结算 - 单据复核 - 发药单补登 - 详情
    {
      name: "发药单补登 - 详情",
      icon: 'setting',
      path: '/purchase/supplementDoc/dispensing/detail/:id',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/Purchase/supplementDoc/dispensing/detail')),
    },
    //采购结算 - 发票查询 - 发票查询
    {
      name: "发票查询",
      icon: 'setting',
      path: '/purchase/invoiceQueryMenu/InvoiceQuery',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/invoiceQueryMenu/InvoiceQuery')),
    },
    //采购结算 - 发票查询 - 发票查询 - 详情
    {
      name: "发票查询 - 详情",
      icon: 'setting',
      path: '/purchase/invoiceQueryMenu/InvoiceQuery/details/:id',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/invoiceQueryMenu/details')),
    },
    //采购结算 - 统计分析 - 结算分析
    {
      name: "结算分析",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/settlementAnalysis',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/settlementAnalysis')),
    },
    {
      name: "统计分析 - 库存查询",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/stockInquiry',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/stockInquiry')),
    },
    {
      name: "统计分析 - 库存查询 - 详情",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/stockInquiry/details/:deptCode/:drugCode/:hisDrugCode',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/stockInquiry/details')),
    },
    //采购结算 - 统计分析 - 药品台账
    {
      name: "药品台账",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/drugLedger',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/drugLedger')),
    },
    //采购结算 - 统计分析 - 近效期查询
    {
      name: "近效期查询",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/nearlyEffective',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/nearlyEffective')),
    },
    //采购结算 - 统计分析 - 损益分析
    {
      name: "损益分析",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/profitLoss',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/profitLoss')),
    },
    //采购结算 - 统计分析 - 损益分析 - 详情
    {
      name: "损益分析 - 详情",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/profitLoss/details/:id/:checkBillNo',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/profitLoss/details')),
    },
    //采购结算 - 统计分析 - 科室退库分析 
    {
      name: "科室退库分析",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/sectionAnalysis',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/sectionAnalysis')),
    },
    //采购结算 - 统计分析 - 订单执行情况 
    {
      name: "订单执行情况",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/orderFulfillment',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/orderFulfillment')),
    },
    //采购结算 - 统计分析 - 订单执行情况 - 详情
    {
      name: "订单执行情况 - 详情",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/orderFulfillment/details/:id',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/orderFulfillment/details')),
    },
    //采购结算 - 统计分析 - 订单追溯 
    {
      name: "订单追溯",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/orderRetrospect',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/orderRetrospect')),
    },
    //采购结算 - 统计分析 - 订单追溯 - 详情
    {
      name: "订单追溯 - 详情",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/orderRetrospect/details/:id',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/orderRetrospect/details')),
    },
    //采购结算 - 统计分析 - 供应商排行 
    {
      name: "供应商排行",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/supplierRank',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/supplierRank')),
    },
    //采购结算 - 统计分析 - 供应商供货分析 
    {
      name: "供应商供货分析",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/supplierSupply',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/supplierSupply')),
    },
    //采购结算 - 统计分析 - 供应商退货分析 
    {
      name: "供应商退货分析",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/supplierReturn',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/supplierReturn')),
    },
    //采购结算 - 统计分析 - 财务指标 
    {
      name: "财务指标",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/financialTarget',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/financialTarget')),
    },
    //采购结算 - 统计分析 - 财务指标 
    {
      name: "绩效信息表",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/performanceInfo',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/performanceInfo')),
    },
    //查询统计 - 批号追溯
    {
      name: "批号追溯",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/batch',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/batch')),
    },
    //查询统计 - 批号追溯 - 详情
    {
      name: "批号追溯 - 详情",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/batch/details/:bigDrugCode/:drugCode/:hisDrugCode/:lot',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/batch/details')),
    },
    //采购结算 - 结算管理 - 结余查询
    {
      name: "结余查询",
      icon: "setting",
      path: '/purchase/settlementMgt/balanceQuery',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/settlementMgt/balanceQuery')),
    },
    /* 基数药 */
    {
      name: "药品目录",
      icon: "setting",
      path: '/baseDrug/drugMgt/drugCatalog',
      component: dynamicWrapper(app, ['baseDrug/drugMgt'], () => import('../routes/BaseDrug/drugMgt')),
    },
    {
      name: "药品目录 - 详情",
      icon: "setting",
      path: '/baseDrug/drugMgt/drugCatalog/edit/:id',
      component: dynamicWrapper(app, ['baseDrug/drugMgt'], () => import('../routes/BaseDrug/drugMgt/edit')),
    },
    {
      name: "库存查询",
      icon: "setting",
      path: '/baseDrug/stockMgt/stockInquiry',
      component: dynamicWrapper(app, ['baseDrug/stockMgt'], () => import('../routes/BaseDrug/stockMgt/stockInquiry')),
    },
    {
      name: "库存查询 - 详情",
      icon: "setting",
      path: '/baseDrug/stockMgt/stockInquiry/details/:id',
      component: dynamicWrapper(app, ['baseDrug/stockMgt'], () => import('../routes/BaseDrug/stockMgt/stockInquiry/details')),
    },
    {
      name: "基数药台账",
      icon: "setting",
      path: '/baseDrug/stockMgt/drugLedger',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/BaseDrug/stockMgt/drugLedger')),
    },
    {
      name: "申领入库 - 验收",
      icon: "setting",
      path: '/baseDrug/wareHouse/acceptance',
      component: dynamicWrapper(app, [], () => import('../routes/BaseDrug/wareHouse/acceptance')),
    },
    {
      name: "申领入库 - 验收 - 详情",
      icon: "setting",
      path: '/baseDrug/wareHouse/acceptance/details/:id',
      component: dynamicWrapper(app, ['baseDrug/wareHouse'], () => import('../routes/BaseDrug/wareHouse/acceptance/details')),
    },
    {
      name: "申领入库 - 药品申领",
      icon: "setting",
      path: '/baseDrug/wareHouse/drugApply',
      component: dynamicWrapper(app, [], () => import('../routes/BaseDrug/wareHouse/drugApply')),
    },
    {
      name: "申领入库 - 药品申领 - 详情",
      icon: "setting",
      path: '/baseDrug/wareHouse/drugApply/details/:id',
      component: dynamicWrapper(app, ['pharmacy/wareHouse'], () => import('../routes/BaseDrug/wareHouse/drugApply/details')),
    },
    /*抢救车-库存*/
    {
      name: "抢救车库存",
      icon: "setting",
      path: '/baseDrug/salvageCar/salvageCarStock',
      component: dynamicWrapper(app, ['baseDrug/salvageCar'], () => import('../routes/BaseDrug/salvageCar/salvageCarStock')),
    },
    {
      name: "抢救车库存-详情",
      icon: "setting",
      path: '/baseDrug/salvageCar/salvageCarStock/details/:bigDrugCode/:deptCode/:drugCode',
      component: dynamicWrapper(app, ['baseDrug/salvageCar'], () => import('../routes/BaseDrug/salvageCar/salvageCarStock/details')),
    },
    {
      name: "抢救车台账",
      icon: "setting",
      path: '/baseDrug/salvageCar/salvageCarLedger',
      component: dynamicWrapper(app, ['baseDrug/salvageCar'], () => import('../routes/BaseDrug/salvageCar/salvageCarLedger')),
    },
    {
      name: "新建退库",
      icon: "setting",
      path: '/baseDrug/salvageCar/refund',
      component: dynamicWrapper(app, ['baseDrug/salvageCar'], () => import('../routes/BaseDrug/salvageCar/refund')),
    },
    {
      name: "新建退库 - 详情",
      icon: "setting",
      path: '/baseDrug/salvageCar/refund/details/:id',
      component: dynamicWrapper(app, ['baseDrug/salvageCar'], () => import('../routes/BaseDrug/salvageCar/refund/details')),
    },
    {
      name: "新建申领",
      icon: "setting",
      path: '/baseDrug/salvageCar/drugApply',
      component: dynamicWrapper(app, ['baseDrug/salvageCar'], () => import('../routes/BaseDrug/salvageCar/drugApply')),
    },
    {
      name: "新建申领 - 详情",
      icon: "setting",
      path: '/baseDrug/salvageCar/drugApply/details/:id',
      component: dynamicWrapper(app, ['baseDrug/salvageCar'], () => import('../routes/BaseDrug/salvageCar/drugApply/details')),
    },
    {
      name: "抢救车库存",
      icon: "setting",
      path: '/baseDrug/salvageCar/acceptance',
      component: dynamicWrapper(app, ['baseDrug/salvageCar'], () => import('../routes/BaseDrug/salvageCar/acceptance')),
    },
    {
      name: "抢救车库存 - 详情",
      icon: "setting",
      path: '/baseDrug/salvageCar/acceptance/details/:id',
      component: dynamicWrapper(app, ['baseDrug/salvageCar'], () => import('../routes/BaseDrug/salvageCar/acceptance/details')),
    },
     /*全院管理-统计分析-调价查询*/
    {
      name: "调价查询",
      icon: "setting",
      path: '/purchase/statisticAnalysis/modifyPrice',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/modifyPrice')),
    },
    {
      name: "调价查询 - 详情",
      icon: "setting",
      path: '/purchase/statisticAnalysis/modifyPrice/details/:id',
      component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/modifyPrice/details')),
    },
    /*--退货审核2018-12-27S--*/
    {
      name: "退货审核",
      icon: 'setting',
      path: '/Purchase/outStorage/backStorage',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Purchase/outStorage/backStorage')),
    },
    {
      name: "退货审核--详情",
      icon: 'setting',
      path: '/Purchase/outStorage/backStorage/details/:id',
      component: dynamicWrapper(app, ['drugStorage/outStorage'], () => import('../routes/Purchase/outStorage/backStorage/details')),
    },
    /*--退货审核2018-12-27E--*/
    /*--创世新增2018-12-14-S--*/
    {
      name: "发药复核",//发药复核
    icon: 'setting',
    path: '/pharmacy/outStorage/review',
    component: dynamicWrapper(app, ['pharmacy/outStorage'], () => import('../routes/Pharmacy/outStorage/review')),
    },
    {
      name: "发药复核-详情",//发药复核-详情
    icon: 'setting',
    path: '/pharmacy/outStorage/review/details/:id',
    component: dynamicWrapper(app, ['pharmacy/outStorage'], () => import('../routes/Pharmacy/outStorage/review/details')),
    },
    /*--创世新增2018-12-14-E--*/

      /*19-1-18*/
      {
          name: "患者追溯",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/patientTracing',
          component: dynamicWrapper(app, [], () => import('../routes/Purchase/statisticAnalysis/patientTracing')),
      },
      //查询统计 - 批号追溯 - 详情
      {
          name: "患者追溯 - 详情",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/patientTracing/details/:bigDrugCode/:drugCode/:hisDrugCode/:lot',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/patientTracing/details')),
      },{
          name: "同比环比统计",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/statisticsTraceability',
          component: dynamicWrapper(app, [], () => import('../routes/Purchase/statisticAnalysis/statisticsTraceability')),
      },
      {
          name: "人员工作统计及追溯",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/statisticsTraceability/detailsList/:ctdid/:deptid',
          component: dynamicWrapper(app, [], () => import('../routes/Purchase/statisticAnalysis/statisticsTraceability/detailsList')),
      },
      {
          name: "人员单据追溯明细",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/statisticsTraceability/details/:bigDrugCode/:drugCode/:hisDrugCode/:lot',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/statisticsTraceability/details')),
      },
      /*人员工作统计	*/
      {
          name: "人员工作统计",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/',
          component: dynamicWrapper(app, ['purchase/reportform'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics')),
      },
      /*人员工作统计	补货单*/
      {
          name: "人员工作统计-补货单",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/tracing/:guid/:userno/:username',
          component: dynamicWrapper(app, ['purchase/reportform'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/tracing')),
      },
      //人员工作统计 - 补货单详情
      {
          name: "人员工作统计 - 补货单",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/details/:ordercode',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/details')),
      },
      {
          name: "人员验收单",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/tracingCheck/:guid/:userno/:username',
          component: dynamicWrapper(app, ['purchase/statistics'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/tracingCheck')),
      },
      //人员单据追溯明细 - 详情
      {
          name: "人员验收单 - 详情",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/detailsCheck/:distributecode/:checktype/:lousernamet/:receptiontime',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/detailsCheck')),
      },
      //补货明细
      {
          name: "补货单明细",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/tracingTotalList/:userid',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/tracingTotalList')),
      },
      //验收单明细
      {
          name: "验收单明细",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/acceptanceTotalList/:userid',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/acceptanceTotalList')),
      },
      //下架
      {
          name: "下架",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/lowerShelf/:bigDrugCode/:userno/:username',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/lowerShelf')),
      },
      //出库复核
      {
          name: "出库复核",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/outgoingReview/:userid/:userno/:username',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/outgoingReview')),
      },
      //盘点
      {
          name: "盘点",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/inventory/:userid/:userno/:username',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/inventory')),
      },
      //调剂
      {
          name: "调剂",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/dispensing/:userid/:userno/:username',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/dispensing')),
      },
      //发药复核
      {
          name: "发药复核",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/drugRechecking/:userid/:userno/:username',
          component: dynamicWrapper(app, [], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/drugRechecking')),
      },




  ]
}]



