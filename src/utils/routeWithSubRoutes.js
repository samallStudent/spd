import React from 'react';
import { Router } from 'dva/router';
// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const RouteWithSubRoutes = (route) =>  (
  <Route exact={route.exact} path={route.path} render={props => (
    // pass the sub-routes down to keep nesting
    <route.component {...props} routes={route.routes}/>
  )}/>
)
export default RouteWithSubRoutes;