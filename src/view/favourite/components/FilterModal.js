import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Modal } from 'antd';
import { withStyles } from '@material-ui/core/styles';
import { Radio } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as icons from 'assets';
import {
  isEmpty,
  removeDuplicateName,
  removeDuplicateCategories,
} from 'utils/helpers/helpers';
import SelectCustom from 'components/select/SelectCustom';
import { BootstrapInput } from 'components/select/BootstrapInput';

const CustomRadio = withStyles({
  root: {
    color: '#6461B4',
    '&$checked': { color: '#6461B4' },
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
  const { suppliers, handleClose, filterValue, handleFilter } = props;
  console.log('suppliers', suppliers);
  const getTotalCategories = () => {
    let resultCategories = [];
    if (!isEmpty(suppliers)) {
      suppliers.forEach((it) => {
        if (!isEmpty(it.categories))
          resultCategories = [...resultCategories, ...it.categories];
      });
    }
    let resultItems = [];
    if (!isEmpty(resultCategories)) {
      resultCategories.forEach((it) => {
        if (!isEmpty(it.items)) resultItems = [...resultItems, ...it.items];
      });
    }
    return {
      totalCategories: removeDuplicateCategories(resultCategories),
      totalItems: removeDuplicateName(resultItems),
      // totalCategories: resultCategories,
      // totalItems: resultItems,
    };
  };
  const totalCategories = getTotalCategories().totalCategories;
  const totalItems = getTotalCategories().totalItems;

  const [itemsSelected, setSelected] = useState(filterValue.suppliers || []);
  const [categorySelected, setCategorySelected] = useState(
    filterValue.categories || []
  );
  const [subItemSelected, setSubItemSelected] = useState(
    filterValue.items || []
  );

  const handleReset = () => {
    // setSelected(filterValue.suppliers || []);
    // setCategorySelected(filterValue.categories || []);
    // setSubItemSelected(filterValue.items || []);
    setSelected([]);
    setCategorySelected([]);
    setSubItemSelected([]);
  };
  const handleSave = () => {
    if (handleFilter)
      handleFilter({
        suppliers: itemsSelected,
        categories: categorySelected,
        items: subItemSelected,
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
    if (!isEmpty(categorySelected)) {
      suppliers.forEach((el) => {
        if (
          el.categories.find((v) =>
            categorySelected.find((it) => it.name === v.name)
          )
        ) {
          result.push(el);
        }
      });
    } else if (!isEmpty(subItemSelected)) {
      suppliers.forEach((el) => {
        let tempItems = [];
        el.categories.forEach((v) => {
          tempItems = [...tempItems, ...v.items];
        });
        if (
          tempItems.find((v) =>
            subItemSelected.find((it) => it.name === v.name)
          )
        ) {
          result.push(el);
        }
      });
    } else {
      result = [...suppliers];
    }
    return result;
  };
  const getCategoriesList = () => {
    let result = [];
    if (!isEmpty(subItemSelected)) {
      totalCategories.forEach((el) => {
        if (
          el.items.find((v) => subItemSelected.find((it) => it.name === v.name))
        ) {
          result.push(el);
        }
      });
    } else result = [...totalCategories];
    return result;
  };
  return (
    <Modal
      visible={true}
      title={null}
      centered
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
          renderOption={(option, idx) => (
            <p
              key={idx}
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
                  subItemSelected.find((v) => v.name === option.name)
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
                      subItemSelected.filter((v) => v.name !== el.name)
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
          options={getCategoriesList()}
          multiple
          getOptionLabel={(v) => v.name}
          onSelectOption={(value) => {
            const result = categorySelected.find((v) => v.name === value.name);
            if (result) {
              setCategorySelected(
                categorySelected.filter((v) => v.name !== result.name)
              );
            } else {
              setCategorySelected([...categorySelected, value]);
            }
          }}
          value={categorySelected}
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
          {!isEmpty(categorySelected) &&
            categorySelected.map((el, i) => (
              <span className="tag-item" key={i}>
                {el.name}{' '}
                <img
                  src={icons.ic_close}
                  alt=""
                  onClick={() => {
                    setCategorySelected(
                      categorySelected.filter((v) => v.name !== el.name)
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
                {el.name}{' '}
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
