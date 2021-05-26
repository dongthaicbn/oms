import api from "utils/helpers/api";
import { isImageData, toBase64Image } from "utils/helpers/helpers";

export const getReceivedDeliveryDetail = (langCode, orderNo) => {
  return api({
    method: 'GET',
    url: '/api/v1/deliveryOrder/detail',
    params: {
      lang_code: langCode,
      order_no: orderNo
    }
  })
};

export const receivedDeliveryOrder = (orderNo, items) => {
  return api({
    method: 'PUT',
    url: '/api/v1/deliveryOrder/receive',
    data: {
      order_no: orderNo,
      items: items
    }
  })
};

export const addDamageRecord = (orderNo, reasonTypeEnum, otherReason, items, photos) => {
  return api({
    method: 'POST',
    url: '/api/v1/deliveryOrder/damageRecord/add',
    data: {
      order_no: orderNo,
      reason_type: reasonTypeEnum.value,
      other_reason: otherReason || '',
      items: items || [],
      photos: photos.map((photo, index) => ({
        ...photo,
        position: index + 1
      })) || []
    }
  });
};

export const updateDamageRecord = async (reportId, reasonTypeEnum, otherReason, items, photos) => {
  return api({
    method: 'PUT',
    url: '/api/v1/deliveryOrder/damageRecord/update',
    data: {
      report_id: reportId,
      reason_type: reasonTypeEnum.value,
      other_reason: otherReason,
      items: items || [],
      photos: photos.map((photo, index) => ({
        ...photo,
        position: index + 1
      })) || []
    }
  });
};

export const deleteDamageRecord = (reportId, langCode) => {
  return api({
    method: 'DELETE',
    url: '/api/v1/deliveryOrder/damageRecord/remove',
    params: {
      lang_code: langCode,
      report_id : reportId
    }
  })
};