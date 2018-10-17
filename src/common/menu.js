const menu = [
  {
  "path": "/drugStorage",
  "subMenus": [
    {
      "path": "/drugStorage/configMgt",
      "level": 1,
      "fsort": 30101,
      "name": "配置管理",
      "id": "30101",
      "key": "/drugStorage/configMgt",
      "parentId": "m301",
      "icon": "setting",
      "subMenus": [
        {
          "path": "/drugStorage/configMgt/drugDirectory",
          "level": 2,
          "fsort": 3010101,
          "name": "药品目录",
          "id": "3010101",
          "key": "/drugStorage/configMgt/drugDirectory",
          "parentId": "m303"
        },
      ]
    },
  /* {
    "path": "/drugStorage/replenishment",
    "level": 1,
    "fsort": 30102,
    "name": "补货管理",
    "id": "30102",
    "key": "/drugStorage/replenishment",
    "parentId": "m301",
    "icon": "calendar",
    "subMenus": [
      {
        "path": "/drugStorage/replenishment/replenishmentPlan",
        "level": 2,
        "fsort": 30102,
        "name": "补货计划",
        "id": "30102",
        "key": "/drugStorage/replenishment/replenishmentPlan",
        "parentId": "m301"
      },
      {
        "path": "/drugStorage/replenishment/purchasePlan",
        "level": 2,
        "fsort": 30102,
        "name": "采购计划",
        "id": "30102",
        "key": "/drugStorage/replenishment/purchasePlan",
        "parentId": "m301"
      },
      {
        "path": "/drugStorage/replenishment/confirmPlan",
        "level": 2,
        "fsort": 30102,
        "name": "确认计划",
        "id": "30102",
        "key": "/drugStorage/replenishment/confirmPlan",
        "parentId": "m301"
      }
    ]
  }, */
  {
    "path": "/drugStorage/wareHouse",
    "level": 1,
    "fsort": 30102,
    "name": "入库",
    "id": "30102",
    "key": "/drugStorage/wareHouse",
    "parentId": "m302",
    "icon": "medicine-box",
    "subMenus": [
      {
        "path": "/drugStorage/wareHouse/psListCheck",
        "level": 2,
        "fsort": 30102,
        "name": "配送单验收",
        "id": "30102",
        "key": "/drugStorage/wareHouse/psListCheck",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/wareHouse/grounding",
        "level": 2,
        "fsort": 30102,
        "name": "上架",
        "id": "30102",
        "key": "/drugStorage/wareHouse/grounding",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/wareHouse/wareHouseReceiptMgt",
        "level": 2,
        "fsort": 30102,
        "name": "入库单管理",
        "id": "30102",
        "key": "/drugStorage/wareHouse/wareHouseReceiptMgt",
        "parentId": "m303"
      },
    ]
  },
  {
    "path": "/drugStorage/outStorage",
    "level": 1,
    "fsort": 30102,
    "name": "出库",
    "id": "30102",
    "key": "/drugStorage/outStorage",
    "parentId": "m302",
    "icon": "medicine-box",
    "subMenus": [
      {
        "path": "/drugStorage/outStorage/acceptDistribution",
        "level": 2,
        "fsort": 30102,
        "name": "受理配货",
        "id": "30102",
        "key": "/drugStorage/outStorage/acceptDistribution",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/outStorage/pickingUnderShelve",
        "level": 2,
        "fsort": 30102,
        "name": "拣货下架",
        "id": "30102",
        "key": "/drugStorage/outStorage/pickingUnderShelve",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/outStorage/outReceiptMgt",
        "level": 2,
        "fsort": 30102,
        "name": "出库单管理",
        "id": "30102",
        "key": "/drugStorage/outStorage/outReceiptMgt",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/outStorage/backStorage",
        "level": 2,
        "fsort": 30102,
        "name": "退货",
        "id": "30102",
        "key": "/drugStorage/outStorage/backStorage",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/outStorage/recallAndLocked",
        "level": 2,
        "fsort": 30102,
        "name": "召回及锁定",
        "id": "30102",
        "key": "/drugStorage/outStorage/recallAndLocked",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/outStorage/recallAndLockedCheck",
        "level": 2,
        "fsort": 30102,
        "name": "召回及锁定审核",
        "id": "30102",
        "key": "/drugStorage/outStorage/recallAndLockedCheck",
        "parentId": "m303"
      },
    ]
  },
  {
    "path": "/drugStorage/goodsAdjust",
    "level": 1,
    "fsort": 30102,
    "name": "货位调整",
    "id": "30102",
    "key": "/drugStorage/goodsAdjust",
    "parentId": "m302",
    "icon": "medicine-box",
    "subMenus":[
      {
        "path": "/drugStorage/goodsAdjust/adjust",
        "level": 2,
        "fsort": 30102,
        "name": "货位调整",
        "id": "30102",
        "key": "/drugStorage/goodsAdjust/adjust",
        "parentId": "m303"
      },
    ]
  },
  /* {
    "path": "/drugStorage/drugStorageManage",
    "level": 1,
    "fsort": 30102,
    "name": "药库管理",
    "id": "30102",
    "key": "/drugStorage/drugStorageManage",
    "parentId": "m302",
    "icon": "medicine-box",
    "subMenus":[
      {
        "path": "/drugStorage/drugStorageManage/drugDirectory",
        "level": 2,
        "fsort": 30102,
        "name": "药品目录",
        "id": "30102",
        "key": "/drugStorage/drugStorageManage/drugDirectory",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/drugStorageManage/applyAccept",
        "level": 2,
        "fsort": 30102,
        "name": "申请受理",
        "id": "30102",
        "key": "/drugStorage/drugStorageManage/applyAccept",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/drugStorageManage/picking",
        "level": 2,
        "fsort": 30102,
        "name": "配货",
        "id": "30102",
        "key": "/drugStorage/drugStorageManage/picking",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/drugStorageManage/pickSoldOut",
        "level": 2,
        "fsort": 30102,
        "name": "拣货下架",
        "id": "30102",
        "key": "/drugStorage/drugStorageManage/pickSoldOut",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/drugStorageManage/output",
        "level": 2,
        "fsort": 30102,
        "name": "出库管理",
        "id": "30102",
        "key": "/drugStorage/drugStorageManage/output",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/drugStorageManage/refund",
        "level": 2,
        "fsort": 30102,
        "name": "退货",
        "id": "30102",
        "key": "/drugStorage/drugStorageManage/refund",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/drugStorageManage/putaway",
        "level": 2,
        "fsort": 30102,
        "name": "上架",
        "id": "30102",
        "key": "/drugStorage/drugStorageManage/putaway",
        "parentId": "m303"
      },
      {
        "path": "/drugStorage/drugStorageManage/newLibrary",
        "level": 2,
        "fsort": 30102,
        "name": "新建入库",
        "id": "30102",
        "key": "/drugStorage/drugStorageManage/newLibrary",
        "parentId": "m303"
      },
    ]
  }, */
  {
    "path": "/drugStorage/checkDecrease",
    "level": 1,
    "fsort": 30103,
    "name": "盘点损益",
    "id": "30103",
    "key": "/drugStorage/checkDecrease",
    "parentId": "m303",
    "icon": "hourglass",
    "subMenus":[
      {
        "path": "/drugStorage/checkDecrease/newInventory",
        "level": 2,
        "fsort": 30103,
        "name": "新建盘点",
        "id": "30103",
        "key": "/drugStorage/checkDecrease/newInventory",
        "parentId": "m304"
      },
      {
        "path": "/drugStorage/checkDecrease/inventoryAudit",
        "level": 2,
        "fsort": 30103,
        "name": "盘点审核",
        "id": "30103",
        "key": "/drugStorage/checkDecrease/inventoryAudit",
        "parentId": "m305"
      },
      {
        "path": "/drugStorage/checkDecrease/afterAdjustment",
        "level": 2,
        "fsort": 30103,
        "name": "盘后调整",
        "id": "30103",
        "key": "/drugStorage/checkDecrease/afterAdjustment",
        "parentId": "m306"
      },
      {
        "path": "/drugStorage/checkDecrease/profiLossRecord",
        "level": 2,
        "fsort": 30103,
        "name": "损益记录",
        "id": "30103",
        "key": "/drugStorage/checkDecrease/profiLossRecord",
        "parentId": "m307"
      },
    ]
  },
  {
    "path": "/drugStorage/stockInquiry",
    "level": 1,
    "fsort": 30104,
    "name": "库存查询",
    "id": "30104",
    "key": "/drugStorage/stockInquiry",
    "parentId": "m304",
    "icon": "search",
    "subMenus": [
      {
        "path": "/drugStorage/stockInquiry",
        "level": 2,
        "fsort": 30104,
        "name": "库存查询",
        "id": "30104",
        "key": "/drugStorage/stockInquiry",
        "parentId": "m304"
      }
    ]
  }
],
  "level": 0,
  "fsort": 301,
  "name": "药库",
  "icon": "table",
  "id": "m301",
  "key": "/drugStorage",
  "parentId": "m3"
}, 
{
  "path": "/pharmacy",
  "subMenus": [
    {
      "path": "/pharmacy/configMgt",
      "level": 1,
      "fsort": 30101,
      "name": "配置管理",
      "id": "30101",
      "key": "/pharmacy/configMgt",
      "parentId": "m301",
      "icon": "setting",
      "subMenus": [
        {
          "path": "/pharmacy/configMgt/drugDirectory",
          "level": 2,
          "fsort": 3010101,
          "name": "药品目录",
          "id": "3010101",
          "key": "/pharmacy/configMgt/drugDirectory",
          "parentId": "m303"
        },
      ]
    },
    /* {
      "path": "/pharmacy/manage",
      "level": 2,
      "fsort": 30105,
      "name": "药房管理",
      "id": "30106",
      "key": "/pharmacy/manage",
      "parentId": "m305",
      "icon": "medicine-box",
      "subMenus":[
        {
          "path": "/pharmacy/manage/drugDirectory",
          "level": 2,
          "fsort": 30105,
          "name": "药房目录",
          "id": "30106",
          "key": "/pharmacy/manage/drugDirectory",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/manage/drugsFor",
          "level": 2,
          "fsort": 30105,
          "name": "药品申领",
          "id": "30106",
          "key": "/pharmacy/manage/drugsFor",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/manage/acceptance",
          "level": 2,
          "fsort": 30105,
          "name": "验收",
          "id": "30106",
          "key": "/pharmacy/manage/acceptance",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/manage/putaway",
          "level": 2,
          "fsort": 30105,
          "name": "上架",
          "id": "30106",
          "key": "/pharmacy/manage/putaway",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/manage/newLibrary",
          "level": 2,
          "fsort": 30105,
          "name": "新建入库",
          "id": "30106",
          "key": "/pharmacy/manage/newLibrary",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/manage/output",
          "level": 2,
          "fsort": 30105,
          "name": "发药出库",
          "id": "30106",
          "key": "/pharmacy/manage/output",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/manage/refund",
          "level": 2,
          "fsort": 30105,
          "name": "退库",
          "id": "30106",
          "key": "/pharmacy/manage/refund",
          "parentId": "m305"
        },
      ]
    }, */
    {//库房-申领入库
      "path": "/pharmacy/wareHouse",
      "level": 2,
      "fsort": 30105,
      "name": "申领入库",
      "id": "30106",
      "key": "/pharmacy/wareHouse",
      "parentId": "m305",
      "icon": "medicine-box",
      "subMenus":[
        {
          "path": "/pharmacy/wareHouse/drugsFor",
          "level": 2,
          "fsort": 30105,
          "name": "药品申领",
          "id": "30106",
          "key": "/pharmacy/wareHouse/drugsFor",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/wareHouse/acceptance",
          "level": 2,
          "fsort": 30105,
          "name": "验收",
          "id": "30106",
          "key": "/pharmacy/wareHouse/acceptance",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/wareHouse/putaway",
          "level": 2,
          "fsort": 30105,
          "name": "上架",
          "id": "30106",
          "key": "/pharmacy/wareHouse/putaway",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/wareHouse/newLibrary",
          "level": 2,
          "fsort": 30105,
          "name": "入库单管理",
          "id": "30106",
          "key": "/pharmacy/wareHouse/newLibrary",
          "parentId": "m305"
        }
      ]
    },
    {//库房-出库
      "path": "/pharmacy/outStorage",
      "level": 2,
      "fsort": 30105,
      "name": "出库",
      "id": "30106",
      "key": "/pharmacy/outStorage",
      "parentId": "m305",
      "icon": "medicine-box",
      "subMenus":[
        {
          "path": "/pharmacy/outStorage/output",
          "level": 2,
          "fsort": 30105,
          "name": "发药出库",
          "id": "30106",
          "key": "/pharmacy/outStorage/output",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/outStorage/refund",
          "level": 2,
          "fsort": 30105,
          "name": "退库",
          "id": "30106",
          "key": "/pharmacy/outStorage/refund",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/outStorage/acceptDistribution",
          "level": 3,
          "fsort": 30105,
          "name": "受理配货",
          "id": "30106",
          "key": "/pharmacy/outStorage/acceptDistribution",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/outStorage/pickingUnderShelve",
          "level": 4,
          "fsort": 30105,
          "name": "拣货下架",
          "id": "30106",
          "key": "/pharmacy/outStorage/pickingUnderShelve",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/outStorage/newOut",
          "level": 5,
          "fsort": 30105,
          "name": "新建出库",
          "id": "30106",
          "key": "/pharmacy/outStorage/newOut",
          "parentId": "m305"
        },
      ]
    },
    {
      "path": "/pharmacy/supplementDoc",
      "level": 1,
      "fsort": 30106,
      "name": "补登单据",
      "id": "30106",
      "key": "/pharmacy/supplementDoc",
      "parentId": "m305",
      "icon": "wallet",
      "subMenus": [
        {
          "path": "/pharmacy/supplementDoc/supplementDocuments",
          "level": 2,
          "fsort": 30105,
          "name": "补登单据",
          "id": "30106",
          "key": "/pharmacy/supplementDoc/supplementDocuments",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/supplementDoc/supplementDocCheck",
          "level": 2,
          "fsort": 30105,
          "name": "补登单审核",
          "id": "30106",
          "key": "/pharmacy/supplementDoc/supplementDocCheck",
          "parentId": "m305"
        }
      ]
    },
    {
      "path": "/pharmacy/goodsAdjust",
      "level": 1,
      "fsort": 30106,
      "name": "货位调整",
      "id": "30106",
      "key": "/pharmacy/goodsAdjust",
      "parentId": "m305",
      "icon": "wallet",
      "subMenus": [
        {
          "path": "/pharmacy/goodsAdjust/adjust",
          "level": 2,
          "fsort": 30105,
          "name": "货位调整",
          "id": "30106",
          "key": "/pharmacy/goodsAdjust/adjust",
          "parentId": "m305"
        }
      ]
    },
    {
      "path": "/pharmacy/checkDecrease",
      "level": 1,
      "fsort": 30103,
      "name": "盘点损益",
      "id": "30103",
      "key": "/pharmacy/checkDecrease",
      "parentId": "m303",
      "icon": "hourglass",
      "subMenus":[
        {
          "path": "/pharmacy/checkDecrease/newInventory",
          "level": 2,
          "fsort": 30103,
          "name": "新建盘点",
          "id": "30103",
          "key": "/pharmacy/checkDecrease/newInventory",
          "parentId": "m304"
        },
        {
          "path": "/pharmacy/checkDecrease/inventoryAudit",
          "level": 2,
          "fsort": 30103,
          "name": "盘点审核",
          "id": "30103",
          "key": "/pharmacy/checkDecrease/inventoryAudit",
          "parentId": "m305"
        },
        {
          "path": "/pharmacy/checkDecrease/afterAdjustment",
          "level": 2,
          "fsort": 30103,
          "name": "盘后调整",
          "id": "30103",
          "key": "/pharmacy/checkDecrease/afterAdjustment",
          "parentId": "m306"
        },
        {
          "path": "/pharmacy/checkDecrease/profiLossRecord",
          "level": 2,
          "fsort": 30103,
          "name": "损益记录",
          "id": "30103",
          "key": "/pharmacy/checkDecrease/profiLossRecord",
          "parentId": "m307"
        }
      ]
    },
    {
      "path": "/pharmacy/stockInquiry",
      "level": 1,
      "fsort": 30104,
      "name": "库存查询",
      "id": "30104",
      "key": "/pharmacy/stockInquiry",
      "parentId": "m304",
      "icon": "search",
      "subMenus": [
        {
          "path": "/pharmacy/stockInquiry",
          "level": 2,
          "fsort": 30104,
          "name": "库存查询",
          "id": "30104",
          "key": "/pharmacy/stockInquiry",
          "parentId": "m304"
        }
      ]
    },
    ],
    "level": 0,
    "fsort": 301,
    "name": "药房",
    "icon": "table",
    "id": "m301",
    "key": "/pharmacy",
    "parentId": "m3"
  },
  {
    "path": "/sys",
    "level": 0,
    "fsort": 301,
    "name": "系统管理",
    "icon": "table",
    "id": "m301",
    "key": "/sys",
    "parentId": "m3",
    "subMenus": [
      {
        "path": "/sys/drugDirectory",
        "level": 1,
        "fsort": 30101,
        "name": "药品目录",
        "id": "30101",
        "key": "/sys/drugDirectory",
        "parentId": "m301",
        "icon": "book",
        "subMenus": [
          {
            "path": "/sys/drugDirectory/directory",
            "level": 2,
            "fsort": 3010101,
            "name": "药品目录",
            "id": "3010101",
            "key": "/sys/drugDirectory/directory",
            "parentId": "m303"
          },
        ]
      },
      {
        "path": "/sys/organization",
        "level": 1,
        "fsort": 30101,
        "name": "组织机构",
        "id": "30101",
        "key": "/sys/organization",
        "parentId": "m301",
        "icon": "usb",
        "subMenus": [
          {
            "path": "/sys/organization/supplierMgt",
            "level": 2,
            "fsort": 3010101,
            "name": "供应商管理",
            "id": "3010101",
            "key": "/sys/organization/supplierMgt",
            "parentId": "m303"
          },
          {
            "path": "/sys/organization/departmentMgt",
            "level": 2,
            "fsort": 3010101,
            "name": "部门管理",
            "id": "3010101",
            "key": "/sys/organization/departmentMgt",
            "parentId": "m303"
          },
          {
            "path": "/sys/organization/userMgt",
            "level": 2,
            "fsort": 3010101,
            "name": "用户管理",
            "id": "3010101",
            "key": "/sys/organization/userMgt",
            "parentId": "m303"
          },
        ]
      },
      {
        "path": "/sys/role",
        "level": 1,
        "fsort": 30101,
        "name": "角色管理",
        "id": "30101",
        "key": "/sys/role",
        "parentId": "m301",
        "icon": "user",
        "subMenus": [
          {
            "path": "/sys/role",
            "level": 2,
            "fsort": 3010101,
            "name": "角色管理",
            "id": "3010101",
            "key": "/sys/role",
            "parentId": "m303"
          },
        ]
      },
      {
        "path": "/sys/setting",
        "level": 1,
        "fsort": 30101,
        "name": "系统设置",
        "id": "30101",
        "key": "/sys/setting",
        "parentId": "m301",
        "icon": "setting",
        "subMenus": [
          {
            "path": "/sys/menu",
            "level": 2,
            "fsort": 3010101,
            "name": "菜单管理",
            "id": "3010101",
            "key": "/sys/menu",
            "parentId": "m303"
          },
          {
            "path": "/sys/setting/itemsData",
            "level": 2,
            "fsort": 3010101,
            "name": "字典管理",
            "id": "3010101",
            "key": "/sys/setting/itemsData",
            "parentId": "m303"
          },
        ]
      },
    ],
  },
  /* 采购结算 */
  {
    "path": "/purchase",
    "level": 0,
    "fsort": 301,
    "name": "采购结算",
    "icon": "table",
    "id": "m301",
    "key": "/purchase",
    "parentId": "m3",
    "subMenus": [
      {
        "path": "/purchase/replenishment",
        "level": 1,
        "fsort": 30101,
        "name": "补货管理",
        "id": "30101",
        "key": "/purchase/replenishment",
        "parentId": "m301",
        "icon": "book",
        "subMenus": [
          {
            "path": "/purchase/replenishment/replenishmentPlan",
            "level": 2,
            "fsort": 3010101,
            "name": "补货计划",
            "id": "3010101",
            "key": "/purchase/replenishment/replenishmentPlan",
            "parentId": "m303"
          },
          {
            "path": "/purchase/replenishment/outCatalogPurchase",
            "level": 2,
            "fsort": 3010101,
            "name": "目录外采购",
            "id": "3010101",
            "key": "/purchase/replenishment/outCatalogPurchase",
            "parentId": "m303"
          },
          {
            "path": "/purchase/replenishment/planCheck",
            "level": 2,
            "fsort": 3010101,
            "name": "计划审核",
            "id": "3010101",
            "key": "/purchase/replenishment/planCheck",
            "parentId": "m303"
          },
          {
            "path": "/purchase/replenishment/planOrder",
            "level": 2,
            "fsort": 3010101,
            "name": "计划订单",
            "id": "3010101",
            "key": "/purchase/replenishment/planOrder",
            "parentId": "m303"
          },
        ]
      },
      {
        "path": "/purchase/settlement",
        "level": 1,
        "fsort": 30101,
        "name": "结算管理",
        "id": "30101",
        "key": "/purchase/settlement",
        "parentId": "m301",
        "icon": "book",
        "subMenus": [
          {
            "path": "/purchase/settlementMgt/dayStatements",
            "level": 2,
            "fsort": 3010101,
            "name": "日对账单",
            "id": "3010101",
            "key": "/purchase/settlementMgt/dayStatements",
            "parentId": "m303"
          },
          {
            "path": "/purchase/settlementMgt/statements",
            "level": 2,
            "fsort": 3010101,
            "name": "结算单",
            "id": "3010101",
            "key": "/purchase/settlementMgt/statements",
            "parentId": "m303"
          },
          {
            "path": "/purchase/settlement/balanceQuery",
            "level": 2,
            "fsort": 3010101,
            "name": "结余查询",
            "id": "3010101",
            "key": "/purchase/settlementMgt/balanceQuery",
            "parentId": "m303"
          },
        ]
      }
    ],
  }
]



export default menu; 