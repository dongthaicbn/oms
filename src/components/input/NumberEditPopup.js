import React, { useState } from 'react';
import { Popover, Button, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import './NumberEditPopup.scss'

export const TYPE_PLUS_VALUE = 'PLUS';
export const TYPE_APPEND_VALUE = 'APPEND';
export const TYPE_APPEND_DOT_VALUE = 'APPEND_DOT';
export const TYPE_BACKSPACE_VALUE = 'BACKSPACE';

const plusValueBy = (originValue, ammount) => {
  if (typeof originValue === 'string' && originValue.endsWith('.')) {
    originValue = Number(backspaceValue(originValue));
  }
  return originValue + ammount;
};

const appendValueWithNumber = (originValue, appendValue) => {
  if (originValue) {
    return Number(`${originValue}${appendValue}`);
  } else if (appendValue) {
    return Number(appendValue);
  }
};

const appendDot = (originValue) => {
  if (originValue) {
    if (typeof originValue === 'string' && originValue.endsWith('.')) {
      return originValue;
    }
    return `${originValue}.`;
  } else {
    return '0.';
  }
};

const backspaceValue = (originValue) => {
  if (originValue) {
    let result = String(originValue).slice(0, -1);
    if (!result.endsWith('.')) {
      result = Number(result);
    }
    return result;
  }
};

const defaultHandleValueChangeEvent = (changeType, originValue, newValue) => {
  switch (changeType) {
    case TYPE_PLUS_VALUE: {
      return plusValueBy(originValue, newValue);
    }

    case TYPE_APPEND_VALUE: {
      return appendValueWithNumber(originValue, newValue);
    }

    case TYPE_APPEND_DOT_VALUE: {
      return appendDot(originValue);
    }

    case TYPE_BACKSPACE_VALUE: {
      return backspaceValue(originValue);
    }

    default: {
      return originValue;
    }
  }
};

const isNumberValid = (value, minValue, maxValue, maxFractionalDigits) => {
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

const defaultValidateValue = (value, minValue, maxValue, maxFractionalDigits) => {
  let dataType = typeof value;
  switch (dataType) {
    case 'number': {
      return isNumberValid(value, minValue, maxValue, maxFractionalDigits);
    }

    default: {
      return true;
    }
  }
};

const defaultFormatValue= (value) => {
  if (typeof value === 'string') {
    if (value.endsWith('.')) {
      value = backspaceValue(value);
    }
    return Number(value);
  }
  return value;
};

const adjustValue = (value, minValue, maxValue) => {
  if (value > maxValue) {
    return maxValue;
  } else if (value < minValue) {
    return minValue;
  }
};

const NumberEditPopup = (props) => {
  let {
    onSubmit, onValueChanged, handleValueChangeEvent, validateValue, formatValue, onPopupCancel, onCancel, onError,
    value, maxValue, minValue, expand, jumpValue, autoAdjustValue,
    disableFractional, maxFractionalDigits, onVisibleChange,
  } = props;
  let [visible, setVisible] = useState(false);
  let [submitted, setSubmitted] = useState(false);
  let [canceled, setCanceled] = useState(false);
  let [expanded, setExpanded] = useState(expand);
  let [originValue, setOriginValue] = useState(value);

  jumpValue = jumpValue || 1;
  autoAdjustValue = autoAdjustValue || false;
  handleValueChangeEvent = handleValueChangeEvent || defaultHandleValueChangeEvent;
  validateValue = validateValue || defaultValidateValue;
  formatValue = formatValue || defaultFormatValue;

  const onUpdateClicked = () => {
    let newValue;
    try {
      newValue = formatValue(value);
    } catch (e) {
      if (onError) {
        onError(e);
      }
      return;
    }
    if (newValue !== value) {
      changeValue(newValue);
    }
    if (!onSubmit || onSubmit(newValue)) {
      setSubmitted(true);
      setCanceled(false);
      setVisible(false);
      if (onVisibleChange) {
        onVisibleChange(false);
      }
    }
  };

  const changeValue = (newValue) => {
    if (!validateValue(newValue, minValue, maxValue, maxFractionalDigits)) {
      if (!autoAdjustValue) {
        return;
      }
      newValue = adjustValue(newValue, minValue, maxValue);
    }
    if (newValue !== value && onValueChanged) {
      onValueChanged(newValue);
    }
  };

  const onVisibleChanged = (isVisible) => {
    if (isVisible) {
      setOriginValue(value);
      setSubmitted(false);
      setCanceled(false);
    } else if (!submitted && !canceled) {
      if (onPopupCancel) {
        onPopupCancel(originValue);
      }
    }
    if (visible !== isVisible && onVisibleChange) {
      onVisibleChange(isVisible);
    }
    setVisible(isVisible);
  };

  const cancel = () => {
    setCanceled(true);
    if (onCancel) {
      onCancel();
    }
  };

  const expandInput = (expand) => {
    try {
      formatValue(value);
    } catch (e) {
      if (onPopupCancel) {
        onPopupCancel(originValue);
      }
    }
    setExpanded(expand);
  };

  const renderContent = () => {
    if (expanded) {
      return renderExpandedContent();
    }
    return renderMinimalContent();
  };

  const renderMinimalContent = () => {
    return (
      <>
        <div className="app-flex-container middle-group">
          <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_PLUS_VALUE, value, -jumpValue))}>
            -{jumpValue}
          </Button>
          <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_PLUS_VALUE, value, jumpValue))}>
            +{jumpValue}
          </Button>
          <Button className="btn-cancel" onClick={cancel}>
            C
          </Button>
        </div>
        <div className="app-flex-container bottom-group">
          <Button className="btn-update" onClick={onUpdateClicked}>
            <FormattedMessage id="IDS_UPDATE" />
          </Button>
        </div>
      </>
    )
  };

  const renderExpandedContent = () => {
    return (
      <div className="middle-group">
        <Row className="row-space" gutter={12}>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_VALUE, value, 7))}>
              7
            </Button>
          </Col>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_VALUE, value, 8))}>
              8
            </Button>
          </Col>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_VALUE, value, 9))}>
              9
            </Button>
          </Col>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_BACKSPACE_VALUE, value))}>
              <img src={icons.ic_backspace} alt="" />
            </Button>
          </Col>
        </Row>
        <Row className="row-space" gutter={12}>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_VALUE, value, 4))}>
              4
            </Button>
          </Col>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_VALUE, value, 5))}>
              5
            </Button>
          </Col>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_VALUE, value, 6))}>
              6
            </Button>
          </Col>
          <Col span={6}>
            <Button className="btn-cancel" onClick={cancel}>
              C
            </Button>
          </Col>
        </Row>
        <Row className="row-space" gutter={12}>
          <Col span={18}>
            <Row className="row-space" gutter={12}>
              <Col span={8}>
                <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_VALUE, value, 1))}>
                  1
                </Button>
              </Col>
              <Col span={8}>
                <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_VALUE, value, 2))}>
                  2
                </Button>
              </Col>
              <Col span={8}>
                <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_VALUE, value, 3))}>
                  3
                </Button>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={16}>
                <Button className="action-button" onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_VALUE, value, 0))}>
                  0
                </Button>
              </Col>
              <Col span={8}>
                <Button className="action-button" disabled={disableFractional}
                  onClick={() => changeValue(handleValueChangeEvent(TYPE_APPEND_DOT_VALUE, value))}>
                  .
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Button className="btn-update" onClick={onUpdateClicked}>
              <FormattedMessage id="IDS_UPDATE" />
            </Button>
          </Col>
        </Row>
      </div>
    )
  };

  let expandIcon;
  if (expanded) {
    expandIcon = <>
      <FormattedMessage id="IDS_COLLAPSE" /><img className="expand-icon" src={icons.ic_subtract} alt="" />
    </>;
  } else {
    expandIcon = <>
      <FormattedMessage id="IDS_EXPAND" /><img className="expand-icon" src={icons.ic_plus} alt="" />
    </>;
  }

  let content = (
    <div className="popup-content">
      <div className="app-flex-container flex-end top-group">
        <Button type="text" className="btn-expand" onClick={() => expandInput(!expanded)}>
          {expandIcon}
        </Button>
      </div>
      {renderContent()}
    </div>
  );
  return (
    <Popover overlayClassName="number-edit-popup" content={content} trigger="click"
             placement="left" visible={visible} onVisibleChange={onVisibleChanged}>
      {props.children || ''}
    </Popover>
  )
};

export default NumberEditPopup;