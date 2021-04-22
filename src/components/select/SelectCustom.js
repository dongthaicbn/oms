import { memo } from 'react';
import { List, ListItem, Popover, Typography, Radio } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DoneIcon from '@material-ui/icons/Done';
import React from 'react';
import { BootstrapInput } from './BootstrapInput';

const CustomRadio = withStyles({
  root: {
    color: '#6461B4',
    '&$checked': {
      color: '#6461B4',
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);
const SelectCustom = (props) => {
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
  const isChecked = (one) => {
    if (multiple) {
      return Boolean(value.find((v) => v.id === one.id));
    }
    return value === one?.id;
  };

  return (
    <>
      <BootstrapInput
        id={id}
        readOnly
        focused={open}
        disabled={disabled}
        value="Supplier"
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
            options.map((one, index) => (
              <ListItem
                key={index}
                role={undefined}
                dense
                button
                onClick={() => {
                  onSelectOption(one, index);
                }}
                style={{
                  // background: isChecked(one) ? '#bfddfe' : undefined,
                  overflow: 'hidden',
                }}
              >
                <Typography
                  variant="body2"
                  style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {getOptionLabel && getOptionLabel(one)}
                </Typography>
                {/* <DoneIcon
                  style={{
                    opacity: 0.6,
                    width: 18,
                    height: 18,
                    visibility: isChecked(one) ? 'visible' : 'hidden',
                    color: '#0070ef',
                    justifySelf: 'flex-end',
                  }}
                /> */}
                <CustomRadio checked={isChecked(one)} />
              </ListItem>
            ))}
        </List>
      </Popover>
    </>
  );
};

export default memo(SelectCustom);
