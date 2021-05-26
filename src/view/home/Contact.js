import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import NumberFormat from 'react-number-format';
import HomeLayout from './components/HomeLayout';
import { contactUs } from './HomeActions';
import { isEmpty, validateEmail } from 'utils/helpers/helpers';
import { actionSnackBar } from 'view/system/systemAction';
import { Box, TextField } from '@material-ui/core';
import * as icons from 'assets';
import './Home.scss';
import { FormattedMessage, useIntl } from 'react-intl';
import ContactItem from './components/ContactItem';
import { routes } from 'utils/constants/constants';
import { ReactComponent as CheckWhiteIcon } from 'assets/icons/ic_check_white.svg';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #E0E0E0',
      borderRadius: 6,
    },
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ef5f5f',
      color: '#ef5f5f',
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      // borderColor: 'red',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      // borderColor: '#E0E0E0',
    },
    '& .MuiOutlinedInput-input': {
      fontFamily: 'NotoSansTC',
      color: '#4F4E66',
    },
    '&:hover .MuiOutlinedInput-input': {
      // color: 'red',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
      // color: 'purple',
    },
    '& .MuiInputLabel-outlined': {
      fontFamily: 'NotoSansTC',
      color: '#828282',
    },
    '&:hover .MuiInputLabel-outlined': {
      // color: 'red',
    },
    '& .MuiInputLabel-outlined.Mui-focused': {
      fontWeight: 700,
    },
    '& .Mui-error': { color: '#ef5f5f' },
  },
});
const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: { name: props.name, value: values.value },
        });
      }}
      format="#### ####"
    />
  );
};
const Contact = (props) => {
  const classes = useStyles();
  const intl = useIntl();
  const [isSuccess, setSuccess] = useState(false);
  const [showError, setShowError] = React.useState({
    company_name: '',
    email: '',
  });
  const [values, setValues] = React.useState({
    company_name: '',
    first_name: '',
    last_name: '',
    email: '',
    contact_no: '',
  });
  const handleChange = (field, e) => {
    if (!isEmpty(showError[field])) {
      setShowError({ ...showError, [field]: '' });
    }
    setValues({ ...values, [field]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      if (
        !validateEmail(values.email.trim()) ||
        isEmpty(values.email.trim()) ||
        isEmpty(values.company_name.trim())
      ) {
        setShowError({
          ...showError,
          company_name: isEmpty(values.company_name.trim())
            ? intl.formatMessage({
                id: 'IDS_INVALID_COMPANY_NAME_TEXT',
              })
            : '',
          email:
            !validateEmail(values.email.trim()) || isEmpty(values.email.trim())
              ? intl.formatMessage({ id: 'IDS_INVALID_EMAIL_TEXT' })
              : '',
        });
        return;
      }
      const { data } = await contactUs(values);
      if (data.result.status === 200) {
        setSuccess(true);
        setShowError({ company_name: '', email: '' });
      } else {
        props.actionSnackBar({
          open: true,
          type: 'error',
          message: data.result.message,
        });
      }
    } catch (error) {
      if (error.data.result && error.data.result.message) {
        props.actionSnackBar({
          open: true,
          type: 'error',
          message: error.data.result.message,
        });
      }
    }
  };
  const handleChangeRoute = (url) => {
    props.history.push(url);
  };
  return (
    <HomeLayout>
      <>
        <p className="contact-header">
          <FormattedMessage id="IDS_CONTACT_US_TITLE" />
        </p>
        <Box className="contact-content">
          <Box className="haft-content">
            <Box className="toa-logo-contain">
              <img src={icons.TOA_logo} alt="TOA logo" />
            </Box>
            <Box className="contact-item-group">
              <ContactItem
                title={<FormattedMessage id="IDS_CONTACT_NO_TITLE" />}
                content={
                  <span
                    onClick={(e) => {
                      window.location = 'tel:(852) 6437 5678';
                      e.preventDefault();
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    (852) 6437 5678
                  </span>
                }
              />
              <ContactItem
                title={<FormattedMessage id="IDS_FAX_NO" />}
                content="(852) 6437 5678"
              />
            </Box>
            <ContactItem
              title={<FormattedMessage id="IDS_EMAIL_ADDRESS" />}
              content={
                <span
                  onClick={(e) => {
                    window.location = 'mailto:chantaiming@toa.mail';
                    e.preventDefault();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  chantaiming@toa.mail
                </span>
              }
            />
            <ContactItem
              title={<FormattedMessage id="IDS_OFFICE_ADDRESS" />}
              content="Flat D, 13/F., Luk Hop Industrial Building, 8 Luk Hop Street, San Po Kong, Kowloon, Hong Kong."
            />
          </Box>
          <Box className="haft-content right-block">
            <form noValidate autoComplete="off">
              <Box
                className="contact-block"
                style={{ height: isSuccess ? 593 : 'auto' }}
              >
                {isSuccess ? (
                  <Box className="succecss-box">
                    <p className="success-text">
                      <FormattedMessage id="IDS_SUCCESSFUL" />
                    </p>
                    <p className="success-message">
                      <FormattedMessage id="IDS_SUCCESSFUL_MESSAGE" />
                    </p>
                    <Box className="check-circle">
                      <CheckWhiteIcon />
                    </Box>
                  </Box>
                ) : (
                  <>
                    <p className="contact-title-block">
                      <FormattedMessage id="IDS_GET_IN_TOUCH" />
                    </p>
                    <TextField
                      // required
                      id="outlined-error-helper-text"
                      label={intl.formatMessage({ id: 'IDS_COMPANY_NAME' })}
                      onChange={(e) => handleChange('company_name', e)}
                      helperText={showError.company_name}
                      error={!isEmpty(showError.company_name)}
                      variant="outlined"
                      className={classes.root}
                    />
                    <Box className="row-form-item">
                      <TextField
                        id="outlined-error-helper-text"
                        label={intl.formatMessage({ id: 'IDS_FIRST_NAME' })}
                        onChange={(e) => handleChange('first_name', e)}
                        variant="outlined"
                        style={{ width: 'calc(50% - 12px)' }}
                        className={classes.root}
                      />
                      <TextField
                        id="outlined-error-helper-text"
                        label={intl.formatMessage({ id: 'IDS_LAST_NAME' })}
                        onChange={(e) => handleChange('last_name', e)}
                        variant="outlined"
                        style={{ width: 'calc(50% - 12px)' }}
                        className={classes.root}
                      />
                    </Box>
                    <TextField
                      // required
                      id="outlined-error-helper-text"
                      label={intl.formatMessage({ id: 'IDS_EMAIL' })}
                      onChange={(e) => handleChange('email', e)}
                      helperText={showError.email}
                      error={!isEmpty(showError.email)}
                      variant="outlined"
                      className={classes.root}
                    />
                    <TextField
                      id="outlined-error-helper-text"
                      label={intl.formatMessage({ id: 'IDS_CONTACT_NO' })}
                      placeholder={`${intl.formatMessage({
                        id: 'IDS_CONTACT_NO',
                      })} (e.g. 2345 6789)`}
                      onChange={(e) => handleChange('contact_no', e)}
                      variant="outlined"
                      className={classes.root}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                    <p className="help-text">
                      <FormattedMessage id="IDS_SUBMIT_DESCRIPTION" />
                      &nbsp;
                      <span
                        style={{
                          fontWeight: 600,
                          color: '#4F4E66',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleChangeRoute(routes.TERM_CONDITION)}
                      >
                        <FormattedMessage id="IDS_TERMS_AND_CONDITIONS" />
                      </span>
                    </p>
                  </>
                )}
                <Button
                  className="submit-btn"
                  onClick={() => {
                    if (isSuccess) handleChangeRoute(routes.HOME);
                    else handleSubmit();
                  }}
                >
                  <FormattedMessage
                    id={isSuccess ? 'IDS_BACK_TO_HOMEPAGE' : 'IDS_SUBMIT'}
                  />
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </>
    </HomeLayout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  { actionSnackBar }
)(withRouter(Contact));
