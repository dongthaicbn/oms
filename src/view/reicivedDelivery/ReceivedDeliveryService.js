import api, { pageApi, CancelToken } from "utils/helpers/api";
import { DEFAULT_NUMBER_OF_ITEMS } from 'utils/constants/constants';

let cancelTokenSource;

export const getReceivedDeliveryList = (langCode, orderStatus, lastItemOrderNo) => {
  cancelReceivedDeliveryListRequest();
  cancelTokenSource = CancelToken.source();
  return pageApi({
    method: 'GET',
    url: '/api/v1/deliveryOrder/list',
    params: {
      lang_code: langCode,
      order_status: orderStatus,
      last_item_id: lastItemOrderNo,
      number_of_items: DEFAULT_NUMBER_OF_ITEMS
    },
    cancelToken: cancelTokenSource.token,
    arrayField: 'orders'
  })
};

export const cancelReceivedDeliveryListRequest = () => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel();
    cancelTokenSource = undefined;
  }
};

export const getReceivedDeliveryStatusCount = () => {
  return api({
    method: 'GET',
    url: '/api/v1/deliveryOrder/list/count',
  });
};