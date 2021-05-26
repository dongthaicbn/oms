import React from 'react';
import SubFooter from './SubFooter';
// import Footer from './components/Footer';
import Header from 'components/header-home/Header';
import Footer from 'components/footer-login/Footer';

const HomeLayout = (props) => {
  return (
    <div className="wapper-home-page">
      <div className="page-container">
        <Header />
        {props.children}
        <SubFooter />
        <Footer />
      </div>
    </div>
  );
};

export default HomeLayout;
