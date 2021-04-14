import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, Space, Radio, List, Card, Typography, Tag, Divider } from 'antd';
import Layout from 'components/layout/Layout';
import StatusTag from 'components/statusTag/StatusTag';
import InfoGroup from 'components/infoGroup/InfoGroup';
import { FormattedMessage } from 'react-intl';
import { formatDate, isEmpty } from 'utils/helpers/helpers';
import { STATUS_PENDING, STATUS_RECEIVED } from 'utils/constants/constants';
import * as icons from 'assets';
import { getOrderList } from './OrderRecordService';
import './OrderRecord.scss';

const {Title, Paragraph, Text} = Typography;

const items = [
  {
    name: 'Supplier Name A',
    order_no: 270865064,
    receipt_no: 79670,
    total_order_number: 5,
    order_at: Date.parse('2020-07-30 00:00:00'),
    estimated_delivery: Date.parse('2020-09-08 00:00:00'),
    received_date: null,
    status: 'pending'
  },
  {
    name: 'Supplier Name B',
    order_no: 370865064,
    receipt_no: 89670,
    total_order_number: 6,
    order_at: Date.parse('2020-10-20 00:00:00'),
    estimated_delivery: null,
    received_date: Date.parse('2020-12-05 00:00:00'),
    status: 'received'
  },
  {
    name: 'Supplier Name C',
    order_no: 470865064,
    receipt_no: 109670,
    total_order_number: 7,
    order_at: Date.parse('2020-06-07 00:00:00'),
    estimated_delivery: null,
    received_date: Date.parse('2020-10-02 00:00:00'),
    status: 'received'
  },
  {
    name: 'Supplier Name D',
    order_no: 570865064,
    receipt_no: 119670,
    total_order_number: 8,
    order_at: Date.parse('2020-02-03 00:00:00'),
    estimated_delivery: null,
    received_date: Date.parse('2020-08-06 00:00:00'),
    status: 'received'
  },
  {
    name: 'Supplier Name E',
    order_no: 670865064,
    receipt_no: 129670,
    total_order_number: 9,
    order_at: Date.parse('2020-05-04 00:00:00'),
    estimated_delivery: Date.parse('2020-08-08 00:00:00'),
    received_date: null,
    status: 'pending'
  },
  {
    name: 'Supplier Name F',
    order_no: 770865064,
    receipt_no: 139670,
    total_order_number: 10,
    order_at: Date.parse('2020-05-26 00:00:00'),
    estimated_delivery: null,
    received_date: Date.parse('2020-09-10 00:00:00'),
    status: 'received'
  }
];

const OrderRecord = (props) => {

  const [orderStatus, setOrderStatus] = useState(0);
  const [data, setData] = useState([]);

  const fetchData = async (orderStatus) => {
    try {
      const res = await getOrderList(1, orderStatus);
      if (!isEmpty(res.data)) {
        setData(res.data.data.orders);
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    // fetchData(orderStatus);
    switch (orderStatus) {
      case 0 : {
        setData(items);
      }
        break;

      case 1: {
        setData(items.filter(item => item.status === 'pending'));
      }
        break;

      case 2: {
        setData(items.filter(item => item.status === 'received'));
      }
        break;
    }
  }, [orderStatus]);

  const renderDeliveryInfo = (item) => {
    switch (item.status) {
      case STATUS_PENDING:
        return (
          <InfoGroup labelID="IDS_ESTIMATED_DELIVERY" className="estimated-delivery-color">
            {formatDate(item.estimated_delivery, 'DD MMM')}
          </InfoGroup>
        );

      case STATUS_RECEIVED:
        return (
          <InfoGroup labelID="IDS_DELIVERY_DATE" className="delivery-date-color">
            <img className="delivery-date-icon" src={icons.ic_tick} alt="icon_tick"/>
            {formatDate(item.received_date, 'DD MMM')}
          </InfoGroup>
        );

      default:
        return;
    }
  };
  const renderListItems = (items) => {
    if (isEmpty(items)) {
      return (
        <>
          <div className="order-record-message-container">
            <Text className="message">
              <FormattedMessage id="IDS_NO_ORDER_RECORD_YET"/>
            </Text>
          </div>
        </>
      );
    }
    return (
      <div className="list-order-record-container">
        <List
          itemLayout="vertical"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Link to={`/order-record/${item.order_no}`}>
                <Card hoverable>
                  <Row>
                    <Col span={10}>
                      <InfoGroup labelID="IDS_SUPPLIER">
                        {item.name}
                      </InfoGroup>
                    </Col>
                    <Col span={1}/>
                    <Col span={9}>
                      {renderDeliveryInfo(item)}
                    </Col>
                    <Col span={4}>
                      <div className="order-date-status-info-group">
                        <Text className="order-date">
                          {formatDate(item.order_at, 'YYYY / MM / DD')}
                        </Text>
                        <StatusTag status={item.status}>{item.status}</StatusTag>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div className="order-no-receipt-no-info-group">
                        <Paragraph>
                          <FormattedMessage id="IDS_ORDER_NO"/>:&nbsp;
                          <Text strong>{item.order_no}</Text>
                          <Divider className="divider" type="vertical"/>
                          <FormattedMessage id="IDS_RECEIPT_NO"/>:&nbsp;
                          <Text strong>{item.receipt_no}</Text>
                        </Paragraph>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div className="total-order-number-info">
                        <Tag>
                          <Text>
                            <FormattedMessage id="IDS_ORDERED_ITEMS" values={{value: item.total_order_number}}/>
                          </Text>
                        </Tag>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </div>
    );
  };
  return (
    <Layout>
      <div className="app-scrollable-container">
        <div className="app-content-container">
          <Row>
            <Col span={24}>
              <Title level={3}><FormattedMessage id="IDS_ORDER_RECORD"/></Title>
            </Col>
          </Row>
          <Row className="status-filter-container">
            <Col span={24}>
              <Radio.Group defaultValue="ALL" buttonStyle="solid"
                           onChange={(e) => setOrderStatus(e.target.value)} value={orderStatus}>
                <Space size={24}>
                  <Radio.Button value={0}>
                    <FormattedMessage id="IDS_ALL"/>
                  </Radio.Button>
                  <Radio.Button value={1}>
                    <FormattedMessage id="IDS_PROCESSING"/>
                  </Radio.Button>
                  <Radio.Button value={2}>
                    <FormattedMessage id="IDS_RECEIVED"/>
                  </Radio.Button>
                </Space>
              </Radio.Group>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {renderListItems(data)}
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export default connect()
(withRouter(OrderRecord));