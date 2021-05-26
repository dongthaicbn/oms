import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, Space, Radio, Card, Typography, Tag, Divider } from 'antd';
import Layout from 'components/layout/Layout';
import StatusTag from 'components/statusTag/StatusTag';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppList from 'components/list/AppList';
import { FormattedMessage } from 'react-intl';
import { formatDate, isEmpty, getLangCode, removeInvalidValues } from 'utils/helpers/helpers';
import { STATUS_PENDING, STATUS_RECEIVED, DEFAULT_NUMBER_OF_ITEMS } from 'utils/constants/constants';
import * as icons from 'assets';
import { getOrderList, cancelGetOrderListRequest } from './OrderRecordService';
import './OrderRecord.scss';
import { routes } from '../../utils/constants/constants';

const { Title, Paragraph, Text } = Typography;

const OrderRecord = props => {
  const [orderStatus, setOrderStatus] = useState(0);
  const [data, setData] = useState();

  const fetchData = async (orderStatus, lastItemOrderId) => {
    try {
      const res = await getOrderList(getLangCode(props.locale), orderStatus, lastItemOrderId);
      if (!isEmpty(res.data)) {
        return res.data;
      }
    } catch (e) {
      throw e;
    }
  };

  const renderDeliveryInfo = item => {
    switch (item.status) {
      case STATUS_PENDING:
        return (
          <InfoGroup
            labelID="IDS_ESTIMATED_DELIVERY"
            className="estimated-delivery">
            {formatDate(item.estimated_delivery, 'DD MMM')}
          </InfoGroup>
        );

      case STATUS_RECEIVED:
        return (
          <InfoGroup
            labelID="IDS_DELIVERY_DATE"
            className="delivery-date">
            <img
              className="icon"
              src={icons.ic_tick}
              alt="icon_tick"
            />
            {formatDate(item.received_date, 'DD MMM')}
          </InfoGroup>
        );

      default:
        return;
    }
  };

  const refreshOrderRecords = async () => {
    let response = await fetchData(orderStatus);
    setData(response.data.orders);
    return response.pagination.hasMore;
  };

  const loadMoreOrderRecords = async (lastItem) => {
    let lastItemId = lastItem? lastItem.order_id : undefined;
    let response = await fetchData(orderStatus, lastItemId);
    if (data) {
      setData([...data, ...response.data.orders]);
    } else {
      setData(response.data.orders);
    }
    return response.pagination.hasMore;
  };

  const renderListItems = (items) => {
    let message;
    if (items && isEmpty(items)) {
      message = (
        <div className="message-container">
          <Text className="message">
            <FormattedMessage id="IDS_NO_ORDER_RECORD_YET"/>
          </Text>
        </div>
      );
    }
    return <>
      {message}
      <AppList dataSource={data}
               refreshOn={orderStatus}
               onRefresh={refreshOrderRecords}
               onLoadMore={loadMoreOrderRecords}
               renderItem={(item) => (
                 <Link to={routes.ORDER_DETAILS.replace(':orderNo', item.order_no)}>
                   <Card hoverable>
                     <Row>
                       <Col span={10}>
                         <InfoGroup className="supplier-name" labelID="IDS_SUPPLIER" noColon={true}>{item.name}</InfoGroup>
                       </Col>
                       <Col span={1} />
                       <Col span={9}>{renderDeliveryInfo(item)}</Col>
                       <Col span={4}>
                         <div className="order-date-status-info-group">
                           <Text className="order-date">
                             {formatDate(item.order_at, 'YYYY / MM / DD')}
                           </Text>
                           <StatusTag status={item.status}>
                             {item.status}
                           </StatusTag>
                         </div>
                       </Col>
                     </Row>
                     <Row>
                       <Col span={24}>
                         <div className="order-no-receipt-no-info-group">
                           <Paragraph>
                             <FormattedMessage id="IDS_ORDER_NO" />:&nbsp;
                             <Text strong>{item.order_no}</Text>
                             <Divider className="divider" type="vertical" />
                             <FormattedMessage id="IDS_RECEIPT_NO" />:&nbsp;
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
                               <FormattedMessage
                                 id="IDS_ORDERED_ITEMS"
                                 values={{ value: item.total_order_number }}
                               />
                             </Text>
                           </Tag>
                         </div>
                       </Col>
                     </Row>
                   </Card>
                 </Link>
               )} />
    </>
  };

  return (
    <div className="order-record-container">
      <Layout>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container">
                <div className="page-title">
                  <Title level={3}>
                    <FormattedMessage id="IDS_ORDER_RECORD" />
                  </Title>
                </div>
              </div>
              <Row className="status-filter-container">
                <Col span={24}>
                  <Radio.Group buttonStyle="solid" value={orderStatus}
                    onChange={(event) => setOrderStatus(event.target.value)}>
                    <Space size={24}>
                      <Radio.Button value={0}>
                        <FormattedMessage id="IDS_ALL" />
                      </Radio.Button>
                      <Radio.Button value={1}>
                        <FormattedMessage id="IDS_PROCESSING" />
                      </Radio.Button>
                      <Radio.Button value={2}>
                        <FormattedMessage id="IDS_RECEIVED" />
                      </Radio.Button>
                    </Space>
                  </Radio.Group>
                </Col>
              </Row>
            </div>
            <div className="body-group">
              {renderListItems(data)}
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
  (withRouter(OrderRecord));
