import React from 'react';
import ContainerLogin from '../../components/container-login/ContainerLogin';
import { FormattedMessage } from 'react-intl';

import CreatePasswordDone from './CreatePasswordDone';
import CreatePasswordForm from './CreatePasswordForm';
import './CreatePassword.scss';
import { Switch, Route } from 'react-router-dom';

export default function CreatePassword(props) {
  let { path } = props.match;
  return (
    <ContainerLogin styleRowContainer={{ alignItems: 'center' }}>
      {/* title create password */}
      <div className="title-create-password">
        <FormattedMessage id="IDS_CREATE_PASSWORD" />
      </div>
      <Switch>
        <Route exact path={`${path}`} component={CreatePasswordForm} />
        <Route exact path={`${path}/done`} component={CreatePasswordDone} />
      </Switch>
    </ContainerLogin>
  );
}
