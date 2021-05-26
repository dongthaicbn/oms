import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { Typography, Divider, Button, Tag } from 'antd';
import CircularProgress from '@material-ui/core/CircularProgress';
import Layout from 'components/layout/Layout';
import RoundImage from 'components/image/RoundImage';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppTable from 'components/table/AppTable';
import NumberEditPopup from 'components/input/NumberEditPopup';
import { formatDate, getLangCode, isEmpty } from 'utils/helpers/helpers';
import { routes } from 'utils/constants/constants';
import * as icons from 'assets';
import { ReactComponent as FilterIcon } from 'assets/icons/ic_filter.svg';
import FilterModal from '../components/FilterModal';
import AppModal from 'components/modal/AppModal';
import { actionSnackBar } from 'view/system/systemAction';
import {
  getOrderCategoriesDetail,
  saveOrder,
} from '../../orderForm/OrderFormActions';
import './CategoryOrderDetail.scss';

const { Title, Paragraph } = Typography;

const renderDayColumn = (weekday, date) => (
  <div>
    <div>{formatDate(date, 'DD/MM')}</div>
    <div>
      (<FormattedMessage id={`IDS_${weekday.toUpperCase()}`} />)
    </div>
  </div>
);

const renderItemQuantity = (item, dayName, actionProvider) => {
  let dayDetail = item.day_detail_map[dayName];
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
        minValue={dayDetail.minimum_range > 0 ? dayDetail.minimum_range : 0}
        maxValue={dayDetail.maximum_range > 0 ? dayDetail.maximum_range : 999}
        onCancel={() =>
          actionProvider.onItemQuantityChanged(
            dayName,
            item.code,
            dayDetail.prefill_value
          )
        }
        onPopupCancel={(originValue) =>
          actionProvider.onItemQuantityChanged(dayName, item.code, originValue)
        }
        onValueChanged={(newValue) =>
          actionProvider.onItemQuantityChanged(dayName, item.code, newValue)
        }
      >
        {button}
      </NumberEditPopup>
    );
  }
  return <div className="app-button quantity-button">{content}</div>;
};

const itemsColumn = {
  title: <FormattedMessage id="IDS_ITEMS" />,
  render: (item) => (
    <div className="app-flex-container items-info-cell">
      <RoundImage src={item.image} alt="Item Image" />
      <InfoGroup
        label={
          <>
            {item.code}
            <Divider type="vertical" />
            <FormattedMessage id="IDS_UNIT" values={{ value: item.unit }} />
          </>
        }
        noColon={true}
      >
        {item.name} {item.pack_weight}
      </InfoGroup>
    </div>
  ),
};

const weekdayColumn = (weekday, date) => ({
  title: renderDayColumn(weekday, date),
  key: weekday,
  align: 'center',
  width: '66px',
  render: (item, actionProvider) =>
    renderItemQuantity(item, weekday, actionProvider),
});

