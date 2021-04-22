import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import { Button } from 'antd';
import './Holiday.scss';
import { actionToggleMenu } from '../system/systemAction';
import { getTodayList } from './HolidayActions';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import { actionSnackBar } from 'view/system/systemAction';
import Layout from 'components/layout/Layout';
import { routes } from 'utils/constants/constants';
import SelectCustom from 'components/select/SelectCustom';
import { getAccountDetail } from './HolidayActions';
import CalendarModal from './components/CalendarModal';

const TYPE_MODAL = {
  SUBMIT: 'submit',
};
const MockData = {
  is_submitted_today: 1,
  is_collect_available: 1,
  supplier_forms: [
    {
      id: 1,
      supplier_name: 'SupplierA',
      total_order_item: 7,
      total_cost: 'HK$2305',
      last_update: '2021-01-01 16:07:06',
      estimated_delivery: '2021-01-01 00:00:00',
      pass_moq: true,
      moq_message:
        'Shipping upon ordering 10 more items from this supplier today',
    },
    {
      id: 2,
      supplier_name: 'SupplierA',
      total_order_item: 7,
      total_cost: 'HK$2305',
      last_update: '2021-01-01 16:07:06',
      estimated_delivery: '2021-01-01 00:00:00',
      pass_moq: false,
      moq_message:
        'Shipping upon ordering 10 more items from this supplier today',
    },
    {
      id: 3,
      supplier_name: 'SupplierA',
      total_order_item: 7,
      total_cost: 'HK$2305',
      last_update: '2021-01-01 16:07:06',
      estimated_delivery: '2021-01-01 00:00:00',
      pass_moq: true,
      moq_message:
        'Shipping upon ordering 10 more items from this supplier today',
    },
    {
      id: 4,
      supplier_name: 'SupplierA',
      total_order_item: 7,
      total_cost: 'HK$2305',
      last_update: '2021-01-01 16:07:06',
      estimated_delivery: '2021-01-01 00:00:00',
      pass_moq: false,
      moq_message:
        'Shipping upon ordering 10 more items from this supplier today',
    },
  ],
};
const Holiday = (props) => {
  const [data, setData] = useState({});
  const [accountDetail, setAccountDetail] = useState({});
  const [isCalendar, setCalendar] = useState(false);
  const fetchData = async () => {
    try {
      const { data } = await getTodayList({
        lang_code: getLangCode(props.locale),
      });
      if (!isEmpty(data.data)) setData(data.data);
    } catch (error) {}
  };
  const fetchAccountDetail = async () => {
    try {
      const { data } = await getAccountDetail({
        lang_code: getLangCode(props.locale),
      });
      if (!isEmpty(data.data)) setAccountDetail(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    // fetchData();
    setData(MockData);
    // fetchAccountDetail(); //eslint-disable-next-line
  }, []);
  const openCheck = () => {
    props.history.push(routes.HOLIDAY_GOOD_CATEGORY);
  };
  const closeModal = () => setCalendar(false);
  const { store, user } = accountDetail;
  return (
    <Layout>
      <div className="scrollable-container">
        <div className="content-container">
          <div className="header-container">
            <div className="left-header">
              <span className="title-info">
                <FormattedMessage id="IDS_STORE" />
                <span className="title-value">: HP003 Lake Silver</span>
              </span>
              <span className="title-info">
                <FormattedMessage id="IDS_DEPT" />
                <span className="title-value">: Management team</span>
              </span>
            </div>
          </div>
          <div className="page-content">
            <div className="holiday-content">
              <SelectCustom
                options={[]}
                multiple
                getOptionLabel={(v) => v.name}
                onSelectOption={(value) => {
                  console.log('value', value);
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
                  12/11/2020 (Thu) - 18/11/2020(Wed)
                </span>
              </div>
            </div>
          </div>
          <div className="page-footer holiday-footer">
            <Button className="footer-btn save-btn" onClick={openCheck}>
              <FormattedMessage id="IDS_CHECK" />
            </Button>
          </div>
        </div>
      </div>
      {isCalendar && <CalendarModal handleClose={() => setCalendar(false)} />}
    </Layout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  { actionToggleMenu, actionSnackBar }
)(withRouter(Holiday));
