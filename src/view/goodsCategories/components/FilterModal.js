import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Modal } from 'antd';
import { withStyles } from '@material-ui/core/styles';
import { Radio, FormControlLabel } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as icons from 'assets';
import { isEmpty, removeDuplicateName } from 'utils/helpers/helpers';
import SelectCustom from 'components/select/SelectCustom';
import { BootstrapInput } from 'components/select/BootstrapInput';

const CustomRadio = withStyles({
  root: {
    color: '#6461B4',
    '&$checked': {
      color: '#6461B4',
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);
const useStyles = makeStyles({
  noOptions: {
    color: '#4F4E66',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: '24px',
  },
});

const FilterModal = (props) => {
  const intl = useIntl();
  const styles = useStyles();
  const { suppliers, handleClose, visible, filterValue, handleFilter } = props;
  const getTotalItem = () => {
    let result = [];
    if (!isEmpty(suppliers)) {
      suppliers.forEach((it) => {
        if (!isEmpty(it.items)) result = [...result, ...it.items];
      });
    }
    return removeDuplicateName(result);
  };
  const totalItems = getTotalItem();

  const [itemsSelected, setSelected] = useState(filterValue.suppliers || []);
  const [subItemSelected, setSubItemSelected] = useState(
    filterValue.items || []
  );
  const [filled, setFilled] = useState(filterValue.filled || null);

  const handleReset = () => {
    // setSubItemSelected(filterValue.items || []);
    // setSelected(filterValue.suppliers || []);
    // setFilled(filterValue.filled || null);
    setSubItemSelected([]);
    setSelected([]);
    setFilled(null);
  };
  const handleSave = () => {
    if (handleFilter)
      handleFilter({
        suppliers: itemsSelected,
        items: subItemSelected,
        filled: filled,
      });
    handleClose();
  };
  const startAdornment = (
    <img
      src={icons.ic_search_black}
      alt=""
      style={{ margin: '0 8px 0 16px', cursor: 'pointer' }}
    />
  );
  const getSuppliers = () => {
    let result = [];
    if (!isEmpty(subItemSelected)) {
      suppliers.forEach((el) => {
        if (
          el.items.find((v) => subItemSelected.find((it) => it.name === v.name))
        ) {
          result.push(el);
        }
      });
    } else result = [...suppliers];
    return result;
  };
  return (
    <Modal
      visible={visible}
      title={null}
      centered
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
        <Autocomplete
          id="combo-box-demo"
          classes={{ noOptions: styles.noOptions }}
          noOptionsText={intl.formatMessage({ id: 'IDS_NO_KEYWORD_MATCH' })}
          options={totalItems}
          getOptionLabel={(option) => option.name}
          style={{ width: '100%' }}
          renderInput={(params) => {
            const { InputLabelProps, InputProps, ...rest } = params;
            return (
              <BootstrapInput
                {...params.InputProps}
                {...rest}
                placeholder={intl.formatMessage({
                  id: 'IDS_PLACEHOLDER_SEARCH_ITEMS',
                })}
                startAdornment={startAdornment}
                endAdornment={null}
              />
            );
          }}
          renderOption={(option) => (
            <p
              key={option.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
              onClick={() => {
                const result = subItemSelected.find(
                  (v) => v.name === option.name
                );
                if (result) {
                  setSubItemSelected(
                    subItemSelected.filter((v) => v.name !== result.name)
                  );
                } else {
                  setSubItemSelected([...subItemSelected, option]);
                }
              }}
            >
              <span>{option.name}</span>
              <CustomRadio
                checked={Boolean(
                  subItemSelected.find((v) => v.id === option.id)
                )}
              />
            </p>
          )}
        />

        <div className="tag-group">
          {!isEmpty(subItemSelected) &&
            subItemSelected.map((el) => (
              <span className="tag-item" key={el.id}>
                {el.name}{' '}
                <img
                  src={icons.ic_close}
                  alt=""
                  onClick={() => {
                    setSubItemSelected(
                      subItemSelected.filter((v) => v.id !== el.id)
                    );
                  }}
                />
              </span>
            ))}
        </div>

        <p className="title-item">
          <FormattedMessage id="IDS_SUPPLIER" />
        </p>
        <SelectCustom
          options={getSuppliers()}
          multiple
          getOptionLabel={(v) => v.supplier_name}
          onSelectOption={(value) => {
            const result = itemsSelected.find((v) => v.id === value.id);
            if (result) {
              setSelected(itemsSelected.filter((v) => v.id !== result.id));
            } else {
              setSelected([...itemsSelected, value]);
            }
          }}
          value={itemsSelected}
          iconRight={
            <img
              src={icons.ic_arrow_down}
              alt=""
              style={{ marginRight: 24, cursor: 'pointer' }}
            />
          }
        />

        <div className="tag-group">
          {!isEmpty(itemsSelected) &&
            itemsSelected.map((el, i) => (
              <span className="tag-item" key={el.id}>
                {el.supplier_name}{' '}
                <img
                  src={icons.ic_close}
                  alt=""
                  onClick={() => {
                    setSelected(itemsSelected.filter((v) => v.id !== el.id));
                  }}
                />
              </span>
            ))}
        </div>

        <p className="title-item">
          <FormattedMessage id="IDS_STATUS" />
        </p>
        <FormControlLabel
          value={0}
          control={<CustomRadio checked={filled === 0} />}
          style={{ width: 'calc(50% - 8px)' }}
          label={
            <span className="status-group">
              <FormattedMessage id="IDS_FILLED" />
            </span>
          }
          onClick={() => setFilled(filled === 0 ? null : 0)}
        />
        <FormControlLabel
          value={1}
          control={<CustomRadio checked={filled === 1} />}
          style={{ width: 'calc(50% - 8px)' }}
          label={
            <span className="status-group">
              <FormattedMessage id="IDS_NOT_FILLED" />
            </span>
          }
          onClick={() => setFilled(filled === 1 ? null : 1)}
        />
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
