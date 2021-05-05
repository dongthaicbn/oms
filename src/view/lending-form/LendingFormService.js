import api from 'utils/helpers/api';

export const getBorrowingStoreList = (params) => {
  return api({
    method: 'get',
    url: '/api/v1/borrowing/storeList',
    params
  });
};