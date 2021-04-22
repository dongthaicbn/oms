import React, { useRef, useState, useEffect } from 'react';

import './InputFile.scss';
import { Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';

export const Dropzone = props => {
  const fileInputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [validFiles, setValidFiles] = useState([]);

  useEffect(() => {
    let filteredArr = selectedFiles.reduce((acc, current) => {
      const x = acc.find(item => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    setValidFiles([...filteredArr]);
  }, [selectedFiles]);

  const filesSelected = () => {
    //@ts-ignore
    if (
      fileInputRef &&
      fileInputRef.current &&
      fileInputRef.current.files &&
      fileInputRef.current.files.length > 0
    ) {
      //@ts-ignore
      handleFiles(fileInputRef.current.files);
    }
  };

  const fileInputClicked = () => {
    //@ts-ignore
    fileInputRef.current.click();
  };

  const handleFiles = files => {
    // for (let i = 0; i < 1; i++) {
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      var base64data = reader.result;

      props.onSelectFile(base64data);
    };
    if (validateFile(files[0])) {
      setSelectedFiles(prevArray => [files[0]]);
    } else {
      files[0]['invalid'] = true;
      setSelectedFiles(prevArray => [files[0]]);
    }
    // }
  };

  const validateFile = file => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }

    return true;
  };

  const fileSize = size => {
    if (size === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + '' + sizes[i];
  };

  return (
    <div className="drag-cv">
      <div className="wapper-company-br padding-mobile">
        <Row className="wapper-inline padding-mobile">
          <Col xs={24} sm={14} md={14}>
            <div className="title-company-br">
              <FormattedMessage id="IDS_COMPANY_BR" />
            </div>
            {validFiles && validFiles.length > 0 ? (
              <div>
                {validFiles.map((data, i) => {
                  var length = 20;
                  var trimmedString =
                    data.name.length > length
                      ? data.name.substring(0, length - 3) + '...'
                      : data.name;
                  return (
                    <span
                      className={`file-name ${
                        data.invalid ? 'file-error' : ''
                      }`}
                    >
                      {trimmedString}({fileSize(validFiles[0].size)})
                    </span>
                  );
                })}
              </div>
            ) : (
              <div
                className="not-upload"
                style={{ color: props.errorValue ? '#f44336' : '#828282' }}
              >
                <FormattedMessage id="IDS_NOT_UPLOAD_YET" />
              </div>
            )}
          </Col>
          <Col xs={24} sm={10} md={10} className="wapper-button-upload">
            <input
              ref={fileInputRef}
              className="file-input"
              type="file"
              accept=".pdf, .png, .jpg, .jpeg"
              multiple={false}
              onChange={filesSelected}
            />
            <span
              className="button-upload"
              onClick={fileInputClicked}
              style={{
                padding:
                  validFiles && validFiles.length > 0
                    ? '14px 20px'
                    : '14px 38px'
              }}
            >
              {validFiles && validFiles.length > 0 ? (
                <FormattedMessage id="IDS_RE_UPLOAD" />
              ) : (
                <FormattedMessage id="IDS_UPLOAD" />
              )}
            </span>
          </Col>
        </Row>
      </div>
    </div>
  );
};
