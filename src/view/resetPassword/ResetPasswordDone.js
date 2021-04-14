import React from 'react';
import * as icons from 'assets';
import './ResetPassword.scss';
import { FormattedMessage } from 'react-intl';

export default function ResetPasswordDone() {
  return (
    <div className="wapper-success-reset-password">
      <div className="subtitle-success-reset-password">
        <FormattedMessage id="IDS_SUBTITLE_SUCCESS_FORGET_PASSWORD" />
      </div>
      <div className="wapper-icon-done">
        <img src={icons.ic_done} alt="" />
      </div>
      {/* button signin */}
      <div className="button">
        <FormattedMessage id="IDS_GO_TO_SIGN_IN" />
      </div>
      {/* question receive email */}
      <div className="wapper-inline">
        <div className="text">
          <FormattedMessage id="IDS_QUESTION_HAVE_ACCOUNT" />
        </div>
        <div className="text button-create-account">
          <FormattedMessage id="IDS_CREATE_ACCOUNT" />
        </div>
      </div>
    </div>
  );
}
