import { memo } from 'react';
import { List, ListItem, Popover, Typography, Radio } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DoneIcon from '@material-ui/icons/Done';
import React from 'react';
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
const SelectCustomHoliday = (props) => {
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
    ...rest
  } = props;
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef();
  const handleClick = () => {
    !disabled && setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const isChecked = (el) => {
    return value.id === el?.id;
  };
  // console.log('options', options);
  return (
    <>
      <BootstrapInput
        id={id}
        readOnly
        focused={open}
        disabled={disabled}
        value={value.name || 'Store'}
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
            cursor: 'pointer',
          },
        }}
        onClick={handleClick}
      />
      <Popover
        open={open}
        anchorEl={inputRef?.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          style: {
            width: inputRef?.current?.offsetWidth,
            maxHeight: 350,
            marginTop: 4,
          },
          variant: 'outlined',
        }}
        elevation={1}
      >
        <List>
          {options?.length > 0 &&
            options.map((el, index) => (
              <ListItem
                key={index}
                role={undefined}
                dense
                button
                onClick={() => {
                  onSelectOption(el, index);
                  handleClose();
                }}
                style={{
                  background: index % 2 === 0 ? 'white' : '#F1F4FC',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  fontSize: 16,
                  lineHeight: '24px',
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
                    {el.name} | {el.code}
                  </p>
                  <p style={{ margin: 0, color: '#4F4E66' }}>{el.address}</p>
                </div>
                <span style={{ color: '#6461B4' }}>{el.phone_no}</span>
              </ListItem>
            ))}
        </List>
      </Popover>
    </>
  );
};

export default memo(SelectCustomHoliday);
