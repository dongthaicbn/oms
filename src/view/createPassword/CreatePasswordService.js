import api from '../../utils/helpers/api';

export const checkCreatePasswordToken = data => {
  return api({
    method: 'post',
    url: `/api/v1/member/password/token`,
    data: {
      ...data
    }
  });
};

export const createPassword = data => {
  return api({
    method: 'post',
    url: `/api/v1/member/password/create`,
    data: {
      ...data
    }
  });
};
