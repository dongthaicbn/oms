import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { parse as parseQueryString } from 'query-string';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Typography, Divider, Button, Tag } from 'antd';
import Layout from 'components/layout/Layout';
import IconButton from 'components/button/IconButton';
import RoundImage from 'components/image/RoundImage';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppTable from 'components/table/AppTable';
import { formatDate, isEmpty, getLangCode } from 'utils/helpers/helpers';
import { routes } from 'utils/constants/constants';
import * as icons from 'assets';
import FilterModal from './components/FilterModal';
import { ReactComponent as FilterIcon } from 'assets/icons/ic_filter.svg';
import './Favourite.scss';
import { getFavouriteList } from './FavouriteActions';

const { Title, Text, Paragraph } = Typography;

const order = {
  category: {
    name: 'Selected Item List',
  },
  suppliers: [
    {
      supplier_id: 1,
      supplier_name: 'Supplier A',
      MOA: 20000,
      monthly_MOA: 500000,
      items: [
        {
          code: 'FB0001-02',
          unit: 'KG',
          name: 'Grass carp A',
          pack_weight: '~4.25',
          cost: 23,
          currency: 'HK$',
          day_detail: [
            {
              is_available: false,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: null,
              date: Date.parse('2020-01-05 00:00:00'),
              weekday: 'fri',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 6,
              prefill_value: 5,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 7,
              prefill_value: 1,
              date: Date.parse('2020-01-07 00:00:00'),
              weekday: 'sun',
            },
          ],
        },
        {
          code: 'FB0001-03',
          unit: 'KG',
          name: 'Shrimp A',
          pack_weight: '~6.75',
          cost: 35,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 1,
              date: Date.parse('2020-01-01 00:00:00'),
              weekday: 'mon',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 2,
              date: Date.parse('2020-01-03 00:00:00'),
              weekday: 'wed',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-05 00:00:00'),
              weekday: 'fri',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 4,
              date: Date.parse('2020-01-07 00:00:00'),
              weekday: 'sun',
            },
          ],
        },
        {
          code: 'FB0001-04',
          unit: 'KG',
          name: 'Tuna A',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0001-05',
          unit: 'KG',
          name: 'Tuna A',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0001-06',
          unit: 'KG',
          name: 'Tuna A',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0001-07',
          unit: 'KG',
          name: 'Tuna A',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0001-08',
          unit: 'KG',
          name: 'Tuna A',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
      ],
    },
    {
      supplier_id: 2,
      supplier_name: 'Supplier B',
      MOA: 50000,
      monthly_MOA: 800000,
      items: [
        {
          code: 'FB0002-02',
          unit: 'KG',
          name: 'Grass carp B',
          pack_weight: '~4.25',
          cost: 23,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 3,
              prefill_value: 0,
              date: Date.parse('2020-01-03 00:00:00'),
              weekday: 'wed',
            },
            {
              is_available: false,
              minimum_range: 1,
              maximum_range: 4,
              prefill_value: 3,
              date: Date.parse('2020-01-04 00:00:00'),
              weekday: 'thu',
            },
            {
              is_available: false,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-05 00:00:00'),
              weekday: 'fri',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 6,
              prefill_value: 5,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 7,
              prefill_value: 1,
              date: Date.parse('2020-01-07 00:00:00'),
              weekday: 'sun',
            },
          ],
        },
        {
          code: 'FB0002-03',
          unit: 'KG',
          name: 'Shrimp B',
          pack_weight: '~6.75',
          cost: 35,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 1,
              date: Date.parse('2020-01-01 00:00:00'),
              weekday: 'mon',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 2,
              date: Date.parse('2020-01-03 00:00:00'),
              weekday: 'wed',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-05 00:00:00'),
              weekday: 'fri',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 4,
              date: Date.parse('2020-01-07 00:00:00'),
              weekday: 'sun',
            },
          ],
        },
        {
          code: 'FB0002-04',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0002-05',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0002-06',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0002-07',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0002-08',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0002-09',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0002-10',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0002-11',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0002-12',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
      ],
    },
    {
      supplier_id: 3,
      supplier_name: 'Supplier C',
      MOA: 50000,
      monthly_MOA: 800000,
      items: [
        {
          code: 'FB0003-02',
          unit: 'KG',
          name: 'Grass carp B',
          pack_weight: '~4.25',
          cost: 23,
          currency: 'HK$',
          day_detail: [
            {
              is_available: false,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-05 00:00:00'),
              weekday: 'fri',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 6,
              prefill_value: 5,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 7,
              prefill_value: 1,
              date: Date.parse('2020-01-07 00:00:00'),
              weekday: 'sun',
            },
          ],
        },
        {
          code: 'FB0003-03',
          unit: 'KG',
          name: 'Shrimp B',
          pack_weight: '~6.75',
          cost: 35,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-05 00:00:00'),
              weekday: 'fri',
            },
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 4,
              date: Date.parse('2020-01-07 00:00:00'),
              weekday: 'sun',
            },
          ],
        },
        {
          code: 'FB0003-04',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0003-05',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0003-06',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0003-07',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0003-08',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0003-09',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0003-10',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0003-11',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
        {
          code: 'FB0003-12',
          unit: 'KG',
          name: 'Tuna B',
          pack_weight: '~10.70',
          cost: 100,
          currency: 'HK$',
          day_detail: [
            {
              is_available: true,
              minimum_range: 1,
              maximum_range: 5,
              prefill_value: 3,
              date: Date.parse('2020-01-06 00:00:00'),
              weekday: 'sat',
            },
          ],
        },
      ],
    },
  ],
};

