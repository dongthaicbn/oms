import api from 'utils/helpers/api';

export const getFavouriteList = (params) => {
  return api({ method: 'get', url: '/api/v1/favourite/list', params });
};
export const getTodayDetail = (params) => {
  return api({
    method: 'get',
    url: '/api/v1/order/today/supplierDetail',
    params,
  });
};
export const addFavourite = (data) => {
  return api({ method: 'post', url: '/api/v1/favourite/add', data });
};
export const removeFavourite = (data) => {
  return api({ method: 'delete', url: '/api/v1/favourite/remove', data });
};
