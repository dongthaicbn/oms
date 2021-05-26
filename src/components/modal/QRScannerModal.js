import React from 'react';
import QrReader from 'react-qr-reader';
import AppModal from './AppModal';
import './QrScannerModal.scss';

const QRScannerModal = (props) => {
  let { className, onError, onSuccess, ...otherProps } = props;

  return (
    <AppModal
      {...otherProps}
      visible={true}
      className={`qr-scanner-modal ${className || ''}`}
      closable={true} hideOkButton={true}
      hideCancelButton={true} destroyOnClose={true}>
      <QrReader
        className="qr-reader"
        delay={500}
        resolution={600}
        facingMode="environment"
        onError={onError}
        onScan={onSuccess}/>
    </AppModal>
  )
};

export default QRScannerModal;