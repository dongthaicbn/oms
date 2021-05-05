import api from '../../utils/helpers/api';

export const getBorrowList = (langCode, recordStatus) => {
  return api({
    method: 'GET',
    url: '/api/v1/borrowing/list',
    params: {
      lang_code: langCode,
      record_status: recordStatus
    }
  });
};
