import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Modal } from 'antd';
import * as icons from 'assets';
import moment from 'moment';

import CalendarCustom from 'components/calendarCustom/CalendarCustom';
import { isEmpty } from 'utils/helpers/helpers';

const CalendarModal = (props) => {
  const intl = useIntl();
  const { handleClose, dateRange, updateDateRange } = props;
  const [startDate, setStartDate] = useState(dateRange.startDate);
  const [endDate, setEndDate] = useState(dateRange.endDate);

  const handleReset = () => {
    setStartDate(dateRange.startDate);
    setEndDate(dateRange.endDate);
  };
  const handleSave = () => {
    updateDateRange({ startDate, endDate });
    handleClose();
  };
  const isDisabled = isEmpty(endDate);

  return (
    <Modal
      visible={true}
      title={null}
      closeIcon={<img src={icons.ic_close} alt="" />}
      onOk={handleClose}
      onCancel={handleClose}
      className="modal-container"
      width={496}
      footer={null}
    >
      <div className="modal-filter-content">
        <CalendarCustom
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <div className="filter-footer" style={{ marginTop: 24 }}>
          <Button className="outline-btn" onClick={handleReset}>
            <FormattedMessage id="IDS_RESET" />
          </Button>
          <Button
            className={`primary-btn ${isDisabled ? 'disabled' : ''}`}
            onClick={() => {
              if (!isDisabled) handleSave();
            }}
          >
            <FormattedMessage id="IDS_DONE" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
