import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, Select } from 'antd';
import * as icons from 'assets';

const ConfirmLeaveModal = (props) => {
  const { handleClose } = props;
  const handleStay = () => {
    handleClose();
  };
  const handleLeave = () => {
    handleClose();
  };
  return (
    <Modal
      visible={true}
      title={null}
      closeIcon={
        <img src={icons.ic_close} alt="" style={{ display: 'none' }} />
      }
      onOk={handleClose}
      onCancel={handleClose}
      className="modal-container"
      width={476}
      footer={null}
      centered
    >
      <div className="modal-filter-content">
        <p className="title-filter-text">
          <FormattedMessage id="IDS_LEAVE_THIS_PAGE" />
        </p>
        <p
          className="title-item"
          style={{
            color: '#4F4E66',
            fontWeight: 'normal',
            fontSize: 20,
            lineHeight: '30px',
            textAlign: 'center',
            padding: '8px 32px',
          }}
        >
          <FormattedMessage id="IDS_LEAVE_DESCRIPTION" />
        </p>
        <div className="filter-footer" style={{ marginTop: 16 }}>
          <Button className="outline-btn" onClick={handleStay}>
            <FormattedMessage id="IDS_STAY" />
          </Button>
          <Button className="primary-btn" onClick={handleLeave}>
            <FormattedMessage id="IDS_LEAVE" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmLeaveModal;
