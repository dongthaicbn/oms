import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Typography, Divider, Button, Tag, Progress } from 'antd';
import CircularProgress from '@material-ui/core/CircularProgress';
import Layout from 'components/layout/Layout';
import IconButton from 'components/button/IconButton';
import RoundImage from 'components/image/RoundImage';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppTable from 'components/table/AppTable';
import NumberEditPopup from 'components/input/NumberEditPopup';
import { formatDate, getLangCode, isEmpty } from 'utils/helpers/helpers';
import { routes } from 'utils/constants/constants';
import * as icons from 'assets';
import { ReactComponent as FilterIcon } from 'assets/icons/ic_filter.svg';
import './CategoryOrderDetail.scss';
import FilterModal from '../components/FilterModal';
import AppModal from 'components/modal/AppModal';
import { actionSnackBar } from 'view/system/systemAction';
import { getOrderCategoriesDetail } from '../../orderForm/OrderFormActions';

const { Title, Text, Paragraph } = Typography;

const renderDayColumn = (columnData, dayName) => (
  <div>
    <div>{formatDate(columnData[dayName]?.date, 'DD/MM')}</div>
    <div>
      (<FormattedMessage id={`IDS_${dayName.toUpperCase()}`} />)
    </div>
  </div>
);

const renderItemQuantity = (item, dayName, actionProvider) => {
  let dayDetail = item.day_detail_map[dayName];
  // let dayDetail = item.day_detail_map[dayName];
  let disabled = !dayDetail || !dayDetail.is_available;
  let content;
  let currentItemQuantity =
    actionProvider.getItemCurrentQuantity(dayName, item.code) || 0;
  let button = <Button disabled={disabled}>{currentItemQuantity}</Button>;
  if (disabled) {
    content = button;
  } else {
    content = (
      <NumberEditPopup
        value={currentItemQuantity}
        minValue={0}
        onPopupCancel={() =>
          actionProvider.onItemQuantityChanged(
            dayName,
            item.code,
            dayDetail.prefill_value
          )
        }
        onCancel={() =>
          actionProvider.onItemQuantityChanged(
            dayName,
            item.code,
            dayDetail.prefill_value
          )
        }
        onValueChanged={(valueChanged) =>
          actionProvider.onItemQuantityChanged(
            dayName,
            item.code,
            currentItemQuantity + valueChanged
          )
        }
      >
        {button}
      </NumberEditPopup>
    );
  }
  return (
    <div className="app-button order-detail-item-quantity-button">
      {content}
    </div>
  );
};

const itemColumns = [
  {
    title: <FormattedMessage id="IDS_ITEMS" />,
    render: (item) => (
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
            {item.name}&nbsp;
            <FormattedMessage
              id="IDS_WEIGHT_PER_PACKS"
              values={{ weight: item.pack_weight }}
            />
          </InfoGroup>
        </div>
      </div>
    ),
  },
  {
    title: (columnData) => renderDayColumn(columnData, 'mon'),
    align: 'center',
    width: '66px',
    render: (item, actionProvider) =>
      renderItemQuantity(item, 'mon', actionProvider),
  },
  {
    title: (columnData) => renderDayColumn(columnData, 'tue'),
    align: 'center',
    width: '66px',
    render: (item, actionProvider) =>
      renderItemQuantity(item, 'tue', actionProvider),
  },
  {
    title: (columnData) => renderDayColumn(columnData, 'wed'),
    align: 'center',
    width: '66px',
    render: (item, actionProvider) =>
      renderItemQuantity(item, 'wed', actionProvider),
  },
  {
    title: (columnData) => renderDayColumn(columnData, 'thu'),
    align: 'center',
    width: '66px',
    render: (item, actionProvider) =>
      renderItemQuantity(item, 'thu', actionProvider),
  },
  {
    title: (columnData) => renderDayColumn(columnData, 'fri'),
    align: 'center',
    width: '66px',
    render: (item, actionProvider) =>
      renderItemQuantity(item, 'fri', actionProvider),
  },
  {
    title: (columnData) => renderDayColumn(columnData, 'sat'),
    key: 'sat',
    align: 'center',
    width: '66px',
    render: (item, actionProvider) =>
      renderItemQuantity(item, 'sat', actionProvider),
  },
  {
    title: (columnData) => renderDayColumn(columnData, 'sun'),
    key: 'sun',
    align: 'center',
    width: '66px',
    render: (item, actionProvider) =>
      renderItemQuantity(item, 'sun', actionProvider),
  },
];

