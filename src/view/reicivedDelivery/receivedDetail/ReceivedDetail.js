import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button, Divider, Typography } from 'antd';
import { isEmpty } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import AppTable from 'components/table/AppTable';
import InfoGroup from 'components/infoGroup/InfoGroup';
import NumberEditPopup from 'components/input/NumberEditPopup';
import { getReceivedDeliveryDetail } from './ReceivedDetailService';
import './ReceivedDetail.scss';
import RoundImage from '../../../components/image/RoundImage';
import AppModal from "../../../components/modal/AppModal";
import CircularProgress from "@material-ui/core/CircularProgress";
import { actionSnackBar } from 'view/system/systemAction';
import { routes } from "../../../utils/constants/constants";

const { Title, Text } = Typography;

const item = {
  order: {
    name: 'Supplier Name A',
    order_no: 270865064
  },
  reports: [
    {
      report_id: 1,
      reason_type: 1,
      other_reason: 'custom reason',
      items: [
        {
          id: 1,
          code: 'FB0001-02',
          unit: 'KG',
          name: 'Grass carp',
          pack_weight: '~4.25'
        }
      ],
      photos: [
        {
          position: 1,
          file_url: 'https://imageURL.com'
        }
      ]
    }
  ],
  items: [
    {
      id: 1,
      code: 'FB0001-01',
      unit: 'KG',
      name: 'Grass carp',
      pack_weight: '~4.25',
      actual_weight: '',
      ordered_qty: 12,
      received_qty: 0
    },
    {
      id: 2,
      code: 'FB0001-02',
      unit: 'KG',
      name: 'Shrimp',
      pack_weight: '~7.25',
      actual_weight: 16,
      ordered_qty: 5,
      received_qty: 0
    },
    {
      id: 3,
      code: 'FB0001-03',
      unit: 'KG',
      name: 'Tuna 1',
      pack_weight: '~10.25',
      actual_weight: 20,
      ordered_qty: 5,
      received_qty: 2
    },
    {
      id: 4,
      code: 'FB0001-04',
      unit: 'KG',
      name: 'Tuna 2',
      pack_weight: '~10.25',
      actual_weight: 20,
      ordered_qty: 10,
      received_qty: 0
    },
    {
      id: 5,
      code: 'FB0001-05',
      unit: 'KG',
      name: 'Tuna 3',
      pack_weight: '~10.25',
      actual_weight: '',
      ordered_qty: 2,
      received_qty: 0
    },
    {
      id: 6,
      code: 'FB0001-06',
      unit: 'KG',
      name: 'Tuna 4',
      pack_weight: '~10.25',
      actual_weight: 20,
      ordered_qty: 7,
      received_qty: 0
    },
    {
      id: 7,
      code: 'FB0001-07',
      unit: 'KG',
      name: 'Tuna 5',
      pack_weight: '~10.25',
      actual_weight: '',
      ordered_qty: 5,
      received_qty: 1
    },
    {
      id: 8,
      code: 'FB0001-08',
      unit: 'KG',
      name: 'Tuna 6',
      pack_weight: '~10.25',
      actual_weight: 20,
      ordered_qty: 10,
      received_qty: 3
    },
    {
      id: 9,
      code: 'FB0001-09',
      unit: 'KG',
      name: 'Tuna 7',
      pack_weight: '~10.25',
      actual_weight: 20,
      ordered_qty: 2,
      received_qty: 0
    }
  ]
};

const itemColumns = [
  {
    title: <FormattedMessage id="IDS_ITEMS"/>,
    render: (item) => (
      <div className="app-flex-container items-info-cell">
        <RoundImage src={item.image} alt="Item Image"/>
        <div>
          <InfoGroup
            label={
              <>
                <Text>{item.code}</Text>
                <Divider type="vertical"/>
                <FormattedMessage id="IDS_UNIT"/>
                :&nbsp;
                <Text>{item.unit}</Text>
              </>
            }
            noColon={true}
          >
            {item.name}&nbsp;
            <FormattedMessage id="IDS_WEIGHT_PER_PACKS" values={{weight: item.pack_weight}}/>
          </InfoGroup>
        </div>
      </div>
    )
  },
  {
    title: <FormattedMessage id="IDS_ACTUAL_QUANTITY"/>,
    key: 'actualQuantity',
    width: 110,
    align: 'center',
    render: (item, actionProviders) => {
      if (item.actual_weight) {
        let value = actionProviders.getItemById(item.id)?.actual_weight?.editValue;
        return (
          <div className="app-button quantity-button actual-quantity">
            <NumberEditPopup value={value} minValue={0} maxValue={99999} maxFractionalDigits={2}
                             onCancel={() => actionProviders.updateItemActualWeight(item.id, item.actual_weight)}
                             onPopupCancel={(originValue) => actionProviders.updateItemActualWeight(item.id, originValue)}
                             onValueChanged={(newValue) => actionProviders.updateItemActualWeight(item.id, newValue)}>
              <Button>
                {value || 0}
              </Button>
            </NumberEditPopup>
          </div>
        );
      }
    },
  },
  {
    title: <FormattedMessage id="IDS_RECEIVED_QUANTITY"/>,
    key: 'receivedQuantity',
    width: 120,
    align: 'center',
    render: (item, actionProviders) => {
      let value = actionProviders.getItemById(item.id)?.received_qty?.editValue;
      return (
        <div className="app-button quantity-button received-quantity">
          <NumberEditPopup value={value} minValue={0} maxValue={99999} disableFractional={true}
                           onCancel={() => actionProviders.updateItemReceivedQty(item.id, item.received_qty)}
                           onPopupCancel={(originValue) => actionProviders.updateItemReceivedQty(item.id, originValue)}
                           onValueChanged={(newValue) => actionProviders.updateItemReceivedQty(item.id, newValue)}>
            <Button>
              {value || 0}
            </Button>
          </NumberEditPopup>
        </div>
      );
    },
  }
];

