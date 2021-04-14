import React from 'react';
import * as icons from 'assets';
import { FormattedMessage } from 'react-intl';
import './Registration.scss';

export default function RegistrationDone(props) {
  const redirectionPage = event => {
    props.history.push(event.target.id);
  };
  return (
    <div className="wapper-success-registration">
      <div className="subtitle-success-reset-password">
        <FormattedMessage id="IDS_SEND_EMAIL_AFTER_APPROVED" />
      </div>
      <div className="wapper-icon-done">
        <img src={icons.ic_done} alt="" />
      </div>
      {/* button signin */}
      <div className="button" onClick={redirectionPage} id={'/'}>
        <FormattedMessage id="IDS_BACK_TO_HOMEPAGE" />
      </div>
    </div>
  );
}
