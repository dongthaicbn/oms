import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Typography, Divider, Button, Row, Col, Form, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import { routes } from 'utils/constants/constants';
import { isEmpty, getLangCode, formatDate, stringInsert, isDateValid, getMonth } from 'utils/helpers/helpers';
import { requiredValidationRule } from 'utils/helpers/validationRules'
import Layout from 'components/layout/Layout';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppTable from 'components/table/AppTable';
import NumberEditPopup from 'components/input/NumberEditPopup';
import DayMonthEditPopup, { INVALID_DATE_INPUT } from 'components/input/DayMonthEditPopup';
import moment from 'moment';
import RoundImage from 'components/image/RoundImage';
import AppModal from 'components/modal/AppModal';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { actionSnackBar } from 'view/system/systemAction';
import { getMonthlyInventoryDetail, submitMonthInventory } from './InventoryDetailService';
import './InventoryDetail.scss';

const {Title, Text} = Typography;
const {TextArea} = Input;

const EXPIRY_DATE_DISPLAY_FORMAT = 'DD / MM';
const EXPIRY_DATE_JSON_FORMAT = 'YYYY-MM-DD';

// const item = {
//   id: 12,
//   year: 2020,
//   month: 11,
//   submission_date: '2020-11-30',
//   deadline: '2020-11-30',
//   status: 'submitted',
//   items: [
//     {
//       product_id: 1,
//       code: 'FB0001-01',
//       unit: 'KG',
//       name: 'Grass carp 1',
//       pack_weight: '~1.25',
//       remaining_qty: 5,
//       expiry_date: undefined
//     },
//     {
//       product_id: 2,
//       code: 'FB0001-02',
//       unit: 'KG',
//       name: 'Grass carp 2',
//       pack_weight: '~2.25',
//       remaining_qty: 5,
//       expiry_date: '2021-01-01'
//     },
//     {
//       product_id: 3,
//       code: 'FB0001-03',
//       unit: 'KG',
//       name: 'Grass carp 3',
//       pack_weight: '~3.25',
//       remaining_qty: 5,
//       expiry_date: '2021-01-02'
//     },
//     {
//       product_id: 4,
//       code: 'FB0001-04',
//       unit: 'KG',
//       name: 'Grass carp 4',
//       pack_weight: '~4.25',
//       remaining_qty: undefined,
//       expiry_date: undefined
//     },
//     {
//       product_id: 5,
//       code: 'FB0001-05',
//       unit: 'KG',
//       name: 'Grass carp 5',
//       pack_weight: '~5.25',
//       remaining_qty: 0,
//       expiry_date: '2021-01-05'
//     },
//     {
//       product_id: 6,
//       code: 'FB0001-06',
//       unit: 'KG',
//       name: 'Grass carp 6',
//       pack_weight: '~6.25',
//       remaining_qty: 0,
//       expiry_date: '2021-01-06'
//     },
//     {
//       product_id: 7,
//       code: 'FB0001-07',
//       unit: 'KG',
//       name: 'Grass carp 7',
//       pack_weight: '~7.25',
//       remaining_qty: 0,
//       expiry_date: '2021-01-07'
//     },
//     {
//       product_id: 8,
//       code: 'FB0001-08',
//       unit: 'KG',
//       name: 'Grass carp 8',
//       pack_weight: '~8.25',
//       remaining_qty: 0,
//       expiry_date: '2021-01-08'
//     },
//     {
//       product_id: 9,
//       code: 'FB0001-09',
//       unit: 'KG',
//       name: 'Grass carp 9',
//       pack_weight: '~9.25',
//       remaining_qty: 0,
//       expiry_date: '2021-01-09'
//     },
//     {
//       product_id: 10,
//       code: 'FB0001-10',
//       unit: 'KG',
//       name: 'Grass carp',
//       pack_weight: '~10.25',
//       remaining_qty: undefined,
//       expiry_date: undefined
//     },
//     {
//       product_id: 11,
//       code: 'FB0001-11',
//       unit: 'KG',
//       name: 'Grass carp',
//       pack_weight: '~11.25',
//       remaining_qty: 0,
//       expiry_date: '2021-01-11'
//     }
//   ]
// };

