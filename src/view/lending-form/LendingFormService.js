import api from 'utils/helpers/api';

export const getBorrowingStoreList = (params) => {
  return api({
    method: 'get',
    url: '/api/v1/borrowing/storeList',
    params
  });
};
export const getLedingFormCategories = (params) => {
  return api({ method: 'get', url: '/api/v1/borrowing/categories', params });
};

export const getLedingFormCategoriesDetail = (params) => {
  return api({ method: 'get', url: '/api/v1/borrowing/category/detail', params });
};

export const addLending = (data) => {
  return api({ method: 'post', url: '/api/v1/borrowing/lending/add', data });
};