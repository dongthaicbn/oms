import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row, Typography, Card, Table, Divider, Button } from 'antd';
import Layout from 'components/layout/Layout';
import StatusTag from 'components/statusTag/StatusTag';
import InfoGroup from 'components/infoGroup/InfoGroup';
import RoundImage from 'components/image/RoundImage';
import { FormattedMessage } from 'react-intl';
import {
  routes,
  STATUS_PENDING,
  STATUS_RECEIVED
} from 'utils/constants/constants';
import { formatDate, isEmpty } from 'utils/helpers/helpers';
import * as icons from 'assets';
import { getOrderDetail } from './OrderDetailsService';
import './OrderDetails.scss';

const { Title, Paragraph, Text } = Typography;

const order = {
  order: {
    name: 'Supplier Name A',
    order_no: 270865064,
    receipt_no: 89670,
    total_order_number: 7,
    order_at: Date.parse('2020-10-30 00:00:00'),
    estimated_delivery: null,
    received_date: Date.parse('2020-11-02 00:00:00'),
    status: 'received'
  },
  items: [
    {
      id: 1,
      code: 'FB0001-02',
      unit: 'KG',
      name: 'Grass carp',
      pack_weight: '(~4.25)',
      actual_weight: 12.3,
      ordered_qty: 12,
      received_qty: 0,
      image:
        'https://www.waveinn.com/f/13754/137543456/gaby-the-grass-carp-giant.jpg'
    },
    {
      id: 2,
      code: 'FB0001-03',
      unit: 'KG',
      name: 'Shrimp',
      pack_weight: '(~4.00)',
      actual_weight: 29.56,
      ordered_qty: 11,
      received_qty: 3,
      image:
        'https://cdn-a.william-reed.com/var/wrbm_gb_food_pharma/storage/images/publications/feed/feednavigator.com/article/2017/12/20/neovia-acquires-us-shrimp-feed-probiotic-expert/7674068-1-eng-GB/Neovia-acquires-US-shrimp-feed-probiotic-expert_wrbm_large.jpg'
    },
    {
      id: 3,
      code: 'FB0001-04',
      unit: 'KG',
      name: 'Tuna',
      pack_weight: '(~3.55)',
      actual_weight: 20.12,
      ordered_qty: 5,
      received_qty: 10,
      image:
        'https://dayanandboholahseafoods.com/wp-content/uploads/2017/11/thon-Rouge1.jpg'
    },
    {
      id: 4,
      code: 'FB0001-05',
      unit: 'KG',
      name: 'Tuna',
      pack_weight: '(~3.55)',
      actual_weight: null,
      ordered_qty: 5,
      received_qty: null,
      image:
        'https://dayanandboholahseafoods.com/wp-content/uploads/2017/11/thon-Rouge1.jpg'
    },
    {
      id: 5,
      code: 'FB0001-06',
      unit: 'KG',
      name: 'Tuna',
      pack_weight: '(~3.55)',
      actual_weight: 20.12,
      ordered_qty: 5,
      received_qty: 10,
      image:
        'https://dayanandboholahseafoods.com/wp-content/uploads/2017/11/thon-Rouge1.jpg'
    },
    {
      id: 6,
      code: 'FB0001-07',
      unit: 'KG',
      name: 'Tuna',
      pack_weight: '(~3.55)',
      actual_weight: null,
      ordered_qty: 5,
      received_qty: 10,
      image:
        'https://dayanandboholahseafoods.com/wp-content/uploads/2017/11/thon-Rouge1.jpg'
    },
    {
      id: 7,
      code: 'FB0001-08',
      unit: 'KG',
      name: 'Tuna',
      pack_weight: '(~3.55)',
      actual_weight: 20.12,
      ordered_qty: 5,
      received_qty: null,
      image:
        'https://dayanandboholahseafoods.com/wp-content/uploads/2017/11/thon-Rouge1.jpg'
    },
    {
      id: 8,
      code: 'FB0001-09',
      unit: 'KG',
      name: 'Tuna',
      pack_weight: '(~3.55)',
      actual_weight: 20.12,
      ordered_qty: 5,
      received_qty: 10,
      image:
        'https://dayanandboholahseafoods.com/wp-content/uploads/2017/11/thon-Rouge1.jpg'
    },
    {
      id: 9,
      code: 'FB0001-10',
      unit: 'KG',
      name: 'Tuna',
      pack_weight: '((~3.55))',
      actual_weight: 20.12,
      ordered_qty: 5,
      received_qty: 10,
      image:
        'https://dayanandboholahseafoods.com/wp-content/uploads/2017/11/thon-Rouge1.jpg'
    },
    {
      id: 10,
      code: 'FB0001-11',
      unit: 'KG',
      name: 'Tuna',
      pack_weight: '((~3.55))',
      actual_weight: 20.12,
      ordered_qty: 5,
      received_qty: 10,
      image:
        'https://dayanandboholahseafoods.com/wp-content/uploads/2017/11/thon-Rouge1.jpg'
    }
  ]
};

