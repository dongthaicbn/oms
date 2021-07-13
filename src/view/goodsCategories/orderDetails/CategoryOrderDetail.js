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

const getItemQuantityMinValue = (dayDetail) => {
  if (dayDetail.is_after_three_months) {
    return 0;
  }
  return dayDetail.minimum_range > 0 ? dayDetail.minimum_range : 0
};

const getItemQuantityMaxValue = (dayDetail) => {
  if (dayDetail.is_after_three_months) {
    return dayDetail.avg_qty + dayDetail.after_three_months_range;
  }
  return dayDetail.maximum_range > 0 ? dayDetail.maximum_range : 999;
};

const getItemQuantityJumpValue = (dayDetail) => {
  return dayDetail.is_after_three_months ? dayDetail.after_three_months_range : 1;
};

const transformItemQuantityNewValue = (dayDetail, currentValue, newValue) => {
  if (dayDetail.is_after_three_months) {
    if (newValue < currentValue) {
      if (newValue < dayDetail.avg_qty - dayDetail.after_three_months_range) {
        return 0;
      }
    } else {
      if (newValue < dayDetail.avg_qty - dayDetail.after_three_months_range) {
        return dayDetail.avg_qty - dayDetail.after_three_months_range;
      }
    }
  }
  return newValue;
};

