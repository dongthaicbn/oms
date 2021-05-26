import React from 'react';
import { withRouter } from 'react-router-dom';
import cookie from 'js-cookie';
import { Button, Box } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { routes, USE_COOKIE } from 'utils/constants/constants';
import './CookieApp.scss';

const CookieApp = (props) => {
  const [open, setOpen] = React.useState(cookie.get(USE_COOKIE) !== 'true');
  const handleLearnMore = () => {
    props.history.push(routes.PRIVACY_POLICY);
  };
  return (
    <React.Fragment key="bottom">
      {open && (
        <Box className="drawer-cookie">
          <div className="cookie-content">
            <p className="cookie-title">
              <FormattedMessage id="IDS_USE_COOKIE_OUR_WEBSITE" />
            </p>
            <p className="cookie-text">
              <FormattedMessage id="IDS_USE_COOKIE_OUR_WEBSITE_DESCRIPTION" />
              &nbsp;
              <span onClick={handleLearnMore}>
                <FormattedMessage id="IDS_LEARN_MORE" />
              </span>
            </p>
            <div className="button-wrapper">
              <Button
                className="got-it-btn"
                onClick={() => {
                  setOpen(false);
                  cookie.set(USE_COOKIE, 'true');
                }}
              >
                <FormattedMessage id="IDS_GOT_IT" />
              </Button>
            </div>
          </div>
        </Box>
      )}
    </React.Fragment>
  );
};
export default withRouter(CookieApp);
