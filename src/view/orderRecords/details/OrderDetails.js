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
import { routes, STATUS_PENDING, STATUS_RECEIVED, ORDER_ID_TYPE } from 'utils/constants/constants';
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
  const {orderId} = props.match.params;
  let [orderNotFound, setOrderNotFound] = useState(false);
  let [data, setData] = useState({});
  let [loadingData, setLoadingData] = useState();

  const fetchData = async (orderId) => {
    try {
      const res = await getOrderDetail(1, orderId);
      if (!isEmpty(res.data)) {
        return res.data;
      }
    } catch (e) {
      throw e;
    }
  };

  const refreshData = async () => {
    setLoadingData(true);
    let response = await fetchData(orderId);
    if (response.result.status !== 200) {
      setOrderNotFound(true);
      setData({});
    } else {
      setOrderNotFound(false);
      setData(response.data);
    }
    setLoadingData(false);
  }

  useEffect(() => refreshData(), []);

  const renderDeliveryInfo = order => {
    if (!order?.status) {
      return (
        <>
          <InfoGroup
            labelID="IDS_DELIVERY_DATE"
            className="delivery-date-color"
            noPlacehholder={true}>
          </InfoGroup>
        </>
      );
    }
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
    props.history.goBack();
  };

  const navigateToReceivedDetail = () => {
    props.history.push(`${routes.RECEIVED_DELIVERY_DETAIL.replace(':orderCode', orderId)}?type=${ORDER_ID_TYPE}`);
  };

  const renderOrderNotFound = () => {
    if (orderNotFound) {
      return (
        <div className="message-container">
          <FormattedMessage id="IDS_ORDER_NOT_FOUND"/>
        </div>
      );
    }
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
                  {
                    data.order?.status &&
                    <StatusTag status={data.order?.status}>
                      {data.order?.status}
                    </StatusTag>
                  }
                </div>
              </div>
              <div className="page-info-container">
                <Card className="app-card info-card card-1">
                  <Row>
                    <Col span={12}>{renderDeliveryInfo(data.order)}</Col>
                    <Col span={1}/>
                    <Col span={11}>
                      <InfoGroup labelID="IDS_ORDER_DATE" noPlacehholder={true}>
                        {formatDate(data.order?.order_at, 'DD MMM')}
                      </InfoGroup>
                    </Col>
                  </Row>
                </Card>
                <Card className="app-card info-card card-2">
                  <Row>
                    <Col span={14}>
                      <InfoGroup labelID="IDS_ORDER_NO" noPlacehholder={true}>
                        {data.order?.order_no}
                      </InfoGroup>
                    </Col>
                    <Col span={10}>
                      <InfoGroup labelID="IDS_RECEIPT_NO" noPlacehholder={true}>
                        {data.order?.receipt_no}
                      </InfoGroup>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>
            <div className="body-group">
              <AppTable columns={itemColumns}
                        dataSource={data.items}
                        showLoading={loadingData}/>
              {renderOrderNotFound()}
            </div>
            <div className="footer-group app-button">
              <Button className="back-button" onClick={goBack}>
                <FormattedMessage id="IDS_BACK"/>
              </Button>
              {
                !orderNotFound &&
                <Button type="primary" className="update-button"
                        onClick={navigateToReceivedDetail}>
                  <FormattedMessage id="IDS_VIEW_UPDATE_RECEIVED_RECORD"/>
                </Button>
              }
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default connect()(withRouter(OrderDetails));
