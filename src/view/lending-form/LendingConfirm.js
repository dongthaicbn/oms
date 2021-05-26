import React, { useEffect, useState } from 'react';
import { addLending } from './LendingFormService';
import { isEmpty } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import { Row, Col, Button, Typography } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RoundImage from 'components/image/RoundImage';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppTable from 'components/table/AppTable';

import AppModal from 'components/modal/AppModal';
import IconLoading from 'components/icon-loading/IconLoading';
import "./LendingConfirm.scss"
import moment from 'moment';
import { notification } from 'antd';

import { routes } from 'utils/constants/constants';
const { Text } = Typography;

const testData = {
  "categories": [
    {
      "name": "Kitchen",
      "items": [
        {
          "id": 1,
          "code": "FA0004",
          "name": "立青瓜片",
          "borrowed_qty": 10,
          "unit_id": 3,
          "unit_name": "Bag"
        },
        {
          "id": 1,
          "code": "FA0004",
          "name": "立青瓜片",
          "borrowed_qty": 10,
          "unit_id": 3,
          "unit_name": "Bag"
        },
        {
          "id": 1,
          "code": "FA0004",
          "name": "立青瓜片",
          "borrowed_qty": 10,
          "unit_id": 3,
          "unit_name": "Bag"
        },
        {
          "id": 1,
          "code": "FA0004",
          "name": "立青瓜片",
          "borrowed_qty": 10,
          "unit_id": 3,
          "unit_name": "Bag"
        }
      ]
    },
    {
      "name": "Bar",
      "items": [
        {
          "id": 1,
          "code": "FA0004",
          "name": "立青瓜片",
          "borrowed_qty": 10,
          "unit_id": 3,
          "unit_name": "Bag"
        },
        {
          "id": 1,
          "code": "FA0004",
          "name": "立青瓜片",
          "borrowed_qty": 10,
          "unit_id": 3,
          "unit_name": "Bag"
        },
        {
          "id": 1,
          "code": "FA0004",
          "name": "立青瓜片",
          "borrowed_qty": 10,
          "unit_id": 3,
          "unit_name": "Bag"
        },
        {
          "id": 1,
          "code": "FA0004",
          "name": "立青瓜片",
          "borrowed_qty": 10,
          "unit_id": 3,
          "unit_name": "Bag"
        },
        {
          "id": 1,
          "code": "FA0004",
          "name": "立青瓜片",
          "borrowed_qty": 10,
          "unit_id": 3,
          "unit_name": "Bag"
        }
      ]
    }
  ]
}

