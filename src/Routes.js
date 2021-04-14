import React from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
// import { isMobile } from 'react-device-detect';
import { routes } from './utils/constants/constants';
import Login from './view/login/Login';
import Home from 'view/home/Home';
import ForgetPassword from './view/forgetPassword/ForgetPassword';
import ResetPassword from './view/resetPassword/ResetPassword';
import CreatePassword from './view/createPassword/CreatePassword';

import Registration from './view/registration/Registration';

import OrderForm from 'view/orderForm/OrderForm';
import GoodsCategories from 'view/orderForm/GoodsCategories';
import GoodsCategoriesDetail from 'view/orderForm/GoodsCategoriesDetail';
import VehicleSchedule from 'view/vehicleSchedule/VehicleSchedule';
import VehicleScheduleDetail from 'view/vehicleSchedule/VehicleScheduleDetail';

import OrderRecord from 'view/orderRecords/OrderRecord';
import OrderDetails from 'view/orderRecords/details/OrderDetails';

const Routes = (props) => {
  return (
    <Switch>
      <Route exact path={routes.HOME} component={Home} />
      <Route exact path={routes.ORDER_FORM} component={OrderForm} />
      <Route exact path={routes.GOODS_CATEGORIES} component={GoodsCategories} />
      <Route
        exact
        path={routes.GOODS_CATEGORIES_DETAIL}
        component={GoodsCategoriesDetail}
      />
      <Route exact path={routes.VEHICLE_SCHEDULE} component={VehicleSchedule} />
      <Route
        exact
        path={routes.VEHICLE_SCHEDULE_DETAIL}
        component={VehicleScheduleDetail}
      />
      <Route exact path={routes.LOGIN} component={Login} />
      <Route exact path={routes.FORGET_PASSWORD} component={ForgetPassword} />
      <Route path={routes.RESET_PASSWORD} component={ResetPassword} />
      <Route path={routes.CREATE_PASSWORD} component={CreatePassword} />
      <Route path={routes.REGISTRATION} component={Registration} />

      <Route exact path={routes.ORDER_RECORD} component={OrderRecord} />
      <Route exact path={routes.ORDER_DETAILS} component={OrderDetails} />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
};

export default withRouter(Routes);
