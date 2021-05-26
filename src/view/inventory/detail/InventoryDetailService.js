import api from "utils/helpers/api";

export const getMonthlyInventoryDetail = (langCode, inventoryId) => {
  return api({
    method: 'GET',
    url: '/api/v1/monthlyInventory/detail',
    params: {
      lang_code: langCode,
      id: inventoryId
    }
  })
};

export const submitMonthInventory = (data) => {
  return api({
    method: 'POST',
    url: '/api/v1/monthlyInventory/submit',
    data: data
  })
};