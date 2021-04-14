import { LANG } from 'utils/constants/constants';
import * as constants from '../../utils/constants/actionType';

// 1 – English (default); 2 – Traditional Chinese; 3 – Simplified Chinese
// zh_CN	Simplified Chinese
// zh_TW	traditional Chinese
const initialState = {
  locale: localStorage.getItem(LANG) || 'en', // vi, en, zh_CN
  account: {},
  role: [],
  showMenu: false,
  selectedActionMenuItemId: 1,
  snackBar: {
    open: false,
    type: '',
    message: '',
  },
};

const system = (state = initialState, action) => {
  switch (action.type) {
    case constants.CHANGE_LANG:
      return { ...state, locale: action.payload };
    case constants.FETCH_ACCOUNT:
      return {
        ...state,
        account: action.payload,
        role: action.payload.permission,
      };
    case constants.TOGGLE_MENU:
      return { ...state, showMenu: action.payload };
    case constants.SELECT_MENU_ACTION_ITEM:
      return { ...state, selectedActionMenuItemId: action.payload };
    case constants.SNACK_BAR:
      return { ...state, snackBar: action.payload };

    default:
      return state;
  }
};

export default system;
