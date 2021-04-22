import React, { useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { FormattedMessage, useIntl } from 'react-intl';
import './CreatePassword.scss';
import { routes } from '../../utils/constants/constants';
import { createPassword } from './CreatePasswordService';
import { encrypt } from '../../utils/helpers/helpers';
import { checkCreatePasswordToken } from './CreatePasswordService';
import { notification } from 'antd';

export default function CreatePasswordForm(props) {
  const intl = useIntl();
  const [oneTimeToken, setOneTimeToken] = React.useState('');
  useEffect(() => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var token = url.searchParams.get('token');
    if (token) {
      checkToken(token);
      setOneTimeToken(token);
    }
  }, []);
  const checkToken = async token => {
    try {
      const data = await checkCreatePasswordToken({ token });
      handleCheckToken(data);
    } catch (error) {
      handleCheckToken(error);
    }
  };
  const openNotificationError = message => {
    notification['error']({
      message: intl.formatMessage({ id: 'IDS_ERROR' }),
      description: message
    });
  };
  const handleCheckToken = data => {
    if (data && data.status) {
      switch (data.status) {
        case 200:
          break;
        case 400:
          openNotificationError(
            intl.formatMessage({ id: 'IDS_TOKEN_EXPIRES' })
          );
          break;
        default:
          openNotificationError(
            intl.formatMessage({ id: 'IDS_AN_ERROR_OCCURRED' })
          );
      }
    }
  };
  const handleCreatePassword = data => {
    if (data && data.status) {
      switch (data.status) {
        case 200:
          props.history.replace(routes.CREATE_PASSWORD_DONE);
          break;
        default:
          openNotificationError(data.data.result.message);
      }
    }
  };

  const [show, setShow] = React.useState({
    password: false,
    repeatPassword: false
  });

  const [values, setValues] = React.useState({
    password: '',
    repeatPassword: ''
  });
  const [errorInput, setErrorInput] = React.useState(false);
  const handleChange = prop => event => {
    if (errorInput) {
      if (prop === 'password') {
        setErrorInput(validInput(event.target.value, values.repeatPassword));
      } else {
        setErrorInput(validInput(values.password, event.target.value));
      }
    }

    setValues({ ...values, [prop]: event.target.value });
  };
  const onSubmit = async () => {
    setErrorInput(validInput(values.password, values.repeatPassword));
    if (
      !validInput(values.password, values.repeatPassword) &&
      values.password
    ) {
      const encryptText = encrypt(values.password);
      try {
        const data = await createPassword({
          token: oneTimeToken,
          password: encryptText
        });
        handleCreatePassword(data);
      } catch (error) {
        handleCreatePassword(error);
      }
    }
  };
  const handleClickClear = prop => event => {
    setValues({ ...values, [prop]: '' });
  };
  const handleClickShow = prop => event => {
    setShow({ ...show, [prop]: !show[prop] });
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  const validInput = (valueA, valueB) => {
    return valueA !== valueB;
  };
  return (
    <div className="wapper-input-create-password">
      <div className="input-field">
        <FormControl variant="outlined" fullWidth error={errorInput}>
          <InputLabel htmlFor="outlined-adornment-password">
            <FormattedMessage id="IDS_PASSWORD" />
          </InputLabel>
          <OutlinedInput
            type={show.password ? 'text' : 'password'}
            label={<FormattedMessage id="IDS_PASSWORD" />}
            variant="outlined"
            value={values.password}
            onChange={handleChange('password')}
            fullWidth
            inputProps={{
              autoComplete: 'new-password'
            }}
            endAdornment={
              <InputAdornment position="end">
                {values.password ? (
                  <IconButton
                    aria-label="toggle clear password"
                    onClick={handleClickClear('password')}
                  >
                    <CancelRoundedIcon style={{ fill: '#E0E0E0' }} />
                  </IconButton>
                ) : null}
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShow('password')}
                  onMouseDown={handleMouseDownPassword}
                >
                  {show.password ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errorInput ? (
            <div className="text-error-create-password">Password not match</div>
          ) : null}
        </FormControl>
      </div>
      <div className="input-field">
        <FormControl variant="outlined" fullWidth error={errorInput}>
          <InputLabel htmlFor="outlined-adornment-password">
            <FormattedMessage id="IDS_PASSWORD" />
          </InputLabel>
          <OutlinedInput
            type={show.repeatPassword ? 'text' : 'password'}
            label={<FormattedMessage id="IDS_PASSWORD" />}
            variant="outlined"
            value={values.repeatPassword}
            onChange={handleChange('repeatPassword')}
            fullWidth
            inputProps={{
              autoComplete: 'new-password'
            }}
            endAdornment={
              <InputAdornment position="end">
                {values.repeatPassword ? (
                  <IconButton
                    aria-label="toggle clear password"
                    onClick={handleClickClear('repeatPassword')}
                  >
                    <CancelRoundedIcon style={{ fill: '#E0E0E0' }} />
                  </IconButton>
                ) : null}
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShow('repeatPassword')}
                  onMouseDown={handleMouseDownPassword}
                >
                  {show.repeatPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errorInput ? (
            <div className="text-error-create-password">Password not match</div>
          ) : null}
        </FormControl>
      </div>
      {/* button send */}
      <div className="button" onClick={onSubmit}>
        <FormattedMessage id="IDS_SEND" />
      </div>
    </div>
  );
}
