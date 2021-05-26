import React from 'react';
import { FormattedMessage } from 'react-intl';

export const requiredValidationRule = (field) => ({
  required: true,
  message: <FormattedMessage id="IDS_INPUT_REQUIRED_VALIDATION_MESSAGE" values={{field: field}}/>
});