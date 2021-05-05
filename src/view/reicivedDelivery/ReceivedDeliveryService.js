import api from "utils/helpers/api";

export const getReceivedDeliveryList = (langCode, orderStatus) => {
  return api({
    method: 'GET',
    url: '/api/v1/deliveryOrder/list',
    params: {
      lang_code: langCode,
      order_status: orderStatus
    }
  })
};