const itemColumns = [
  {
    title: <FormattedMessage id="IDS_ITEMS" />,
    render: item => (
      <div className="app-flex-container items-info-cell">
        <RoundImage src={item.image} alt="Item Image" />
        <div>
          <InfoGroup
            label={
              <>
                <Text>{item.code}</Text>
              </>
            }
            noColon={true}
          >
            {item.name}&nbsp;
            <FormattedMessage
              id="IDS_WEIGHT_PER_PACKS"
              values={{ weight: item.pack_weight }}
            />
          </InfoGroup>
        </div>
      </div>
    )
  },
  {
    title: 'Actual weight',
    align: 'center',
    width: '100px',
    render: item => <div className="borrowed-qty">{item.borrowed_qty}</div>
  },
  {
    title: 'Received qty',
    align: 'center',
    width: '100px',
    render: item => <div className="unit">{item.unit_name}</div>
  }
];
const LendingConfirm = props => {
  let [data, setData] = useState({});
  let [modalVisible, setModalVisible] = useState(false);
  let [loading, setLoading] = useState(false);
  const intl = useIntl();
  let shop_name = localStorage.getItem("shop_name")
  let lending_date = localStorage.getItem("lending_date") ? moment(localStorage.getItem("lending_date")) : null
  let shop_id = localStorage.getItem("shop_id")
  const goBack = () => {
    props.history.goBack();
  };
  useEffect(() => {
    let newData = JSON.parse(localStorage.getItem("lendingData"));
    // let newData = testData

    setData(newData)
  }, []);

  const onAdd = () => {

    props.history.push(`${routes.LENDING_FORM_GOODS_CATEGORY}?shop_id=${shop_id}`)
  }
  const onSubmit = async () => {
    setModalVisible(true)
    let bodyLending = {}
    bodyLending.shop_id = parseInt(shop_id)
    bodyLending.date = localStorage.getItem("lending_date")
    bodyLending.items = []
    if (data && data.categories) {
      data.categories.map(item => {
        item.items.map(childValue => {
          delete childValue.name
          delete childValue.code
          bodyLending.items.push(childValue)
        })
      })
    }
    // console.log(bodyLending)
    try {
      const { res } = await addLending(bodyLending);
      // console.log(res.data)
      localStorage.setItem("showNotiNewItem", true)
      props.history.push(routes.BORROW_RECORD)
      localStorage.removeItem("lendingData")
      localStorage.removeItem("shop_id")
      localStorage.removeItem("shop_name")
      localStorage.removeItem("lending_date")
    } catch (error) {
      notification['error']({
        message: intl.formatMessage({ id: 'IDS_ERROR' }),
        description: error && error.message
      });
    } finally {
      setModalVisible(false)
    }
  }

  return (
    <Layout emptyDrawer={true}>
      <div className="borrow-detail-container">
        <div className="app-content-container content-container">
          <Row className="borrow-detail-header">
            <Col span={20} className="lending-confirm-info-store">
              <div>
                <InfoGroup labelID="IDS_LENDING_TO" noColon>
                  {shop_name}
                </InfoGroup>

              </div>
              <div className="date-lending">
                <InfoGroup labelID="IDS_DATE" noColon>
                  {lending_date ?.format("DD MMM")}
                </InfoGroup>
              </div>
            </Col>
            <Col span={4}>
              <div className="app-flex-container flex-end app-button modal-button-container">
                {/* <IconButton icon={<FilterIcon />}>
                  <FormattedMessage id="IDS_FILTER" />
                </IconButton> */}
                <Button
                  type="primary"
                  className="action-button reject-button-container"
                  style={{ float: 'right' }}
                  onClick={onAdd}
                >
                  <FormattedMessage id="IDS_ADD_ITEMS" />
                </Button>
              </div>
            </Col>
          </Row>
          <Row className="lending-confirm-table">
            <Col span={24}>
              <AppTable
                columns={itemColumns}
                // columnDataSource={mapFormData}
                dataSource={data && data.categories}
                itemsKey="items"
                groupKey="name"
              // groupExpandable={createGroupExpandable()}
              // rowExpandable={createRowExpandable()}
              // groupError={(item) => formErrors[item.supplier_id]}
              // itemError={(item) => formErrors[item.supplier_id]}
              // actionProviders={{
              //   onItemQuantityChanged: onItemQuantityChanged,
              //   getItemCurrentQuantity: getItemCurrentQuantity
              // }}
              />
            </Col>
          </Row>
        </div>
        <div className="action-container app-button">
          <Button className="action-button back-button" onClick={goBack}>
            <FormattedMessage id="IDS_BACK" />
          </Button>
          <Button
            type="primary"
            className="action-button"
            style={{ float: 'right' }}
            onClick={onSubmit}
          >
            <FormattedMessage id="IDS_SUBMIT" />
          </Button>
        </div>
      </div>
      <AppModal
        visible={modalVisible}
        titleID={"IDS_SUBMIT_LENDING_FORM"}
        // onClose={() => setModalVisible(false)}
        hideCancelButton={true}
        hideOkButton={true}
      >
        <div className="wapper-loading">
          <IconLoading />
        </div>
      </AppModal>
    </Layout>
  );
};
export default connect()(withRouter(LendingConfirm));
