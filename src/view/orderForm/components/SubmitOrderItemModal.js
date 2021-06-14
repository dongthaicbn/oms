import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal } from 'antd';
import * as icons from 'assets';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { actionSnackBar } from 'view/system/systemAction';
import { submitOrder } from '../OrderFormActions';
import IconLoading from 'components/icon-loading/IconLoading';
import { getLangCode } from 'utils/helpers/helpers';

const SubmitOrderItemModal = (props) => {
  const [loading, setLoading] = useState(false);
  const { handleClose, fetchData, locale } = props;

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await submitOrder({ lang_code: getLangCode(locale) });
      if (data.result.status === 200) {
        fetchData();
        props.actionSnackBar({
          open: true,
          type: 'success',
          message: data.result.message,
        });
      } else {
        props.actionSnackBar({
          open: true,
          type: 'warning',
          message: data.result.message,
        });
      }
    } catch (error) {
    } finally {
      handleClose();
      setLoading(false);
    }
  };
  return (
    <Modal
      visible={true}
      title={null}
      closeIcon={
        <img src={icons.ic_close} alt="" style={{ display: 'none' }} />
      }
      onOk={handleClose}
      onCancel={handleClose}
      className="modal-container"
      width={476}
      footer={null}
      centered
    >
      <div className="modal-filter-content">
        <p className="title-filter-text">
          <FormattedMessage id="IDS_SUBMIT" />
        </p>
        <p
          className="title-item"
          style={{
            color: '#4F4E66',
            fontWeight: 'normal',
            fontSize: 20,
            lineHeight: '30px',
            textAlign: 'center',
            padding: '8px 32px',
          }}
        >
          <FormattedMessage id="IDS_SUBMIT_ORDER_DESCRIPTION" />
        </p>
        {loading ? (
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              padding: 32,
            }}
          >
            <IconLoading />
          </div>
        ) : (
            <div className="filter-footer" style={{ marginTop: 16 }}>
              <Button className="outline-btn" onClick={handleClose}>
                <FormattedMessage id="IDS_CANCEL" />
              </Button>
              <Button className="primary-btn" onClick={handleSave}>
                <FormattedMessage id="IDS_SAVE" />
              </Button>
            </div>
          )}
      </div>
    </Modal>
  );
};

export default connect((state) => ({ locale: state.system.locale }), {
  actionSnackBar,
})(withRouter(SubmitOrderItemModal));
