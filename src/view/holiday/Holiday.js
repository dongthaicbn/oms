import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import * as icons from 'assets';
import { Button } from 'antd';
import './Holiday.scss';
import { actionToggleMenu } from '../system/systemAction';
import { getDeliveryStoreList } from './HolidayActions';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import { actionSnackBar } from 'view/system/systemAction';
import Layout from 'components/layout/Layout';
import {
  routes,
  DATE_FORMAT,
  DATE_FORMAT_URL,
} from 'utils/constants/constants';
import SelectCustomHoliday from './components/SelectCustomHoliday';
import CalendarModal from './components/CalendarModal';

const Holiday = (props) => {
  const { account, locale } = props;
  const [data, setData] = useState({});
  const [isCalendar, setCalendar] = useState(false);
  const [shop, setShop] = useState({});
  const [dateRange, setDateRange] = useState({
    startDate: moment(),
    endDate: moment().add(1, 'days'),
  });
  const fetchData = async () => {
    try {
      const { data } = await getDeliveryStoreList({
        lang_code: getLangCode(locale),
      });
      if (!isEmpty(data.data) && data.result.status === 200) setData(data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData(); //eslint-disable-next-line
  }, []);

  const openCheck = () => {
    props.history.push(
      `${routes.HOLIDAY_GOOD_CATEGORY}?shop_id=${
        shop.id
      }&start_date=${dateRange.startDate.format(
        DATE_FORMAT_URL
      )}&end_date=${dateRange.endDate.format(DATE_FORMAT_URL)}`
    );
  };
  const closeModal = () => setCalendar(false);
  const { store, user } = account;
  const isDisabled = isEmpty(shop);
  return (
    <Layout>
      <div className="scrollable-container" style={{ position: 'relative' }}>
        <div className="content-container">
          <div className="header-container" style={{ paddingLeft: 0 }}>
            <div className="left-header">
              <span className="title-info">
                <FormattedMessage id="IDS_STORE" />
                {!isEmpty(store) && (
                  <span className="title-value">: {store.company_name}</span>
                )}
              </span>
            </div>
          </div>
          <div className="page-content">
            <div className="holiday-content">
              <SelectCustomHoliday
                options={Object.values(data.stores || {})}
                // multiple
                value={shop}
                getOptionLabel={(v) => v.supplier_name}
                onSelectOption={(value) => {
                  setShop(value);
                  setCalendar(true);
                }}
                // value={itemsSelected}
                iconRight={
                  <img
                    src={icons.ic_arrow_down}
                    alt=""
                    style={{ marginRight: 24, cursor: 'pointer' }}
                  />
                }
              />
              <div
                className="calendar-holiday"
                onClick={() => setCalendar(true)}
              >
                <span>
                  <img
                    src={icons.ic_calendar}
                    alt=""
                    style={{ marginRight: 12, marginTop: -4 }}
                  />
                  {dateRange.startDate.format(DATE_FORMAT)} (
                  {dateRange.startDate.format('ddd')}) -&nbsp;
                  {dateRange.endDate.format(DATE_FORMAT)} (
                  {dateRange.endDate.format('ddd')})
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="page-footer holiday-footer"
          style={{
            background: '#f3f3f9',
            padding: '24px 12px',
            width: 'calc(100% - 24px)',
          }}
        >
          <Button
            className={`footer-btn save-btn ${isDisabled ? 'disabled' : ''}`}
            onClick={() => {
              if (!isDisabled) openCheck();
            }}
          >
            <FormattedMessage id="IDS_CHECK" />
          </Button>
        </div>
      </div>
      {isCalendar && (
        <CalendarModal
          handleClose={() => setCalendar(false)}
          dateRange={dateRange}
          updateDateRange={(dates) => setDateRange(dates)}
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
  { actionToggleMenu, actionSnackBar }
)(withRouter(Holiday));
