import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Layout from 'components/layout/Layout';
import { TOKEN } from 'utils/constants/constants';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from 'antd'
import AppModal from 'components/modal/AppModal';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { changePassword } from './MyAccountService'
import { encrypt } from '../../utils/helpers/helpers';
import { actionSnackBar } from 'view/system/systemAction';
import { notification } from 'antd';
import CircularProgress from '@material-ui/core/CircularProgress';
import './MyAccount.scss'
const reg = /^-?[0-9]*(\.[0-9]*)?$/;

const MyAccount = props => {
  let [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = React.useState(false);

  const [showError, setshowError] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const intl = useIntl();

  const [showPassword, setShowPassword] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [values, setValues] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  useEffect(() => {
    if (!localStorage.getItem(TOKEN)) {
      props.history.push("/")
    }
  }, [])
  const handleChange = prop => event => {
    if (showError[prop]) {
      if ((prop == "newPassword" || prop == "confirmPassword") && validField("newPassword") && validField("confirmPassword")) {
        setshowError({ ...showError, newPassword: '', confirmPassword: '' });
      } else {
        setshowError({ ...showError, [prop]: '' });
      }
    }
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickClearPassword = prop => () => {
    setValues({ ...values, [prop]: '' });
  };
  const handleClickShowPassword = prop => () => {
    setShowPassword({ ...showPassword, [prop]: !showPassword[prop] });
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  const renderTitleInput = (type) => {
    switch (type) {
      case "oldPassword":
        return <FormattedMessage id="IDS_OLD_PASSWORD" />
      case "newPassword":
        return <FormattedMessage id="IDS_NEW_PASSWORD" />
      case "confirmPassword":
        return <FormattedMessage id="IDS_CONFIRM_NEW_PASSWORD" />
      default:
        return <FormattedMessage id="IDS_PASSWORD" />
    }
  }
  const renderInput = (type) => {
    return (
      <div className="input-field">
        <FormControl variant="outlined" fullWidth>
          <InputLabel
            htmlFor="outlined-adornment-password"
            error={showError[type] ? true : false}
          >
            {renderTitleInput(type)}
          </InputLabel>
          <OutlinedInput
            type={showPassword[type] ? 'text' : 'password'}
            label={renderTitleInput(type)}
            variant="outlined"
            value={values[type]}
            onChange={handleChange(type)}
            fullWidth
            inputProps={{
              autoComplete: 'new-password'
            }}
            endAdornment={
              <InputAdornment position="end">
                {values[type] ? (
                  <IconButton
                    aria-label="toggle clear password"
                    onClick={handleClickClearPassword(type)}
                  >
                    <CancelRoundedIcon style={{ fill: '#E0E0E0' }} />
                  </IconButton>
                ) : null}
                {values[type] ? (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword(type)}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword[type] ? <Visibility style={{ color: '#6461B4' }} /> : <VisibilityOff style={{ color: '#6461B4' }} />}
                  </IconButton>
                ) : null}
              </InputAdornment>
            }
            error={showError[type] ? true : false}
          />
          {showError[type] ? (
            <div className="text-error-login">{showError[type]}</div>
          ) : null}

        </FormControl>
      </div>
    )
  }
  const onChange = async () => {
    setLoading(true);
    if (valid()) {
      const old_password = encrypt(values.oldPassword);
      const password = encrypt(values.newPassword);
      const confirm_password = encrypt(values.confirmPassword);
      try {
        const { data } = await changePassword({ old_password, password, confirm_password });
        handleResultChangePassword(data);
      } catch (data) {
        handleResultChangePassword(data && data.data);
      }
    } else {
      setLoading(false);
    }
  }
  const valid = () => {
    let validOldPassword = validField("oldPassword")
    let validNewPassword = validField("newPassword")
    let validConfirmPassword = validField("confirmPassword")
    let wrongFormat = intl.formatMessage({ id: 'IDS_PASSWORD_WRONG_FORMAT' })
    let passwordNotMatch = intl.formatMessage({ id: 'IDS_PASSWORD_DID_NOT_MATCH' })
    if (validOldPassword && validNewPassword && validConfirmPassword) {
      if (values.newPassword !== values.confirmPassword) {
        setshowError({
          ...showError,
          newPassword: passwordNotMatch,
          confirmPassword: passwordNotMatch,
        })
        return false
      }

      return true
    } else {
      setshowError({
        oldPassword: !validOldPassword ? wrongFormat : '',
        newPassword: !validNewPassword ? wrongFormat : '',
        confirmPassword: !validConfirmPassword ? wrongFormat : '',
      })
    }
    return false
  }
  const validField = (type) => {
    if (!values[type] || values[type].length < 8) {
      return false
    }
    return true
  }
  const handleResultChangePassword = data => {

    let status = data && data.result && data.result.status;
    let message = data && data.result && data.result.message
    switch (status) {
      case 200:
        setModalVisible(false)
        clearData()
        props.actionSnackBar({
          open: true,
          type: 'success',
          message: intl.formatMessage({ id: 'IDS_CHANGE_PASSWORD_SUCCESSFULLY' }),
        });
        break;
      case 9:
        if (message === intl.formatMessage({ id: 'IDS_OLD_PASSWORD_NOT_CORRECT' })) {
          setshowError({
            ...showError,
            oldPassword: intl.formatMessage({ id: 'IDS_OLD_PASSWORD_NOT_CORRECT' })
          });
        } else if (message === intl.formatMessage({ id: 'IDS_PASSWORD_DID_NOT_MATCH' })) {
          setshowError({
            ...showError,
            confirmPassword: intl.formatMessage({ id: 'IDS_PASSWORD_DID_NOT_MATCH' }),
            newPassword: intl.formatMessage({ id: 'IDS_PASSWORD_DID_NOT_MATCH' })
          });
        } else {
          openNotificationError(message);
        }
        break;
      default:
        openNotificationError(data && data.result && data.result.message);
      // setModalVisible(false)
    }
    setLoading(false);
  }
  const openNotificationError = message => {
    notification['error']({
      message: intl.formatMessage({ id: 'IDS_ERROR' }),
      description: message
    });
  };
  const clearData = () => {
    setshowError({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setShowPassword({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setValues({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }
  const formatPhoneNumber = value => {
    let newContactNo = value.replace(/ /g, '');
    if (reg.test(newContactNo)) {
      let newContactNoText = `${newContactNo}`.replace(/(\d{4})(\d)/g, '$1 $2');
      return newContactNoText;
    }
    return '';
  };
  return (
    <Layout emptyDrawer={true}>
      <div className="scrollable-container">
        <div className="content-container wapper-my-account">
          <div className="title-header"><FormattedMessage id="IDS_ACCOUNT_DETAILS" /></div>
          <div className="section-infor">
            <div className="title-infor"><FormattedMessage id="IDS_PERSONAL_INFORMATION" /></div>
            <div className="dash"></div>
            <div className="name row-account">
              <div className="first-name col-account-left">
                <div className="title"><FormattedMessage id="IDS_FIRST_NAME" />:</div>
                <div className="value">{props.account && props.account.user && props.account.user.first_name}</div>
              </div>
              <div className="last-name col-account-right">
                <div className="title"><FormattedMessage id="IDS_LAST_NAME" />:</div>
                <div className="value">{props.account && props.account.user && props.account.user.last_name}</div>
              </div>
            </div>
            <div className="email-and-phone row-account">
              <div className="email col-account-left">
                <div className="title"><FormattedMessage id="IDS_EMAIL" />:</div>
                <div className="value">{props.account && props.account.user && props.account.user.email}</div>
              </div>
              <div className="phone col-account-right">
                <div className="title"><FormattedMessage id="IDS_CONTACT_NO" /></div>
                <div className="value">{props.account && props.account.user && props.account.user.contact_no && formatPhoneNumber(props.account.user.contact_no)}</div>
              </div>
            </div>
            <div className="password row-account">
              <div className="email col-account-left">
                <div className="title"><FormattedMessage id="IDS_PASSWORD" /></div>
                <Button className="back-button" onClick={() => setModalVisible(true)}>
                  <FormattedMessage id="IDS_CHANGE_PASSWORD" />
                </Button>
              </div>
            </div>
          </div>
          <div className="section-infor">
            <div className="title-infor"><FormattedMessage id="IDS_STORE_INFORMATION" /></div>
            <div className="dash"></div>
            <div className="name row-account">
              <div className="name col-account-left">
                <div className="title"><FormattedMessage id="IDS_STORE_COMPANY_NAME" />:</div>
                <div className="value">{props.account && props.account.store && props.account.store.company_name}</div>
              </div>
              <div className="contact col-account-right">
                <div className="title"><FormattedMessage id="IDS_STORE_COMPANY_CONTACT_NO" /></div>
                <div className="value">{props.account && props.account.store && props.account.store.contact_no ? props.account.store.contact_no : '_'}</div>
              </div>
            </div>
            <div className="address row-account">
              <div className="name col-account-left">
                <div className="title"><FormattedMessage id="IDS_STORE_COMPANY_ADDRESS" />:</div>
                <div className="value">{props.account && props.account.store && props.account.store.company_address ? props.account.store.company_address : '_'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppModal
        visible={modalVisible}
        titleID={"IDS_CHANGE_PASSWORD"}
        closable
        onVisibleChange={() => setModalVisible(false)}
        hideCancelButton={true}
        hideOkButton={true}
        width={300}
        className="modal-change-password"
      >
        <div className="wapper-modal-my-account">
          {renderInput("oldPassword")}
          {renderInput("newPassword")}
          {renderInput("confirmPassword")}
          <div className="app-flex-container app-button modal-button-container">
            {/* <IconButton icon={<FilterIcon />}>
                  <FormattedMessage id="IDS_FILTER" />
                </IconButton> */}
            <Button
              type="primary"
              className="action-button reject-button-container"
              onClick={onChange}
            >
              {loading ? (
                <CircularProgress style={{ color: '#fff' }} size={20} />
              ) : (
                  <FormattedMessage id="IDS_CHANGE" />
                )}
            </Button>
          </div>
        </div>

      </AppModal>
    </Layout>
  )
}
export default connect(
  (state) => ({
    account: state.system.account
  }),
  { actionSnackBar }
)(withRouter(MyAccount));
