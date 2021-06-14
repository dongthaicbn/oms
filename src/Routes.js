import React from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { isLoggedIn, pageNeedCheckAuthen } from 'utils/helpers/helpers';
import { routes } from './utils/constants/constants';
import Login from './view/login/Login';
import Home from 'view/home/Home';
import ForgetPassword from './view/forgetPassword/ForgetPassword';
import ResetPassword from './view/resetPassword/ResetPassword';
import CreatePassword from './view/createPassword/CreatePassword';
import Registration from './view/registration/Registration';
import OrderForm from 'view/orderForm/OrderForm';
import GoodsCategories from 'view/goodsCategories/GoodsCategories';
import CategoryOrderDetail from 'view/goodsCategories/orderDetails/CategoryOrderDetail';
import VehicleSchedule from 'view/vehicleSchedule/VehicleSchedule';
import VehicleScheduleDetail from 'view/vehicleSchedule/VehicleScheduleDetail';
import OrderRecord from 'view/orderRecords/OrderRecord';
import OrderDetails from 'view/orderRecords/details/OrderDetails';
import Holiday from 'view/holiday/Holiday';
import HolidayGoodsCategories from 'view/holiday/HolidayGoodsCategories';
import HolidayGoodsCategoriesDetail from 'view/holiday/HolidayGoodsCategoriesDetail';
import Favourite from 'view/favourite/Favourite';
import Borrow from 'view/borrow-record/Borrow';
import BorrowDetail from 'view/borrow-record/borrowDetail/BorrowDetail';
import ReceivedDelivery from 'view/reicivedDelivery/ReceivedDelivery';
import ReceivedDetail from 'view/reicivedDelivery/receivedDetail/ReceivedDetail';
// import HolidayGoodsCategories from 'view/holiday/HolidayGoodsCategories';
// import HolidayGoodsCategoriesDetail from 'view/holiday/HolidayGoodsCategoriesDetail';
import LendingForm from 'view/lending-form/LendingForm';
import LendingConfirm from 'view/lending-form/LendingConfirm';

import LendingGoodsCategories from 'view/lending-form/goodCategories/LendingGoodsCategories';
import LendingGoodCategoryDetail from 'view/lending-form/goodCategories/LendingGoodCategoryDetail';
import Contact from 'view/home/Contact';
import TermCondition from 'view/home/TermCondition';
import Inventory from 'view/inventory/Inventory';
import InventoryDetail from 'view/inventory/detail/InventoryDetail';

import MyAccount from 'view/my-account/MyAccount';
import NewAndPromotion from 'view/newsAndPromotion/newAndPromotion';
import PageNotFound from 'view/pageNotFound/PageNotFound';

const Routes = (props) => {
  if (!isLoggedIn() && pageNeedCheckAuthen()) {
    return <Redirect to={routes.LOGIN} />;
  }
  return (
    <Switch>
      <Route exact path={routes.HOME} component={Home} />
      <Route exact path={routes.ORDER_FORM} component={OrderForm} />
      <Route exact path={routes.GOODS_CATEGORIES} component={GoodsCategories} />
      <Route
        exact
        path={routes.GOODS_CATEGORY_ORDER_DETAIL}
        component={CategoryOrderDetail}
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
      <Route exact path={routes.HOLIDAY} component={Holiday} />
      <Route
        exact
        path={routes.HOLIDAY_GOOD_CATEGORY}
        component={HolidayGoodsCategories}
      />
      <Route
        exact
        path={routes.HOLIDAY_GOOD_CATEGORY_DETAIL}
        component={HolidayGoodsCategoriesDetail}
      />
      <Route exact path={routes.FAVOURITE} component={Favourite} />
      <Route path={routes.BORROW_RECORD} component={Borrow} />
      {/* <Route exact path={routes.BORROW_DETAIL} component={BorrowDetail} /> */}

      <Route
        exact
        path={routes.RECEIVED_DELIVERY}
        component={ReceivedDelivery}
      />
      <Route exact path={routes.LENDING_FORM} component={LendingForm} />
      <Route exact path={routes.LENDING_CONFIRM} component={LendingConfirm} />

      <Route
        exact
        path={routes.LENDING_FORM_GOODS_CATEGORY}
        component={LendingGoodsCategories}
      />
      <Route
        exact
        path={routes.LENDING_FORM_GOODS_CATEGORY_DETAIL}
        component={LendingGoodCategoryDetail}
      />
      <Route exact path={routes.MY_ACCOUNT} component={MyAccount} />
      <Route path={routes.NEWS_AND_PROMOTION} component={NewAndPromotion} />

      <Route
        exact
        path={routes.RECEIVED_DELIVERY_DETAIL}
        component={ReceivedDetail}
      />
      <Route exact path={routes.CONTACT} component={Contact} />
      <Route exact path={routes.TERM_CONDITION} component={TermCondition} />
      <Route exact path={routes.PRIVACY_POLICY} component={TermCondition} />
      <Route exact path={routes.DISCLAIMER} component={TermCondition} />

      <Route exact path={routes.INVENTORY} component={Inventory} />
      <Route exact path={routes.INVENTORY_DETAIL} component={InventoryDetail} />
      <Route exact path={routes.PAGE_NOT_FOUND} component={PageNotFound} />
      <Route render={() => <Redirect to={routes.PAGE_NOT_FOUND} />} />
    </Switch>
  );
};

export default withRouter(Routes);
