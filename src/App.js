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
    } catch (error) {}
  };
  useEffect(() => {
    if (localStorage.getItem(TOKEN)) fetchAccountDetail(); // eslint-disable-next-line
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
    // showMenu: state.system.showMenu,
  }),
  { updateAccountInfo }
)(withRouter(App));
