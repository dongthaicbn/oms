import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row, Typography, Card, Divider, Button } from 'antd';
import Layout from 'components/layout/Layout';
import StatusTag from 'components/statusTag/StatusTag';
import InfoGroup from 'components/infoGroup/InfoGroup';
import RoundImage from 'components/image/RoundImage';
import AppTable from 'components/table/AppTable';
import { FormattedMessage } from 'react-intl';
import { routes, STATUS_PENDING, STATUS_RECEIVED } from 'utils/constants/constants';
import { formatDate, isEmpty } from 'utils/helpers/helpers';
import * as icons from 'assets';
import { getOrderDetail } from './OrderDetailsService';
import './OrderDetails.scss';

const { Title } = Typography;

const itemColumns = [
  {
    title: <FormattedMessage id="IDS_ITEMS"/>,
    key: 'items',
    render: item => (
      <div className="app-flex-container item-info-container">
        <RoundImage src={item.image} alt="Item Image"/>
        <InfoGroup
          label={
            <>
              {item.code}
              <Divider type="vertical"/>
              <FormattedMessage id="IDS_UNIT" values={{value: item.unit}}/>
            </>
          }
          labelClassName="item-info-label"
          noColon={true}
          className="item-info"
        >
          {item.name} {item.pack_weight}
        </InfoGroup>
      </div>
    )
  },
  {
    title: <FormattedMessage id="IDS_ACTUAL_QUANTITY"/>,
    key: 'actualQuantity',
    width: 110,
    align: 'center',
    render: item => {
      if (item.show_actual_weight) {
        return (
          <div className="app-button input-cell actual-quantity">
            <Button>
              {item.actual_weight || '00.00'}
            </Button>
          </div>
        );
      }
    }
  },
  {
    title: <FormattedMessage id="IDS_RECEIVED_QUANTITY"/>,
    dataIndex: 'received_qty',
    key: 'receivedQuantity',
    width: 120,
    align: 'center',
    render: value => {
      return (
        <div className="app-button input-cell received-quantity">
          <Button>
            {value || 0}
          </Button>
        </div>
      );
    }
  }
];

const OrderDetails = props => {
  const {orderNo} = props.match.params;
  let [data, setData] = useState({});

  const fetchData = async orderNo => {
    try {
      const res = await getOrderDetail(1, orderNo);
      if (!isEmpty(res.data)) {
        setData(res.data.data);
      }
    } catch (e) {
    }
  };

  useEffect(() => fetchData(orderNo), [orderNo]);

  const renderDeliveryInfo = order => {
    switch (order?.status) {
      case STATUS_PENDING:
        return (
          <>
            <InfoGroup
              labelID="IDS_ESTIMATED_DELIVERY"
              className="estimated-delivery-color"
            >
              {formatDate(order?.estimated_delivery, 'DD MMM')}
            </InfoGroup>
          </>
        );

      case STATUS_RECEIVED:
        return (
          <>
            <InfoGroup
              labelID="IDS_DELIVERY_DATE"
              className="delivery-date-color"
            >
              <img
                className="delivery-date-icon"
                src={icons.ic_tick}
                alt="icon_tick"
              />
              {formatDate(order?.received_date, 'DD MMM')}
            </InfoGroup>
          </>
        );

      default:
        return;
    }
  };

  const goBack = () => {
    props.history.push(routes.ORDER_RECORD);
  };

  const navigateToReceivedDetail = () => {
    props.history.push(routes.RECEIVED_DELIVERY_DETAIL_EDIT.replace(':orderNo', orderNo));
  };

  return (
    <div className="order-detail-container">
      <Layout>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container">
                <div className="page-title">
                  <Title level={3}>
                    {data.order?.name}
                  </Title>
                </div>
                <div className="status-tag-container">
                  <StatusTag status={data.order?.status}>
                    {data.order?.status}
                  </StatusTag>
                </div>
              </div>
              <div className="page-info-container">
                <Card className="app-card info-card card-1">
                  <Row>
                    <Col span={12}>{renderDeliveryInfo(data.order)}</Col>
                    <Col span={1}/>
                    <Col span={11}>
                      <InfoGroup labelID="IDS_ORDER_DATE">
                        {formatDate(data.order?.order_at, 'DD MMM')}
                      </InfoGroup>
                    </Col>
                  </Row>
                </Card>
                <Card className="app-card info-card card-2">
                  <Row>
                    <Col span={14}>
                      <InfoGroup labelID="IDS_ORDER_NO">
                        {data.order?.order_no}
                      </InfoGroup>
                    </Col>
                    <Col span={10}>
                      <InfoGroup labelID="IDS_RECEIPT_NO">
                        {data.order?.receipt_no}
                      </InfoGroup>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>
            <div className="body-group">
              <AppTable columns={itemColumns}
                        dataSource={data.items}/>
            </div>
            <div className="footer-group app-button">
              <Button className="back-button" onClick={goBack}>
                <FormattedMessage id="IDS_BACK"/>
              </Button>
              <Button type="primary" className="update-button"
                      onClick={navigateToReceivedDetail}>
                <FormattedMessage id="IDS_VIEW_UPDATE_RECEIVED_RECORD"/>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default connect()(withRouter(OrderDetails));
