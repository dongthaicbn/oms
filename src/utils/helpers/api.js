import axios from 'axios';
import { routes, TOKEN } from '../constants/constants';
// import { TOKEN, routes } from '../constants/constants';
import config from '../constants/config';
import { isEmpty } from './helpers';

export const CancelToken = axios.CancelToken;

const request = axios.create({
  baseURL: config.BASE_URL,
  headers: { Authorization: 'Bearer ' + localStorage.getItem(TOKEN) },
});

request.interceptors.request.use(
  (config) => {
    if (config.url.indexOf('/api/authenticate') !== -1) {
      delete config.headers['access_token'];
    }
    return {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
      },
    };
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    if (response.data.result && response.data.result.status === 401) {
      window.location.href = routes.LOGIN;
    }
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return new Promise(() => {});
    }
    if (error.response && error.response.status === 401) {
      window.location.href = routes.LOGIN;
    }
    return Promise.reject(error.response);
  }
);

const api = (options = {}) => {
  return request.request({
    baseURL: config.BASE_URL,
    ...options,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
      ...options.headers,
    },
  });
};

export const pageApi = (options = {}) => {
  let { arrayField } = options;
  let { number_of_items, ...otherParams } = options.params;
  return request.request({
    baseURL: config.BASE_URL,
    ...options,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
      ...options.headers,
    },
    params: {
      ...otherParams,
      number_of_items: number_of_items + 1,
    },
    transformResponse: [
      (rawResponse) => {
        let response = JSON.parse(rawResponse);
        let hasMore = false;
        if (!isEmpty(response?.data)) {
          let arrayResult = response.data;
          if (arrayField) {
            arrayResult = response.data[arrayField];
          }
          if (Array.isArray(arrayResult)) {
            hasMore = arrayResult.length === number_of_items + 1;
            if (hasMore) {
              arrayResult.splice(arrayResult.length - 1, 1);
            }
          }
        }
        response.pagination = {
          hasMore: hasMore,
        };
        return response;
      },
    ],
  });
};

export default api;
