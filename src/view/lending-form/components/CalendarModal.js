import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Modal } from 'antd';
import * as icons from 'assets';
import moment from 'moment';

import CalendarCustom from 'components/calendarCustom/CalendarCustom';

const CalendarModal = (props) => {
  const intl = useIntl();
  const { handleClose } = props;
  // const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(null);
  const {
    startDate,
    setStartDate,
    ...rest
  } = props;
  const handleReset = () => { };
  const handleSave = () => {
    handleClose();
  };

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
      style={{ position: 0 }}
    >
      <div className="modal-filter-content">
        <CalendarCustom
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          type={'single'}
          selectAnyDate={true}
        />
        <div className="filter-footer" style={{ marginTop: 24 }}>
          <Button className="outline-btn" onClick={handleReset}>
            <FormattedMessage id="IDS_RESET" />
          </Button>
          <Button className="primary-btn" onClick={handleSave}>
            <FormattedMessage id="IDS_DONE" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
