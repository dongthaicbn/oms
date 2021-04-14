import React from 'react';
import ContainerLogin from '../../components/container-login/ContainerLogin';
import { FormattedMessage } from 'react-intl';
import './Registration.scss';

import { Switch, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import RegistrationDone from './RegistrationDone';
export default function Registration(props) {
  let { path } = props.match;
  return (
    <ContainerLogin
      styleRowContainer={{ alignItems: 'center' }}
      styleContainerForm={{ marginBottom: '70px' }}
    >
      <div className="title-registration-password">
        <FormattedMessage id="IDS_REGISTRATION" />
      </div>
      <Switch>
        <Route exact path={`${path}`} component={RegistrationForm} />
        <Route exact path={`${path}/done`} component={RegistrationDone} />
      </Switch>
    </ContainerLogin>
  );
}
