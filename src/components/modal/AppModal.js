import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal } from 'antd';
import * as icons from 'assets';
import './AppModal.scss';

const AppModal = props => {
  const {
    className,
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
    onClose,
    showBackButton,
    onBack,
    onClickNotCloseModal,
    width
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
      if (onVisibleChange && !onClickNotCloseModal) {
        onVisibleChange(false);
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onVisibleChange && !onClickNotCloseModal) {
      onVisibleChange(false);
    }
  };

  const handleModalClose = () => {
    if (onVisibleChange) {
      onVisibleChange(!visible);
    }
    if (onCancel) {
      onCancel();
    }
  };

  const handleModalBack = () => {
    if (onVisibleChange) {
      onVisibleChange(!visible);
    }
    if (onBack) {
      onBack();
    }
  };

  const customModalRender = (contentNode) => {
    if (showBackButton) {
      return (
        <div className="ant-modal-content">
          <button type="button" aria-label="Back"
            className="app-modal-back" onClick={handleModalBack}>
            <span className="app-modal-back-icon">
              <img src={icons.ic_back} alt="" />
            </span>
          </button>
          {contentNode.props.children}
        </div>
      );
    }
    return contentNode;
  };

  return (
    <Modal
      visible={visible}
      closable={closable ? closable : false}
      closeIcon={<img src={icons.ic_close} alt="" />}
      maskClosable={true}
      title={titleID ? <FormattedMessage id={titleID} /> : title}
      className={`app-modal ${className || ''}`}
      onCancel={handleModalClose}
      modalRender={customModalRender}
      width={width ? width : 'unset'}
      footer={
        <div className="app-button modal-button-container">
          {!hideOkButton && (
            <Button type="primary" onClick={handleOk}>
              {renderButtonLabel(okTextID, okText, 'IDS_OK')}
            </Button>
          )}
          {!hideCancelButton && (
            <Button onClick={handleCancel} style={hideOkButton ? '' : { marginRight: 24 }}>
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
