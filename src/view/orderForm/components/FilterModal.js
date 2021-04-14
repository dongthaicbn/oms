import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Modal, Input, Radio, Select } from 'antd';
import * as icons from 'assets';
import { isEmpty } from 'utils/helpers/helpers';
import SelectCustom from 'components/select/SelectCustom';

const { Option } = Select;

const FilterModal = (props) => {
  const intl = useIntl();
  const { suppliers, handleClose } = props;
  const [itemSelected, setSelected] = useState(
    !isEmpty(suppliers) ? suppliers[0] : {}
  );

  const handleReset = () => {
    handleClose();
  };
  const handleSave = () => {
    handleClose();
  };
  const handleChange = (value) => {
    setSelected(value);
  };
  console.log('suppliers', suppliers);
  return (
    <Modal
      visible={true}
      title={null}
      closeIcon={<img src={icons.ic_close} alt="" />}
      onOk={handleClose}
      onCancel={handleClose}
      className="modal-container"
      width={476}
      footer={null}
    >
      <div className="modal-filter-content">
        <p className="title-filter-text">
          <FormattedMessage id="IDS_SAVE_ORDER_ITEM" />
        </p>
        <p className="title-item">
          <FormattedMessage id="IDS_ITEMS" />
        </p>
        <Input
          size="large"
          placeholder={intl.formatMessage({
            id: 'IDS_PLACEHOLDER_SEARCH_ITEMS',
          })}
          prefix={
            <img
              src={icons.ic_search_black}
              alt=""
              style={{ marginRight: 8, cursor: 'pointer' }}
            />
          }
        />
        <div className="tag-group">
          <span className="tag-item">
            Tag 2 <img src={icons.ic_close} alt="" />
          </span>
        </div>
        <p className="title-item">
          <FormattedMessage id="IDS_SUPPLIER" />
        </p>
        <SelectCustom
          options={(suppliers || []).map((el) => ({
            ...el,
            name: el.supplier_name,
            id: el.supplier_id,
          }))}
          getOptionLabel={(v) => v.name}
          onSelectOption={(value) => {
            setSelected(value);
          }}
          value={itemSelected.supplier_id}
          iconRight={
            <img
              src={icons.ic_arrow_down}
              alt=""
              style={{ marginRight: 24, cursor: 'pointer' }}
            />
          }
        />
        <div className="tag-group">
          <span className="tag-item">
            {itemSelected.supplier_name} <img src={icons.ic_close} alt="" />
          </span>
        </div>
        <p className="title-item">
          <FormattedMessage id="IDS_STATUS" />
        </p>
        <Radio.Group className="status-group">
          <Radio value={0}>
            <FormattedMessage id="IDS_FILLED" />
          </Radio>
          <Radio value={1}>
            <FormattedMessage id="IDS_NOT_FILLED" />
          </Radio>
        </Radio.Group>
        <div className="filter-footer">
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

export default FilterModal;
