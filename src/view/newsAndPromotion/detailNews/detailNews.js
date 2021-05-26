import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import { getDetailNews } from '../newAndPromotionService'
import moment from 'moment';
import './detailNews.scss'

const DetailNews = (props) => {
  const { id } = props.match.params;
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      let params = {
        lang_code: getLangCode(props.locale),
        id
      }
      const res = await getDetailNews(params)
      console.log(res)
      if (!isEmpty(res.data.data.news_promotion)) {
        setData(res.data.data.news_promotion)
      }

    } catch (e) {

    }
  }
  useEffect(() => {
    document.getElementById("root").scroll(0, 0)
    if (id) {
      fetchData()
    }
  }, [])
  return (
    <div className="wapper-detail-news">
      <p className="promotion-title">
        <FormattedMessage id="IDS_NEW_PROMOTION" />
      </p>
      <div className="title-news">{data && data.title}</div>
      <div className="create-date">{data && data.create_date && moment(data.create_date).format("DD MMM YYYY")}</div>
      <img className="image-news" src={data && data.banner_url} />
      <div className="description-news">{data && data.description}</div>
    </div>)
}
export default connect(
  (state) => ({

  }),
  {}
)(withRouter(DetailNews));