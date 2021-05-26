import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'App.scss';
import Routes from './Routes';
import DrawerMenu from 'components/layout/DrawerMenu';
import SnackBar from './components/snackbar/SnackBar';
import CookieApp from 'components/cookie/CookieApp';
import { getAccountDetail } from './view/home/HomeActions';
import { isEmpty, getLangCode } from './utils/helpers/helpers';
import { updateAccountInfo } from './view/system/systemAction';
import { TOKEN } from 'utils/constants/constants';

const App = (props) => {
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
    if (localStorage.getItem(TOKEN)) fetchAccountDetail();
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener("resize", () => {
      vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }, []);
  return (
    <Layout className="app-container">
      <Routes />
      <DrawerMenu />
      <SnackBar />
      <CookieApp />
    </Layout>
  );
};

export default connect(
  (state) => ({
    account: state.system.account,
  }),
  { updateAccountInfo }
)(withRouter(App));
