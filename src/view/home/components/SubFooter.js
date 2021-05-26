import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import '../Home.scss';
import { Row, Col } from 'antd';
import { routes } from 'utils/constants/constants';

const SubFooter = (props) => {
  const handleChangeRoute = (url) => {
    props.history.push(url);
  };
  return (
    <div className="padding-common sub-footer-content">
      <Row className="wapper-sub-footer">
        <Col xs={24} sm={24} md={6} lg={6} xl={6} xxl={6}>
          <img src={icons.ic_logo} alt="" className="logo-sub-footer" />
        </Col>
        <Col xs={24} sm={8} md={6} lg={6} xl={6} xxl={6}>
          <div className="item-group">
            <p className="title-item">
              <FormattedMessage id="IDS_ORDER" />
            </p>
            <p
              className="text-item pointer"
              onClick={() => handleChangeRoute(routes.ORDER_FORM)}
            >
              <FormattedMessage id="IDS_ORDER_FORM" />
            </p>
            <p
              className="text-item pointer"
              onClick={() => handleChangeRoute(routes.ORDER_RECORD)}
            >
              <FormattedMessage id="IDS_ORDER_RECORD" />
            </p>
            <p
              className="text-item pointer"
              onClick={() => handleChangeRoute(routes.VEHICLE_SCHEDULE)}
            >
              <FormattedMessage id="IDS_VEHICLE_SCHEDULE" />
            </p>
            <p
              className="text-item pointer"
              onClick={() => handleChangeRoute(routes.HOLIDAY)}
            >
              <FormattedMessage id="IDS_DELIVERY_HOLIDAY" />
            </p>
          </div>
        </Col>
        <Col xs={24} sm={8} md={6} lg={6} xl={6} xxl={6}>
          <div className="item-group">
            <p className="title-item">
              <FormattedMessage id="IDS_RECEIVE" />
            </p>
            <p
              className="text-item pointer"
              onClick={() => handleChangeRoute(routes.RECEIVED_DELIVERY)}
            >
              <FormattedMessage id="IDS_RECEIVE_DELIVERY" />
            </p>
            <p className="title-item">
              <FormattedMessage id="IDS_OTHER_FORMS" />
            </p>
            <p
              className="text-item pointer"
              onClick={() => handleChangeRoute(routes.BORROW_RECORD)}
            >
              <FormattedMessage id="IDS_INVENTORY_BORROWING" />
            </p>
          </div>
        </Col>
        <Col xs={24} sm={8} md={6} lg={6} xl={6} xxl={6}>
          <div className="item-group">
            <p
              className="title-item pointer"
              onClick={() => handleChangeRoute(routes.CONTACT)}
            >
              <FormattedMessage id="IDS_CONTACT_US" />
            </p>
            <p
              className="title-item pointer"
              onClick={() => handleChangeRoute(routes.NEWS_AND_PROMOTION)}
            >
              <FormattedMessage id="IDS_NEW_PROMOTION" />
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(SubFooter);