const defaultTableColumns = [itemsColumn];
let mainSuppliers = [];

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
  let [filterValue, setFilterValue] = useState({});
  let [tableColumns, setTableColumns] = useState(defaultTableColumns);

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
            product_id: item.id,
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

  const initTableColumns = (weekdayInfos) => {
    let newTableColumns = [itemsColumn];
    weekdayInfos.forEach((weekdayInfo) => {
      newTableColumns.push(
        weekdayColumn(weekdayInfo.weekday, weekdayInfo.date)
      );
    });
    setTableColumns(newTableColumns);
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
          <div className="total-cost-container">
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
        mainSuppliers = [...data.data.suppliers];
        initData(data.data.suppliers, mapFormData);
        initTableColumns(data.data.weekdays);
        setData(data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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

  const submitForm = async () => {
    setSaveProgressVisible(true);
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
            order_qty: dayItems[itemId].order_qty || 0,
          };
        }),
      });
    });
    try {
      const { data } = await saveOrder(submitData);
      if (data.result.status === 200) {
        props.actionSnackBar({
          open: true,
          type: 'success',
          messageID: 'IDS_TODAY_ORDER_FORM_CREATED',
        });
        props.history.push(routes.ORDER_FORM);
      }
    } catch (error) {}
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
  const checkFilled = (day_detail, filledVal) => {
    // filledVal: 0 => filled, 1 - not filled
    let temp = day_detail.find((v) => v.prefill_value > 0);
    return filledVal === 0 ? Boolean(temp) : !Boolean(temp);
  };
  const handleFilter = (values) => {
    setFilterValue(values);
    let result = [];

    if (!isEmpty(values.filled)) {
      if (!isEmpty(values.items)) {
        if (!isEmpty(values.suppliers)) {
          values.suppliers.forEach((supplierItem) => {
            result.push({
              ...supplierItem,
              items: supplierItem.items.filter(
                (elm) =>
                  values.items.find((el) => el.name === elm.name) &&
                  checkFilled(elm.day_detail, values.filled)
              ),
            });
          });
        } else {
          mainSuppliers.forEach((supplierItem) => {
            let tempItems = supplierItem.items.filter(
              (elm) =>
                values.items.find((el) => el.name === elm.name) &&
                checkFilled(elm.day_detail, values.filled)
            );
            if (!isEmpty(tempItems))
              result.push({ ...supplierItem, items: tempItems });
          });
        }
      } else {
        if (!isEmpty(values.suppliers)) {
          values.suppliers.forEach((supplierItem) => {
            result.push({
              ...supplierItem,
              items: supplierItem.items.filter((elm) =>
                checkFilled(elm.day_detail, values.filled)
              ),
            });
          });
        } else {
          mainSuppliers.forEach((supplierItem) => {
            result.push({
              ...supplierItem,
              items: supplierItem.items.filter((elm) =>
                checkFilled(elm.day_detail, values.filled)
              ),
            });
          });
        }
      }
    } else {
      if (!isEmpty(values.items)) {
        if (!isEmpty(values.suppliers)) {
          values.suppliers.forEach((supplierItem) => {
            result.push({
              ...supplierItem,
              items: supplierItem.items.filter((elm) =>
                values.items.find((el) => el.name === elm.name)
              ),
            });
          });
        } else {
          mainSuppliers.forEach((supplierItem) => {
            let tempItems = supplierItem.items.filter((elm) =>
              values.items.find((el) => el.name === elm.name)
            );
            if (!isEmpty(tempItems))
              result.push({ ...supplierItem, items: tempItems });
          });
        }
      } else {
        if (!isEmpty(values.suppliers)) {
          result = [...values.suppliers];
        } else {
          result = [...mainSuppliers];
        }
      }
    }
    setData({ ...data, suppliers: result });
  };
  return (
    <div className="category-order-detail-container">
      <Layout>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container app-button">
                <div className="page-title">
                  <Title level={3}>{data.category?.name}</Title>
                </div>
                <Button
                  className={`${
                    !isEmpty(filterValue.suppliers) ||
                    !isEmpty(filterValue.items) ||
                    !isEmpty(filterValue.filled)
                      ? 'active-btn'
                      : ''
                  }`}
                  icon={<FilterIcon />}
                  onClick={() => setFilterModalVisible(true)}
                >
                  <FormattedMessage id="IDS_FILTER" />
                </Button>
              </div>
            </div>
            <div className="body-group">
              <AppTable
                columns={tableColumns}
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
            </div>
            <div className="footer-group app-button">
              <Button className="back-button" onClick={prepareGoBack}>
                <FormattedMessage id="IDS_BACK" />
              </Button>
              <Button
                type="primary"
                className="save-button"
                onClick={prepareSubmitForm}
              >
                <FormattedMessage id="IDS_SAVE" />
              </Button>
            </div>
          </div>
        </div>
        <FilterModal
          visible={filterModalVisible}
          handleClose={() => setFilterModalVisible(false)}
          suppliers={(mainSuppliers || []).map((v) => {
            if (v) return { ...v, id: v.supplier_id };
            return v;
          })}
          filterValue={filterValue}
          handleFilter={handleFilter}
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
    </div>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
    account: state.system.account,
  }),
  { actionSnackBar }
)(withRouter(CategoryOrderDetail));
