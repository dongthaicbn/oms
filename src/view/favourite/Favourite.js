import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Typography, Button } from 'antd';
import Layout from 'components/layout/Layout';
import IconButton from 'components/button/IconButton';
import { actionSnackBar } from 'view/system/systemAction';
import RoundImage from 'components/image/RoundImage';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppTable from 'components/table/AppTable';
import { isEmpty, getLangCode } from 'utils/helpers/helpers';
import { routes } from 'utils/constants/constants';
// import * as icons from 'assets';
import FilterModal from './components/FilterModal';
import { ReactComponent as FilterIcon } from 'assets/icons/ic_filter.svg';
import './Favourite.scss';
import {
  getFavouriteList,
  addFavourite,
  removeFavourite,
} from './FavouriteActions';

const { Title, Text } = Typography;

let mainOrder = [];

const Favourite = (props) => {
  const { locale } = props;
  let [data, setData] = useState({});
  let [open, setOpen] = useState(false);
  let [filterValue, setFilterValue] = useState({});

  const openFilter = () => setOpen(true);

  const fetchData = async () => {
    try {
      const { data } = await getFavouriteList({
        lang_code: getLangCode(locale),
      });
      if (!isEmpty(data.data) && data.result.status === 200) {
        mainOrder = data.data.orders || [];
        setData(data.data);
      }
    } catch (error) { }
  };

  useEffect(() => {
    fetchData(); // eslint-disable-next-line
  }, []);

  const goBack = () => {
    props.history.goBack();
  };
  const { favourte_categories, orders } = data;

  const convertDataTable = () => {
    let result = [];
    if (!isEmpty(orders)) {
      orders.forEach((el) => {
        let temp = { ...el, items: [] };
        if (!isEmpty(el.categories)) {
          el.categories.forEach((elm) => {
            temp.items = [...temp.items, ...elm.items];
          });
        }
        result.push(temp);
      });
    }
    return result;
  };
  const handleAction = async (isAdded, item, category_id) => {
    try {
      const dataDTO = { item_id: item.id, category_id };
      let res;
      if (!isAdded) {
        res = await addFavourite(dataDTO);
      } else {
        res = await removeFavourite(dataDTO);
      }
      const dataRes = res.data;
      if (dataRes.result.status === 200) {
        props.actionSnackBar({
          open: true,
          type: 'success',
          message: isAdded ? 'Remove item success' : 'Add item success',
        });
        fetchData();
      } else {
        props.actionSnackBar({
          open: true,
          type: 'error',
          message: dataRes.result.message,
        });
      }
    } catch (error) { }
  };
  const getColumns = () => {
    let result = [
      {
        title: <FormattedMessage id="IDS_ITEMS" />,
        render: (item) => (
          <div className="app-flex-container items-info-cell">
            <RoundImage src={item.image} alt="Item Image" />
            <div>
              <InfoGroup label={<Text>{item.code}</Text>} noColon={true}>
                {item.name}
                <div>
                  <FormattedMessage
                    id="IDS_WEIGHT_PER_PACKS"
                    values={{ weight: item.pack_weight }}
                  />
                </div>
              </InfoGroup>
            </div>
          </div>
        ),
      },
    ];
    if (favourte_categories) {
      favourte_categories.forEach((el) => {
        result.push({
          title: el.name,
          align: 'center',
          width: '146px',
          render: (it) => {
            const isAdded = (it.added_cats_ids || []).includes(el.id);
            return (
              <div
                className={isAdded ? 'action-btn added-item' : 'action-btn'}
                onClick={() => {
                  handleAction(isAdded, it, el.id);
                }}
              >
                <FormattedMessage
                  id={isAdded ? 'IDS_ADDED' : 'IDS_ADD_TO_LIST'}
                />
              </div>
            );
          },
        });
      });
    }
    return result;
  };
  const handleFilter = (values) => {
    setFilterValue(values);
    let result = [];
    if (!isEmpty(values.items)) {
      if (!isEmpty(values.categories)) {
        if (!isEmpty(values.suppliers)) {
          values.suppliers.forEach((supplierItem) => {
            let cateTemp = [];
            (supplierItem.categories || []).forEach((v) => {
              if (values.categories.find((el) => el.name === v.name)) {
                cateTemp.push({
                  ...v,
                  items: v.items.filter((elm) =>
                    values.items.find((el) => el.name === elm.name)
                  ),
                });
              }
            });
            result.push({ ...supplierItem, categories: cateTemp });
          });
        } else {
          mainOrder.forEach((supplierItem) => {
            let cateTemp = [];
            (supplierItem.categories || []).forEach((v) => {
              if (values.categories.find((el) => el.name === v.name)) {
                cateTemp.push({
                  ...v,
                  items: v.items.filter((elm) =>
                    values.items.find((el) => el.name === elm.name)
                  ),
                });
              }
            });
            if (!isEmpty(cateTemp)) {
              result.push({ ...supplierItem, categories: cateTemp });
            }
          });
        }
      } else {
        if (!isEmpty(values.suppliers)) {
          values.suppliers.forEach((supplierItem) => {
            let cateTemp = [];
            (supplierItem.categories || []).forEach((v) => {
              const tempItems = v.items.filter((elm) =>
                values.items.find((el) => el.name === elm.name)
              );
              if (!isEmpty(tempItems)) {
                cateTemp.push({ ...v, items: tempItems });
              }
            });
            result.push({ ...supplierItem, categories: cateTemp });
          });
        } else {
          mainOrder.forEach((supplierItem) => {
            let cateTemp = [];
            (supplierItem.categories || []).forEach((v) => {
              const tempItems = v.items.filter((elm) =>
                values.items.find((el) => el.name === elm.name)
              );
              if (!isEmpty(tempItems)) {
                cateTemp.push({ ...v, items: tempItems });
              }
            });
            if (!isEmpty(cateTemp)) {
              result.push({ ...supplierItem, categories: cateTemp });
            }
          });
        }
      }
    } else {
      if (!isEmpty(values.categories)) {
        if (!isEmpty(values.suppliers)) {
          values.suppliers.forEach((supplierItem) => {
            let cateTemp = [];
            (supplierItem.categories || []).forEach((v) => {
              if (values.categories.find((el) => el.name === v.name)) {
                cateTemp.push(v);
              }
            });
            result.push({ ...supplierItem, categories: cateTemp });
          });
        } else {
          mainOrder.forEach((supplierItem) => {
            let cateTemp = [];
            (supplierItem.categories || []).forEach((v) => {
              if (values.categories.find((el) => el.name === v.name)) {
                cateTemp.push(v);
              }
            });
            if (!isEmpty(cateTemp)) {
              result.push({ ...supplierItem, categories: cateTemp });
            }
          });
        }
      } else {
        if (!isEmpty(values.suppliers)) {
          result = [...values.suppliers];
        } else {
          result = [...mainOrder];
        }
      }
    }
    setData({ ...data, orders: result });
  };
  return (
    <div className="category-order-detail-container">
      <Layout>
        <div className="app-scrollable-container favourite-page">
          <div className={`app-content-container app-content-container-favourite new-container-favourite`}>
            <div className="header-group">
              <div className="page-info-container app-button">
                <div className="page-title">
                  <Title level={3}>
                    <FormattedMessage id="IDS_SELECTED_ITEM_LIST" />
                  </Title>
                </div>
                <Button
                  className={`${
                    !isEmpty(filterValue.suppliers) ||
                      !isEmpty(filterValue.categories) ||
                      !isEmpty(filterValue.items)
                      ? 'active-btn'
                      : ''
                    }`}
                  icon={<FilterIcon />}
                  onClick={openFilter}
                >
                  <FormattedMessage id="IDS_FILTER" />
                </Button>
              </div>
            </div>
            {!isEmpty(orders) && (
              <div className="body-group">
                <AppTable
                  columns={getColumns()}
                  dataSource={convertDataTable()}
                  itemsKey="items"
                  groupKey="name"
                />
              </div>
            )}
            {/* <div className="footer-group app-button">
              <Button className="back-button" onClick={goBack}>
                <FormattedMessage id="IDS_BACK" />
              </Button>
            </div> */}
          </div>
        </div>
        {open && (
          <FilterModal
            handleClose={() => setOpen(false)}
            suppliers={mainOrder}
            filterValue={filterValue}
            handleFilter={handleFilter}
          />
        )}
      </Layout>
    </div>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
    account: state.system.account,
    layoutSlider: state.system.layoutSlider,
  }),
  { actionSnackBar }
)(withRouter(Favourite));
