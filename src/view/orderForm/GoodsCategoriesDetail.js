import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import queryString from 'query-string';
import * as icons from 'assets';
import './OrderForm.scss';
import { actionToggleMenu } from '../system/systemAction';
import { getOrderCategoriesDetail } from './OrderFormActions';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import FilterModal from './components/FilterModal';
import ConfirmLeaveModal from './components/ConfirmLeaveModal';
import SaveOrderItemModal from './components/SaveOrderItemModal';

const TYPE_MODAL = {
  LEAVE: 'leave',
  SAVE: 'save',
};
const GoodsCategoriesDetail = (props) => {
  const [dataDetail, setDataDetail] = useState({});
  const [isFilter, setFilter] = useState(false);
  const [typeModal, setTypeModal] = useState(null);

  const { id } = props.match.params;
  const paramsUrl = queryString.parse(props.location.search);

  const openFilter = () => setFilter(true);
  const closeFilter = () => setFilter(false);

  const fetchData = async () => {
    try {
      const { data } = await getOrderCategoriesDetail({
        lang_code: getLangCode(props.locale),
        is_favorite_category: paramsUrl.type === 'categories' ? 0 : 1,
        id,
      });

      if (!isEmpty(data.data)) setDataDetail(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData(); // eslint-disable-next-line
  }, [id]);
  const handleBack = () => {
    setTypeModal('leave');
  };
  const handleSave = () => {
    setTypeModal(TYPE_MODAL.SAVE);
  };
  const closeModal = () => {
    setTypeModal(null);
  };

  return (
    <Layout>
      <div className="header-container vehicle-detail order-detail">
        <span className="title-info">FB Seafood</span>
        <Button className="outline-btn" onClick={openFilter}>
          <img
            src={icons.ic_filter}
            alt=""
            style={{ marginRight: 8, cursor: 'pointer' }}
          />
          <FormattedMessage id="IDS_FILTER" />
        </Button>
      </div>
      <div className="page-content vehicle-detail">
        <div className="header-group">
          <div className="items-column">
            <FormattedMessage id="IDS_ITEMS" />
          </div>
          <div className="vehicle-column">
            <FormattedMessage id="IDS_VEHICLE_SCHEDULE" />
          </div>
          <div className="order-column">
            <FormattedMessage id="IDS_ORDER_BEFORE" />
          </div>
        </div>
        <>
          {['A', 'B', 'C'].map((el, i) => (
            <Fragment key={i}>
              <p className="title-vehicle-item">Supplier {el}</p>
              {[1, 2, 3].map((item, idx) => (
                <div className="header-group vehicle-item" key={idx}>
                  <div className="items-column">
                    <FormattedMessage id="IDS_ITEMS" />
                  </div>
                  <div className="vehicle-column">
                    <span className="value-item">1-4, 6-7</span>
                  </div>
                  <div className="order-column">
                    <span className="value-item">2</span>
                  </div>
                </div>
              ))}
            </Fragment>
          ))}
        </>
      </div>
      <div className="page-footer order-footer">
        <Button className="footer-btn" onClick={handleBack}>
          <FormattedMessage id="IDS_BACK" />
        </Button>
        <Button className="footer-btn save-btn" onClick={handleSave}>
          <FormattedMessage id="IDS_SAVE" />
        </Button>
      </div>
      {isFilter && (
        <FilterModal
          suppliers={dataDetail.suppliers || []}
          handleClose={closeFilter}
        />
      )}
      {typeModal === TYPE_MODAL.LEAVE && (
        <ConfirmLeaveModal handleClose={closeModal} />
      )}
      {typeModal === TYPE_MODAL.SAVE && (
        <SaveOrderItemModal handleClose={closeModal} />
      )}
    </Layout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  { actionToggleMenu }
)(withRouter(GoodsCategoriesDetail));
