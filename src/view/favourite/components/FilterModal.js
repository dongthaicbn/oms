import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Modal } from 'antd';
// import { withStyles } from '@material-ui/core/styles';
// import { Radio, FormControlLabel } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as icons from 'assets';
import { isEmpty } from 'utils/helpers/helpers';
import SelectCustom from 'components/select/SelectCustom';
import { BootstrapInput } from 'components/select/BootstrapInput';

// const CustomRadio = withStyles({
//   root: {
//     color: '#6461B4',
//     '&$checked': {
//       color: '#6461B4',
//     },
//   },
//   checked: {},
// })((props) => <Radio color="default" {...props} />);

const FilterModal = (props) => {
  const intl = useIntl();
  const { suppliers, handleClose, handleFilter } = props;
  const convertArrayData = (data) => {
    return data.map((el) => ({
      ...el,
      name: el.supplier_name,
      id: el.supplier_id,
    }));
  };
  const [itemsSelected, setSelected] = useState(
    // !isEmpty(suppliers) ? convertArrayData([suppliers[0]]) : []
    []
  );
  const [subItemSelected, setSubItemSelected] = useState([]);
  const [filled, setFilled] = useState(null);

  const handleReset = () => {
    setSubItemSelected([]);
    setSelected([]);
    setFilled(null);
  };
  const handleSave = () => {
    if (handleFilter) handleFilter();
    handleClose();
  };
  const startAdornment = (
    <img
      src={icons.ic_search_black}
      alt=""
      style={{ margin: '0 8px 0 16px', cursor: 'pointer' }}
    />
  );
  const getItems = () => {
    let result = [];
    if (!isEmpty(itemsSelected)) {
      itemsSelected.forEach((el) => {
        result = [...result, ...el.items];
      });
    }
    return result;
  };
  return (
    <Modal
      visible={true}
      title={null}
      closeIcon={<img src={icons.ic_close} alt="" />}
      onOk={handleSave}
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
          options={getItems()}
          getOptionLabel={(option) => option.name}
          style={{ width: '100%' }}
          onChange={(event, value, reason) => {
            if (reason !== 'clear') {
              const result = subItemSelected.find((v) => v.code === value.code);
              if (result) {
                setSubItemSelected(
                  subItemSelected.filter((v) => v.code !== result.code)
                );
              } else {
                setSubItemSelected([...subItemSelected, value]);
              }
            }
          }}
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
          // renderOption={(option) => (
          //   <Typography noWrap>{option.name}</Typography>
          // )}
        />

        <div className="tag-group">
          {!isEmpty(subItemSelected) &&
            subItemSelected.map((el) => (
              <span className="tag-item" key={el.code}>
                {el.name}{' '}
                <img
                  src={icons.ic_close}
                  alt=""
                  onClick={() => {
                    setSubItemSelected(
                      subItemSelected.filter((v) => v.code !== el.code)
                    );
                  }}
                />
              </span>
            ))}
        </div>

        <p className="title-item">
          <FormattedMessage id="IDS_CATEGORIES" />
        </p>
        <SelectCustom
          options={convertArrayData(suppliers || [])}
          multiple
          getOptionLabel={(v) => v.name}
          onSelectOption={(value) => {
            const result = itemsSelected.find((v) => v.id === value.id);
            if (result) {
              setSelected(itemsSelected.filter((v) => v.id !== result.id));
            } else {
              setSelected([...itemsSelected, value]);
            }
          }}
          value={itemsSelected}
          valueString="Categories"
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
          <FormattedMessage id="IDS_SUPPLIER" />
        </p>
        <SelectCustom
          options={convertArrayData(suppliers || [])}
          multiple
          getOptionLabel={(v) => v.name}
          onSelectOption={(value) => {
            const result = itemsSelected.find((v) => v.id === value.id);
            if (result) {
              setSelected(itemsSelected.filter((v) => v.id !== result.id));
            } else {
              setSelected([...itemsSelected, value]);
            }
          }}
          value={itemsSelected}
          valueString="Supplier"
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