const displayInputDate = (value) => {
  let displayValue;
  if (value instanceof Date) {
    displayValue = formatDate(value, EXPIRY_DATE_DISPLAY_FORMAT);
  } else if (typeof value === 'string' && value.length > 2) {
    displayValue = stringInsert(value, 2, ' / ');
  } else {
    displayValue = value;
  }
  return displayValue || <span className="placeholder-date-format">{EXPIRY_DATE_DISPLAY_FORMAT}</span>;
};

const itemColumns = [
  {
    title: <FormattedMessage id="IDS_ITEMS"/>,
    render: (item, actionProviders, rowIndex) => (
      <div className="app-flex-container item-info-container">
        <RoundImage src={item.image} alt="Item Image"/>
        <div>
          <InfoGroup
            label={
              <>
                {item.code}
                <Divider type="vertical"/>
                <FormattedMessage id="IDS_UNIT" values={{value: item.unit}}/>
              </>
            }
            labelClassName="item-info-label"
            noColon={true}
            className="item-info"
          >
            {item.name}&nbsp;
            <FormattedMessage
              id="IDS_WEIGHT_PER_PACKS"
              values={{weight: item.pack_weight}}
            />
          </InfoGroup>
        </div>
        {
          !actionProviders.isConfirmMode() && (
            <Form.Item name={['items', rowIndex, 'product_id']}
                       initialValue={item.product_id}
                       hidden>
              <Input/>
            </Form.Item>
          )
        }
      </div>
    ),
  },
  {
    title: <FormattedMessage id="IDS_EXPIRY_DATE"/>,
    key: 'expiryDate',
    align: 'center',
    width: '118px',
    render: (item, actionProviders, rowIndex) => {
      let expiryDate = actionProviders.getItemById(item.product_id)?.expiry_date;
      if (actionProviders.isConfirmMode()) {
        return <div className="input-cell expiry-date-input">
          {formatDate(expiryDate?.editValue, EXPIRY_DATE_DISPLAY_FORMAT)}
        </div>
      }
      return (
        <div className={`app-button input-cell expiry-date-input ${actionProviders.isFormSubmitFailed() && expiryDate?.error ? 'input-error' : ''}`}>
          <DayMonthEditPopup value={expiryDate?.editValue} year={actionProviders.getYear()}
                             onCancel={() => actionProviders.editItemField(item.product_id, 'expiry_date', expiryDate?.originValue)}
                             onPopupCancel={(originValue) => actionProviders.editItemField(item.product_id, 'expiry_date', originValue)}
                             onValueChanged={(newValue) => actionProviders.editItemField(item.product_id, 'expiry_date', newValue)}
                             onSubmit={(value) => actionProviders.handleEditItemFieldSubmit(item.product_id, rowIndex, 'expiry_date', formatDate(value, EXPIRY_DATE_JSON_FORMAT))}
                             onError={(error) => actionProviders.handleExpiryDateInputError(item, error)}>
            <Button>
              {displayInputDate(expiryDate?.editValue)}
            </Button>
          </DayMonthEditPopup>
          <Form.Item name={['items', rowIndex, 'expiry_date']}
                     initialValue={formatDate(expiryDate?.originValue, EXPIRY_DATE_JSON_FORMAT)}
                     rules={[requiredValidationRule('Expiry date')]} hidden>
            <Input/>
          </Form.Item>
        </div>
      );
    }
  },
  {
    title: <FormattedMessage id="IDS_REMAINING_QUANTITY"/>,
    key: 'remainingQty',
    align: 'center',
    width: '111px',
    render: (item, actionProviders, rowIndex) => {
      let remainingQty = actionProviders.getItemById(item.product_id)?.remaining_qty;
      if (actionProviders.isConfirmMode()) {
        return <div className="input-cell remaining-quantity-input">
          {remainingQty?.editValue || 0}
        </div>;
      }
      return (
        <div className="app-button input-cell remaining-quantity-input">
          <NumberEditPopup value={remainingQty?.editValue} minValue={0} maxValue={99999} disableFractional={true}
                           onCancel={() => actionProviders.editItemField(item.product_id, 'remaining_qty', item.remaining_qty)}
                           onPopupCancel={(originValue) => actionProviders.editItemField(item.product_id, 'remaining_qty', originValue)}
                           onValueChanged={(newValue) => actionProviders.editItemField(item.product_id, 'remaining_qty', newValue)}
                           onSubmit={(value) => actionProviders.handleEditItemFieldSubmit(item.product_id, rowIndex, 'remaining_qty', value)}>
            <Button>
              {remainingQty?.editValue || 0}
            </Button>
          </NumberEditPopup>
          <Form.Item name={['items', rowIndex, 'remaining_qty']}
                     initialValue={remainingQty?.originValue || 0}
                     rules={[requiredValidationRule('Remaining quantity')]} hidden>
            <Input/>
          </Form.Item>
        </div>
      );
    }
  },
];

