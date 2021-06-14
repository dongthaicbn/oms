import { memo } from 'react';
import { List, ListItem, Popover, Typography, Radio } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useIntl } from 'react-intl';

import React from 'react';
import { BootstrapInput } from 'components/select/BootstrapInput';

const SelectCustomLending = (props) => {
  const {
    options,
    getOptionLabel,
    multiple,
    onSelectOption,
    id,
    disabled,
    isView,
    iconRight,
    value,
    selected,
    ...rest
  } = props;
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef();
  const handleClick = () => {
    !disabled && setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const isChecked = (one) => {
    if (multiple) {
      return Boolean(value.find((v) => v.id === one.id));
    }
    return value === one ?.id;
  };
  const intl = useIntl();

  return (
    <>
      <BootstrapInput
        id={id}
        readOnly
        focused={open}
        disabled={disabled}
        value={selected ? selected : intl.formatMessage({
          id: 'IDS_SELECT_A_STORE',
        })}
        innerRef={inputRef}
        isView={isView}
        endAdornment={isView ? null : <>{iconRight || <ArrowDropDownIcon />}</>}
        inputProps={{
          ...rest.inputProps,
          style: {
            textOverflow: 'ellipsis',
            fontWeight: 'bold',
            fontSize: 20,
            lineHeight: '30px',
            color: '#4F4E66',
            textAlign: 'center',
          },
        }}
        onClick={handleClick}
      />
      <Popover
        open={open}
        anchorEl={inputRef ?.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          style: {
            width: inputRef ?.current ?.offsetWidth,
            maxHeight: 350,
            marginTop: 4,
          },
          variant: 'outlined',
        }}
        elevation={1}
      >
        <List>
          {options && Object.keys(options).length > 0 &&
            Object.keys(options).map((key, index) => (
              <ListItem
                key={index}
                role={undefined}
                dense
                button
                onClick={() => {
                  onSelectOption(options[key], index);
                  handleClose();
                }}
                style={{
                  background: index % 2 === 0 ? '#F9FAFF' : '#F1F4FC',
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '16px 24px',
                  fontSize: 16,
                  lineHeight: '24px',
                  justifyContent: 'space-between'
                }}
              >
                <div
                  style={{
                    paddingRight: 32,

                    fontSize: 16,
                    lineHeight: '24px',
                  }}
                >
                  <p
                    style={{
                      marginBottom: 8,
                      color: '#4F4E66',
                      fontWeight: 'bold',
                    }}
                  >
                    {options[key].name}
                  </p>
                  <p style={{ margin: 0, color: '#4F4E66' }}>
                    {options[key].address}
                  </p>
                </div>
                <span style={{ color: '#6461B4' }}>{options[key].phone_no}</span>
              </ListItem>
            ))
          }
          {/* {options ?.length > 0 &&
            options.map((one, index) => (
              
            ))} */}
        </List>
      </Popover>
    </>
  );
};

export default memo(SelectCustomLending);
