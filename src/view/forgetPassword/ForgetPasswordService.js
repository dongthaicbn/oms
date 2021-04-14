import api from '../../utils/helpers/api';
export const requestForgetPassword = (email) => {
    return api({
      method: 'post', url: `/api/v1/member/forgotPassword`,
      data: {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
          email
      }
    });
  };
  