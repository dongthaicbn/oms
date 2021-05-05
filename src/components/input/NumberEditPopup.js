import React, { useState } from 'react';
import { Popover, Button, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import './NumberEditPopup.scss'

const NumberEditPopup = (props) => {
  let {
    onSubmit, onValueChanged, onPopupCancel, onCancel,
    value, maxValue, minValue,
    disableFractional, maxFractionalDigits
  } = props;
  let [visible, setVisible] = useState(false);
  let [submitted, setSubmitted] = useState(false);
  let [canceled, setCanceled] = useState(false);
  let [expanded, setExpanded] = useState(false);
  let [originValue, setOriginValue] = useState(value);

  const onUpdateClicked = () => {
    reformatValueNumber(value);
    if (!onSubmit || onSubmit()) {
      setSubmitted(true);
      setCanceled(false);
      setVisible(false)
    }
  };

  const changeValue = (newValue) => {
    if (typeof newValue !== 'string') {
      if (!isNumberValid(newValue)) {
        return;
      }
    } else if (!newValue.endsWith('.')) {
      let numberValue = parseFloat(newValue);
      if (!isNumberValid(numberValue)) {
        return;
      }
      newValue = numberValue;
    }
    if (newValue !== value && onValueChanged) {
      onValueChanged(newValue);
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
      reformatValueNumber(value);
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

  const appendDot = (value) => {
    if (value) {
      if (isNaN(value) && value.endsWith('.')) {
        return value;
      }
      return `${value}.`
    } else {
      return '0.';
    }
  }

  const backspaceValue = (value) => {
    if (value) {
      return String(value).slice(0, -1);
    }
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
          <Button className="action-button" onClick={() => changeValue(value - 1)}>
            -1
          </Button>
          <Button className="action-button" onClick={() => changeValue(value + 1)}>
            +1
          </Button>
          <Button className="btn-cancel" onClick={cancel}>
            C
          </Button>
        </div>
        <div className="app-flex-container bottom-group">
          <Button className="btn-update" onClick={onUpdateClicked}>
            <FormattedMessage id="IDS_UPDATE"/>
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
            <Button className="action-button" onClick={() => changeValue(appendValue(value, 7))}>
              7
            </Button>
          </Col>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(appendValue(value, 8))}>
              8
            </Button>
          </Col>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(appendValue(value, 9))}>
              9
            </Button>
          </Col>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(backspaceValue(value))}>
              <img src={icons.ic_backspace} alt=""/>
            </Button>
          </Col>
        </Row>
        <Row className="row-space" gutter={12}>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(appendValue(value, 4))}>
              4
            </Button>
          </Col>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(appendValue(value, 5))}>
              5
            </Button>
          </Col>
          <Col span={6}>
            <Button className="action-button" onClick={() => changeValue(appendValue(value, 6))}>
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
                <Button className="action-button" onClick={() => changeValue(appendValue(value, 1))}>
                  1
                </Button>
              </Col>
              <Col span={8}>
                <Button className="action-button" onClick={() => changeValue(appendValue(value, 2))}>
                  2
                </Button>
              </Col>
              <Col span={8}>
                <Button className="action-button" onClick={() => changeValue(appendValue(value, 3))}>
                  3
                </Button>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={16}>
                <Button className="action-button" onClick={() => changeValue(appendValue(value, 0))}>
                  0
                </Button>
              </Col>
              <Col span={8}>
                <Button className="action-button" disabled={disableFractional}
                        onClick={() => changeValue(appendDot(value))}>
                  .
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Button className="btn-update" onClick={onUpdateClicked}>
              <FormattedMessage id="IDS_UPDATE"/>
            </Button>
          </Col>
        </Row>
      </div>
    )
  };

  let expandIcon;
  if (expanded) {
    expandIcon = <>
      <FormattedMessage id="IDS_COLLAPSE"/><img className="expand-icon" src={icons.ic_subtract} alt=""/>
    </>;
  } else {
    expandIcon = <>
      <FormattedMessage id="IDS_EXPAND"/><img className="expand-icon" src={icons.ic_plus} alt=""/>
    </>;
  }

  let content = (
    <div className="quantity-edit-popup-content">
      <div className="app-flex-container flex-end top-group">
        <Button type="text" className="btn-expand" onClick={() => setExpanded(!expanded)}>
          {expandIcon}
        </Button>
      </div>
      {renderContent()}
    </div>
  );
  return (
    <Popover content={content} trigger="click" placement="left" visible={visible} onVisibleChange={onVisibleChanged}>
      {props.children || ''}
    </Popover>
  )
};

export default NumberEditPopup;