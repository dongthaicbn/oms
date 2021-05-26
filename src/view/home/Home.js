import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './Home.scss';
import BannerSlide from './components/BannerSlide';
import PromotionContent from './components/PromotionContent';
import HomeLayout from './components/HomeLayout';
// import Footer from './components/Footer';
import { actionToggleMenu, updateAccountInfo } from '../system/systemAction';
import { getHomeInfo, getAccountDetail } from './HomeActions';
import { isEmpty, getLangCode } from 'utils/helpers/helpers';
// import { TOKEN } from 'utils/constants/constants';

const Home = (props) => {
  const [data, setData] = useState({});
  const { locale } = props;
  // const openMenu = () => {
  //   props.actionToggleMenu(true);
  // };
  const fetchData = async () => {
    try {
      const { data } = await getHomeInfo({ lang_code: getLangCode(locale) });

      if (!isEmpty(data.data)) setData(data.data);
    } catch (error) { }
  };
  const fetchAccountDetail = async () => {
    try {
      const { data } = await getAccountDetail({
        lang_code: getLangCode(props.locale),
      });
      if (!isEmpty(data.data)) {
        props.updateAccountInfo(data.data);
      }
    } catch (error) { }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (props.account.logined) {
      fetchAccountDetail();
    }
  }, [props.account && props.account.logined]);
  return (
    <HomeLayout>
      <BannerSlide banners={data.banners || []} />
      <PromotionContent promotions={data.news_promotions || []} />
    </HomeLayout>
  );
};

export default connect(
  (state) => ({
    account: state.system.account,
  }),
  { actionToggleMenu, updateAccountInfo }
)(withRouter(Home));
