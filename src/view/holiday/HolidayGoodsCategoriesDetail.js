import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { Divider, Typography, Tag, Button } from 'antd';
import Layout from 'components/layout/Layout';
import AppTable from 'components/table/AppTable';
import RoundImage from 'components/image/RoundImage';
import InfoGroup from 'components/infoGroup/InfoGroup';
import { getLangCode, isEmpty, formatDate } from 'utils/helpers/helpers';
import { ReactComponent as DropDownIcon } from 'assets/icons/ic_dropdown.svg';
import * as icons from 'assets';
import { actionToggleMenu } from '../system/systemAction';
import { getDeliveryCategoriesDetail } from './HolidayActions';
import './HolidayGoodsCategoryDetail.scss';

const { Title, Paragraph } = Typography;

const MINIMAL_AVAILABLE_DATE_DISPLAY = 6;

const columns = [
  {
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
    renderGroup: (item) => item.name,
  },
  {
    title: (
      <div className="item-info-column">
        <FormattedMessage id="IDS_VEHICLE_SCHEDULE" />
      </div>
    ),
    width: '120px',
    align: 'center',
    render: (item) =>
      item.vehicle_schdules && (
        <Tag className="info-tag">{item.vehicle_schdules}</Tag>
      ),
  },
  {
    title: (
      <div className="item-info-column">
        <FormattedMessage id="IDS_ORDER_BEFORE" />
      </div>
    ),
    width: '120px',
    align: 'center',
    render: (item) =>
      item.vehicle_schdules && (
        <Tag className="info-tag">{item.vehicle_schdules}</Tag>
      ),
  },
];

const HolidayGoodsCategoriesDetail = (props) => {
  const { id } = props.match.params;
  const paramsUrl = queryString.parse(props.location.search);
  const [data, setData] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [supplierMetas, setSupplierMetas] = useState([]);

  const toggleAvailableDateView = (supplierIndex, viewAll) => {
    let newSupplierMetas = [...supplierMetas];
    newSupplierMetas[supplierIndex] = {
      expanded: viewAll,
    };
    setSupplierMetas(newSupplierMetas);
  };

  const createGroupExtendable = () => {
    return {
      extendable: (item) => item.date?.suspended_date?.length > 0,
      render: (item) => {
        let expanded = supplierMetas[item._index]?.expanded;
        let availableDates = item.date?.available_date || [];
        let viewActionContent;
        if (expanded) {
          viewActionContent = (
            <>
              <FormattedMessage id="IDS_CLOSE" />
              <DropDownIcon />
            </>
          );
        } else {
          if (availableDates.length > MINIMAL_AVAILABLE_DATE_DISPLAY) {
            availableDates = availableDates.slice(
              0,
              MINIMAL_AVAILABLE_DATE_DISPLAY
            );
          }
          viewActionContent = (
            <>
              <FormattedMessage id="IDS_VIEW_ALL" />
              <DropDownIcon />
            </>
          );
        }
        return (
          <div className="supplier-delivery-info-container">
            <div className="suspended-section">
              <FormattedMessage id="IDS_DELIVERY_SUSPENDED" />
              {item.date?.suspended_date?.length > 0 && (
                <div className="delivery-suspended-dates">
                  {item.date?.suspended_date?.map((date) => (
                    <Tag>{formatDate(date, 'DD/MM(dd)')}</Tag>
                  ))}
                </div>
              )}
            </div>
            <Divider />
            {availableDates.length > 0 && (
              <div className="available-section">
                {availableDates.map((date) => (
                  <Tag>
                    {formatDate(date.order_date, 'DD/MM(dd)')}
                    <img src={icons.ic_arrow_right} />
                    {formatDate(date.delivery_date, 'DD/MM(dd)')}
                  </Tag>
                ))}
              </div>
            )}
            {item.date?.available_date?.length >
              MINIMAL_AVAILABLE_DATE_DISPLAY && (
              <>
                <Divider />
                <div className="view-action-section">
                  <div
                    className="view-action"
                    onClick={() =>
                      toggleAvailableDateView(item._index, !expanded)
                    }
                  >
                    {viewActionContent}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      },
    };
  };

  const fetchData = async (id, type, shop_id, start_date, end_date) => {
    try {
      const { data } = await getDeliveryCategoriesDetail({
        lang_code: getLangCode(props.locale),
        is_favorite_category: type === 'categories' ? 0 : 1,
        id,
        shop_id: shop_id,
        start_date: start_date,
        end_date: end_date,
      });

      if (!isEmpty(data.data)) {
        return data.data;
      }
    } catch (e) {
      throw e;
    }
  };

  const refreshData = async () => {
    let response = await fetchData(
      id,
      paramsUrl.type,
      paramsUrl.shop_id,
      paramsUrl.start_date,
      paramsUrl.end_date
    );
    setData(response);
    setSuppliers(response.suppliers);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const goBack = () => {
    props.history.goBack();
  };

  return (
    <div className="holiday-goods-category-detail">
      <Layout>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container">
                <div className="page-title">
                  <Title level={3}>{data.category?.name}</Title>
                </div>
              </div>
            </div>
            <div className="body-group">
              <AppTable
                columns={columns}
                dataSource={suppliers}
                itemsKey="items"
                groupKey="name"
                groupExtendable={createGroupExtendable()}
              />
            </div>
            <div className="footer-group app-button">
              <Button className="back-button" onClick={goBack}>
                <FormattedMessage id="IDS_BACK" />
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  { actionToggleMenu }
)(withRouter(HolidayGoodsCategoriesDetail));
