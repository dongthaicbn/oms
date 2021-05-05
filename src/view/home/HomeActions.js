import api from 'utils/helpers/api';

export const getHomeInfo = (params) => {
  return api({ method: 'get', url: '/api/v1/home/all', params });
};
export const getAccountDetail = (params) => {
  return api({ method: 'get', url: '/api/v1/account/detail', params });
};
