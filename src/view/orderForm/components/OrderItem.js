import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import * as icons from 'assets';
import OrderItemModal from './OrderItemModal';

const OrderItem = (props) => {
  const { item } = props;
  const isWarning = item.pass_moq;
  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  return (
    <>
      <div
        className={`order-item ${isWarning ? 'warning-item' : ''}`}
        onClick={openModal}
      >
        <div className="title-block">
          <div className="left-title-block">
            <span className="time-text">
              <FormattedMessage id="IDS_LAST_UPDATE" />: {item.last_update}
            </span>
            <span className="name-text">{item.supplier_name}</span>
          </div>
          <Button className="item-btn">
            <FormattedMessage id="IDS_VIEW" />
            &nbsp;/ &nbsp;
            <FormattedMessage id="IDS_REVISE" />
          </Button>
        </div>
        <div className="order-center-info">
          <span>
            <FormattedMessage id="IDS_ORDERED_ITEMS" values={{ value: 7 }} />
          </span>
          <span>
            <FormattedMessage id="IDS_TOTAL" />: {item.total_cost}
          </span>
        </div>
        {isWarning ? (
          <p className="warning-text">
            <img
              src={icons.ic_warning_white}
              alt=""
              style={{ marginRight: 8 }}
            />
            {item.moq_message}
          </p>
        ) : (
          <p className="estimate-text">
            <FormattedMessage id="IDS_ESTIMATED_DELIVERY" />:{' '}
            {item.estimated_delivery}
          </p>
        )}
      </div>
      {visible && <OrderItemModal item={item} handleClose={closeModal} />}
    </>
  );
};

export default OrderItem;
