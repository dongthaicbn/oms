import api from "../../../utils/helpers/api";

export const getOrderDetail = (langCode, orderNo) => {
    return api({
        method: 'GET',
        url: '/api/v1/order/detail',
        params: {
            lang_code: langCode,
            order_no: orderNo
        }
    })
};