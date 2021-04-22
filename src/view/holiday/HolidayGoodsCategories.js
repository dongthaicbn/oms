import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';

import './Holiday.scss';
import { actionToggleMenu } from '../system/systemAction';
import { getOrderCategories } from './HolidayActions';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import { routes } from 'utils/constants/constants';

const HolidayGoodsCategories = (props) => {
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const { data } = await getOrderCategories({
        lang_code: getLangCode(props.locale),
      });
      if (!isEmpty(data.data)) setData(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);
  const openDetail = (item, type) => {
    props.history.push(
      `${routes.HOLIDAY_GOOD_CATEGORY_DETAIL.replace(
        ':id',
        item.id
      )}?type=${type}`
    );
  };
  const handleBack = () => {
    props.history.push(routes.HOLIDAY);
  };
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
          <div className="page-footer">
            <Button className="footer-btn" onClick={handleBack}>
              <FormattedMessage id="IDS_BACK" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  { actionToggleMenu }
)(withRouter(HolidayGoodsCategories));
