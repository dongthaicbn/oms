import api from "utils/helpers/api";

export const getMonthlyInventory = (langCode, year) => {
  return api({
    method: 'GET',
    url: '/api/v1/monthlyInventory/list',
    params: {
      lang_code: langCode,
      year: year
    }
  })
};