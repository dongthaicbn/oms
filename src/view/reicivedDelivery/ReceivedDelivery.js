import React, { useEffect, useState } from 'react';
import { usePageCache } from 'components/hook/AppHook';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Card, Col, Row, Space, Tag, Radio, Typography, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { isEmpty, getLangCode, getOrderStatus } from 'utils/helpers/helpers';
import { formatDate } from 'utils/helpers/helpers';
import { routes, STATUS_ALL, STATUS_DAMAGED, STATUS_PENDING, STATUS_RECEIVED, ORDER_ID_TYPE, ORDER_NO_TYPE } from 'utils/constants/constants';
import * as icons from 'assets';
import { ReactComponent as SearchIcon } from 'assets/icons/ic_search_black.svg';
import AppList from 'components/list/AppList';
import InfoGroup from 'components/infoGroup/InfoGroup';
import StatusTag from 'components/statusTag/StatusTag';
import Layout from 'components/layout/Layout';
import AppInput from 'components/input/AppInput';
import AppModal from 'components/modal/AppModal';
import QRScannerModal from 'components/modal/QRScannerModal';
import { actionSnackBar } from 'view/system/systemAction';
import { getReceivedDeliveryList, searchReceivedDelivery, getReceivedDeliveryStatusCount } from './ReceivedDeliveryService';
import './ReceivedDelivery.scss';

const {Title, Paragraph, Text} = Typography;

const PAGE_CACHE_KEY = 'ReceivedDelivery';

