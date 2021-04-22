// common
export const TOKEN = 'token';
export const USE_COOKIE = 'use-cookie';
export const ACCOUNT = 'ACCOUNT';
export const LANG = 'language';

export const STATUS_PENDING = 'pending';
export const STATUS_RECEIVED = 'received';

// routes
export const routes = {
  ERROR: '/error',
  LOGIN: '/login',
  FORGET_PASSWORD: '/forget-password',
  RESET_PASSWORD: '/reset-password',
  RESET_PASSWORD_DONE: '/reset-password/done',
  CREATE_PASSWORD: '/create-password',
  CREATE_PASSWORD_DONE: '/create-password/done',
  REGISTRATION: '/registration',
  REGISTRATION_DONE: '/registration/done',
  ORDER_RECORD: '/order-record',
  ORDER_DETAILS: '/order-record/:orderNo',
  HOME: '/',
  ORDER_FORM: '/order-form',
  GOODS_CATEGORIES: '/goods-categories',
  VEHICLE_SCHEDULE: '/vehicle-schedule',
  VEHICLE_SCHEDULE_DETAIL: '/vehicle-schedule/:id',
  HOLIDAY: '/holiday',
  HOLIDAY_GOOD_CATEGORY: '/holiday/goods-category',
  HOLIDAY_GOOD_CATEGORY_DETAIL: '/holiday/goods-category/:id',
  FAVOURITE: '/favourite',
  CATEGORY: '/category',
  GOODS_CATEGORY_ORDER_DETAIL: '/goods-categories/:id/order',
};
export const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 4 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 24 } },
};
export const NUMBER_REGEX = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
export const URL_REGEX = /^((ftp|http|https):\/\/).*$/;
