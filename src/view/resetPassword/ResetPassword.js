import React from 'react';
import ContainerLogin from '../../components/container-login/ContainerLogin';
import { FormattedMessage } from 'react-intl';
import ResetPasswordDone from './ResetPasswordDone';
import ResetPasswordForm from './ResetPasswordForm';
import './ResetPassword.scss';
import { Switch, Route } from 'react-router-dom';

export default function ResetPassword(props) {
  let { path } = props.match;
  return (
    <ContainerLogin styleRowContainer={{ alignItems: 'center' }}>
      {/* title reset password */}
      <div className="title-reset-password">
        <FormattedMessage id="IDS_RESET_PASSWORD" />
      </div>
      <Switch>
        <Route exact path={`${path}`} component={ResetPasswordForm} />
        <Route exact path={`${path}/done`} component={ResetPasswordDone} />
      </Switch>
    </ContainerLogin>
  );
}
