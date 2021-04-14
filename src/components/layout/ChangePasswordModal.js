import React, { useState } from 'react';
import { Form, Modal, Input, message, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { changePassword } from 'view/system/systemAction';
import { ACCOUNT, TOKEN } from 'utils/constants/constants';
import { isEmpty } from 'utils/helpers/helpers';

const ChangePasswordModal = (props) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await changePassword({
        ...values,
        [TOKEN]: localStorage.getItem(TOKEN),
      });
      if (!isEmpty(data.data)) {
        message.success('Thay đổi mật khẩu thành công');
        localStorage.setItem(TOKEN, data.data.tokenkey);
        localStorage.setItem(ACCOUNT, JSON.stringify(data.data));
        props.closeModal();
      } else {
        message.error(data.message);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <Modal
      title="Thay đổi mật khẩu"
      visible={true}
      onOk={props.closeModal}
      onCancel={props.closeModal}
      footer={null}
    >
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="login-form"
      >
        <span className="lab-text">Mật khẩu cũ</span>
        <Form.Item
          name="old_password"
          required
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Hãy nhập mật khẩu cũ!',
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu cũ" />
        </Form.Item>
        <span className="lab-text">Mật khẩu mới</span>
        <Form.Item
          name="new_password"
          required
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Hãy nhập mật khẩu mới!',
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={props.closeModal}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginLeft: 20 }}
            >
              &nbsp;&nbsp;
              <FormattedMessage id="IDS_OK" />
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
