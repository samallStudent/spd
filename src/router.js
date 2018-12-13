import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import cloneDeep from 'lodash/cloneDeep';

import Login from './routes/Login';
// import PageNotFound from './routes/Error/error';
import SubSystem from './routes/System';
import NewAdd from './routes/Purchase/replenishment/replenishmentPlan/add';
import CatalogAdd from './routes/Purchase/replenishment/outCatalogPurchase/add';
import SinceReplenishment from './routes/Purchase/sinceMining/replenishmentPlan/add';
import SinceOutCatalog from './routes/Purchase/sinceMining/outCatalogPurchase/add';
import AddDrugsFor from './routes/Pharmacy/wareHouse/drugsFor/add';
import AddNewAcceptance from './routes/Pharmacy/wareHouse/acceptance/add';
import AddOutput from './routes/DrugStorage/outStorage/withdraw/add';
import AddNewBackStorage from './routes/DrugStorage/outStorage/backStorage/add' // 药库退货
import AddNewBackStoragePlan from './routes/Pharmacy/outStorage/refund/add' // 药房退库
import AddBaseBackStoragePlan from './routes/BaseDrug/outStorage/refund/add' // 基数药退库
import AddNewReCallOrLocked from './routes/DrugStorage/outStorage/recallAndLocked/add'; // 药库 新建召回, 新建锁定
import PharmacyAddNewOutput from './routes/Pharmacy/outStorage/newOut/add';
import PharmacyAddNewBaseOutput from './routes/Pharmacy/outStorage/baseReplen/add';
import PslistAdd from './routes/DrugStorage/wareHouse/psListCheck/add';
import NewAddGoodsAdjust  from './routes/DrugStorage/goodsAdjust/adjust/add';
import PharmacyAddGoodsAdjust from './routes/Pharmacy/goodsAdjust/adjust/add';
import AddSupplementDoc from './routes/Pharmacy/supplementDoc/supplementDocuments/add';
import AddInSupplementDoc from './routes/Pharmacy/supplementDoc/supplementDocuments/addIn';
import BaseAddDrugsApply from './routes/BaseDrug/wareHouse/drugApply/add';
import BaseAddNewAcceptance from './routes/BaseDrug/wareHouse/acceptance/add';
// import NewRecon from './routes/Purchase/settlementMgt/dayStatements/newRecon';
import PriceAdjustment from './routes/Purchase/drugPricing/pricingConfirmation/add';
import AddSalvageTruck from './routes/BaseDrug/salvageCar/refund/add';
import AddRescuecarApply from './routes/BaseDrug/salvageCar/drugApply/add';
import AddSalvageCarAcceptance from './routes/BaseDrug/salvageCar/acceptance/add';
import { getNavData } from './common/nav';
import { getPlainNode } from './utils/utils';


dynamic.setDefaultLoadingComponent(() => (
  <div className='loding-wapper'>
    <Spin size="large"/>
  </div>
))

function getRouteData(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = cloneDeep(navData.filter(item => item.layout === path)[0]);
  const nodeList = getPlainNode(route.children);
  return nodeList;
}

function getLayout(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = navData.filter(item => item.layout === path)[0];
  return {
    component: route.component,
    layout: route.layout,
    name: route.name,
    path: route.path,
  };
}


function RouterConfig({ history, app }) {
  let navData = getNavData(app);
  //const WorkplaceLayout = getLayout(navData, 'WorkplaceLayout').component;
  const BasicLayout = getLayout(navData, 'BasicLayout').component;
  // navData[0].children.map(item => {
  //   item.path = item.path.split('/');
  //   item.path.splice(2, 0, ':deptCode');
  //   item.path = item.path.join('/');
  //   return item;
  // });
  const passProps = {
    app,
    navData,
    getRouteData: (path) => {
      return getRouteData(navData, path);
    },
  };

  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/login" component={Login}/>
          {/* <Route path="/error" component={PageNotFound}/> */}
          <Route path="/subSystem" component={SubSystem}/>
          <Route path="/purchase/replenishment/replenishmentPlan/add" component={NewAdd}/>
          <Route path="/purchase/replenishment/replenishmentPlan/edit/:planCode" component={NewAdd}/>
          
          <Route path="/purchase/replenishment/outCatalogPurchase/edit/:planCode" component={CatalogAdd}/>
          <Route path="/purchase/replenishment/outCatalogPurchase/add" component={CatalogAdd}/>

          <Route path="/pharmacy/wareHouse/drugsFor/add" component={AddDrugsFor}/>
          <Route path="/pharmacy/wareHouse/acceptance/add" component={AddNewAcceptance}/>
          <Route path="/drugStorage/outStorage/withdraw/add" component={AddOutput}/>

          <Route path="/drugStorage/outStorage/backStorage/add" component={AddNewBackStorage}/>
          <Route path="/drugStorage/outStorage/backStorage/edit/:backNo" component={AddNewBackStorage}/>
          
          <Route path="/pharmacy/outStorage/refund/add" component={AddNewBackStoragePlan}/>
          <Route path="/pharmacy/outStorage/refund/edit/:backNo" component={AddNewBackStoragePlan}/>
          
          <Route path="/baseDrug/outStorage/refund/add" component={AddBaseBackStoragePlan}/>

          <Route path="/drugStorage/outStorage/recallAndLocked/add/:type" component={AddNewReCallOrLocked}/>

          <Route path="/pharmacy/outStorage/newOut/add" component={PharmacyAddNewOutput}/>
          <Route path="/pharmacy/outStorage/baseReplen/add" component={PharmacyAddNewBaseOutput}/>
          <Route path="/drugStorage/wareHouse/psListCheck/add" component={PslistAdd}/>
          <Route path="/drugStorage/goodsAdjust/adjust/add" component={NewAddGoodsAdjust}/>
          <Route path="/pharmacy/goodsAdjust/adjust/add" component={PharmacyAddGoodsAdjust}/>
          <Route path="/pharmacy/supplementDoc/supplementDocuments/addOut" component={AddSupplementDoc}/>
          <Route path="/pharmacy/supplementDoc/supplementDocuments/addIn" component={AddInSupplementDoc}/>
          <Route path="/baseDrug/wareHouse/drugApply/add" component={BaseAddDrugsApply} />
          <Route path="/baseDrug/wareHouse/acceptance/add" component={BaseAddNewAcceptance}/>

          <Route path="/purchase/sinceMining/replenishmentPlan/add" component={SinceReplenishment}/>
          <Route path="/purchase/sinceMining/replenishmentPlan/edit/:planCode" component={SinceReplenishment}/>

          <Route path="/purchase/sinceMining/outCatalogPurchase/add" component={SinceOutCatalog}/>
          <Route path="/purchase/sinceMining/outCatalogPurchase/edit/:planCode" component={SinceOutCatalog}/>

          <Route path="/purchase/drugPricing/pricingConfirmation/add" component={PriceAdjustment}/>          
          <Route path="/baseDrug/salvageCar/refund/add" component={AddSalvageTruck}/>          
          <Route path="/baseDrug/salvageCar/drugApply/add" component={AddRescuecarApply}/>
          <Route path="/baseDrug/salvageCar/acceptance/add" component={AddSalvageCarAcceptance}/>
          {/* <Route path="/home" component={Home}/> createSinceReplenishment */}
          {/* <Route path="/app" render={props => <WorkplaceLayout {...props} {...passProps} />} /> */}
          <Route path="/" exact render={()=> (
               <Redirect to='/login' />
           )}/>
          <Route path="/" render={props => <BasicLayout {...props} {...passProps} />} />
          

        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
