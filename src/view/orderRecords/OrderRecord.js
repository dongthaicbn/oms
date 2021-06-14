import React, { useState, useEffect, useRef } from 'react';
import { usePageCache } from 'components/hook/AppHook';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Space, Radio, Card, Typography, Tag, Divider } from 'antd';
import Layout from 'components/layout/Layout';
import StatusTag from 'components/statusTag/StatusTag';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppList from 'components/list/AppList';
import { FormattedMessage } from 'react-intl';
import { formatDate, isEmpty, getLangCode } from 'utils/helpers/helpers';
import { routes, STATUS_PENDING, STATUS_RECEIVED } from 'utils/constants/constants';
import * as icons from 'assets';
import { getOrderList } from './OrderRecordService';
import './OrderRecord.scss';

const {Title, Paragraph, Text} = Typography;

const PAGE_CACHE_KEY = 'OrderRecord';

const OrderRecord = props => {
  const [isUseCache, getPageCacheData, updatePageCacheData] = usePageCache(PAGE_CACHE_KEY, props);
  const [orderStatus, setOrderStatus] = useState(0);
  const [data, setData] = useState();
  const [loadingData, setLoadingData] = useState();
  const [pagination, setPagination] = useState();
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    updatePageCacheData('status', orderStatus);
  }, [orderStatus]);

  useEffect(() => {
    updatePageCacheData('numberOfOrders', data?.length);
  }, [data]);

  const handleListScroll = (scrollTop) => {
    updatePageCacheData('scrollTop', scrollTop)
  };

  useEffect(() => {
    let status = 0;
    let numberOfItems;
    let scrollTop;
    if (isUseCache) {
      let cacheData = getPageCacheData();
      status = cacheData.status;
      numberOfItems = cacheData.numberOfOrders;
      scrollTop = cacheData.scrollTop;
      setOrderStatus(cacheData.status);
    }
    refreshOrderRecords(status, numberOfItems, scrollTop);
  }, []);

  const fetchData = async (orderStatus, lastItemOrderId, numberOfItems) => {
    try {
      const res = await getOrderList(getLangCode(props.locale), orderStatus, lastItemOrderId, numberOfItems);
      if (!isEmpty(res.data)) {
        return res.data;
      }
    } catch (e) {
      throw e;
    }
  };

  const refreshOrderRecords = async (orderStatus, numberOfItems, scrollTop = 0) => {
    setLoadingData(true);
    setData(undefined);
    setPagination(undefined);
    let response = await fetchData(orderStatus, null, numberOfItems);
    setData(response.data.orders);
    setPagination(response.pagination);
    setScrollTop(scrollTop);
    setLoadingData(false);
  };

  const loadMoreOrderRecords = async (lastItem) => {
    let lastItemId = lastItem ? lastItem.order_id : undefined;
    let response = await fetchData(orderStatus, lastItemId);
    if (data) {
      setData([...data, ...response.data.orders]);
    } else {
      setData(response.data.orders);
    }
    setPagination(response.pagination);
  };

  const handleOrderStatusChange = (newStatus) => {
    refreshOrderRecords(newStatus);
    setOrderStatus(newStatus);
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

  const goToOrderDetail = (order) => {
    props.history.push(routes.ORDER_DETAILS.replace(':orderId', order.order_id));
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
               showLoading={loadingData}
               hasMore={pagination?.hasMore}
               onLoadMore={loadMoreOrderRecords}
               scrollTop={scrollTop}
               onScroll={handleListScroll}
               renderItem={(item) => (
                 <Card hoverable onClick={() => goToOrderDetail(item)}>
                   <Row>
                     <Col span={10}>
                       <InfoGroup className="supplier-name" labelID="IDS_SUPPLIER"
                                  noColon={true}>{item.name}</InfoGroup>
                     </Col>
                     <Col span={1}/>
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
                             <FormattedMessage
                               id={item.total_order_number > 1 ? 'IDS_ORDERED_ITEMS' : 'IDS_ORDERED_ITEM'}
                               values={{value: item.total_order_number}}
                             />
                           </Text>
                         </Tag>
                       </div>
                     </Col>
                   </Row>
                 </Card>
               )}/>
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
                    <FormattedMessage id="IDS_ORDER_RECORD"/>
                  </Title>
                </div>
              </div>
              <Row className="status-filter-container">
                <Col span={24}>
                  <Radio.Group buttonStyle="solid" value={orderStatus}
                               onChange={(event) => handleOrderStatusChange(event.target.value)}>
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

export default connect(
  (state) => ({
    locale: state.system.locale
  }),
  {})
(withRouter(OrderRecord));
