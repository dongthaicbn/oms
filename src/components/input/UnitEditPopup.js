import React, { useState } from 'react';
import { Popover, Button, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import './UnitEditPopup.scss';


const UnitEditPopup = (props) => {
  let {
    onSubmit, onValueChanged, onPopupCancel, onCancel,
    value, maxValue, minValue,
    disableFractional, maxFractionalDigits, units
  } = props;
  let [visible, setVisible] = useState(false);
  let [submitted, setSubmitted] = useState(false);
  let [canceled, setCanceled] = useState(false);
  let [expanded, setExpanded] = useState(false);
  let [originValue, setOriginValue] = useState(value);

  const onUpdateClicked = () => {
    // reformatValueNumber(value);
    if (!onSubmit || onSubmit()) {
      setSubmitted(true);
      setCanceled(false);
      setVisible(false)
    }
  };

  const changeValue = (newValue) => {

    // if (typeof newValue !== 'string') {
    //   if (!isNumberValid(newValue)) {
    //     return;
    //   }
    // } else if (!newValue.endsWith('.')) {
    //   let numberValue = parseFloat(newValue);
    //   if (!isNumberValid(numberValue)) {
    //     return;
    //   }
    //   newValue = numberValue;
    // }
    if (newValue !== value && onValueChanged) {
      onValueChanged(newValue);
      onUpdateClicked()
      console.log(newValue)
      // onVisibleChanged(false)
    }
  };

  const isNumberValid = (value) => {
    if (minValue !== null && minValue !== undefined && value < minValue) {
      return false;
    }
    if (maxValue !== null && maxValue !== undefined && value > maxValue) {
      return false;
    }
    if (maxFractionalDigits) {
      let numberParts = String(value).split('.');
      if (numberParts.length > 1 && numberParts[1].length > maxFractionalDigits) {
        return false;
      }
    }
    return true;
  };

  const reformatValueNumber = (value) => {
    if (typeof value === 'string' && value.endsWith('.')) {
      changeValue(Number(backspaceValue(value)));
    }
  }

  const onVisibleChanged = (visible) => {
    if (visible) {
      setOriginValue(value);
      setSubmitted(false);
      setCanceled(false);
    } else if (!submitted && !canceled) {
      // reformatValueNumber(value);
      if (onPopupCancel) {
        onPopupCancel(originValue);
      }
    }
    setVisible(visible);
  };

  const cancel = () => {
    setCanceled(true);
    if (onCancel) {
      onCancel();
    }
  }

  const appendValue = (value, appendValue) => {
    if (value) {
      return `${value}${appendValue}`;
    } else if (appendValue) {
      return `${appendValue}`;
    }
  };


  const backspaceValue = (value) => {
    if (value) {
      return String(value).slice(0, -1);
    }
  };

  const renderContent = () => {
    return (
      <div className="middle-group">
        <Row className="row-space" gutter={12}>
          {units && units.map((item, index) => (
            <Col span={12} className="cell-item">
              <Button className="action-button" onClick={() => changeValue(item.id)}>
                {item.name}
              </Button>
            </Col>
          ))}

        </Row>
      </div>
    )
  };


  let content = (
    <div className="quantity-unit-edit-popup-content">
      {renderContent()}
    </div>
  );
  return (
    <Popover content={content} trigger="click" placement="bottom" visible={visible} onVisibleChange={onVisibleChanged}>
      {props.children || ''}
    </Popover>
  )
};

export default UnitEditPopup;