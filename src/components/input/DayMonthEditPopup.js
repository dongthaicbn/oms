import React from 'react';
import moment from 'moment';
import NumberEditPopup, {
  TYPE_APPEND_VALUE,
  TYPE_BACKSPACE_VALUE,
  TYPE_PLUS_VALUE
} from './NumberEditPopup';
import { isDateValid, formatDate } from 'utils/helpers/helpers';

export const INVALID_DATE_INPUT = 'INVALID_DATE_INPUT';

const plusDateByDay = (originValue, ammountDay) => {
  if (originValue instanceof Date) {
    let originMoment = moment(originValue);
    return originMoment.add(ammountDay, 'days').toDate();
  }
};

const appendValueWith = (originValue, appendValue) => {
  if (originValue) {
    if (originValue instanceof Date) {
      originValue = formatDate(originValue, 'DDMM');
    }
    return `${originValue}${appendValue}`;
  } else {
    return `${appendValue}`;
  }
};

const backspaceValue = (originValue) => {
  if (originValue) {
    if (originValue instanceof Date) {
      originValue = formatDate(originValue, 'DDMM');
    }
    return String(originValue).slice(0, -1);
  }
};

const handleDateChangeEvent = (changeType, originValue, newValue) => {
  switch (changeType) {
    case TYPE_PLUS_VALUE: {
      return plusDateByDay(originValue, newValue);
    }

    case TYPE_APPEND_VALUE: {
      return appendValueWith(originValue, newValue);
    }

    case TYPE_BACKSPACE_VALUE: {
      return backspaceValue(originValue);
    }

    default: {
      return originValue;
    }
  }
};

const checkDateValid = (value, minValue, maxValue) => {
  if (minValue !== null && minValue !== undefined && moment(value).isBefore(minValue)) {
    return false;
  }
  if (maxValue !== null && maxValue !== undefined && moment(value).isAfter(maxValue)) {
    return false;
  }
  return true;
};

const validateValue = (value, minValue, maxValue, maxFractionalDigits) => {
  if (value instanceof Date) {
    return checkDateValid(value, minValue, maxValue);
  }
  return true;
};

const formatValue = (value, year) => {
  if (typeof value === 'string') {
    let date = moment(value, 'DDMM')
      .set('year', year)
      .toDate();
    if (!isDateValid(date)) {
      throw INVALID_DATE_INPUT;
    }
    return date;
  }
  return value;
};

const DayMonthEditPopup = (props) => {
  let { value, year, ...otherProps } = props;
  return (
    <NumberEditPopup {...otherProps}
                     value={value}
                     handleValueChangeEvent={handleDateChangeEvent}
                     validateValue={validateValue}
                     formatValue={(value) => formatValue(value, year)}
                     disableFractional={true} expand={!value}>
      {props.children || ''}
    </NumberEditPopup>
  );
};

export default DayMonthEditPopup;