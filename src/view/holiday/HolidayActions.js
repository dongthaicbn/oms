import api from 'utils/helpers/api';

// holiday
export const getDeliveryStoreList = (params) => {
  return api({ method: 'get', url: '/api/v1/delivery/storeList', params });
};
export const getDeliveryCategories = (params) => {
  return api({ method: 'get', url: '/api/v1/delivery/categories', params });
};
export const getDeliveryCategoriesDetail = (params) => {
  return api({
    method: 'get',
    url: '/api/v1/delivery/category/detail',
    params,
  });
};
