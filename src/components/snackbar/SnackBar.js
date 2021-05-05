import React from 'react';
import { FormattedMessage } from 'react-intl';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { actionSnackBar } from '../../view/system/systemAction';
import { connect } from 'react-redux';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles(theme => ({
  success: {
    width: '80vw',
    background: 'linear-gradient(272.96deg, #28A9F1 0%, #65C8FF 100%)',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)',
    borderRadius: '10px'
  },
  warning: {
    width: '80vw',
    background: '#EF5F5F',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)',
    borderRadius: '6px'
  }
}));
const SnackBar = props => {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.actionSnackBar({
      open: false,
      type: '',
      message: '',
      messageID: '',
      messageParams: undefined,
    });
  };

  const renderMessage = () => {
    if (props.snackBar.messageID) {
      return <FormattedMessage id={props.snackBar.messageID} values={props.snackBar.messageParams}/>
    }
    return props.snackBar.message;
  }

  return (
    <div>
      <Snackbar
        open={props.snackBar.open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          severity="success"
          icon={
            props.snackBar.type === 'success' ? (
              <CheckCircleIcon fontSize="inherit" />
            ) : (
              <ReportProblemIcon fontSize="inherit" />
            )
          }
          className={
            props.snackBar.type === 'success'
              ? classes.success
              : classes.warning
          }
        >
          {renderMessage()}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default connect(
  state => ({
    // isLoading: state.system.isLoading,
    snackBar: state.system.snackBar
  }),
  { actionSnackBar }
)(withRouter(SnackBar));
