import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal } from 'antd';
import './AppModal.scss';

const AppModal = props => {
  const {
    visible,
    onVisibleChange,
    titleID,
    title,
    onOk,
    okText,
    okTextID,
    hideOkButton,
    onCancel,
    cancelText,
    cancelTextID,
    hideCancelButton,
    closable,
    onClose
  } = props;

  const renderButtonLabel = (textID, text, defaultTextID) => {
    if (textID) {
      return <FormattedMessage id={textID} />;
    } else if (text) {
      return text;
    } else {
      return <FormattedMessage id={defaultTextID} />;
    }
  };

  const handleOk = () => {
    if (onOk && onOk()) {
      if (onVisibleChange) {
        onVisibleChange(false);
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onVisibleChange) {
      onVisibleChange(false);
    }
  };

  return (
    <Modal
      visible={visible}
      closable={closable ? closable : false}
      title={titleID ? <FormattedMessage id={titleID} /> : title}
      className="app-modal"
      onCancel={onClose}
      footer={
        <div className="app-button modal-button-container">
          {!hideCancelButton && (
            <Button type="primary" onClick={handleOk}>
              {renderButtonLabel(okTextID, okText, 'IDS_OK')}
            </Button>
          )}
          {!hideOkButton && (
            <Button onClick={handleCancel}>
              {renderButtonLabel(cancelTextID, cancelText, 'IDS_CANCEL')}
            </Button>
          )}
        </div>
      }
      centered
    >
      {props.children || ''}
    </Modal>
  );
};

export default AppModal;
