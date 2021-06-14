import api from '../../utils/helpers/api';
export const requestForgetPassword = (email, langCode) => {
    return api({
      method: 'post', url: `/api/v1/member/forgotPassword`,
      data: {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
          email,
          lang_code: langCode
      }
    });
  };
  