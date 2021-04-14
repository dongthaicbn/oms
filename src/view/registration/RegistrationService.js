import api from '../../utils/helpers/api';

export const requestRegistration = data => {
  return api({
    method: 'post',
    url: `/api/v1/member/registration`,
    data: {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...data
    }
  });
};
export const getCompanySize = () => {
  return api({
    method: 'get',
    url: `/api/v1/member/registration/companySize?lang_code=1`
  });
};
