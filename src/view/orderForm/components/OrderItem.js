import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import * as icons from 'assets';
import { showDate } from 'utils/helpers/helpers';
import { routes } from 'utils/constants/constants';
import OrderItemModal from './OrderItemModal';

const OrderItem = (props) => {
  const { item, isShowEdit } = props;
  const isWarning = !item.pass_moa;
  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);
  const handleDetail = () => {
    props.history.push(
      `${routes.GOODS_CATEGORY_ORDER_DETAIL.replace(':id', 1)}?type=categories`
    );
  };

  return (
    <>
      <div
        className={`order-item ${isWarning ? 'warning-item' : ''}`}
        onClick={openModal}
      >
        <div className="title-block">
          <div className="left-title-block">
            <span className="time-text">
              <FormattedMessage id="IDS_LAST_UPDATE" />:{' '}
              {showDate(item.last_update)}
            </span>
            <span className="name-text">{item.supplier_name}</span>
          </div>
          {isShowEdit && (
            <Button
              className="item-btn"
              style={{
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
        <div className="order-center-info">
          <span>
            {item.total_order > 1 ? (
              <FormattedMessage
                id="IDS_ORDERED_ITEMS"
                values={{ value: item.total_order }}
              />
            ) : (
              <FormattedMessage
                id="IDS_ORDERED_ITEM"
                values={{ value: item.total_order }}
              />
            )}
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
            {item.moa_message}
          </p>
        ) : (
          <p className="estimate-text">
            <FormattedMessage id="IDS_ESTIMATED_DELIVERY" />:{' '}
            {showDate(item.estimated_delivery)}
          </p>
        )}
      </div>
      {visible && (
        <OrderItemModal
          item={item}
          handleClose={closeModal}
          isShowEdit={isShowEdit}
          handleDetail={handleDetail}
        />
      )}
    </>
  );
};

export default withRouter(OrderItem);
