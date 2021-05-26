import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Card, Col, Row, Space, Tag, Radio, Typography, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { isEmpty, getLangCode, getOrderStatus } from 'utils/helpers/helpers';
import { formatDate } from 'utils/helpers/helpers';
import { STATUS_ALL, STATUS_DAMAGED, STATUS_PENDING, STATUS_RECEIVED } from 'utils/constants/constants';
import { routes } from 'utils/constants/constants';
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
import { getReceivedDeliveryList, getReceivedDeliveryStatusCount } from './ReceivedDeliveryService';
import './ReceivedDelivery.scss';

const {Title, Paragraph, Text} = Typography;
const NO_DATA_MESSAGE_ID = "IDS_NO_DELIVERY_YET";
const NO_SEARCH_RESULT_MESSAGE_ID = "IDS_NO_RESULT_FOUND";

const ReceivedDelivery = (props) => {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [totalStatusItems, setTotalStatusItems] = useState({
    all_count: undefined,
    pending_count: undefined,
    received_count: undefined,
    damaged_count: undefined
  });
  const [data, setData] = useState();
  const [originData, setOriginData] = useState([]);
  const [messageID, setMessageID] = useState(NO_DATA_MESSAGE_ID);
  const [searchMode, setSearchMode] = useState(false);
  const [qrScannerModalVisible, setQRScannerModalVisible] = useState();
  const [redirectModalMeta, setRedirectModalMeta] = useState({
    visible: false,
    url: undefined
  });

  const fetchData = async (orderStatus, lastItemOrderId) => {
    try {
      const res = await getReceivedDeliveryList(getLangCode(props.locale), orderStatus, lastItemOrderId);
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

  useEffect(() => {
    fetchStatusCount()
      .then(response => {
        setTotalStatusItems(response.data);
      })
  }, []);

  const initOrders = (orders) => {
    setData(orders);
    setOriginData(orders);
    setMessageID(NO_DATA_MESSAGE_ID);
  };

  const handleSearch = (event) => {
    if (!originData?.length) {
      return;
    }
    let searchText = event.target.value;
    if (searchText) {
      let results = originData.filter((item) => item.order_no?.toString().startsWith(searchText));
      setSearchMode(true);
      setData(results);
      setMessageID(NO_SEARCH_RESULT_MESSAGE_ID);
    } else {
      setSearchMode(false);
      setData(originData);
      setMessageID(NO_DATA_MESSAGE_ID);
    }
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

  const refreshReceivedDelivery = async () => {
    let response = await fetchData(currentStatus);
    setData(response.data.orders);
    return response.pagination.hasMore;
  };

  const loadMoreReceivedDelivery = async (lastItem) => {
    let lastItemId = lastItem? lastItem.order_id : undefined;
    let response = await fetchData(currentStatus, lastItemId);
    initOrders([...data, ...response.data.orders]);
    return response.pagination.hasMore;
  };

  const handleQrCodeScanError = (err) => {
    props.actionSnackBar({
      open: true,
      type: 'error',
      messageID: 'IDS_SCAN_QR_CODE_ERRRO',
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

  const redirectToUrl = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
    return true;
  };

  const renderListItems = (items) => {
    let message;
    if (items && isEmpty(items)) {
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
               disableLoadMore={searchMode}
               refreshOn={currentStatus}
               onRefresh={refreshReceivedDelivery}
               onLoadMore={loadMoreReceivedDelivery}
               renderItem={(item) => (
                 <Link to={routes.RECEIVED_DELIVERY_DETAIL.replace(':orderNo', item.order_no)}>
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
                    <FormattedMessage id="IDS_RECEIVED_DELIVERY"/>
                  </Title>
                </div>
                <FormattedMessage id="IDS_SEARCH_ORDER_NO">
                  {
                    placeholder => (
                      <AppInput placeholder={placeholder} prefix={<SearchIcon/>} onChange={handleSearch}/>
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
                  showBackButton={true} closable={true}
                  onBack={() => setQRScannerModalVisible(true)} onOk={() => redirectToUrl(redirectModalMeta.url)}>
          {redirectModalMeta.url}
        </AppModal>
        {
          qrScannerModalVisible && <QRScannerModal onVisibleChange={(visible) => setQRScannerModalVisible(visible)}
                                                   showBackButton={true} onError={handleQrCodeScanError}
                                                   onSuccess={handleQrCodeScanSuccess}/>
        }
      </Layout>
    </div>
  );
};

export default connect((state) => ({
  locale: state.system.locale,
}))
(withRouter(ReceivedDelivery));