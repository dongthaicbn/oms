import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
import * as icons from 'assets';
import IconLoading from 'components/icon-loading/IconLoading';
import { getTodayDetail } from '../OrderFormActions';
import {
  getLangCode,
  isEmpty,
  showDate,
  showEstimateDate,
} from 'utils/helpers/helpers';

const OrderItemModal = (props) => {
  const { item, locale, handleClose, isShowEdit, handleDetail } = props;
  const [dataDetail, setDataDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await getTodayDetail({
        lang_code: getLangCode(locale),
        id: item.id,
      });
      let status = data && data.result && data.result.status;
      if (!isEmpty(status) && status === 200) setDataDetail(data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isEmpty(item)) fetchData();
  }, [item]);
  const { supplier_form, delivery_items } = dataDetail;
  return (
    <Modal
      visible={true}
      title={null}
      centered
      closeIcon={
        <img src={icons.ic_close} alt="" style={{ width: 24, height: 24 }} />
      }
      onOk={handleClose}
      onCancel={handleClose}
      className="modal-container"
      width={726}
      footer={null}
    >
      {loading ? (
        <div
          className="icon-loading"
          style={{
            margin: 80,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconLoading />
        </div>
      ) : (
        <div className="modal-content">
          <span className="time-text">
            <FormattedMessage id="IDS_LAST_UPDATE" />:{' '}
            {!isEmpty(supplier_form) && showDate(supplier_form.last_update)}
          </span>
          <div className="title-block" style={{ marginTop: 8 }}>
            <div className="left-title-block">
              <span className="name-text">
                {!isEmpty(supplier_form) && supplier_form.supplier_name}
              </span>
              <span className="time-text">
                <FormattedMessage id="IDS_ESTIMATED_DELIVERY" />
                &nbsp;:&nbsp;
                {!isEmpty(supplier_form) &&
                  showEstimateDate(supplier_form.estimated_delivery)}
              </span>
              {!isEmpty(supplier_form) && (
                <span className="order-value-text">
                  <FormattedMessage id="IDS_ORDER" />
                  &nbsp;:&nbsp;
                  {`${supplier_form.total_order_item} Item${
                    supplier_form.total_order_item > 1 ? 's' : ''
                  }`}
                </span>
              )}
            </div>
            {isShowEdit && (
              <Button
                className="item-btn"
                style={{
                  background: '#F7F9FF',
                  color: '#6461B4',
                  fontWeight: 'bold',
                  fontSize: 18,
                  lineHeight: '27px',
                }}
                onClick={handleDetail}
              >
                <FormattedMessage id="IDS_VIEW" />
                &nbsp;/ &nbsp;
                <FormattedMessage id="IDS_REVISE" />
              </Button>
            )}
          </div>
          {!isEmpty(delivery_items) &&
            delivery_items.map((el, i) => (
              <div key={i} className="item-group">
                <span className="first-text">{el.code}</span>
                <div className="item-detail">
                  <span className="text-group">
                    <span className="title-item">{el.name}</span>
                    <span className="value-item">{el.supplier_name}</span>
                  </span>
                  <span className="text-group" style={{ textAlign: 'right' }}>
                    <span className="title-item right-text">{el.quantity}</span>
                    <span className="value-item right-text">{el.cost}</span>
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </Modal>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  {}
)(OrderItemModal);
