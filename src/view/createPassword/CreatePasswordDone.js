import React from 'react';
import './CreatePassword.scss';

import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import { routes } from '../../utils/constants/constants';

export default function CreatePasswordDone(props) {
  const redirectionPage = event => {
    props.history.push(event.target.id);
  };

  return (
    <div className="wapper-success-create-password">
      <div className="subtitle-success-create-password">
        <FormattedMessage id="IDS_SUBTITLE_SUCCESS_FORGET_PASSWORD" />
      </div>
      <div className="wapper-icon-done">
        <img src={icons.ic_done} alt="" />
      </div>
      {/* button signin */}
      <div className="button" onClick={redirectionPage} id={routes.LOGIN}>
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
