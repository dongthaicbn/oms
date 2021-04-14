import api from '../../utils/helpers/api';

export const checkResetPasswordToken = data => {
  return api({
    method: 'post',
    url: `/api/v1/member/resetPassword/token`,
    data: {
      ...data
    }
  });
};

export const resetPassword = data => {
  return api({
    method: 'post',
    url: `/api/v1/member/resetPassword`,
    data: {
      ...data
    }
  });
};
