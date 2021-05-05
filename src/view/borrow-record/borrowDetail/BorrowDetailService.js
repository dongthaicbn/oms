import api from '../../../utils/helpers/api';

export const getBorrowDetail = (langCode, id) => {
  return api({
    method: 'GET',
    url: '/api/v1/borrowing/detail',
    params: {
      lang_code: langCode,
      id
    }
  });
};
export const updateBorrowing = (id, action, sign_image) => {
  return api({
    method: 'PUT',
    url: '/api/v1/borrowing/update',
    params: {
      id,
      action,
      sign_image
    }
  });
};