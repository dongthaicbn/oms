import api from "utils/helpers/api";

export const getReceivedDeliveryDetail = (langCode, orderNo) => {
  return api({
    method: 'GET',
    url: '/api/v1//deliveryOrder/detail',
    params: {
      lang_code: langCode,
      order_no: orderNo
    }
  })
};