const CategoryOrderDetail = (props) => {
  const { locale } = props;
  const { id } = props.match.params;
  const paramsUrl = queryString.parse(props.location.search);

  let [data, setData] = useState({});
  let [mapFormData, setMapFormData] = useState({});
  let [editItems, setEditItems] = useState({});
  let [filterModalVisible, setFilterModalVisible] = useState(false);
  let [confirmLeaveModalVisible, setConfirmLeaveModalVisible] = useState(false);
  let [confirmSaveModalVisible, setConfirmSaveModalVisible] = useState(false);
  let [saveProgressVisible, setSaveProgressVisible] = useState(false);

  const initData = (suppliers, mapFormData) => {
    suppliers.forEach((supplier) => {
      supplier.items.forEach((item) => {
        item.supplier_id = supplier.supplier_id;
        item.day_detail_map = item.day_detail.reduce((map, day) => {
          if (!mapFormData[day.weekday]) {
            mapFormData[day.weekday] = {
              date: day.date,
              items: {},
            };
          }
          mapFormData[day.weekday].items[item.code] = {
            supplier_id: supplier.supplier_id,
            product_id: item.code,
            order_qty: day.prefill_value,
            min_order_qty: day.minimum_range,
            max_order_qty: day.maximum_range,
            origin_order_qty: day.prefill_value,
          };
          return {
            ...map,
            [day.weekday]: day,
          };
        }, {});
      });
    });
  };

  const createGroupExpandable = () => {
    return {
      expandable: (item) => !isEmpty(editItems[item.supplier_id]?.errorItems),
      render: (item) => (
        <Paragraph>
          <img src={icons.ic_warning_white} alt="" />
          <FormattedMessage
            id="IDS_SHIPPING_WARNING"
            values={{
              value: <b>10 more items</b>,
            }}
          />
        </Paragraph>
      ),
    };
  };

  const createRowExpandable = () => {
    if (paramsUrl.showPrice) {
      return {
        expandable: (item) => true,
        render: (item) => (
          <div className="app-flex-container flex-end order-detail-total-cost-label">
            <Tag>
              <FormattedMessage
                id="IDS_TOTAL_COST_PER_PACKS"
                values={{
                  currency: item.currency,
                  cost: item.cost,
                }}
              />
            </Tag>
          </div>
        ),
      };
    }
  };
  const fetchData = async () => {
    try {
      const { data } = await getOrderCategoriesDetail({
        lang_code: getLangCode(locale),
        is_favorite_category: paramsUrl.type === 'categories' ? 0 : 1,
        id,
      });

      if (!isEmpty(data.data)) {
        initData(data.data.suppliers, mapFormData);
        setData(data.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchData(); // eslint-disable-next-line
  }, [id]);
  useEffect(() => {
    setMapFormData(mapFormData);
  }, []);

  const goBack = () => {
    props.history.push(routes.GOODS_CATEGORIES);
  };

  const prepareGoBack = () => {
    if (isEmpty(editItems)) goBack();
    setConfirmLeaveModalVisible(true);
  };

  const formHasError = () => {
    let categoryIDs = Object.keys(editItems);
    for (const categoryID of categoryIDs) {
      if (!isEmpty(editItems[categoryID]?.errorItems)) {
        return true;
      }
    }
    return false;
  };

  const prepareSubmitForm = () => {
    if (!formHasError()) {
      setConfirmSaveModalVisible(true);
    }
  };

  const submitForm = () => {
    setSaveProgressVisible(true);
    setTimeout(() => {
      let submitData = {
        dates: [],
      };
      Object.keys(mapFormData).forEach((weekDay) => {
        let dayItems = mapFormData[weekDay].items;
        submitData.dates.push({
          date: formatDate(mapFormData[weekDay].date, 'YYYY-MM-DD'),
          items: Object.keys(dayItems).map((itemId) => {
            return {
              product_id: dayItems[itemId].product_id,
              order_qty: dayItems[itemId].order_qty,
            };
          }),
        });
      });
      console.log(submitData);

      props.actionSnackBar({
        open: true,
        type: 'success',
        messageID: 'IDS_TODAY_ORDER_FORM_CREATED',
      });

      props.history.push(routes.ORDER_FORM);
    }, 3000);
    return false;
  };

  const getItemCurrentQuantity = (weekDay, itemCode) => {
    return mapFormData[weekDay]?.items[itemCode]?.order_qty;
  };

  const onItemQuantityChanged = (weekday, itemCode, newValue) => {
    let newMapFormData = { ...mapFormData };
    let item = newMapFormData[weekday].items[itemCode];
    item.order_qty = newValue;
    updateEditItems(weekday, item);
    setMapFormData(newMapFormData);
    return true;
  };

  const updateEditItems = (weekday, item) => {
    let editItemGroup = editItems[item.supplier_id];
    if (item.origin_order_qty === item.order_qty) {
      if (editItemGroup) {
        if (editItemGroup.updateItems[item.product_id]) {
          delete editItemGroup.updateItems[item.product_id][weekday];
          if (isEmpty(editItemGroup.updateItems[item.product_id])) {
            delete editItemGroup.updateItems[item.product_id];
          }
        }

        if (editItemGroup.errorItems[item.product_id]) {
          delete editItemGroup.errorItems[item.product_id][weekday];
          if (isEmpty(editItemGroup.errorItems[item.product_id])) {
            delete editItemGroup.errorItems[item.product_id];
          }
        }

        if (
          isEmpty(editItemGroup.errorItems) &&
          isEmpty(editItemGroup.updateItems)
        ) {
          delete editItems[item.supplier_id];
        }

        setEditItems(editItems);
      }
    } else {
      if (!editItemGroup) {
        editItemGroup = {
          updateItems: {},
          errorItems: {},
        };
        editItems[item.supplier_id] = editItemGroup;
      }
      if (!editItemGroup.errorItems[item.product_id]) {
        editItemGroup.errorItems[item.product_id] = {};
      }
      if (!editItemGroup.updateItems[item.product_id]) {
        editItemGroup.updateItems[item.product_id] = {};
      }
      if (item.order_qty < item.min_order_qty) {
        editItemGroup.errorItems[item.product_id][weekday] = true;
        delete editItemGroup.updateItems[item.product_id][weekday];
        if (isEmpty(editItemGroup.updateItems[item.product_id])) {
          delete editItemGroup.updateItems[item.product_id];
        }
      } else {
        editItemGroup.updateItems[item.product_id][weekday] = true;
        delete editItemGroup.errorItems[item.product_id][weekday];
        if (isEmpty(editItemGroup.errorItems[item.product_id])) {
          delete editItemGroup.errorItems[item.product_id];
        }
      }
      setEditItems(editItems);
    }
  };
  return (
    <Layout>
      <div className="order-detail-container">
        <div className="app-content-container content-container">
          <Row className="order-detail-header">
            <Col span={20}>
              <div className="app-flex-container height-full flex-va-center">
                <Title level={3}>{data.category?.name}</Title>
              </div>
            </Col>
            <Col span={4}>
              <div className="app-flex-container flex-end filter-button-container">
                <IconButton
                  icon={<FilterIcon />}
                  onClick={() => setFilterModalVisible(true)}
                >
                  <FormattedMessage id="IDS_FILTER" />
                </IconButton>
              </div>
            </Col>
          </Row>
          <Row className="order-detail-table">
            <Col span={24}>
              <AppTable
                columns={itemColumns}
                columnDataSource={mapFormData}
                dataSource={data.suppliers}
                itemsKey="items"
                groupKey="supplier_name"
                groupExpandable={createGroupExpandable()}
                rowExpandable={createRowExpandable()}
                groupError={(item) =>
                  !isEmpty(editItems[item.supplier_id]?.errorItems)
                }
                itemError={(item) =>
                  !isEmpty(editItems[item.supplier_id]?.errorItems)
                }
                actionProviders={{
                  onItemQuantityChanged: onItemQuantityChanged,
                  getItemCurrentQuantity: getItemCurrentQuantity,
                }}
              />
            </Col>
          </Row>
        </div>
        <div className="action-container app-button">
          <Button className="action-button back-button" onClick={prepareGoBack}>
            <FormattedMessage id="IDS_BACK" />
          </Button>
          <Button
            type="primary"
            className="action-button"
            style={{ float: 'right' }}
            onClick={() => prepareSubmitForm()}
          >
            <FormattedMessage id="IDS_SAVE" />
          </Button>
        </div>
      </div>
      <FilterModal
        visible={filterModalVisible}
        handleClose={() => setFilterModalVisible(false)}
      />
      <AppModal
        visible={confirmLeaveModalVisible}
        titleID="IDS_LEAVE_THIS_PAGE"
        okTextID="IDS_LEAVE"
        onOk={goBack}
        cancelTextID="IDS_STAY"
        onVisibleChange={(visible) => setConfirmLeaveModalVisible(visible)}
      >
        <FormattedMessage id="IDS_LEAVE_DESCRIPTION" />
      </AppModal>
      <AppModal
        visible={confirmSaveModalVisible}
        titleID="IDS_SAVE_ORDER_ITEM"
        okTextID="IDS_SAVE"
        onOk={submitForm}
        onVisibleChange={(visible) => setConfirmSaveModalVisible(visible)}
      >
        <FormattedMessage id="IDS_ORDER_ITEM_DESCRIPTION" />
        {saveProgressVisible && (
          <div className="modal-progress-container">
            <CircularProgress />
          </div>
        )}
      </AppModal>
    </Layout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
    account: state.system.account,
  }),
  { actionSnackBar }
)(withRouter(CategoryOrderDetail));
