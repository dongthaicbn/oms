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
  pageCache: {
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
    case constants.SNACK_BAR:
      return { ...state, snackBar: action.payload };

    case constants.CACHE_PAGE: {
      let newState = {...state};
      newState.pageCache[action.payload.page] = action.payload.pageData;
      return newState;
    }

    default:
      return state;
  }
};

export default system;
