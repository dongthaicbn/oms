import api from "../../../utils/helpers/api";

export const getOrderDetail = (langCode, orderNo) => {
    return api({
        method: 'GET',
        url: '/api/v1/order/detail',
        params: {
            lang_code: langCode,
            order_no: orderNo
        },
        headers: {
            Authorization: 'Bearer sWe11gw22iiw7XyoyuZ0kAt66OUnEYwSMBhN7Dsk'
        }
    })
};