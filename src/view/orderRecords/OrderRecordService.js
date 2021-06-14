import { pageApi, CancelToken } from 'utils/helpers/api';
import { DEFAULT_NUMBER_OF_ITEMS } from 'utils/constants/constants';

let cancelTokenSource;

export const getOrderList = (langCode, orderStatus, lastItemOrderNo, numberOfItems = DEFAULT_NUMBER_OF_ITEMS) => {
  cancelCurrentGetOrderListRequest();
  cancelTokenSource = CancelToken.source();
  return pageApi({
    method: 'GET',
    url: '/api/v1/order/list',
    params: {
      lang_code: langCode,
      order_status: orderStatus,
      last_item_id: lastItemOrderNo,
      number_of_items: numberOfItems
    },
    cancelToken: cancelTokenSource.token,
    arrayField: 'orders'
  });
};

export const cancelCurrentGetOrderListRequest = () => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel();
    cancelTokenSource = undefined;
  }
};