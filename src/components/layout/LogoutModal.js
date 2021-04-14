import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';
import { ACCOUNT, routes, TOKEN } from 'utils/constants/constants';

const LogoutModal = (props) => {
  const onSubmit = () => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(ACCOUNT);
    props.history.push(routes.LOGIN);
    props.closeModal();
  };

  return (
    <>
      <Modal
        title="Đăng xuất"
        visible={true}
        onOk={onSubmit}
        onCancel={props.closeModal}
      >
        <span>Bạn có chắc chắn muốn đăng xuất?</span>
      </Modal>
    </>
  );
};
export default withRouter(LogoutModal);