const renderItemQuantity = (item, weekday, actionProvider) => {
  let dayDetail = item.day_detail[weekday];
  let disabled = !dayDetail || !dayDetail.is_available;
  let content;
  let currentOrderQty = actionProvider.getItemCurrentOrderQty(item._group_index, item._index, weekday) || 0;
  let button = <Button disabled={disabled}>{currentOrderQty}</Button>;
  if (disabled) {
    content = button;
  } else {
    content = (
      <NumberEditPopup
        value={currentOrderQty}
        minValue={getItemQuantityMinValue(dayDetail)}
        maxValue={getItemQuantityMaxValue(dayDetail)}
        jumpValue={getItemQuantityJumpValue(dayDetail)}
        autoAdjustValue={dayDetail.is_after_three_months}
        onCancel={() => {
          if (dayDetail.is_after_three_months) {
            actionProvider.onItemOrderQtyChanged(item._group_index, item._index, weekday, dayDetail.avg_qty, 0);
          } else {
            actionProvider.onItemOrderQtyChanged(item._group_index, item._index, weekday, dayDetail.prefill_value);
          }
        }}
        onPopupCancel={(originValue) =>
          actionProvider.onItemOrderQtyChanged(item._group_index, item._index, weekday, originValue)
        }
        onValueChanged={(newValue) => {
          newValue = transformItemQuantityNewValue(dayDetail, currentOrderQty, newValue);
          actionProvider.onItemOrderQtyChanged(item._group_index, item._index, weekday, newValue);
        }}
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

const initTableColumns = (weekdayInfos) => {
  let newTableColumns = [itemsColumn];
  weekdayInfos.forEach((weekdayInfo) => {
    newTableColumns.push(
      weekdayColumn(weekdayInfo.weekday, weekdayInfo.date)
    );
  });
  return newTableColumns;
};

const defaultTableColumns = [itemsColumn];

const getInitOrderQty = (dayDetail) => {
  if (dayDetail.is_after_three_months) {
    if (dayDetail.prefill_value === 0 ||
      dayDetail.prefill_value === dayDetail.avg_qty - dayDetail.after_three_months_range ||
      dayDetail.prefill_value === dayDetail.avg_qty ||
      dayDetail.prefill_value === dayDetail.avg_qty + dayDetail.after_three_months_range) {
      return dayDetail.prefill_value;
    }
    return 0;
  }
  return dayDetail.prefill_value || 0;
};

const initData = (data) => {
  let supplierTotalOrderQty = [];
  let submitData = [];
  let suppliers = data.suppliers.map(supplier => {
    let submitItems = [];

    let totalOrderQty = 0;
    let items = supplier.items.map(item => {
      let submitDayDetail = {};

      let mapDayDetail = item.day_detail.reduce((result, dayDetail) => {
        result[dayDetail.weekday] = {
          ...dayDetail,
          order_qty: getInitOrderQty(dayDetail)
        };
        submitDayDetail[dayDetail.weekday] = {
          date: dayDetail.date,
          order_qty: result[dayDetail.weekday].order_qty
        };
        totalOrderQty += result[dayDetail.weekday].order_qty;
        return result;
      }, {});

      submitItems.push({
        product_id: item.id,
        day_detail: submitDayDetail
      });

      return {
        ...item,
        day_detail: mapDayDetail
      };
    });

    supplierTotalOrderQty.push(totalOrderQty);

    submitData.push({
      supplier_id: supplier.supplier_id,
      items: submitItems
    });

    return {
      ...supplier,
      items: items
    }
  });
  return [data, suppliers, submitData, supplierTotalOrderQty];
};
let interval = null;
const CategoryOrderDetail = (props) => {
  const { locale } = props;
  const { id } = props.match.params;
  const paramsUrl = queryString.parse(props.location.search);

  let [data, setData] = useState({});
  let [loadingData, setLoadingData] = useState();
  let [tableColumns, setTableColumns] = useState(defaultTableColumns);
  let [suppliers, setSuppliers] = useState([]);
  let [originSuppliers, setOriginSuppliers] = useState([]);
  let [submitData, setSubmitData] = useState([]);
  let [supplierTotalOrderQty, setSupplierTotalOrderQty] = useState([]);
  let [changedData, setChangedData] = useState({});
  let [filterModalVisible, setFilterModalVisible] = useState(false);
  let [confirmLeaveModalVisible, setConfirmLeaveModalVisible] = useState(false);
  let [confirmSaveModalVisible, setConfirmSaveModalVisible] = useState(false);
  let [saveProgressVisible, setSaveProgressVisible] = useState(false);
  let [filterValue, setFilterValue] = useState({});

  const createGroupExpandable = () => {
    return {
      expandable: (item) => !isSupplierValid(item._index),
      render: (item) => {
        let moa = Number(suppliers[item._index].MOA || 0);
        let totalOrderQty = supplierTotalOrderQty[item._index];
        return (
          <Paragraph>
            <img src={icons.ic_warning_white} alt="" />
            <FormattedMessage
              id="IDS_SHIPPING_WARNING"
              values={{
                value: <b>{totalOrderQty - moa} more items</b>,
              }}
            />
          </Paragraph>
        )
      },
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
        )
      };
    }
  };

  const fetchData = async (categoryId, categoryType) => {
    try {
      const { data } = await getOrderCategoriesDetail({
        lang_code: getLangCode(locale),
        is_favorite_category: categoryType === 'categories' ? 0 : 1,
        id: categoryId,
      });

      if (!isEmpty(data.data)) {
        return data.data;
      }
    } catch (e) {
      throw e;
    }
  };

  const refreshData = async () => {
    setLoadingData(true);
    let response = await fetchData(id, paramsUrl.type);
    setTableColumns(initTableColumns(response.weekdays));
    let [newData, newSuppliers, newSubmitData, newSupplierTotalOrderQty] = initData(response);
    setData(newData);
    setSuppliers(newSuppliers);
    setOriginSuppliers(newSuppliers);
    setSubmitData(newSubmitData);
    setSupplierTotalOrderQty(newSupplierTotalOrderQty);
    setLoadingData(false);
  };
  useEffect(() => {
    if (!isEmpty(suppliers) && !isEmpty(paramsUrl.id)) {
      interval = setInterval(() => {
        const el = document.getElementById(paramsUrl.id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" })
          clearInterval(interval)
        }
      }, 100);
    }
  }, [suppliers]);

  useEffect(() => {
    refreshData();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const goBack = () => {
    props.history.goBack();
  };

  const prepareGoBack = () => {
    if (isEmpty(changedData)) {
      goBack();
    } else {
      setConfirmLeaveModalVisible(true);
    }
  };

  const isSupplierValid = (supplierIndex) => {
    return Number(suppliers[supplierIndex].MOA || 0) >= supplierTotalOrderQty[supplierIndex];
  };

  const formHasError = () => {
    for (let i = 0; i < suppliers.length; i++) {
      if (!isSupplierValid(i)) {
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

    let dateMap = {};
    submitData.map(supplier => {
      supplier.items.map(item => {
        Object.keys(item.day_detail)
          .map(weekday => {
            let date;
            if (!dateMap[weekday]) {
              dateMap[weekday] = {
                date: item.day_detail[weekday].date,
                items: []
              };
            }
            date = dateMap[weekday];
            date.items.push({
              product_id: item.product_id,
              order_qty: item.day_detail[weekday].order_qty
            });
          });
      });
    });

    let convertedSubmitData = {
      lang_code: getLangCode(locale),
      dates: Object.keys(dateMap).map(weekday => dateMap[weekday])
    };

    try {
      const { data } = await saveOrder(convertedSubmitData);
      if (data.result.status === 200) {
        props.actionSnackBar({
          open: true,
          type: 'success',
          messageID: data.result.message,
        });
        props.history.push(routes.ORDER_FORM);
      } else {
        props.actionSnackBar({
          open: true,
          type: 'warning',
          message: data.result.message,
        });
      }
    } catch (error) {
    }
    return false;
  };

  const getItemCurrentOrderQty = (supplierIndex, itemIndex, weekday) => {
    return submitData[supplierIndex] ?.items[itemIndex] ?.day_detail[weekday] ?.order_qty;
  };

  const onItemOrderQtyChanged = (supplierIndex, itemIndex, weekday, newOrderQty) => {
    let newSubmitData = [...submitData];
    let dayDetail = newSubmitData[supplierIndex] ?.items[itemIndex] ?.day_detail[weekday];
    if (dayDetail) {
      setSubmitData(newSubmitData);
      updateSupplierTotalOrderQty(supplierIndex, dayDetail.order_qty, newOrderQty);
      updateChangedItems(supplierIndex, itemIndex, weekday, newOrderQty);
      dayDetail.order_qty = newOrderQty;
      setSubmitData(newSubmitData);
    }
    return true;
  };

  const updateChangedItems = (supplierIndex, itemIndex, weekday, newOrderQty) => {
    let newChangedData = { ...changedData };
    let originOrderQty = suppliers[supplierIndex].items[itemIndex].day_detail[weekday].order_qty;

    if (newOrderQty === originOrderQty) {
      if (newChangedData[supplierIndex]) {
        let changedSupplier = newChangedData[supplierIndex];

        if (changedSupplier[itemIndex]) {
          let changedItem = changedSupplier[itemIndex];

          if (changedItem[weekday]) {
            delete changedItem[weekday];

            if (isEmpty(changedItem)) {
              delete changedSupplier[itemIndex];

              if (isEmpty(changedSupplier)) {
                delete newChangedData[supplierIndex];
              }
            }
          }
        }
      }
    } else {
      if (!newChangedData[supplierIndex]) {
        newChangedData[supplierIndex] = {};
      }
      let changedSupplier = newChangedData[supplierIndex];

      if (!changedSupplier[itemIndex]) {
        changedSupplier[itemIndex] = {}
      }

      changedSupplier[itemIndex][weekday] = newOrderQty;
    }
    setChangedData(newChangedData);
  };

  const updateSupplierTotalOrderQty = (supplierIndex, oldOrderQty, newOrderQty) => {
    let newSupplierTotalOrderQty = [...supplierTotalOrderQty];
    newSupplierTotalOrderQty[supplierIndex] = newSupplierTotalOrderQty[supplierIndex] - oldOrderQty + newOrderQty;
    setSupplierTotalOrderQty(newSupplierTotalOrderQty);
  };

  const supplierFilter = (groupItem) => {
    if (!isEmpty(filterValue.suppliers)) {
      return filterValue.suppliers[groupItem.supplier_id]
    }
    return true;
  };

  const itemFilter = (item) => {
    if (!isEmpty(filterValue.items)) {
      if (!filterValue.items[item.name]) {
        return false;
      }
    }

    if (!isEmpty(filterValue.filled)) {
      let filledDay = Object.keys(item.day_detail)
        .find((weekday) => {
          return submitData[item._group_index] ?.items[item._index] ?.day_detail[weekday].order_qty > 0
        });
      return filterValue.filled ? !Boolean(filledDay) : Boolean(filledDay);
    }

    return true;
  };

  const handleFilter = (filterValue) => {
    setFilterValue({
      filled: filterValue.filled,
      items: filterValue.items.reduce((map, item) => ({
        ...map,
        [item.name]: true
      }), {}),
      suppliers: filterValue.suppliers.reduce((map, item) => ({
        ...map,
        [item.id]: true
      }), {}),
    });
  };

  return (
    <div className="category-order-detail-container">
      <Layout>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container app-button">
                <div className="page-title">
                  <Title level={3}>{data.category ?.name}</Title>
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
                dataSource={suppliers}
                showLoading={loadingData}
                itemsKey="items"
                groupKey="supplier_name"
                groupId="supplier_id"
                groupFilter={supplierFilter}
                itemFilter={itemFilter}
                groupExpandable={createGroupExpandable()}
                rowExpandable={createRowExpandable()}
                groupError={(item) => !isSupplierValid(item._index)}
                itemError={(item) => !isSupplierValid(item._group_index)}
                actionProviders={{
                  onItemOrderQtyChanged: onItemOrderQtyChanged,
                  getItemCurrentOrderQty: getItemCurrentOrderQty,
                }}
              />
            </div>
            <div className="footer-group app-button category-order-detail-footer-group">
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
          suppliers={(originSuppliers || []).map((v) => {
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
