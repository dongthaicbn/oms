import React from 'react';
import { withRouter } from 'react-router-dom';
import { routes } from 'utils/constants/constants';
import '../Home.scss';

const Footer = (props) => {
  const handleChangeRoute = (url) => {
    props.history.push(url);
  };
  return (
    <div className="footer-content">
      <span>© 2020 Taste Of Asia Group Chopsticks</span>
      <div className="right-footer">
        <span
          onClick={() => handleChangeRoute(routes.TERM_CONDITION)}
          style={{ cursor: 'pointer' }}
        >
          Terms & Conditions
        </span>
        |
        <span
          onClick={() => handleChangeRoute(routes.PRIVACY_POLICY)}
          style={{ cursor: 'pointer' }}
        >
          Privacy Policy{' '}
        </span>
        |
        <span
          onClick={() => handleChangeRoute(routes.DISCLAIMER)}
          style={{ cursor: 'pointer' }}
        >
          Disclaimer
        </span>
      </div>
    </div>
  );
};

export default withRouter(Footer);
