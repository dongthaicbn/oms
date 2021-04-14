import React from 'react';
import './Footer.scss';
import { Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
export default function Footer() {
  return (
    <div className="container-footer">
      <Row>
        <Col xs={24} sm={8} md={12} lg={15}>
          <div className="text">
            <FormattedMessage id="IDS_COPY_RIGHT" />
          </div>
        </Col>
        <Col xs={24} sm={16} md={12} lg={9}>
          <div className="inline">
            <div className="text-term">
              <FormattedMessage id="IDS_TERMS" />
            </div>
            <div className="dash" />
            <div className="text-policy-and-disclaimer">
              <FormattedMessage id="IDS_POLICY" />
            </div>
            <div className="dash" />
            <div className="text-policy-and-disclaimer">
              <FormattedMessage id="IDS_DISCLAIMER" />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
