import { createStyles, InputBase, withStyles } from '@material-ui/core';

export const BootstrapInput = withStyles((theme) =>
  createStyles({
    root: {
      minHeight: 78,
      width: '100%',
      padding: 0,
      borderRadius: 10,
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      overflow: 'hidden',
      border: '2px solid #b5b6ff',
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      fontSize: 16,
      padding: '8px',
      color: '#4f4e66',
    },
    dropDown: {
      marginRight: 21
    },
    focused: {
      border: '2px solid #b5b6ff',
    },
    error: {
      border: '2px solid #b5b6ff',
    },
    disabled: {
      color: '#4f4e66',
    },
  })
)(InputBase);
