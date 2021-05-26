import api from "utils/helpers/api";

export const getCategoryOrderDetail = (langCode, categoryId, categoryTarget) => {
  return api({
    method: 'GET',
    url: '/api/v1/order/category/detail',
    params: {
      lang_code: langCode,
      id: categoryId,
      is_favorite_category: categoryTarget
    }
  })
};