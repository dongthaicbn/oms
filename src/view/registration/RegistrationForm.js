import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import { Row, Col } from 'antd';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { IOSSwitch } from '../../components/iosSwitchButton/IosSwitchButton';
import './Registration.scss';
import {
  validateEmail,
  validatePhoneNumber
} from '../../utils/helpers/helpers';
import { Dropzone } from '../../components/inputFile/InputFile';
import { requestRegistration, getCompanySize } from './RegistrationService';
import { routes } from '../../utils/constants/constants';
import CircularProgress from '@material-ui/core/CircularProgress';
import { notification } from 'antd';

const reg = /^-?[0-9]*(\.[0-9]*)?$/;
export default function RegistrationForm(props) {
  const [loading, setLoading] = React.useState(false);
  const [listCompanySize, setListCompanySize] = React.useState([]);
  const [values, setValues] = React.useState({
    first_name: '',
    last_name: '',
    email: '',
    contact_no: '',
    company_name: '',
    company_size: '',
    store_contact_no: '',
    company_BR: null,
    receive_news: 1
  });
  const [error, setError] = React.useState({
    email: false,
    contact_no: false,
    last_name: false,
    first_name: false,
    company_name: false,
    company_size: false,
    store_contact_no: false,
    company_BR: false
  });
  useEffect(async () => {
    const listCompanySize = await getCompanySize();
    if (listCompanySize && listCompanySize.data && listCompanySize.data.data) {
      setListCompanySize(listCompanySize.data.data);
    }
    window.scrollTo(0, 0);
  }, []);
  const handleChangeReceiveNews = event => {
    let receive_news;
    if (event.target.checked) {
      receive_news = 1;
    } else {
      receive_news = 2;
    }
    setValues({ ...values, receive_news });
  };

  const handleChange = prop => event => {
    if (error[prop]) {
      setError({ ...error, [prop]: false });
    }

    if (prop === 'contact_no' || prop === 'store_contact_no') {
      // let regexNumber = /^[0-9]*$/;
      // if (regexNumber.test(event.target.value)) {
      setValues({ ...values, [prop]: formatPhoneNumber(event.target.value) });
      // }
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }
  };
  const formatPhoneNumber = value => {
    let newContactNo = value.replace(/ /g, '');
    if (reg.test(newContactNo)) {
      let newContactNoText = `${newContactNo}`.replace(/(\d{4})(\d)/g, '$1 $2');
      return newContactNoText;
    }
    return '';
  };
  const handleFile = value => {
    setError({ ...error, company_BR: false });
    setValues({ ...values, company_BR: value });
  };

  const onSubmit = async () => {
    setLoading(true);
    setError({
      email: textValid('email', values.email) ? true : false,
      contact_no: textValid('contact_no', values.contact_no) ? true : false,
      first_name: textValid('first_name', values.first_name) ? true : false,
      last_name: textValid('last_name', values.last_name) ? true : false,
      company_name: textValid('company_name', values.company_name)
        ? true
        : false,
      company_size: textValid('company_size', values.company_size)
        ? true
        : false,
      store_contact_no: textValid('store_contact_no', values.store_contact_no)
        ? true
        : false,
      company_BR: values.company_BR ? false : true
    });
    try {
      const { data } = await requestRegistration(values);
      handleResultRegistration(data);
    } catch (data) {
      handleResultRegistration(data.data);
    }
  };
  const intl = useIntl();
  const handleResultRegistration = data => {
    let status = data && data.result && data.result.status;
    switch (status) {
      case 200:
        props.history.push(routes.REGISTRATION_DONE);
        // window.scrollTo(0, 0);
        break;
      default:
        openNotificationError(data.result && data.result.message);
    }
    setLoading(false);
  };
  const openNotificationError = message => {
    notification['error']({
      message: intl.formatMessage({ id: 'IDS_ERROR' }),
      description: message
    });
  };
  const textValid = (type, value) => {
    if (!value) {
      return intl.formatMessage({ id: 'IDS_PLEASE_FILL_OUT' });
    }
    switch (type) {
      case 'email':
        if (validateEmail(value)) {
          return false;
        } else {
          return intl.formatMessage({ id: 'IDS_DONT_RECOGNISE_EMAIL' });
        }
      case 'contact_no':
        if (validatePhoneNumber(value)) {
          return false;
        } else {
          return intl.formatMessage({ id: 'IDS_FORMAT_NOT_CORRECT' });
        }
      case 'store_contact_no':
        if (validatePhoneNumber(value)) {
          return false;
        } else {
          return intl.formatMessage({ id: 'IDS_FORMAT_NOT_CORRECT' });
        }
      default:
        return '';
    }
  };
  const redirectionPage = event => {
    props.history.push(event.target.id);
  };
  return (
    <div className="wapper-input-registration">
      <div className="wapper-group">
        <div className="title-group padding-mobile">
          <FormattedMessage id="IDS_CONTACT_INFORMATION" />
        </div>
        {/* name */}
        <Row className="wapper-inline padding-mobile">
          <Col xs={24} sm={12} md={12}>
            <div className="input-field-half padding-mobile">
              <TextField
                id="outlined-basic"
                label={<FormattedMessage id="IDS_FIRST_NAME" />}
                variant="outlined"
                fullWidth
                onChange={handleChange('first_name')}
                helperText={
                  error.first_name
                    ? textValid('first_name', values.first_name)
                    : null
                }
                error={error.first_name}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <div className="input-field-half padding-mobile">
              <TextField
                id="outlined-basic"
                label={<FormattedMessage id="IDS_LAST_NAME" />}
                variant="outlined"
                fullWidth
                onChange={handleChange('last_name')}
                helperText={
                  error.last_name
                    ? textValid('last_name', values.last_name)
                    : null
                }
                error={error.last_name}
              />
            </div>
          </Col>
        </Row>
        {/* email */}
        <div className="input-field-full padding-mobile">
          <FormattedMessage id="IDS_PLACEHOLDER_EMAIL_OR_ID">
            {msg => (
              <TextField
                id="outlined-basic"
                label={<FormattedMessage id="IDS_EMAIL" />}
                placeholder={msg}
                variant="outlined"
                fullWidth
                onChange={handleChange('email')}
                helperText={
                  error.email ? textValid('email', values.email) : null
                }
                error={error.email}
              />
            )}
          </FormattedMessage>
        </div>
        {/* contact */}
        <div className="input-field-full padding-mobile">
          <FormattedMessage id="IDS_PLACEHOLDER_CONTACT_NO">
            {msg => (
              <TextField
                id="outlined-basic"
                label={<FormattedMessage id="IDS_CONTACT_NO" />}
                placeholder={msg}
                variant="outlined"
                fullWidth
                autoComplete="new-password"
                onChange={handleChange('contact_no')}
                helperText={
                  error.contact_no
                    ? textValid('contact_no', values.contact_no)
                    : null
                }
                error={error.contact_no}
                inputProps={{ maxLength: 9 }}
                value={values.contact_no}
              />
            )}
          </FormattedMessage>
        </div>
      </div>
      <div className="dash"></div>
      <div className="wapper-group">
        <div className="title-group padding-mobile">
          <FormattedMessage id="IDS_STORE_COMPANY" />
        </div>
        {/* store company name */}
        <div className="input-field-full padding-mobile">
          <TextField
            id="outlined-basic"
            label={<FormattedMessage id="IDS_STORE_COMPANY_NAME" />}
            variant="outlined"
            fullWidth
            autoComplete="new-password"
            onChange={handleChange('company_name')}
            helperText={
              error.company_name
                ? textValid('company_name', values.company_name)
                : null
            }
            error={error.company_name}
          />
        </div>

        {/* Company Size */}
        <div className="input-field-full padding-mobile">
          <FormControl variant="outlined" fullWidth error={error.company_size}>
            <InputLabel
              id="demo-simple-select-outlined-label"
              error={error.company_size}
            >
              <FormattedMessage id="IDS_COMPANY_SIZE" />
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={values.company_size}
              onChange={handleChange('company_size')}
              label="companySize"
            >
              {listCompanySize.map(e => (
                <MenuItem value={e.id}>{e.name}</MenuItem>
              ))}
            </Select>
            {error.company_size ? (
              <div className="text-error-login">
                {textValid('company_size', values.company_size)}
              </div>
            ) : null}
          </FormControl>
        </div>

        {/* store company contact no */}
        <div className="input-field-full padding-mobile">
          <TextField
            id="outlined-basic"
            label={<FormattedMessage id="IDS_STORE_COMPANY_CONTACT_NO" />}
            variant="outlined"
            fullWidth
            autoComplete="new-password"
            onChange={handleChange('store_contact_no')}
            helperText={
              error.store_contact_no
                ? textValid('store_contact_no', values.store_contact_no)
                : null
            }
            error={error.store_contact_no}
            value={values.store_contact_no}
            inputProps={{ maxLength: 9 }}
          />
        </div>
        {/* Company BR */}
        <Dropzone onSelectFile={handleFile} errorValue={error.company_BR} />
      </div>
      <div className="dash"></div>
      <div className="wapper-group">
        {/* receive email */}
        <div className="inline-agree padding-mobile">
          <div className="text-agree">
            <FormattedMessage id="IDS_AGREE_RECEIVE_EMAIL" />
          </div>
          <IOSSwitch
            checked={values.receive_news === 1 ? true : false}
            onChange={handleChangeReceiveNews}
          />
        </div>
      </div>
      <div className="dash"></div>
      <div className="wapper-group">
        <div className="agree-terms padding-mobile">
          <div>
            <FormattedMessage id="IDS_YOU_AGREE_TO" />
          </div>
          <div className="terms-and-conditions">
            <FormattedMessage id="IDS_TERMS_AND_CONDITIONS" />
          </div>
        </div>
      </div>
      {/* button signin */}
      <div className="button" onClick={onSubmit}>
        {loading ? (
          <CircularProgress style={{ color: '#fff' }} size={20} />
        ) : (
          <FormattedMessage id="IDS_SUBMIT" />
        )}
      </div>
      <div className="forward-to-signin">
        <span className="haved-account">
          <FormattedMessage id="IDS_HAVED_AN_ACCOUNT" />
        </span>
        <span
          className="button-signin"
          onClick={redirectionPage}
          id={routes.LOGIN}
        >
          <FormattedMessage id="IDS_LOWERCASE_SIGN_IN" />
        </span>
      </div>
    </div>
  );
}