const Favourite = (props) => {
  const { locale } = props;
  const { showPrice } = parseQueryString(props.location.search, {
    parseBooleans: true,
  });
  let [data, setData] = useState({});
  let [dataFavourite, setDataFavourite] = useState({});
  let [mapFormData, setMapFormData] = useState({});
  let [formErrors, setFormErrors] = useState({});
  let [open, setOpen] = useState(false);
  let [filterValue, setFilterValue] = useState(false);

  const openFilter = () => setOpen(true);

  const renderColumnTitle = (title) => (
    <p style={{ margin: 0, padding: 8 }}>{title}</p>
  );

  const renderItemQuantity = (item, dayName, actionProvider) => {
    let dayDetail = item.day_detail_map[dayName];
    let disabled = !dayDetail || !dayDetail.is_available;

    return (
      <div
        className="app-button order-detail-item-quantity-button"
        style={{ padding: '0 8px' }}
      >
        <Button
          disabled={disabled}
          style={{ width: '100%', padding: '0 20px' }}
        >
          Add to list
        </Button>
      </div>
    );
  };

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
          };
          return {
            ...map,
            [day.weekday]: day,
          };
        }, {});
      });
    });
  };

  const createFormData = (mapFormData) => {
    let result = {
      dates: [],
    };
    Object.keys(mapFormData).forEach((weekday) => {
      result.dates.push({
        date: formatDate(mapFormData[weekday].date, 'YYYY-MM-DD'),
        items: Object.keys(mapFormData[weekday].items).map(
          (key) => mapFormData[weekday].items[key]
        ),
      });
    });
    return result;
  };

  const createGroupExpandable = () => {
    return {
      expandable: (item) => formErrors[item.supplier_id],
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
    if (showPrice) {
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
      const { data } = await getFavouriteList({
        lang_code: getLangCode(locale),
      });
      if (!isEmpty(data.data) && data.result.status === 200) {
        setDataFavourite(data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
    initData(order.suppliers, mapFormData);
    setData(order);
    setMapFormData(mapFormData);
  }, []);

  const goBack = () => {
    props.history.push(routes.CATEGORY);
  };

  const submitForm = () => {
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
  };

  const getItemCurrentQuantity = (weekDay, itemCode) => {
    return mapFormData[weekDay]?.items[itemCode]?.order_qty;
  };

  const onItemQuantityChanged = (weekday, itemCode, newValue) => {
    let newMapFormData = { ...mapFormData };
    let item = newMapFormData[weekday].items[itemCode];
    item.order_qty = newValue;
    validateFormErrors(item);
    setMapFormData(newMapFormData);
    return true;
  };

  const validateFormErrors = (item) => {
    if (item.order_qty < item.min_order_qty) {
      let errors = { ...formErrors };
      if (!errors[item.supplier_id]) {
        errors[item.supplier_id] = {
          items: {},
        };
      }
      errors[item.supplier_id].items[item.product_id] = true;
      setFormErrors(errors);
    } else if (formErrors[item.supplier_id]?.items[item.product_id]) {
      let errors = { ...formErrors };
      delete errors[item.supplier_id].items[item.product_id];
      if (isEmpty(errors[item.supplier_id].items)) {
        delete errors[item.supplier_id];
      }
      setFormErrors(errors);
    }
  };
  const { favourte_categories, orders } = dataFavourite;
  // console.log('categories', favourte_categories);
  // console.log('orders', orders);
  const getColumns = () => {
    let result = [
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
    ];
    if (!isEmpty(favourte_categories)) {
      favourte_categories.forEach((el) => {
        result.push({
          title: (columnData) => renderColumnTitle(el.name),
          align: 'center',
          width: '130px',
          render: (item, actionProvider) =>
            renderItemQuantity(item, 'fri', actionProvider),
        });
      });
    }
    return result;
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
              <div
                className={`app-flex-container flex-end filter-button-container ${
                  filterValue ? 'active-btn' : ''
                }`}
                onClick={openFilter}
              >
                <IconButton icon={<FilterIcon />}>
                  <FormattedMessage id="IDS_FILTER" />
                </IconButton>
              </div>
            </Col>
          </Row>
          <Row className="order-detail-table">
            <Col span={24}>
              <AppTable
                columns={getColumns()}
                columnDataSource={mapFormData}
                dataSource={data.suppliers}
                groupKey="supplier_name"
                // dataSource={!isEmpty(orders) ? orders[0].categories : []}
                // groupKey="name"
                itemsKey="items"
                groupExpandable={createGroupExpandable()}
                rowExpandable={createRowExpandable()}
                groupError={(item) => formErrors[item.supplier_id]}
                itemError={(item) => formErrors[item.supplier_id]}
                actionProviders={{
                  onItemQuantityChanged: onItemQuantityChanged,
                  getItemCurrentQuantity: getItemCurrentQuantity,
                }}
              />
            </Col>
          </Row>
        </div>
        <div className="action-container app-button">
          <Button className="action-button back-button" onClick={goBack}>
            <FormattedMessage id="IDS_BACK" />
          </Button>
          <Button
            type="primary"
            className="action-button"
            style={{ float: 'right' }}
            onClick={submitForm}
          >
            <FormattedMessage id="IDS_SAVE" />
          </Button>
        </div>
      </div>
      {open && (
        <FilterModal
          handleClose={() => setOpen(false)}
          suppliers={order.suppliers}
          handleFilter={() => setFilterValue(true)}
        />
      )}
    </Layout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
    account: state.system.account,
  }),
  {}
)(withRouter(Favourite));
