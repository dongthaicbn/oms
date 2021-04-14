import api from 'utils/helpers/api';

export const getScheduleCategories = (params) => {
  return api({
    method: 'get',
    url: '/api/v1/vehicleSchedule/categories',
    params,
  });
};
export const getScheduleDetail = (params) => {
  return api({ method: 'get', url: '/api/v1/vehicleSchedule/detail', params });
};
