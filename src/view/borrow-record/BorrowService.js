import api from '../../utils/helpers/api';
import { DEFAULT_NUMBER_OF_ITEMS } from 'utils/constants/constants';

export const getBorrowList = (langCode, recordStatus, lastItemNo) => {
  return api({
    method: 'GET',
    url: '/api/v1/borrowing/list',
    params: {
      lang_code: langCode,
      record_status: recordStatus,
      last_item_id: lastItemNo,
      number_of_items: DEFAULT_NUMBER_OF_ITEMS
    }
  });
};
