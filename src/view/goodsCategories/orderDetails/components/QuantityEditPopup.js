import React, { useState } from 'react';
import { Popover, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import './QuantityEditPopup.scss'

const QuantityEditPopup = (props) => {
  let { onSubmit, onValueChanged, onCancel, value, maxValue, minValue } = props;
  let [visible, setVisible] = useState(false);
  let [submitted, setSubmitted] = useState(false);
  let [currentValue, setCurrentValue] = useState(value || 0);

  const onUpdateClicked = () => {
    if (!onSubmit || onSubmit(currentValue)) {
      setSubmitted(true);
      setVisible(false)
    }
  }

  const changeCurrentValueBy = (valueChanged) => {
    let newValue = currentValue + valueChanged;
    if (minValue !== null && minValue !== undefined && newValue < minValue) {
      return;
    }
    if (maxValue !== null && maxValue !== undefined && newValue > maxValue) {
      return;
    }
    setCurrentValue(newValue);
    if (onValueChanged) {
      onValueChanged(newValue);
    }
  }

  const onCancelChanged = () => {
    resetCurrentValue();
    if (onValueChanged) {
      onValueChanged(value);
    }
  }

  const resetCurrentValue = () => {
    setCurrentValue(value)
  }

  const onVisibleChanged = (visible) => {
    if (visible) {
      setSubmitted(false);
    } else if (!submitted && onCancel){
      resetCurrentValue();
      onCancel(value);
    }
    setVisible(visible);
  }

  let content = (
    <div className="quantity-edit-popup-content">
      <div className="app-flex-container flex-end top-group">
        <Button type="text" className="btn-expand">
          <FormattedMessage id="IDS_EXPAND"/><img className="expand-icon" src={icons.ic_plus} alt=""/>
        </Button>
      </div>
      <div className="app-flex-container middle-group">
        <Button className="btn-decrease" onClick={() => changeCurrentValueBy(-1)}>
          -1
        </Button>
        <Button className="btn-increase" onClick={() => changeCurrentValueBy(1)}>
          +1
        </Button>
        <Button className="btn-cancel" onClick={onCancelChanged}>
          C
        </Button>
      </div>
      <div className="app-flex-container bottom-group">
        <Button className="btn-update" onClick={onUpdateClicked}>
          <FormattedMessage id="IDS_UPDATE"/>
        </Button>
      </div>
    </div>
  );
  return (
    <Popover content={content} trigger="click" placement="left" visible={visible} onVisibleChange={onVisibleChanged}>
      {props.children || ''}
    </Popover>
  )
}

export default QuantityEditPopup;