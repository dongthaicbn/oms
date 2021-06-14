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
import { actionSnackBar } from 'view/system/systemAction';
import Layout from 'components/layout/Layout';
import OrderItem from './components/OrderItem';
import { routes } from 'utils/constants/constants';
import SubmitOrderItemModal from './components/SubmitOrderItemModal';

const TYPE_MODAL = {
  SUBMIT: 'submit',
};
const OrderForm = (props) => {
  const { account, locale } = props;
  const [data, setData] = useState({});
  const [typeModal, setTypeModal] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await getTodayList({
        lang_code: getLangCode(locale),
      });
      if (!isEmpty(data.data)) setData(data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData(); //eslint-disable-next-line
  }, []);
  const openEditOrder = () => {
    props.history.push(routes.GOODS_CATEGORIES);
  };
  const closeModal = () => setTypeModal(null);
  const { store } = account;
  // const { store, user } = account;
  // console.log('data', data);
  const supplier = !isEmpty(data.supplier_forms)
    ? data.supplier_forms.filter((v) => v)
    : [];
  const renderBottomButton = () => {
    return (
      <div className="footer-content">
        <Button
          className={`item-btn ${
                    data.is_collect_available === 1 ? 'active-btn' : ''
                  }`}
                  onClick={() => {
                    if (data.is_collect_available === 1) {
                      props.history.push(routes.RECEIVED_DELIVERY);
                    }
                  }}
                >
                  <FormattedMessage id="IDS_COLLECT" />
                </Button>
                <Button
                  className={`item-btn ${
                    data.is_submitted_today === 1 ? 'active-btn' : ''
                  }`}
                  onClick={() => {
                    if (data.is_submitted_today === 1)
                      setTypeModal(TYPE_MODAL.SUBMIT);
                  }}
                >
                  <FormattedMessage id="IDS_SUBMIT_TODAY_ORDER_FORM" />
                </Button>
      </div>
    )
  }
  return (
    <Layout>
      <div className="scrollable-container order-form-container">
        <div className="content-container">
          <div className="header-order-container">
            <div className="left-header">
              {!isEmpty(store) && (
                <div>
                  <span className="title-info">
                    <FormattedMessage id="IDS_STORE" />
                    <span className="title-value">: {store.company_name}</span>
                  </span>
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
          {/* <div className="page-order-content"> */}
          {isEmpty(supplier) ? (
            <div className="empty-text">
              <div className="wapper-empty-text">
                <FormattedMessage id="IDS_NO_ORDER_ITEMS" />
              </div>
              {renderBottomButton()}
            </div>
          ) : (
            <div
              style={{
                marginTop: 0,
                overflow: 'auto',
              }}
              className="box-order-form"
            >
              {[...supplier].map((el, i) => (
                <OrderItem
                  item={el}
                  key={i}
                  isShowEdit={data.is_show_edit_button !== 0}
                />
              ))}
              <Box
                style={{
                  width: 335,
                  marginLeft: 'calc(100% - 345px)',
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
                  <FormattedMessage id="IDS_TOTAL_ITEM" />: {data.total_item}
                </p>
                <Divider
                  className="custom-divider"
                  style={{ margin: '0 0 28px 0' }}
                />
                <p
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: 24,
                    lineHeight: '36px',
                    fontFamily: 'NotoSansTC',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <FormattedMessage id="IDS_TOTAL" />
                  <span
                    style={{
                      marginLeft: 16,
                      fontSize: 36,
                      fontFamily: 'NotoSansTCBlack',
                    }}
                  >
                    {data.total_cost}
                  </span>
                </p>
              </Box>
              {renderBottomButton()}
            </div>
          )}
        </div>
        
        {typeModal === TYPE_MODAL.SUBMIT && (
          <SubmitOrderItemModal
            handleClose={closeModal}
            fetchData={fetchData}
          />
        )}
        {/* </div> */}
      </div>
    </Layout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
    account: state.system.account,
  }),
  { actionToggleMenu, actionSnackBar }
)(withRouter(OrderForm));