const InventoryDetail = (props) => {
  const {id} = props.match.params;
  const [data, setData] = useState();
  const [mapItems, setMapItems] = useState({});
  const [confirmMode, setConfirmMode] = useState(false);
  const [confirmSubmitModalVisible, setConfirmSubmitModalVisible] = useState(false);
  const [submitProgressModalVisible, setSubmitProgressModalVisible] = useState(false);
  const [formSubmitFailed, setFormSubmitFailed] = useState(false);
  const [formData] = Form.useForm();
  const [submitData, setSubmitData] = useState({
    remark: undefined,
    items: []
  });

  const fetchData = async (inventoryId) => {
    try {
      const res = await getMonthlyInventoryDetail(getLangCode(props.locale), inventoryId);
      if (!isEmpty(res.data)) {
        let data = res.data.data?.inventory_list;
        initMapItems(data.items);
        setData(data);
      }
    } catch (e) {
    }
  };

  const initMapItems = (items) => {
    let result = {};
    items.forEach(item => {
      let expiryDate = moment(item.expiry_date, EXPIRY_DATE_JSON_FORMAT).toDate();
      expiryDate = isDateValid(expiryDate) ? expiryDate : undefined;
      result[item.product_id] = {
        ...item,
        expiry_date: {
          originValue: expiryDate,
          editValue: expiryDate,
          error: !expiryDate
        },
        remaining_qty: {
          originValue: item.remaining_qty || 0,
          editValue: item.remaining_qty || 0
        }
      }
    });
    setMapItems(result);
  };

  useEffect(() => {
    fetchData(id);
    // setData(item);
    // initMapItems(item.items);
  }, []);

  const isConfirmMode = () => {
    return confirmMode;
  };

  const isFormSubmitFailed = () => {
    return formSubmitFailed;
  };

  const getYear = () => {
    return data?.year;
  };

  const getItemById = (itemId) => {
    return mapItems[itemId];
  };

  const editItemField = (itemId, fieldName, newValue) => {
    let item = mapItems[itemId];
    if (item && item[fieldName]?.editValue !== newValue) {
      item[fieldName].editValue = newValue;
      item[fieldName].error = !newValue;
      setMapItems({...mapItems});
    }
  };

  const handleEditItemFieldSubmit = (itemId, itemIndex, fieldName, newValue) => {
    formData.setFields([
      {
        name: ['items', itemIndex, fieldName],
        value: newValue
      }
    ]);
    return true;
  };

  const handleExpiryDateInputError = (item, error) => {
    switch (error) {
      case INVALID_DATE_INPUT: {
        props.actionSnackBar({
          open: true,
          type: 'error',
          messageID: 'IDS_INVALID_DATE_INPUT_FORMAT',
        });
      }
    }
  };

  const renderBodyGroup = () => {
    let table = <AppTable columns={itemColumns}
                          dataSource={data?.items}
                          actionProviders={{
                            getItemById: getItemById,
                            editItemField: editItemField,
                            getYear: getYear,
                            handleExpiryDateInputError: handleExpiryDateInputError,
                            handleEditItemFieldSubmit: handleEditItemFieldSubmit,
                            isConfirmMode: isConfirmMode,
                            isFormSubmitFailed: isFormSubmitFailed
                          }}
                          renderBottom={renderRemarkInput}/>;
    if (confirmMode) {
      return table;
    }
    return (
      <Form form={formData} scrollToFirstError={true}
            onFinish={showConfirmInventory} onFinishFailed={() => setFormSubmitFailed(true)}>
        <Form.Item name={['id']} initialValue={Number(id)} hidden>
          <Input/>
        </Form.Item>
        {table}
      </Form>
    );
  };

  const renderRemarkInput = () => {
    let remark;
    if (confirmMode) {
      remark = submitData.remark;
    } else {
    remark = <Form.Item name="remark" rules={[requiredValidationRule('Remark')]}>
      <TextArea/>
    </Form.Item>
    }
    return (
      <Row className="remark-input-container">
        <Col span={24}>
          <div className="remark-input-label">
            <FormattedMessage id="IDS_REMARK"/>
          </div>
          <div className="remark-input">
            {remark}
          </div>
        </Col>
      </Row>
    )
  };

  const goBack = () => {
    props.history.push(routes.INVENTORY);
  };

  const backToEdit = () => {
    setConfirmMode(false);
  };

  const showConfirmInventory = (submitData) => {
    setSubmitData(submitData);
    setConfirmMode(true);
  };

  const confirmSubmitInventory = () => {
    setConfirmSubmitModalVisible(true);
  };

  const submitInventory = () => {
    setSubmitProgressModalVisible(true);
    setConfirmSubmitModalVisible(false);

    submitMonthInventory(submitData)
      .then(() => {
        setSubmitProgressModalVisible(false);
        goBack();
        props.actionSnackBar({
          open: true,
          type: 'success',
          messageID: 'IDS_INVENTORY_SUBMIT_SUCCESS_MESSAGE',
        });
      });
  };

  return (
    <div className="inventory-detail-container">
      <Layout emptyDrawer={true}>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container">
                <div className="page-title">
                  <Title level={3}>
                    <FormattedMessage id="IDS_INVENTORY"/>
                    {
                      data && <>
                        &nbsp;- <FormattedMessage id={getMonth(data?.month)}/> {data?.year}
                      </>
                    }
                  </Title>
                  <Text>
                    <FormattedMessage id="IDS_STORE_NAME" values={{name: props.account?.store?.company_name}}/>
                  </Text>
                </div>
              </div>
            </div>
            <div className="body-group">
              {renderBodyGroup()}
            </div>
            <div className="footer-group app-button">
              <Button className="back-button" onClick={() => confirmMode ? backToEdit() : goBack()}>
                <FormattedMessage id={confirmMode ? 'IDS_BACK_TO_EDIT' : 'IDS_BACK'}/>
              </Button>
              <Button type="primary" className="submit-button"
                      onClick={() => confirmMode ? confirmSubmitInventory() : formData.submit()}>
                <FormattedMessage id={confirmMode ? 'IDS_CONFIRM' : 'IDS_SUBMIT'}/>
              </Button>
            </div>
          </div>
        </div>
        <AppModal visible={confirmSubmitModalVisible}
                  onVisibleChange={(visible) => setConfirmSubmitModalVisible(visible)}
                  titleID="IDS_SUBMIT_INVENTORY_FORM"
                  okTextID="IDS_SUBMIT" onOk={submitInventory}>
          <FormattedMessage id="IDS_SUBMIT_INVENTORY_FORM_MESSAGE"/>
        </AppModal>
        <AppModal visible={submitProgressModalVisible}
                  onVisibleChange={(visible) => setSubmitProgressModalVisible(visible)}
                  titleID="IDS_SUBMIT_INVENTORY_FORM" hideOkButton={true} hideCancelButton={true}>
          <div className="modal-progress-container">
            <CircularProgress/>
          </div>
        </AppModal>
      </Layout>
    </div>
  )
};

export default connect(
  state => ({
    locale: state.system.locale,
    account: state.system.account
  }),
  {actionSnackBar}
)(withRouter(InventoryDetail));