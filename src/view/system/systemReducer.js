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
    message: ''
  },
  lendingData: {
    date: null,
    shop_id: null,
    shop_name: null,
    categories: [],
    borrowingNo: 'IB0200265201'
  },
  layoutSlider: {
    previousUrl: null
  }
};

const system = (state = initialState, action) => {
  switch (action.type) {
    case constants.CHANGE_LANG:
      return { ...state, locale: action.payload };
    case constants.FETCH_ACCOUNT:
      return {
        ...state,
        account: action.payload
      };
    case constants.TOGGLE_MENU:
      return { ...state, showMenu: action.payload };
    case constants.SELECT_MENU_ACTION_ITEM:
      return { ...state, selectedActionMenuItemId: action.payload };
    case constants.SNACK_BAR:
      return { ...state, snackBar: action.payload };
    case constants.LAYOUT_SLIDER_ROUTING:
      let newState = {...state};
      newState.layoutSlider = {
        ...newState.layoutSlider,
        ...action.payload
      };
      return newState;
    default:
      return state;
  }
};

export default system;
