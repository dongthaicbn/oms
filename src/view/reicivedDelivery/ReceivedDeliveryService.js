import api, { pageApi, CancelToken } from "utils/helpers/api";
import { DEFAULT_NUMBER_OF_ITEMS } from 'utils/constants/constants';

let rdlCancelTokenSource;
let rdsCancelTokenSource;

export const getReceivedDeliveryList = (langCode, orderStatus, lastItemOrderNo, numberOfItems = DEFAULT_NUMBER_OF_ITEMS) => {
  cancelReceivedDeliveryListRequest();
  rdlCancelTokenSource = CancelToken.source();
  return pageApi({
    method: 'GET',
    url: '/api/v1/deliveryOrder/list',
    params: {
      lang_code: langCode,
      order_status: orderStatus,
      last_item_id: lastItemOrderNo,
      number_of_items: numberOfItems
    },
    cancelToken: rdlCancelTokenSource.token,
    arrayField: 'orders'
  })
};

export const cancelReceivedDeliveryListRequest = () => {
  if (rdlCancelTokenSource) {
    rdlCancelTokenSource.cancel();
    rdlCancelTokenSource = undefined;
  }
};

export const searchReceivedDelivery = (langCode, orderNo, orderStatus, lastItemOrderNo, numberOfItems = DEFAULT_NUMBER_OF_ITEMS) => {
  cancelReceivedDeliverySearchRequest();
  rdsCancelTokenSource = CancelToken.source();
  return pageApi({
    method: 'GET',
    url: '/api/v1/deliveryOrder/list/search',
    params: {
      lang_code: langCode,
      order_no: orderNo,
      order_status: orderStatus,
      last_item_id: lastItemOrderNo,
      number_of_items: numberOfItems
    },
    cancelToken: rdsCancelTokenSource.token,
    arrayField: 'orders'
  })
};

export const cancelReceivedDeliverySearchRequest = () => {
  if (rdsCancelTokenSource) {
    rdsCancelTokenSource.cancel();
    rdsCancelTokenSource = undefined;
  }
};

export const getReceivedDeliveryStatusCount = () => {
  return api({
    method: 'GET',
    url: '/api/v1/deliveryOrder/list/count',
  });
};