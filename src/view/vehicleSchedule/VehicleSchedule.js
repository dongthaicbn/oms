import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import './VehicleSchedule.scss';
import { actionToggleMenu } from '../system/systemAction';
import { getScheduleCategories } from './VehicleScheduleActions';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import { routes } from 'utils/constants/constants';

const VehicleSchedule = (props) => {
  const { locale, account } = props;
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const { data } = await getScheduleCategories({
        lang_code: getLangCode(locale),
      });

      if (!isEmpty(data.data)) setData(data.data);
    } catch (error) { }
  };
  useEffect(() => {
    fetchData(); //eslint-disable-next-line
  }, []);
  const openDetail = (item, type) => {
    props.history.push(
      `${routes.VEHICLE_SCHEDULE_DETAIL.replace(':id', item.id)}?type=${type}`
    );
  };

  const handleBack = () => {
    props.history.goBack();
  };

  const { store } = account;
  // const { store, user } = account;
  return (
    <Layout>
      <div
        className="scrollable-container padding-right scrollable-container-categories"
      // style={{ position: 'relative' }}
      >
        <div className="content-container">
          <div className="header-container">
            <div className="left-header">
              <span className="title-info">
                <FormattedMessage id="IDS_STORE" />
                {!isEmpty(store) && (
                  <span className="title-value">: {store.company_name}</span>
                )}
              </span>
            </div>
          </div>
          <div
            className="page-content page-content-vehicle-schedule"
          // style={{ height: 'calc(100vh - 202px)' }}
          >
            <div className="item-group">
              {!isEmpty(data.favourite_categories) &&
                data.favourite_categories.map((el, i) => (
                  <div
                    key={el.id}
                    className={`favourite-item item-${i}`}
                    onClick={() => openDetail(el, 'favourite')}
                  >
                    <span className="selected-text">
                      <FormattedMessage id="IDS_SELECTED_ITEMS" />
                    </span>
                    <span className="selected-value">{el.name}</span>
                  </div>
                ))}
            </div>
            <div className="item-group categories-group ">
              {!isEmpty(data.categories) &&
                data.categories.map((el, i) => (
                  <div
                    key={el.id}
                    className="normal-item"
                    onClick={() => openDetail(el, 'categories')}
                  >
                    <span>{el.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* <div
          className="page-footer"
          style={{
            padding: 24,
          }}
        >
          <Button className="footer-btn" onClick={handleBack}>
            <FormattedMessage id="IDS_BACK" />
          </Button>
        </div> */}
      </div>
    </Layout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
    account: state.system.account,
    layoutSlider: state.system.layoutSlider,
  }),
  { actionToggleMenu }
)(withRouter(VehicleSchedule));
