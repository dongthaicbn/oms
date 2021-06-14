import api from 'utils/helpers/api';
import * as constants from 'utils/constants/actionType';

export const actionChangeLang = lang => ({
  type: constants.CHANGE_LANG,
  payload: lang
});

export const getAccountInfo = () => async dispatch => {
  try {
    const { data } = await api({ method: 'get', url: '/api/v1/accounts/me' });
    dispatch({ type: constants.FETCH_ACCOUNT, payload: data.data });
  } catch (error) { }
};

export const updateAccountInfo = data => ({
  type: constants.FETCH_ACCOUNT,
  payload: data
});

export const actionToggleMenu = data => ({
  type: constants.TOGGLE_MENU,
  payload: data
});

export const actionSnackBar = data => ({
  type: constants.SNACK_BAR,
  payload: data
});

export const actionCachePage = (page, data) => ({
  type: constants.CACHE_PAGE,
  payload: {
    page: page,
    pageData: data
  }
});
