import React, { useState } from 'react';
import ContainerLogin from '../../components/container-login/ContainerLogin';
import { FormattedMessage, useIntl } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import './ForgetPassword.scss';
import * as icons from 'assets';
import { requestForgetPassword } from './ForgetPasswordService';
import { validateEmail } from '../../utils/helpers/helpers';
import { notification } from 'antd';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function ForgetPassword(props) {
  const [sendDone, setSendDone] = useState(false);
  const [values, setValues] = React.useState({
    email: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [loadingRedirect, setLoadingRedirect] = React.useState(false);

  const [error, setError] = React.useState(null);
  const onSubmit = async () => {
    if (valid(values.email)) {
      setError(valid(values.email));
    } else {
      setLoading(true);
      try {
        const { data } = await requestForgetPassword(values.email);
        handleResultForgetPassword(data);
      } catch (data) {
        handleResultForgetPassword(data.data);
      }
    }
  };
  const openNotificationError = message => {
    notification['error']({
      message: intl.formatMessage({ id: 'IDS_ERROR' }),
      description: message
    });
  };
  const intl = useIntl();
  const handleResultForgetPassword = data => {
    let status = data && data.result && data.result.status;
    switch (status) {
      case 200:
        setSendDone(true);
        break;
      case 400:
        setError(intl.formatMessage({ id: 'USER_NOT_FOUND' }));
        break;
      default:
        openNotificationError(data.result && data.result.message);
    }
    setLoading(false);
  };
  const valid = email => {
    if (validateEmail(email)) {
      return null;
    } else {
      return intl.formatMessage({ id: 'EMAIL_NOT_RECOGNIZED' });
    }
  };
  const handleChange = prop => event => {
    if (error) {
      setError(null);
    }
    setValues({ ...values, [prop]: event.target.value });
  };
  const goToSignIn = () => {
    setLoadingRedirect(true);
    setTimeout(() => {
      props.history.push('/');
      setLoadingRedirect(false);
    }, 5000);
  };

  return (
    <ContainerLogin styleRowContainer={{ alignItems: 'center' }}>
      {/* title forget password */}
      <div className="title-forget-password">
        <FormattedMessage id="IDS_FORGET_PASSWORD" />
      </div>
      <div
        className="wapper-input-forget-password"
        style={{ display: sendDone ? 'none' : 'block' }}
      >
        <div className="subtitle-forget-password">
          <FormattedMessage id="IDS_SUBTITLE_FORGET_PASSWORD" />
        </div>
        <div className="input-field">
          <FormattedMessage id="IDS_PLACEHOLDER_EMAIL_OR_ID">
            {msg => (
              <TextField
                id="outlined-basic"
                label={<FormattedMessage id="IDS_EMAIL_OR_ID" />}
                placeholder={msg}
                variant="outlined"
                fullWidth
                onChange={handleChange('email')}
                helperText={error ? error : null}
                error={error}
              />
            )}
          </FormattedMessage>
        </div>
        {/* button send */}
        <div className="button" onClick={onSubmit}>
          {loading ? (
            <CircularProgress style={{ color: '#fff' }} size={20} />
          ) : (
            <FormattedMessage id="IDS_SEND" />
          )}
        </div>
      </div>
      <div
        className="wapper-success-forget-password"
        style={{ display: !sendDone ? 'none' : 'block' }}
      >
        <div className="subtitle-success-forget-password">
          <FormattedMessage id="IDS_SUBTITLE_SUCCESS_FORGET_PASSWORD" />
        </div>
        <div className="wapper-icon-done">
          <img src={icons.ic_done} alt="" />
        </div>
        {/* button signin */}
        <div className="button" onClick={goToSignIn}>
          {loadingRedirect ? (
            <CircularProgress style={{ color: '#fff' }} size={20} />
          ) : (
            <FormattedMessage id="IDS_GO_TO_SIGN_IN" />
          )}
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
    </ContainerLogin>
  );
}
