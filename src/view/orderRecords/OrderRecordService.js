import api from "../../utils/helpers/api";

export const getOrderList = (langCode, orderStatus) => {
    return api({
        method: 'GET',
        url: '/api/v1/order/list',
        params: {
            lang_code: langCode,
            order_status: orderStatus
        },
        headers: {
            Authorization: 'Bearer sWe11gw22iiw7XyoyuZ0kAt66OUnEYwSMBhN7Dsk'
        }
    })
};