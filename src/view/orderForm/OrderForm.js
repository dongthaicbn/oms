import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button, Divider } from 'antd';
import { Box } from '@material-ui/core';
import './OrderForm.scss';
import { actionToggleMenu } from '../system/systemAction';
import { getTodayList } from './OrderFormActions';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import OrderItem from './components/OrderItem';
import { routes } from 'utils/constants/constants';
import SubmitOrderItemModal from './components/SubmitOrderItemModal';
import { getAccountDetail } from './OrderFormActions';

const TYPE_MODAL = {
  SUBMIT: 'submit',
};
const OrderForm = (props) => {
  const [data, setData] = useState({});
  const [accountDetail, setAccountDetail] = useState({});
  const [typeModal, setTypeModal] = useState(null);

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
    fetchData();
    fetchAccountDetail(); //eslint-disable-next-line
  }, []);
  const openEditOrder = () => {
    props.history.push(routes.GOODS_CATEGORIES);
  };
  const closeModal = () => setTypeModal(null);
  const { store, user } = accountDetail;
  return (
    <Layout>
      <div className="header-order-container">
        <div className="left-header">
          {!isEmpty(store) && (
            <div>
              <span className="title-info">
                <FormattedMessage id="IDS_STORE" />
                <span className="title-value">: {store.company_name}</span>
              </span>
              {/* <span className="title-info">
                <FormattedMessage id="IDS_DEPT" />
                <span className="title-value">: {store.company_address}</span>
              </span> */}
            </div>
          )}
          <span className="title-header">
            <FormattedMessage id="IDS_TODAY_ORDER_FORM" />
          </span>
        </div>
        <Button className="header-btn" onClick={openEditOrder}>
          <FormattedMessage id="IDS_EDIT_ORDER_ITEMS" />
        </Button>
      </div>
      <div className="page-order-content">
        {isEmpty(data.supplier_forms) ? (
          <div className="empty-text">
            <FormattedMessage id="IDS_NO_ORDER_ITEMS" />
          </div>
        ) : (
          <>
            {data.supplier_forms.map((el, i) => (
              <OrderItem item={el} key={i} />
            ))}
            <Box
              style={{
                width: 335,
                marginLeft: 'calc(100% - 335px)',
                marginTop: 86,
                textAlign: 'right',
                color: '#4F4E66',
                fontWeight: 'bold',
              }}
            >
              <p
                style={{
                  margin: '0 0 16px 0',
                  fontSize: 16,
                  lineHeight: '24px',
                }}
              >
                <FormattedMessage id="IDS_TOTAL_ITEM" />: 242
              </p>
              <Divider className="custom-divider" />
              <p
                style={{
                  margin: '0 0 16px 0',
                  fontSize: 24,
                  lineHeight: '36px',
                }}
              >
                <FormattedMessage id="IDS_TOTAL" />: HK$22,542
              </p>
            </Box>
          </>
        )}
        <div className="footer-content">
          <Button className="item-btn">
            <FormattedMessage id="IDS_COLLECT" />
          </Button>
          <Button
            className="item-btn active-btn"
            onClick={() => {
              setTypeModal(TYPE_MODAL.SUBMIT);
            }}
          >
            <FormattedMessage id="IDS_SUBMIT_TODAY_ORDER_FORM" />
          </Button>
        </div>
      </div>
      {typeModal === TYPE_MODAL.SUBMIT && (
        <SubmitOrderItemModal handleClose={closeModal} />
      )}
    </Layout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  { actionToggleMenu }
)(withRouter(OrderForm));
