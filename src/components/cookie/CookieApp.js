import React from 'react';
import cookie from 'js-cookie';
import { Drawer, Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { USE_COOKIE } from 'utils/constants/constants';
import './CookieApp.scss';
import { isEmpty } from 'utils/helpers/helpers';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(isEmpty(cookie.get(USE_COOKIE)));

  return (
    <React.Fragment key="bottom">
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => {
          setOpen(false);
          cookie.set(USE_COOKIE, 'false');
        }}
        className="drawer-cookie"
      >
        <div className="cookie-content">
          <p className="cookie-title">
            <FormattedMessage id="IDS_USE_COOKIE_OUR_WEBSITE" />
          </p>
          <p className="cookie-text">
            <FormattedMessage id="IDS_USE_COOKIE_OUR_WEBSITE_DESCRIPTION" />
            &nbsp;
            <span>
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
      </Drawer>
    </React.Fragment>
  );
}
