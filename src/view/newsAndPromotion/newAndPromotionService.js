import api from '../../utils/helpers/api';

export const getListNews = (params) => {
  return api({
    method: 'GET',
    url: '/api/v1/newsPromotions/list',
    params
  });
};


export const getDetailNews = (params) => {
  return api({
    method: 'GET',
    url: '/api/v1/newsPromotions/detail',
    params
  });
};
