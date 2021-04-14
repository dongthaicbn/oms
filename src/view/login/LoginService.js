import api from '../../utils/helpers/api';
import { TOKEN } from '../../utils/constants/constants';

export const requestLoginExample = (data) => {
  localStorage.removeItem(TOKEN);
  return api({ method: 'post', url: 'api/API/UserLogin', data });
};

export const requestLogin = (username, password) => {
  localStorage.removeItem(TOKEN);
  return api({
    method: 'post', url: `/api/v1/member/login`,
    data: {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
        client_id: "031447391946937",
        client_secret: "341ix2iki16ot6xnyydqt8gyzzirkuaw",
        username,
        password
    }
  });
};

