import React, { useState, useEffect } from 'react';
import HomeLayout from '../home/components/HomeLayout';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import './newAndPromotion.scss'
import { getListNews } from './newAndPromotionService'
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import { Card, Row, Col, notification } from 'antd';
import DetailNews from './detailNews/detailNews'
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

const NUMBER_OF_PAGE = 4
const NewAndPromotion = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  var refImage = []
  const [heightImage, setHeightImage] = useState(null)
  const [idLastItem, setIdLastItem] = useState(null)
  const [showLoadMore, setShowLoadMore] = useState(true)
  // let mapHeight = new Map()
  let { path } = props.match;
  const [currentPosition, setCurrentPosition] = useState(0)
  const intl = useIntl();

  useEffect(() => {
    fetchData(NUMBER_OF_PAGE, null)
    const handleScroll = e => {
      // set scroll values in state
    }

    window.addEventListener('scroll', handleScroll);

    // Remove listener when component unmounts
    window.removeEventListener('scroll', handleScroll);
  }, [])
  useEffect(() => {
    refImage.map((e, i) => {
      if (refImage && refImage.length > 0) {
        setHeightImage(refImage[0].clientWidth * 226 / 428)
      }

    })

    document.getElementById("root").scroll(0, currentPosition)

  }, [data])
  useEffect(() => {
    if (window.location.pathname == "/news-and-promotions") {
      document.getElementById("root").scroll(0, currentPosition)
    }
    console.log("change path", window.location.pathname)
  }, [window.location.pathname])
  const openNotificationError = message => {
    notification['warning']({
      message: intl.formatMessage({ id: 'IDS_WARNING' }),
      description: message
    });
  };
  const fetchData = async (number_of_items, last_item_id) => {
    setLoading(true)
    try {
      let params = {
        lang_code: getLangCode(props.locale),
        number_of_items,
        last_item_id
      }
      const res = await getListNews(params)
      if (!res.data || !res.data.data) {
        openNotificationError("NewsAndPromotions not found")
        setShowLoadMore(false)
      }
      if (!isEmpty(res.data.data.news_promotions)) {
        let newData = data.concat(res.data.data.news_promotions)
        setData(newData)
        if (res.data.data.news_promotions.length > 0) {
          setIdLastItem(res.data.data.news_promotions[res.data.data.news_promotions.length - 1].id)
        }
      }
      setLoading(false)


      // console.log(res)
    } catch (e) {
      setLoading(false)
    }
  }
  const onLoadMore = () => {
    getCurrentPosition()
    fetchData(NUMBER_OF_PAGE, idLastItem)
  }
  const gotoDetail = (id) => {
    getCurrentPosition()
    props.history.push(path + `/detail/${id}`)
  }
  const getCurrentPosition = () => {
    let newCurrentPosition = document.getElementById("root").scrollTop
    setCurrentPosition(newCurrentPosition)
  }
  const listNews = () => {
    return (
      <div className="padding-common wapper-new-and-promotion">
        <p className="promotion-title">
          <FormattedMessage id="IDS_NEW_PROMOTION" />
        </p>
        <Row className="card-group" id="card-group">
          {data.map((el, i) => (
            <Col md={12} sm={24}>
              <Card key={el.id}
                onClick={() => gotoDetail(el.id)}
                cover={
                  <img style={{
                    height: heightImage ? heightImage : 'unset'
                  }}
                    ref={(divElement) => { refImage.push(divElement) }} alt="example" src={el.banner_url} />
                }>
                <Card.Meta
                  title={el.title}
                  description={
                    <>
                      <p style={{ marginBottom: 8 }}>{el.description}</p>
                      <p style={{ marginBottom: 0 }} className="time">{el.create_date && moment(el.create_date).format("DD MMM YYYY")}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
        {showLoadMore ?
          <div>
            {!loading ?
              <div className="wapper-load-more">
                <div className="load-more" onClick={onLoadMore}><FormattedMessage id="IDS_LOAD_MORE" /></div>
              </div>
              :
              (
                <div className="wapper-loading-news">
                  <CircularProgress style={{ color: '#6461B4' }} size={48} />
                </div>
              )
            }
          </div> : null}
      </div>

    )
  }
  return (
    <HomeLayout>

      <Switch>
        <Route exact path={`${path}`} component={listNews} />
        <Route exact path={`${path}/detail/:id`} component={DetailNews} />
      </Switch>
    </HomeLayout>
  )
}
export default connect(
  (state) => ({

  }),
  {}
)(withRouter(NewAndPromotion));