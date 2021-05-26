// common
export const TOKEN = 'token';
export const USE_COOKIE = 'use-cookie';
export const ACCOUNT = 'ACCOUNT';
export const LANG = 'language';

export const STATUS_ALL = 'all';
export const STATUS_PENDING = 'pending';
export const STATUS_RECEIVED = 'received';
export const STATUS_DAMAGED = 'damaged';
export const STATUS_SUBMITTED = 'submitted';

export const TYPE_BORROW = 'borrow';
export const TYPE_LEND = 'lend';
export const TYPE_ACCEPT = 'Accepted';
export const TYPE_REJECTED = 'Rejected';

export const UPLOAD_TYPE_FILE = 1;
export const UPLOAD_TYPE_URL = 2;

export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_FORMAT_URL = 'YYYY-MM-DD';
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
  BORROW_RECORD: '/borrowing-record',
  BORROW_DETAIL: '/borrowing-record/:id',

  CATEGORY: '/category',
  GOODS_CATEGORY_ORDER_DETAIL: '/goods-categories/:id/order',
  RECEIVED_DELIVERY: '/received-delivery',
  RECEIVED_DELIVERY_DETAIL: '/received-delivery/:orderNo',
  RECEIVED_DELIVERY_DETAIL_EDIT: '/received-delivery/:orderNo/edit',
  LENDING_FORM: '/lending-form',
  LENDING_CONFIRM: '/lending-confirm',

  LENDING_FORM_GOODS_CATEGORY: '/lending-form/goods-category',
  LENDING_FORM_GOODS_CATEGORY_DETAIL: '/lending-form/goods-category/:id',
  MY_ACCOUNT: '/my-account',
  CONTACT: '/contact',
  TERM_CONDITION: '/terms-conditions',
  PRIVACY_POLICY: '/privacy-policy',
  DISCLAIMER: '/disclaimer',
  NEWS_AND_PROMOTION: '/news-and-promotions',
  INVENTORY: '/inventory',
  INVENTORY_DETAIL: '/inventory/:id',
  PAGE_NOT_FOUND: '/page-not-found',
};
export const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 4 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 24 } },
};
export const NUMBER_REGEX = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
export const URL_REGEX = /^((ftp|http|https):\/\/).*$/;

export const reasonType = {
  PACKAGE_DAMAGED: {
    value: 1,
    textID: 'IDS_PACKAGE_DAMAGED',
  },
  WRONG_PRODUCT: {
    value: 2,
    textID: 'IDS_WRONG_PRODUCT',
  },
  SPOILED: {
    value: 3,
    textID: 'IDS_SPOILED',
  },
  OTHER: {
    value: 4,
    textID: 'IDS_OTHER',
  },
};

export const DEFAULT_NUMBER_OF_ITEMS = 8;