const ReceivedDetail = (props) => {
  const { orderNo } = props.match.params;
  const [data, setData] = useState([]);
  const [mapItems, setMapItems] = useState({});
  const [receivedDeliveryModalVisible, setReceivedDeliveryModalVisible] = useState(false);

  const fetchData = async (orderStatus) => {
    try {
      const res = await getReceivedDeliveryDetail(props.locale, orderStatus);
      if (!isEmpty(res.data)) {
        setData(res.data.data);
      }
    } catch (e) {
    }
  };

  const initMapItems = (items) => {
    let result = {};
    items.forEach(item => result[item.id] = {
      id: item.id,
      actual_weight: {
        originValue: item.actual_weight,
        editValue: item.actual_weight
      },
      received_qty: {
        originValue: item.received_qty,
        editValue: item.received_qty
      },
    });
    setMapItems(result);
  };

  const getItemById = (itemId) => {
    return mapItems[itemId];
  };

  const updateItemActualWeight = (itemId, newWeight) => {
    let item = mapItems[itemId];
    if (item) {
      item.actual_weight.editValue = newWeight;
      setMapItems({...mapItems});
    }
  };

  const updateItemReceivedQty = (itemId, newQty) => {
    let item = mapItems[itemId];
    if (item) {
      item.received_qty.editValue = newQty;
      setMapItems({...mapItems});
    }
  };

  useEffect(() => {
    // fetchData(orderNo)
    setData(item);
    initMapItems(item.items);
  }, []);

  const receiveDelivery = () => {
    setReceivedDeliveryModalVisible(true);
    setTimeout(() => {
      setReceivedDeliveryModalVisible(false);
      props.actionSnackBar({
        open: true,
        type: 'success',
        messageID: 'IDS_RECEIVED_DELIVERY_SUCCESSFULLY',
        messageParams: {
          orderNo: orderNo
        }
      });
      goBack();
    }, 3000);
  }

  const goBack = () => {
    props.history.push(routes.RECEIVED_DELIVERY);
  }

  return (
    <div className="received-detail-container">
      <Layout>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container app-button">
                <div className="page-title">
                  <Title level={3}>
                    <FormattedMessage id="IDS_SELECTED_ITEM_LIST"/>
                  </Title>
                  <Text>
                    <FormattedMessage id="IDS_ORDER"/>: {data.order?.order_no}
                  </Text>
                </div>
                <Button type="primary">
                  <FormattedMessage id="IDS_REPORT_DAMAGE"/>
                </Button>
              </div>
            </div>
            <div className="body-group">
              <AppTable columns={itemColumns}
                        dataSource={data.items}
                        actionProviders={{
                          getItemById: getItemById,
                          updateItemActualWeight: updateItemActualWeight,
                          updateItemReceivedQty: updateItemReceivedQty
                        }}/>
            </div>
            <div className="footer-group app-button">
              <Button className="back-button">
                <FormattedMessage id="IDS_BACK"/>
              </Button>
              <Button type="primary" className="received-delivery-button"
                      onClick={receiveDelivery}>
                <FormattedMessage id="IDS_RECEIVED_DELIVERY"/>
              </Button>
            </div>
          </div>
        </div>
        <AppModal visible={receivedDeliveryModalVisible} titleID="IDS_RECEIVED_DELIVERY"
                  hideOkButton={true} hideCancelButton={true}
                  onVisibleChange={(visible) => setReceivedDeliveryModalVisible(visible)}>
          <div className="modal-progress-container">
            <CircularProgress/>
          </div>
        </AppModal>
      </Layout>
    </div>
  );
};

export default connect((state) => ({
  locale: state.system.locale,
}), {actionSnackBar})
(withRouter(ReceivedDetail));