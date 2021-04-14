import React from 'react';
import { confirmPassword } from 'view/system/systemAction';
import { Modal, Row, Col, message, Form, Button, Input } from 'antd';
import { rules } from 'utils/helpers/helpers';

const ConfirmPassword = (props) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      await confirmPassword(values);
      handleCancel();
      if (props.handleConfirm) props.handleConfirm();
    } catch (err) {
      message.error('Password incorrect!');
    }
  };
  const handleCancel = () => {
    if (props.handleCancel) props.handleCancel();
  };
  return (
    <Modal
      visible={true}
      centered
      maskClosable={false}
      width={520}
      wrapClassName="theme-modal recommend-modal"
      className="countries-selected-theme"
      title="Confirm password"
      footer={null}
      onCancel={handleCancel}
    >
      <p className="title-col" style={{ color: '#252525' }}>
        Please confirm your password to continue
      </p>
      <Form form={form} onFinish={onFinish} initialValues={{ models: [] }}>
        <Row className="row-model">
          <Col span={24}>
            <p className="title-col">Password</p>
            <Form.Item name="password" rules={rules('Please input password!')}>
              <Input.Password placeholder="Password" />
            </Form.Item>
          </Col>
        </Row>
        <div className="ant-modal-footer footer-create">
          <div>
            <Button
              type="button"
              className="ant-btn ant-btn-link"
              onClick={handleCancel}
            >
              <span>CANCEL</span>
            </Button>
            <Button
              type="submit"
              htmlType="submit"
              className="ant-btn ant-btn-primary"
            >
              <span>PUSH</span>
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ConfirmPassword;
