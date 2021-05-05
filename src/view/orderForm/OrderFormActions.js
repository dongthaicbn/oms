import api from 'utils/helpers/api';

export const getTodayList = (params) => {
  return api({ method: 'get', url: '/api/v1/order/today/list', params });
};
export const getTodayDetail = (params) => {
  return api({
    method: 'get',
    url: '/api/v1/order/today/supplierDetail',
    params,
  });
};
export const getOrderCategories = (params) => {
  return api({ method: 'get', url: '/api/v1/order/categories', params });
};
export const getOrderCategoriesDetail = (params) => {
  return api({ method: 'get', url: '/api/v1/order/category/detail', params });
};
export const saveOrder = (data) => {
  return api({ method: 'post', url: '/api/v1/order/save', data });
};
export const submitOrder = (data) => {
  return api({ method: 'post', url: '/api/v1/order/submit', data });
};
