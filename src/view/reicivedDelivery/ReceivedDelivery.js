import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { List, Card, Col, Row, Space, Tag, Radio, Typography, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { getReceivedDeliveryList } from './ReceivedDeliveryService';
import { isEmpty } from 'utils/helpers/helpers';
import { formatDate } from 'utils/helpers/helpers';
import { STATUS_ALL, STATUS_DAMAGED, STATUS_PENDING, STATUS_RECEIVED } from 'utils/constants/constants';
import { routes } from 'utils/constants/constants';
import * as icons from 'assets';
import { ReactComponent as SearchIcon } from 'assets/icons/ic_search_black.svg';
import InfoGroup from 'components/infoGroup/InfoGroup';
import StatusTag from 'components/statusTag/StatusTag';
import Layout from 'components/layout/Layout';
import AppInput from 'components/input/AppInput';
import './ReceivedDelivery.scss';

const {Title, Paragraph, Text} = Typography;

const items = [
  {
    name: 'Supplier Name A',
    order_no: 270865064,
    total_order_number: 7,
    order_at: Date.parse('2020-10-30 00:00:00'),
    estimated_delivery: Date.parse('2020-11-02 00:00:00'),
    received_date: null,
    status: 'pending'
  },
  {
    name: 'Supplier Name B',
    order_no: 370865064,
    total_order_number: 6,
    order_at: Date.parse('2020-05-01 00:00:00'),
    estimated_delivery: null,
    received_date: Date.parse('2020-08-10 00:00:00'),
    status: 'received'
  },
  {
    name: 'Supplier Name C',
    order_no: 470865064,
    total_order_number: 2,
    order_at: Date.parse('2020-11-20 00:00:00'),
    estimated_delivery: Date.parse('2020-12-05 00:00:00'),
    received_date: null,
    status: 'pending'
  },
  {
    name: 'Supplier Name D',
    order_no: 570865064,
    total_order_number: 5,
    order_at: Date.parse('2020-08-25 00:00:00'),
    estimated_delivery: null,
    received_date: Date.parse('2020-09-02 00:00:00'),
    status: 'damaged'
  },
  {
    name: 'Supplier Name E',
    order_no: 370865064,
    total_order_number: 7,
    order_at: Date.parse('2020-02-10 00:00:00'),
    estimated_delivery: null,
    received_date: Date.parse('2020-10-20 00:00:00'),
    status: 'pending'
  },
];

const ReceivedDelivery = (props) => {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [totalStatusItems, setTotalStatusItems] = useState({});
  const [data, setData] = useState([]);

  const fetchData = async (orderStatus) => {
    try {
      const res = await getReceivedDeliveryList(props.locale, orderStatus);
      if (!isEmpty(res.data)) {
        setData(res.data.data.orders);
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    // fetchData(currentStatus);
    let data;
    switch (currentStatus) {
      case 1: {
        data = items.filter(item => item.status === STATUS_PENDING);
        if (totalStatusItems[STATUS_PENDING] !== data.length) {
          totalStatusItems[STATUS_PENDING] = data.length;
        }
      }
        break;

      case 2: {
        data = items.filter(item => item.status === STATUS_RECEIVED);
        if (totalStatusItems[STATUS_RECEIVED] !== data.length) {
          totalStatusItems[STATUS_RECEIVED] = data.length;
        }
      }
        break;

      case 3: {
        data = items.filter(item => item.status === STATUS_DAMAGED);
        if (totalStatusItems[STATUS_DAMAGED] !== data.length) {
          totalStatusItems[STATUS_DAMAGED] = data.length;
        }
      }
        break;

      default: {
        data = items;
        if (totalStatusItems[STATUS_ALL] !== data.length) {
          totalStatusItems[STATUS_ALL] = data.length;
        }
      }
    }
    setData(data);
    setTotalStatusItems(totalStatusItems);
  }, [currentStatus]);

  const renderDeliveryInfo = (item) => {
    switch (item.status) {
      case STATUS_PENDING:
        return (
          <InfoGroup labelID="IDS_ESTIMATED_DELIVERY" className="estimated-delivery-color">
            {formatDate(item.estimated_delivery, 'DD MMM')}
          </InfoGroup>
        );

      case STATUS_RECEIVED:
      case STATUS_DAMAGED:
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

  const renderActionButton = (item) => {
    switch (item.status) {
      case STATUS_PENDING:
        return <Button type="primary">
          <FormattedMessage id="IDS_RECEIVED"/>
        </Button>;

      case STATUS_RECEIVED:
      case STATUS_DAMAGED:
        return <Button>
          <FormattedMessage id="IDS_VIEW_UPDATE"/>
        </Button>;
    }
  };

  const renderListItems = (items) => {
    if (isEmpty(items)) {
      return (
        <>
          <div className="received-delivery-message-container">
            <Text className="message">
              <FormattedMessage id="IDS_NO_RESULT_FOUND"/>
            </Text>
          </div>
        </>
      );
    }
    return (
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Link to={routes.RECEIVED_DELIVERY_DETAIL.replace(':orderNo', item.order_no)}>
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
                    <div className="order-no-info-group">
                      <Paragraph>
                        <FormattedMessage id="IDS_ORDER_NO"/>:&nbsp;
                        <Text strong>{item.order_no}</Text>
                      </Paragraph>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="action-group-container app-flex-container app-button">
                      <div className="total-order-number-info">
                        <Tag>
                          <Text>
                            <FormattedMessage id="IDS_ORDERED_ITEMS" values={{value: item.total_order_number}}/>
                          </Text>
                        </Tag>
                      </div>
                      {renderActionButton(item)}
                    </div>
                  </Col>
                </Row>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    );
  };
  return (
    <div className="received-delivery-container">
      <Layout>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container">
                <div className="page-title">
                  <Title level={3}>
                    <FormattedMessage id="IDS_RECEIVED_DELIVERY"/>
                  </Title>
                </div>
                <FormattedMessage id="IDS_SEARCH">
                  {
                    placeholder => (
                      <AppInput placeholder={placeholder} prefix={<SearchIcon/>}/>
                    )
                  }
                </FormattedMessage>
              </div>
              <Row className="status-filter-container">
                <Col span={24}>
                  <Radio.Group buttonStyle="solid" value={currentStatus}
                               onChange={(e) => setCurrentStatus(e.target.value)}>
                    <Space size={24}>
                      <Radio.Button value={0}>
                        <FormattedMessage id="IDS_ALL"/>
                        {totalStatusItems[STATUS_ALL] >= 0 ? ' (' + totalStatusItems[STATUS_ALL] + ')' : ''}
                      </Radio.Button>
                      <Radio.Button value={1}>
                        <FormattedMessage id="IDS_PENDING"/>
                        {totalStatusItems[STATUS_PENDING] >= 0 ? ' (' + totalStatusItems[STATUS_PENDING] + ')' : ''}
                      </Radio.Button>
                      <Radio.Button value={2}>
                        <FormattedMessage id="IDS_RECEIVED"/>
                        {totalStatusItems[STATUS_RECEIVED] >= 0 ? ' (' + totalStatusItems[STATUS_RECEIVED] + ')' : ''}
                      </Radio.Button>
                      <Radio.Button value={3}>
                        <FormattedMessage id="IDS_DAMAGED_ORDER"/>
                        {totalStatusItems[STATUS_DAMAGED] >= 0 ? ' (' + totalStatusItems[STATUS_DAMAGED] + ')' : ''}
                      </Radio.Button>
                    </Space>
                  </Radio.Group>
                </Col>
              </Row>
            </div>
            <div className="body-group">
              {renderListItems(data)}
            </div>
            <div className="footer-group app-button">
              <Button type="primary">
                <FormattedMessage id="IDS_SCAN_QR_CODE_BARCODE" />
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default connect((state) => ({
  locale: state.system.locale,
}))
(withRouter(ReceivedDelivery));