import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import HomeLayout from './components/HomeLayout';
import { getSupportivePage } from './HomeActions';
import { isEmpty, getLangCode } from 'utils/helpers/helpers';
import { Box } from '@material-ui/core';
import * as icons from 'assets';
import './Home.scss';
import { FormattedMessage } from 'react-intl';
import ContactItem from './components/ContactItem';
import { routes } from 'utils/constants/constants';

const TermCondition = (props) => {
  const { locale } = props;
  const { pathname } = props.location;
  const [data, setData] = useState({});

  const getFlag = () => {
    if (pathname === routes.TERM_CONDITION) return 'terms-conditions';
    if (pathname === routes.PRIVACY_POLICY) return 'privacy-policy';
    if (pathname === routes.DISCLAIMER) return 'disclaimer';
    return '';
  };
  const getTitle = () => {
    if (pathname === routes.TERM_CONDITION) return 'IDS_TERMS';
    if (pathname === routes.PRIVACY_POLICY) return 'IDS_POLICY';
    if (pathname === routes.DISCLAIMER) return 'IDS_DISCLAIMER';
    return '';
  };

  const fetchData = async () => {
    try {
      const { data } = await getSupportivePage({
        lang_code: getLangCode(locale),
        slug: getFlag(),
      });

      if (!isEmpty(data.data)) setData(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, [pathname]);
  return (
    <HomeLayout>
      <Box style={{ minHeight: 'calc(100vh - 389px)' }}>
        <p className="contact-header">
          <FormattedMessage id={getTitle()} />
        </p>
        <p className="title-block-item">{data.title}</p>
        <p className="text-block-item">{data.content}</p>
      </Box>
    </HomeLayout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  {}
)(withRouter(TermCondition));
