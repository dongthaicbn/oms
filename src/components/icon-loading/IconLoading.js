import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    color: '#6461B4'
  }
}));

export default function IconLoading() {
  const classes = useStyles();
  return (
    <div>
      <CircularProgress className={classes.root} />
    </div>
  );
}
