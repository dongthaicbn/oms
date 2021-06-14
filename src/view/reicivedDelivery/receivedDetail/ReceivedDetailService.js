import api from "utils/helpers/api";
import { ORDER_ID_TYPE, ORDER_NO_TYPE, ACTION_REMOVE_PHOTO } from 'utils/constants/constants';
import { isImageData, toBase64Image } from "utils/helpers/helpers";

export const getReceivedDeliveryDetail = (langCode, type, orderCode) => {
  return api({
    method: 'GET',
    url: '/api/v1/deliveryOrder/detail',
    params: {
      lang_code: langCode,
      type: type,
      order_no: Number(type) === ORDER_NO_TYPE? orderCode : null,
      order_id: Number(type) === ORDER_ID_TYPE? orderCode : null
    }
  })
};

export const receivedDeliveryOrder = (orderId, items) => {
  return api({
    method: 'PUT',
    url: '/api/v1/deliveryOrder/receive',
    data: {
      order_id: orderId,
      items: items
    }
  })
};

export const addDamageRecord = (orderId, reasonTypeEnum, otherReason, items, photos) => {
  return api({
    method: 'POST',
    url: '/api/v1/deliveryOrder/damageRecord/add',
    data: {
      order_id: orderId,
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
      photos: photos.map((photo, index) => {
        if (photo.action === ACTION_REMOVE_PHOTO) {
          return {
            action: ACTION_REMOVE_PHOTO,
            position: photo.position,
          }
        }
        return { ...photo, position: photo.position }
      }) || []
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