const ReceivedDelivery = (props) => {
  const [isUseCache, getPageCacheData, updatePageCacheData] = usePageCache(PAGE_CACHE_KEY, props);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [totalStatusItems, setTotalStatusItems] = useState({
    all_count: undefined,
    pending_count: undefined,
    received_count: undefined,
    damaged_count: undefined
  });
  const [data, setData] = useState();
  const [loadingData, setLoadingData] = useState();
  const [pagination, setPagination] = useState();
  const [scrollTop, setScrollTop] = useState(0);
  const [searchTimer, setSearchTimer] = useState();
  const [searchKeyword, setSearchKeyword] = useState();
  const [qrScannerModalVisible, setQRScannerModalVisible] = useState();
  const [redirectModalMeta, setRedirectModalMeta] = useState({
    visible: false,
    url: undefined
  });

  useEffect(() => {
    updatePageCacheData('status', currentStatus)
  }, [currentStatus]);

  useEffect(() => {
    updatePageCacheData('searchKeyword', searchKeyword)
  }, [searchKeyword]);

  useEffect(() => {
    updatePageCacheData('numberOfOrders', data?.length || undefined);
  }, [data]);

  const handleListScroll = (scrollTop) => {
    updatePageCacheData('scrollTop', scrollTop)
  };

  useEffect(() => {
    let numberOfOrders;
    let searchKeyword;
    let scrollTop;
    let status = 0;
    if (isUseCache) {
      let cacheData = getPageCacheData();
      numberOfOrders = cacheData.numberOfOrders;
      searchKeyword = cacheData.searchKeyword;
      scrollTop = cacheData.scrollTop;
      status = cacheData.status;
      setCurrentStatus(cacheData.status);
      setSearchKeyword(searchKeyword);
    }
    refreshTotalItemStatusCount();
    refreshReceivedDelivery(status, searchKeyword, false, numberOfOrders, scrollTop);
  }, []);

  const fetchData = async (orderStatus, lastItemOrderId, numberOfItems) => {
    try {
      const res = await getReceivedDeliveryList(getLangCode(props.locale), orderStatus, lastItemOrderId, numberOfItems);
      if (!isEmpty(res.data)) {
        return res.data;
      }
    } catch (e) {
      throw e;
    }
  };

  const fetchSearchData = async (orderStatus, orderNo, lastItemOrderId, numberOfItems) => {
    try {
      const res = await searchReceivedDelivery(getLangCode(props.locale), orderNo, orderStatus, lastItemOrderId, numberOfItems);
      if (!isEmpty(res.data)) {
        return res.data;
      }
    } catch (e) {
      throw e;
    }
  };

  const fetchStatusCount = async () => {
    try {
      const res = await getReceivedDeliveryStatusCount();
      if (!isEmpty(res.data)) {
        return res.data;
      }
    } catch (e) {
      throw e;
    }
  };

  const refreshTotalItemStatusCount = async () => {
    let response = await fetchStatusCount();
    setTotalStatusItems(response.data);
  };

  const refreshReceivedDelivery = async (status, searchKeyword, sortRefresh, numberOfItems, scrollTop = 0) => {
    if (!sortRefresh) {
      setData(undefined);
      setPagination(undefined);
    }
    setLoadingData(true);
    let response;
    if (searchKeyword) {
      response = await fetchSearchData(status, searchKeyword, numberOfItems);
    } else {
      response = await fetchData(status, null, numberOfItems);
    }
    setData(response.data.orders);
    setPagination(response.pagination);
    setScrollTop(scrollTop);
    setLoadingData(false);
  };

  const loadMoreReceivedDelivery = async (lastItem) => {
    let lastItemId = lastItem? lastItem.order_id : undefined;
    let response;
    if (searchKeyword) {
      response = await fetchSearchData(currentStatus, searchKeyword, lastItemId);
    } else {
      response = await fetchData(currentStatus, lastItemId);
    }
    initOrders([...data, ...response.data.orders]);
    setPagination(response.pagination);
  };

  const handleStatusChange = (newStatus) => {
    refreshReceivedDelivery(newStatus, searchKeyword);
    setCurrentStatus(newStatus);
  };

  const initOrders = (orders) => {
    setData(orders);
  };

  const handleSearch = async (event) => {
    let searchKeyword = event.target.value;
    setSearchKeyword(searchKeyword);
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    let newSearchTimer = setTimeout(() => {
      refreshReceivedDelivery(currentStatus, searchKeyword, true);
      setSearchTimer(undefined);
    }, 300);
    setSearchTimer(newSearchTimer);
  };

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
          <FormattedMessage id="IDS_RECEIVE"/>
        </Button>;

      case STATUS_RECEIVED:
      case STATUS_DAMAGED:
        return <Button>
          <FormattedMessage id="IDS_VIEW_UPDATE"/>
        </Button>;
    }
  };

  const handleQrCodeScanError = (err) => {
    props.actionSnackBar({
      open: true,
      type: 'error',
      messageID: 'IDS_SCAN_QR_CODE_ERROR',
      messageParams: {
        message: err.message
      }
    });
  };

  const handleQrCodeScanSuccess = (content) => {
    if (content) {
      setQRScannerModalVisible(false);
      setRedirectModalMeta({
        visible: true,
        url: content
      });
    }
  };

  const goToSannedOrderByQR = (orderNo) => {
    if (orderNo) {
      props.history.push(`${routes.RECEIVED_DELIVERY_DETAIL.replace(':orderCode', orderNo)}?type=${ORDER_NO_TYPE}`);
    }
    return true;
  };

  const getItemActionLink = (item) => {
    return `${routes.RECEIVED_DELIVERY_DETAIL.replace(':orderCode', item.order_id)}?type=${ORDER_ID_TYPE}`;
  };

  const renderListItems = (items) => {
    let message;
    if (items && isEmpty(items)) {
      let messageID;
      if (searchKeyword) {
        messageID = "IDS_NO_RESULT_FOUND";
      } else {
        messageID = "IDS_NO_DELIVERY_YET";
      }
      message = (
        <div className="message-container">
          <Text className="message">
            <FormattedMessage id={messageID}/>
          </Text>
        </div>
      );
    }
    return <>
      {message}
      <AppList dataSource={data}
               showLoading={loadingData}
               hasMore={pagination?.hasMore}
               onLoadMore={loadMoreReceivedDelivery}
               scrollTop={scrollTop}
               onScroll={handleListScroll}
               renderItem={(item) => (
                 <Link to={getItemActionLink(item)}>
                   <Card hoverable>
                     <Row>
                       <Col span={10}>
                         <InfoGroup className="supplier-name" labelID="IDS_SUPPLIER" noColon={true}>
                           {item.name}
                         </InfoGroup>
                       </Col>
                       <Col span={1}/>
                       <Col span={9}>
                         {renderDeliveryInfo(item)}
                       </Col>
                       <Col span={4}>
                         <div className="order-status-info">
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
               )}/>
    </>
  };
  return (
    <div className="received-delivery-container">
      <Layout emptyDrawer={true}>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container">
                <div className="page-title">
                  <Title level={3}>
                    <FormattedMessage id="IDS_RECEIVE_DELIVERY"/>
                  </Title>
                </div>
                <FormattedMessage id="IDS_SEARCH">
                  {
                    placeholder => (
                      <AppInput placeholder={placeholder} prefix={<SearchIcon/>}
                                value={searchKeyword} onChange={handleSearch}/>
                    )
                  }
                </FormattedMessage>
              </div>
              <Row className="status-filter-container">
                <Col span={24}>
                  <Radio.Group buttonStyle="solid" value={currentStatus}
                               onChange={(e) => handleStatusChange(e.target.value)}>
                    <Space size={24}>
                      <Radio.Button value={0}>
                        <FormattedMessage id="IDS_ALL"/>
                        {totalStatusItems.all_count >= 0 ? ' (' + totalStatusItems.all_count + ')' : ''}
                      </Radio.Button>
                      <Radio.Button value={1}>
                        <FormattedMessage id="IDS_PENDING"/>
                        {totalStatusItems.pending_count >= 0 ? ' (' + totalStatusItems.pending_count + ')' : ''}
                      </Radio.Button>
                      <Radio.Button value={2}>
                        <FormattedMessage id="IDS_RECEIVED"/>
                        {totalStatusItems.received_count >= 0 ? ' (' + totalStatusItems.received_count + ')' : ''}
                      </Radio.Button>
                      <Radio.Button value={3}>
                        <FormattedMessage id="IDS_DAMAGED_ORDER"/>
                        {totalStatusItems.damaged_count >= 0 ? ' (' + totalStatusItems.damaged_count + ')' : ''}
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
              <Button type="primary" onClick={() => setQRScannerModalVisible(true)}>
                <FormattedMessage id="IDS_SCAN_QR_CODE_BARCODE"/>
              </Button>
            </div>
          </div>
        </div>
        <AppModal visible={redirectModalMeta.visible} titleID="IDS_CONFIRM_REDIRECT"
                  onVisibleChange={(visible) => setRedirectModalMeta({...redirectModalMeta, visible: false})}
                  showBackButton={false} closable={false}
                  onOk={() => goToSannedOrderByQR(redirectModalMeta.url)}>
          {redirectModalMeta.url}
        </AppModal>
        {
          qrScannerModalVisible && <QRScannerModal onVisibleChange={(visible) => setQRScannerModalVisible(visible)}
                                                   showBackButton={false} onError={handleQrCodeScanError}
                                                   onSuccess={handleQrCodeScanSuccess}/>
        }
      </Layout>
    </div>
  );
};

export default connect((state) => ({
  locale: state.system.locale,
}), { actionSnackBar })
(withRouter(ReceivedDelivery));