import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Layout from 'components/layout/Layout';
import { FormattedMessage, useIntl } from 'react-intl';
import SelectCustomLending from './components/SelectCustomLending';
import * as icons from 'assets';
import { Button, notification } from 'antd';
import CalendarModal from './components/CalendarModal';
import { actionToggleMenu } from '../system/systemAction';
import { actionSnackBar } from 'view/system/systemAction';
import { withRouter } from 'react-router-dom';
import { getBorrowingStoreList } from './LendingFormService';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import moment from 'moment';
import { routes } from 'utils/constants/constants';
import './LendingForm.scss'


const LendingForm = (props) => {
  const [isCalendar, setCalendar] = useState(false);
  const [data, setData] = useState({});
  const [store, setStore] = useState(null);
  const [startDate, setStartDate] = useState(moment());
  const { account } = props;
  const intl = useIntl();
  const openCheck = () => {
    if (store && store.id) {
      localStorage.setItem("shop_id", store.id)
      localStorage.setItem("shop_name", store.name)
      localStorage.setItem("lending_date", startDate.format('YYYY-MM-DD'))

      props.history.push(
        `${routes.LENDING_FORM_GOODS_CATEGORY}?shop_id=${
        store.id
        }`
      );
    } else {
      notification['error']({
        message: intl.formatMessage({ id: 'IDS_ERROR' }),
        description: intl.formatMessage({ id: 'IDS_PLEASE_CHOOSE_STORE' })
      });
    }
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
  const goBack = () => {
    props.history.goBack();
  };
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout emptyDrawer={true}>
      <div className="lending-form-container">
        <div className="content-container">
          <div className="header-container">
            <div className="left-header">
              <span className="title-info">
                <FormattedMessage id="IDS_STORE" />
                <span className="title-value">: {account.store ? account.store && account.store.company_name : '_'}</span>
              </span>
              {/* <span className="title-info">
                <FormattedMessage id="IDS_DEPT" />
                <span className="title-value">: Management team</span>
              </span> */}
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

        </div>
        <div className="action-container app-button">
          <Button className="action-button back-button" onClick={goBack}>
            <FormattedMessage id="IDS_BACK" />
          </Button>
          <Button type="primary" className="footer-btn save-btn action-button" onClick={openCheck}>
            <FormattedMessage id="IDS_NEXT" />
          </Button>
        </div>
      </div>


      {isCalendar && <CalendarModal handleClose={() => setCalendar(false)} startDate={startDate} setStartDate={setStartDate} />}
    </Layout>
  );
}

export default connect(
  (state) => ({
    locale: state.system.locale,
    account: state.system.account,
    lendingData: state.system.lendingData
  }),
  { actionToggleMenu, actionSnackBar }
)(withRouter(LendingForm));
