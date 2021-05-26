import React, { useRef } from 'react';
import AppModal from './AppModal';
import { Camera } from 'react-cam';
import './CameraModal.scss'

const CameraModal = (props) => {
  const {className, onBack, onCancel, onCapture, onCameraError, ...otherProps} = props;
  let cameraRef = useRef(null);

  const captureImage = (base64Image) => {
    if (onCapture) {
      onCapture(base64Image);
    }
    stopCameraVideoStream();
    otherProps.onVisibleChange(false);
  };

  const stopCameraVideoStream = () => {
    let videoStream = cameraRef?.current?.camRef?.current?.srcObject;
    if (videoStream) {
      videoStream.getTracks()[0]?.stop();
    }
  };

  const handleCancel = () => {
    stopCameraVideoStream();
    if (onCancel) {
      onCancel();
    }
  };

  const handleBack = () => {
    stopCameraVideoStream();
    if (onBack) {
      onBack();
    }
  };

  return (
    <AppModal
      className={`camera-modal ${className || ''}`}
      {...otherProps}
      visible={true} // must be always visible
      closable={true} onCancel={handleCancel}
      onBack={handleBack}
      hideOkButton={true} hideCancelButton={true} destroyOnClose={true}>
      <Camera showFocus={false}
              front={false}
              capture={captureImage}
              onError={onCameraError}
              ref={cameraRef}
              btnColor="white"
              width={680}
              height={600}/>
      <div className="capture-action-group app-button">
        <div className="capture-action" onClick={() => cameraRef.current.capture()}/>
      </div>
    </AppModal>
  )
};

export default CameraModal;