import axios from 'axios';
import { TOKEN } from '../constants/constants';
// import { TOKEN, routes } from '../constants/constants';
import config from '../constants/config';

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
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // window.location.href = routes.HOME;
    }
    return Promise.reject(error.response);
  }
);

const api = (options = {}) => {
  return request({
    baseURL: config.BASE_URL,
    ...options,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem(TOKEN),
      ...options.headers,
    },
  });
};

export default api;
