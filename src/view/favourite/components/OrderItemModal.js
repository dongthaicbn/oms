import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
import * as icons from 'assets';
import { getTodayDetail } from '../FavouriteActions';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';

const OrderItemModal = (props) => {
  const { item, locale, handleClose } = props;
  const [dataDetail, setDataDetail] = useState({});
  const fetchData = async () => {
    try {
      const { data } = await getTodayDetail({
        lang_code: getLangCode(locale),
        id: item.id,
      });
      let status = data && data.result && data.result.status;
      if (!isEmpty(status) && status === 200) setDataDetail(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    if (!isEmpty(item)) fetchData();
  }, [item]);
  const { supplier_form, delivery_items } = dataDetail;
  return (
    <Modal
      visible={true}
      title={null}
      closeIcon={<img src={icons.ic_close} alt="" />}
      onOk={handleClose}
      onCancel={handleClose}
      className="modal-container"
      width={726}
      footer={null}
    >
      {isEmpty(dataDetail) ? (
        <></>
      ) : (
        <div className="modal-content">
          <span className="time-text">
            <FormattedMessage id="IDS_LAST_UPDATE" />:{' '}
            {!isEmpty(supplier_form) && supplier_form.last_update}
          </span>
          <div className="title-block">
            <div className="left-title-block">
              <span className="name-text">
                {!isEmpty(supplier_form) && supplier_form.supplier_name}
              </span>
              <span className="time-text">
                <FormattedMessage id="IDS_ESTIMATED_DELIVERY" />:{' '}
                {!isEmpty(supplier_form) && supplier_form.estimated_delivery}
              </span>
              {!isEmpty(supplier_form) && (
                <span className="order-value-text">
                  <FormattedMessage id="IDS_ORDER" />:{' '}
                  {`${supplier_form.total_order_item} item${
                    supplier_form.total_order_item > 1 ? 's' : ''
                  }`}
                </span>
              )}
            </div>
            <Button className="item-btn">
              <FormattedMessage id="IDS_VIEW" />
              &nbsp;/ &nbsp;
              <FormattedMessage id="IDS_REVISE" />
            </Button>
          </div>
          {!isEmpty(delivery_items) &&
            delivery_items.map((el, i) => (
              <div key={i} className="item-group">
                <span className="first-text">{el.code}</span>
                <div className="item-detail">
                  <span className="text-group">
                    <span className="title-item">{el.name}</span>
                    <span
                      className="value-item"
                      style={{ background: 'transparent' }}
                    >
                      {el.supplier_name}
                    </span>
                  </span>
                  <span className="text-group">
                    <span className="title-item right-text">{el.quantity}</span>
                    <span
                      className="value-item right-text"
                      style={{ background: 'transparent' }}
                    >
                      {el.cost}
                    </span>
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