const itemColumns = [
  {
    title: <FormattedMessage id="IDS_ITEMS" />,
    key: 'items',
    render: item => (
      <div className="app-flex-container items-info-cell">
        <RoundImage src={item.image} alt="Item Image" />
        <div>
          <InfoGroup
            label={
              <>
                <Text>{item.code}</Text>
                <Divider type="vertical" />
                <FormattedMessage id="IDS_UNIT" />
                :&nbsp;
                <Text>{item.unit}</Text>
              </>
            }
            noColon={true}
          >
            {item.name} {item.pack_weight}
          </InfoGroup>
        </div>
      </div>
    )
  },
  {
    title: <FormattedMessage id="IDS_ACTUAL_QUANTITY" />,
    dataIndex: 'actual_weight',
    key: 'actualQuantity',
    width: 110,
    align: 'center',
    render: value => {
      if (value)
        return (
          <div className="item-quantity-container">
            <Paragraph className="actual-quantity">{value}</Paragraph>
          </div>
        );
    }
  },
  {
    title: <FormattedMessage id="IDS_RECEIVED_QUANTITY" />,
    dataIndex: 'received_qty',
    key: 'receivedQuantity',
    width: 120,
    align: 'center',
    render: value => {
      if (value)
        return (
          <div className="item-quantity-container">
            <Paragraph className="received-quantity">{value}</Paragraph>
          </div>
        );
    }
  }
];

const OrderDetails = props => {
  const { orderNo } = props.match.params;
  let [data, setData] = useState({});

  const fetchData = async orderNo => {
    try {
      const res = await getOrderDetail(1, orderNo);
      if (!isEmpty(res.data)) {
        setData(res.data.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    // fetchData(orderNo);
    setData(order);
  }, [orderNo]);

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

  return (
    <Layout>
      <div className="app-scrollable-container order-detail-scrollable-container">
        <div className="app-content-container order-detail-content-container">
          <Row>
            <Col span={20}>
              <Title level={3}>{data.order?.name}</Title>
            </Col>
            <Col span={4}>
              <div className="app-flex-container flex-end">
                <StatusTag status={data.order?.status}>
                  {data.order?.status}
                </StatusTag>
              </div>
            </Col>
          </Row>
          <div className="app-flex-container order-info-card-container">
            <Card className="app-card info-card card-1">
              <Row>
                <Col span={12}>{renderDeliveryInfo(data.order)}</Col>
                <Col span={1} />
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
          <Row>
            <Col span={24}>
              <Table
                className="app-table"
                columns={itemColumns}
                dataSource={data.items}
                rowKey="id"
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      </div>
      <div className="action-container app-button">
        <Button className="action-button back-button" onClick={goBack}>
          <FormattedMessage id="IDS_BACK" />
        </Button>
        <Button
          type="primary"
          className="action-button"
          style={{ float: 'right' }}
        >
          <FormattedMessage id="IDS_VIEW_UPDATE_RECEIVED_RECORD" />
        </Button>
      </div>
    </Layout>
  );
};

export default connect()(withRouter(OrderDetails));
