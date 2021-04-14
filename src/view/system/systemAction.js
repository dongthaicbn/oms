import api from 'utils/helpers/api';
import * as constants from 'utils/constants/actionType';
// import { isEmpty } from 'utils/helpers/helpers';

export const actionChangeLang = lang => ({
  type: constants.CHANGE_LANG,
  payload: lang
});

export const getAccountInfo = () => async dispatch => {
  try {
    const { data } = await api({ method: 'get', url: '/api/v1/accounts/me' });
    dispatch({ type: constants.FETCH_ACCOUNT, payload: data.data });
  } catch (error) {}
};
export const updateAccountInfo = data => ({
  type: constants.FETCH_ACCOUNT,
  payload: data
});
export const actionToggleMenu = data => ({
  type: constants.TOGGLE_MENU,
  payload: data
});
export const actionSelectActionMenuItem = data => ({
  type: constants.SELECT_MENU_ACTION_ITEM,
  payload: data
});

export const actionSnackBar = data => ({
  type: constants.SNACK_BAR,
  payload: data
});
