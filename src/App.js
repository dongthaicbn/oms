import React from 'react';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'App.scss';
import Routes from './Routes';
import DrawerMenu from 'components/layout/DrawerMenu';
import SnackBar from './components/snackbar/SnackBar';
const App = props => {
  return (
    <Layout className="app-container">
      <Routes />
      <DrawerMenu />
      <SnackBar />
    </Layout>
  );
};

export default connect(
  state => ({
    // showMenu: state.system.showMenu,
  }),
  {}
)(withRouter(App));
