import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Layout from 'components/layout/Layout';
import { FormattedMessage } from 'react-intl';
import SelectCustomLending from './components/SelectCustomLending';
import * as icons from 'assets';
import { Button } from 'antd';
import CalendarModal from './components/CalendarModal';
import { actionToggleMenu } from '../system/systemAction';
import { actionSnackBar } from 'view/system/systemAction';
import { withRouter } from 'react-router-dom';
import { getBorrowingStoreList } from './LendingFormService';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import moment from 'moment';


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
      supplier_name: 'SupplierB',
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
      supplier_name: 'SupplierC',
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
      supplier_name: 'SupplierB',
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
const LendingForm = (props) => {
  const [isCalendar, setCalendar] = useState(false);
  const [data, setData] = useState({});
  const [store, setStore] = useState(null);
  const [startDate, setStartDate] = useState(moment());

  const openCheck = () => {
  };
  const fetchData = async () => {
    try {
      const { data } = await getBorrowingStoreList({
        lang_code: getLangCode(props.locale),
      });
      console.log(data.data)

      if (!isEmpty(data.data)) setData(data.data);
    } catch (error) { }
  };
  useEffect(() => {
    fetchData()
  }, [])

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
              <SelectCustomLending
                options={data && data.stores}
                // multiple
                value={[]}
                selected={store && store.name}
                getOptionLabel={(v) => v.supplier_name}
                onSelectOption={(value) => {
                  console.log('value', value);
                  setStore(value)
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
                  {startDate.format('DD/MM/YYYY (ddd)')}
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
      {isCalendar && <CalendarModal handleClose={() => setCalendar(false)} startDate={startDate} setStartDate={setStartDate} />}
    </Layout>
  );
}

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  { actionToggleMenu, actionSnackBar }
)(withRouter(LendingForm));
