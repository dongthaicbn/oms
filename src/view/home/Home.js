import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import * as icons from 'assets';
import './Home.scss';
import BannerSlide from './components/BannerSlide';
import PromotionContent from './components/PromotionContent';
import SubFooter from './components/SubFooter';
// import Footer from './components/Footer';
import { actionToggleMenu } from '../system/systemAction';
import { getHomeInfo } from './HomeActions';
import { isEmpty, getLangCode } from 'utils/helpers/helpers';
import Header from '../../components/header-home/Header';
import Footer from '../../components/footer-login/Footer';
const Home = props => {
  const [data, setData] = useState({});
  const { locale } = props;
  const openMenu = () => {
    props.actionToggleMenu(true);
  };
  const fetchData = async () => {
    try {
      const { data } = await getHomeInfo({ lang_code: getLangCode(locale) });

      if (!isEmpty(data.data)) setData(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="wapper-home-page">
      <div className="page-container">
        <Header />
        <BannerSlide banners={data.banners || []} />
        <PromotionContent promotions={data.news_promotions || []} />
        <SubFooter />
        <Footer />
      </div>
    </div>
  );
};

export default connect(
  state => ({
    // users: state.system.users,
  }),
  { actionToggleMenu }
)(withRouter(Home));
