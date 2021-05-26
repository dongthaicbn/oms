import api from '../../utils/helpers/api';

export const changePassword = (password) => {
  return api({
    method: 'post', url: `/api/v1/account/changePassword`,
    data: {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      ...password
    }
  });
};