import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Divider } from 'antd';
import { connect } from 'react-redux';
import * as icons from '../../assets';
import { FormattedMessage } from 'react-intl';
import { requestLogin } from './LoginService';
import {
  getAccountInfo,
  updateAccountInfo,
} from '../../view/system/systemAction';
import './Login.scss';
import { ACCOUNT, TOKEN } from '../../utils/constants/constants';
import { isEmpty } from 'utils/helpers/helpers';
// import api from '../../utils/helpers/api';

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [showErrMes, setErr] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await requestLogin(values);
      if (!isEmpty(data.data)) {
        localStorage.setItem(TOKEN, data.data.tokenkey);
        localStorage.setItem(ACCOUNT, JSON.stringify(data.data));
        // props.getAccountInfo();
        props.updateAccountInfo(data.data);
      } else {
        setErr('Username hoặc password không chính xác!');
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {};
  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="logo-content">
          <img src={icons.ic_logo} alt="logo" />
          <div className="login-text">
            <p className="login-header">Water Network Management System</p>
            <Divider style={{ background: 'white' }} />
            <p className="sub-header">
              Chào mừng bạn đến với hệ thống IoT Thủy Sản
            </p>
          </div>
        </div>
      </div>
      <div className="login-container">
        <img src={icons.ic_logo} className="logo-img" alt="logo" />
        {showErrMes && <p className="fail-text">{showErrMes}</p>}
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="login-form"
        >
          <span className="lab-text">Tài khoản</span>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Hãy nhập username!',
              },
              { max: 50, message: 'Bạn không thể nhập quá 50 kí tự!' },
              { pattern: "^[_'.@A-Za-z0-9-]*$", message: 'Hãy nhập username' },
            ]}
          >
            <Input placeholder="Nhập tài khoản" />
          </Form.Item>
          <span className="lab-text">Mật khẩu</span>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Hãy nhập password!',
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item className="footer-container">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-btn"
            >
              &nbsp;&nbsp;
              <FormattedMessage id="IDS_SMS_LOGIN" />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(
  (state) => ({
    // isLoading: state.system.isLoading
  }),
  { getAccountInfo, updateAccountInfo }
)(withRouter(Login));
