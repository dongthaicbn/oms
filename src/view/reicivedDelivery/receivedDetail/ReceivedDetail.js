import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { Button, Divider, Typography, List, Radio, Input, Card } from 'antd';
import { isEmpty, getReasonType, getLangCode, formatNumber } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import AppTable from 'components/table/AppTable';
import InfoGroup from 'components/infoGroup/InfoGroup';
import NumberEditPopup from 'components/input/NumberEditPopup';
import RoundImage from 'components/image/RoundImage';
import AppModal from 'components/modal/AppModal';
import CircularProgress from '@material-ui/core/CircularProgress';
import CameraModal from 'components/modal/CameraModal';
import { actionSnackBar } from 'view/system/systemAction';
import { reasonType, UPLOAD_TYPE_FILE, UPLOAD_TYPE_URL, ACTION_ADD_PHOTO, ACTION_REMOVE_PHOTO, ORDER_ID_TYPE, ORDER_NO_TYPE, STATUS_DAMAGED, STATUS_PENDING, STATUS_RECEIVED } from 'utils/constants/constants';
import { ReactComponent as PlusIcon } from 'assets/icons/ic_plus.svg';
import * as icons from 'assets';
import {
  getReceivedDeliveryDetail, receivedDeliveryOrder,
  addDamageRecord, updateDamageRecord, deleteDamageRecord
} from './ReceivedDetailService';
import './ReceivedDetail.scss';

const {Title, Text} = Typography;
const {TextArea} = Input;

const MAX_REPORT_DAMAGED_PHOTOS = 3;
const MODE_ADD = 'add';
const MODE_EDIT = 'edit';
const MODE_VIEW = 'view';

const getMode = (status) => {
  switch (status) {
    case STATUS_PENDING: {
      return MODE_ADD;
    }

    case STATUS_DAMAGED:
    case STATUS_RECEIVED: {
      return MODE_EDIT;
    }

    default:
      return MODE_ADD;
  }
};

const itemColumns = [
  {
    title: <FormattedMessage id="IDS_ITEMS"/>,
    render: (item) => (
      <div className="app-flex-container item-info-container">
        <RoundImage src={item.image} alt="Item Image"/>
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
          {item.name} {item.pack_weight}
        </InfoGroup>
      </div>
    )
  },
  {
    title: <FormattedMessage id="IDS_ACTUAL_WEIGHT"/>,
    key: 'actualQuantity',
    width: 110,
    align: 'center',
    render: (item, actionProviders) => {
      if (item.show_actual_weight) {
        let actualWeight = actionProviders.getItemById(item.id)?.actual_weight;
        let editing = actionProviders.isItemActualWeightEditing(item.id);
        let pageMode = actionProviders.getPageMode();
        let content = <Button>
          {editing? (actualWeight?.editValue || '0') : formatNumber(actualWeight?.editValue || '00.00', '0.00')}
        </Button>;
        if (pageMode === MODE_VIEW) {
          return (
            <div className="app-button quantity-button actual-quantity">
              {content}
            </div>
          );
        }
        return (
          <div className="app-button quantity-button actual-quantity">
            <NumberEditPopup value={actualWeight?.editValue} minValue={0} maxValue={99999} maxFractionalDigits={2}
                                onCancel={() => actionProviders.updateItemActualWeight(item.id, item.actual_weight)}
                                onPopupCancel={(originValue) => actionProviders.updateItemActualWeight(item.id, originValue)}
                                onValueChanged={(newValue) => actionProviders.updateItemActualWeight(item.id, newValue)}
                                onVisibleChange={(visible) => actionProviders.updateEditingActualWeightItemId(visible? item.id : null)}>
              {content}
            </NumberEditPopup>
          </div>
        );
      }
    },
  },
  {
    title: <FormattedMessage id="IDS_RECEIVED_QUANTITY"/>,
    key: 'receivedQuantity',
    width: 120,
    align: 'center',
    render: (item, actionProviders) => {
      let value = actionProviders.getItemById(item.id)?.received_qty?.editValue;
      let pageMode = actionProviders.getPageMode();
      let content = <Button>
        {value || 0}
      </Button>;
      if (pageMode === MODE_VIEW) {
        return (
          <div className="app-button quantity-button received-quantity">
            {content}
          </div>
        );
      }
      return (
        <div className="app-button quantity-button received-quantity">
          <NumberEditPopup value={value} minValue={0} maxValue={99999} disableFractional={true}
                           onCancel={() => actionProviders.updateItemReceivedQty(item.id, item.received_qty)}
                           onPopupCancel={(originValue) => actionProviders.updateItemReceivedQty(item.id, originValue)}
                           onValueChanged={(newValue) => actionProviders.updateItemReceivedQty(item.id, newValue)}>
            {content}
          </NumberEditPopup>
        </div>
      );
    },
  }
];

const ReceivedDetail = (props) => {
  const { orderCode } = props.match.params;
  const paramsUrl = queryString.parse(props.location.search);
  const [data, setData] = useState({});
  const [loadingData, setLoadingData] = useState();
  const [mapItems, setMapItems] = useState({});
  const [rpDmgMeta, setRpDmgMeta] = useState({
    items: [],
    report: undefined
  });
  const [receivedDeliveryModalVisible, setReceivedDeliveryModalVisible] = useState(false);
  const [rpDmgItemsModalVisible, setRpDmgItemsModalVisible] = useState(false);
  const [rpDmgReasonModalVisible, setRpDmgReasonModalVisible] = useState(false);
  const [rpDmgInputReasonModalVisible, setRpDmgInputReasonModalVisible] = useState(false);
  const [rpDmgFormModalMeta, setRpDmgFormModalMeta] = useState({
    visible: false,
    mode: MODE_ADD
  });
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [confirmDeleteModalMeta, setConfirmDeleteModalMeta] = useState({
    visible: false,
    deleteReportId: undefined
  });
  const [editingActualWeightItemId, setEditingActualWeightItemId] = useState();

  const fetchData = async (orderCode) => {
    try {
      const res = await getReceivedDeliveryDetail(getLangCode(props.locale), paramsUrl.type || ORDER_NO_TYPE, orderCode);
      if (!isEmpty(res.data)) {
        return res.data;
      }
    } catch (e) {
      throw e;
    }
  };

  const initMapItems = (items) => {
    let result = {};
    items.forEach(item => {
      let actualWeight = item.actual_weight || 0;
      let receivedQty = item.received_qty ||  item.ordered_qty || 0;
      result[item.id] = {
        ...item,
        actual_weight: {
          originValue: actualWeight,
          editValue: actualWeight
        },
        received_qty: {
          originValue: receivedQty,
          editValue: receivedQty
        }
      }
    });
    setMapItems(result);
  };

  const refreshData = async () => {
    setLoadingData(true);
    let response = await fetchData(orderCode);
    setData(response.data);
    initMapItems(response.data.items);
    setLoadingData(false);
  };

  useEffect(() => refreshData(), []);

  const getItemById = (itemId) => {
    return mapItems[itemId];
  };

  const updateItemActualWeight = (itemId, newWeight) => {
    let item = mapItems[itemId];
    if (item) {
      item.actual_weight.editValue = newWeight;
      setMapItems({...mapItems});
    }
  };

  const getPageMode = () => {
    return getMode(data.order?.status);
  };

  const isItemActualWeightEditing = (itemId) => {
    return editingActualWeightItemId === itemId;
  };

  const updateEditingActualWeightItemId = (itemId) => {
    setEditingActualWeightItemId(itemId);
  };

  const updateItemReceivedQty = (itemId, newQty) => {
    let item = mapItems[itemId];
    if (item) {
      item.received_qty.editValue = newQty;
      setMapItems({...mapItems});
    }
  };

  const receiveDelivery = async () => {
    setReceivedDeliveryModalVisible(true);

    let items = Object.keys(mapItems).map((itemId) => ({
      id: itemId,
      actual_weight: mapItems[itemId].actual_weight.editValue || 0,
      received_qty: mapItems[itemId].received_qty.editValue || 0
    }));

    await receivedDeliveryOrder(data.order.order_id, items);

    setReceivedDeliveryModalVisible(false);
    props.actionSnackBar({
      open: true,
      type: 'success',
      messageID: 'IDS_RECEIVED_DELIVERY_SUCCESSFULLY',
      messageParams: {
        orderNo: data.order?.order_no
      }
    });
    goBack();
  };

  const reportDamageItems = (resetSelected, mode) => {
    if (resetSelected) {
      setRpDmgMeta({
        items: {},
        report: {
          report_id: undefined,
          reason_type: undefined,
          other_reason: undefined,
          photos: []
        }
      });
    }
    if (mode) {
      rpDmgFormModalMeta.mode = mode
    }
    setRpDmgItemsModalVisible(true);
    setRpDmgFormModalMeta({
      ...rpDmgFormModalMeta,
      visible: false
    })
  };

  const handleReportDamageItemSelected = (item) => {
    let newRpDmgMeta = {...rpDmgMeta};
    if (newRpDmgMeta.items[item.id]) {
      delete newRpDmgMeta.items[item.id];
    } else {
      newRpDmgMeta.items[item.id] = item;
    }
    setRpDmgMeta(newRpDmgMeta);
  };

  const handleReportDamageItemNext = () => {
    if (!isEmpty(rpDmgMeta.items)) {
      if (rpDmgFormModalMeta.mode === MODE_ADD) {
        reportDamageReasonSelection();
      } else {
        reportDamageForm();
      }
    }
  };

  const reportDamageReasonSelection = () => {
    setRpDmgReasonModalVisible(true);
    setRpDmgItemsModalVisible(false);
    setRpDmgFormModalMeta({...rpDmgFormModalMeta, visible: false});
  };

  const handleDamageReasonTypeSelected = (selectedReasonType) => {
    let newRpDmgMeta = {...rpDmgMeta};
    newRpDmgMeta.report.reason_type = selectedReasonType;
    setRpDmgMeta(newRpDmgMeta);

    if (selectedReasonType === reasonType.OTHER) {
      reportDamageInputReason();
    } else {
      reportDamageForm();
    }
  };

  const reportDamageInputReason = () => {
    setRpDmgInputReasonModalVisible(true);
    setRpDmgReasonModalVisible(false);
  };

  const handleReportDamageInputReasonChange = (event) => {
    let newRpDmgMeta = {...rpDmgMeta};
    newRpDmgMeta.report.other_reason = event.target.value;
    setRpDmgMeta(newRpDmgMeta);
  };

  const reportDamageForm = (mode) => {
    let newRpDmgFormModalMeta = {...rpDmgFormModalMeta};
    newRpDmgFormModalMeta.visible = true;
    if (mode) {
      newRpDmgFormModalMeta.mode = mode;
    }
    setRpDmgFormModalMeta(newRpDmgFormModalMeta);
    setRpDmgItemsModalVisible(false);
    setRpDmgReasonModalVisible(false);
    setRpDmgInputReasonModalVisible(false);
    setCameraModalVisible(false);
  };

  const handleRpDmgFormBack = () => {
    if (rpDmgMeta.report?.reason_type === reasonType.OTHER) {
      reportDamageInputReason();
    } else {
      reportDamageReasonSelection();
    }
  };

  const handleSubmitDamageForm = async () => {
    let reasonType = rpDmgMeta.report.reason_type;
    let otherReason = rpDmgMeta.report.other_reason;
    let items = Object.keys(rpDmgMeta.items).map((itemId) => ({id: itemId}));
    let photos = rpDmgMeta.report.photos;
    if (rpDmgFormModalMeta.mode === MODE_ADD) {
      await addDamageRecord(data.order?.order_id, reasonType, otherReason, items, photos);
    } else if (rpDmgFormModalMeta.mode === MODE_EDIT) {
      await updateDamageRecord(rpDmgMeta.report.report_id, reasonType, otherReason, items, photos);
    }
    fetchData(orderCode);
  };

  const showCameraModal = () => {
    setCameraModalVisible(true);
    setRpDmgFormModalMeta({
      ...rpDmgFormModalMeta,
      visible: false
    });
  };

  const renderImageButtons = (report) => {
    let result = report?.photos.map((photo, index) => {
      if (photo.action === ACTION_ADD_PHOTO) {
        return <RoundImage key={index} className="item-photo"
                           src={photo.file} deletable={true} onDelete={() => handleRemoveImage(index)}
                           disablePreview={true}/>
      }
    });
    if (report?.photos?.length < MAX_REPORT_DAMAGED_PHOTOS) {
      return <>
        {result}
        {renderAddImageButton()}
      </>;
    }
    return result;
  };

  const renderAddImageButton = () => {
    return <div className="item-photo item-add" onClick={() => showCameraModal()}>
      <PlusIcon/>
    </div>
  };

  const handleRemoveImage = (index) => {
    let newRpDmgMeta = {...rpDmgMeta};
    let photo = newRpDmgMeta.report.photos[index];
    if (photo.upload_type === UPLOAD_TYPE_URL) {
      photo.action = ACTION_REMOVE_PHOTO;
    } else {
      newRpDmgMeta.report.photos.splice(index, 1);
    }
    setRpDmgMeta(newRpDmgMeta);
  };

  const handleCameraError = (err) => {
    props.actionSnackBar({
      open: true,
      type: 'error',
      messageID: 'IDS_CAMERA_ERROR',
      messageParams: {
        message: err.message
      }
    });
  };

  const handleCaptureImage = (base64Image) => {
    const temp = [];
    if (!isEmpty(rpDmgMeta.report.photos)) {
      rpDmgMeta.report.photos.forEach((it, idx) => {
        temp.push({ ...it, position: idx + 1 });
      });
    }
    temp.push({
      action: ACTION_ADD_PHOTO,
      upload_type: UPLOAD_TYPE_FILE,
      file: base64Image,
      position: temp.length + 1
    });
    let newRpDmgMeta = { ...rpDmgMeta, report: { ...rpDmgMeta.report, photos: temp } };
    // newRpDmgMeta.report.photos.push({
    //   action: ACTION_ADD_PHOTO,
    //   upload_type: UPLOAD_TYPE_FILE,
    //   file: base64Image,
    // });
    setRpDmgMeta(newRpDmgMeta);
    reportDamageForm();
  };

  const handleEditDamageReport = (report) => {
    setRpDmgMeta({
      items: report.items.reduce((map, item) => ({...map, [item.id]: item}), {}),
      report: {
        report_id: report.report_id,
        reason_type: getReasonType(report.reason_type),
        other_reason: report.other_reason || '',
        photos: report.photos?.sort((photo1, photo2) => photo1.position - photo2.position)
          .map(photo => ({
            action: ACTION_ADD_PHOTO,
            upload_type: UPLOAD_TYPE_URL,
            file: photo.file_url,
            position: photo.position
          })) || []
      }
    });
    reportDamageForm(MODE_EDIT);
  };

  const handleDeleteDamageReport = async () => {
    await deleteDamageRecord(confirmDeleteModalMeta.deleteReportId, getLangCode(props.locale));
    fetchData(orderCode);
    props.actionSnackBar({
      open: true,
      type: 'success',
      messageID: 'IDS_DELETE_REPORT_SUCCESS_MESSAGE'
    });
  };

  const goBack = () => {
    props.history.goBack();
  };

  const renderDamageReports = () => {
    return data.reports?.map(report => {
      return (
        <Card key={report.report_id} className="item-damage-report">
          {
            report.items?.map(item => (
              <InfoGroup
                key={item.id}
                label={
                  <>
                    {item?.code}
                    <Divider type="vertical"/>
                    <FormattedMessage id="IDS_UNIT" values={{value: item?.unit}}/>
                  </>
                }
                labelClassName="item-info-label"
                noColon={true}
                className="item-info"
              >
                {item?.name} {item?.pack_weight}
              </InfoGroup>
            ))
          }
          <div className="report-reason-container app-button report-action-group">
            <InfoGroup labelID="IDS_REPORT_REASON" labelClassName="report-reason-label"
                       className="report-reason">
                        <span className="reason-type">
                          <FormattedMessage id={getReasonType(report.reason_type).textID}/>
                        </span>
              {report.other_reason && <> - {report.other_reason}</>}
            </InfoGroup>
            <Button className="btn-action action-edit"
                    onClick={() => handleEditDamageReport(report)}>
              <img src={icons.ic_edit} alt=""/>
            </Button>
            <Button className="btn-action action-delete"
                    onClick={() => setConfirmDeleteModalMeta({
                      visible: true,
                      deleteReportId: report.report_id
                    })}>
              <img src={icons.ic_delete} alt=""/>
            </Button>
          </div>
        </Card>
      );
    })
  };

  const renderBodyGroup = () => {
    if (loadingData) {
      return (
        <div className="loading-progress-container">
          <CircularProgress/>
        </div>
      )
    }
    return <>
      {renderDamageReports()}
      <AppTable columns={itemColumns}
                dataSource={data.items}
                showLoading={loadingData}
                actionProviders={{
                  getItemById: getItemById,
                  updateItemActualWeight: updateItemActualWeight,
                  updateItemReceivedQty: updateItemReceivedQty,
                  updateEditingActualWeightItemId: updateEditingActualWeightItemId,
                  isItemActualWeightEditing: isItemActualWeightEditing,
                  getPageMode: getPageMode
                }}/>
    </>;
  }

  const renderActionButton = () => {
    let buttonLabel;
    let mode = getPageMode();
    if (mode === MODE_ADD) {
      buttonLabel = <FormattedMessage id="IDS_RECEIVE_DELIVERY"/>;
    } else if (mode === MODE_EDIT) {
      buttonLabel = <FormattedMessage id="IDS_UPDATE"/>;
    }
    if (buttonLabel) {
      return (
        <Button type="primary" className="received-delivery-button"
                onClick={receiveDelivery}>
          {buttonLabel}
        </Button>
      );
    }
  };

  return (
    <div className="received-detail-container">
      <Layout emptyDrawer={true}>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container app-button">
                <div className="page-title">
                  <Title level={3}>
                    <FormattedMessage id="IDS_SELECTED_ITEM_LIST"/>
                  </Title>
                  <Text>
                    <FormattedMessage id="IDS_ORDER"/>: {data.order?.order_no}
                  </Text>
                </div>
                <Button type="primary" onClick={() => reportDamageItems(true, MODE_ADD)}>
                  <FormattedMessage id="IDS_REPORT_DAMAGE"/>
                </Button>
              </div>
            </div>
            <div className="body-group">
              {renderBodyGroup()}
            </div>
            <div className="footer-group app-button">
              <Button className="back-button" onClick={goBack}>
                <FormattedMessage id="IDS_BACK"/>
              </Button>
              {renderActionButton()}
            </div>
          </div>
        </div>
        <AppModal visible={receivedDeliveryModalVisible} titleID="IDS_RECEIVED_DELIVERY"
                  hideOkButton={true} hideCancelButton={true}
                  onVisibleChange={(visible) => setReceivedDeliveryModalVisible(visible)}>
          <div className="modal-progress-container">
            <CircularProgress/>
          </div>
        </AppModal>
        <AppModal visible={rpDmgItemsModalVisible} titleID="IDS_REPORT_DAMAGE"
                  hideOkButton={true} hideCancelButton={true} closable={true}
                  showBackButton={rpDmgFormModalMeta.mode === MODE_EDIT} onBack={reportDamageForm}
                  onVisibleChange={(visible) => setRpDmgItemsModalVisible(visible)}>
          <div className="modal-rp-dmg-item-selection">
            <div style={{marginBottom: 24}}>
              <FormattedMessage id="IDS_SELECT_REPORT_ITEMS"/>
            </div>
            <List className="scrollable"
                  dataSource={data.items}
                  renderItem={(item, index) => {
                    return (
                      <div
                        className={`selection-item ${index % 2 === 0 ? 'selection-item-odds' : 'selection-item-even'}`}>
                        <div className="item-code">
                          {item.code}
                        </div>
                        <div className="item-name">
                          {item.name} {item.pack_weight}
                        </div>
                        <div className="item-action">
                          <Radio size="large"
                                 checked={rpDmgMeta.items[item.id]}
                                 onClick={() => handleReportDamageItemSelected(item)}/>
                        </div>
                      </div>
                    )
                  }}/>
            <div className="app-button action-button">
              <Button type="primary" onClick={handleReportDamageItemNext}>
                <FormattedMessage id="IDS_NEXT"/>
              </Button>
            </div>
          </div>
        </AppModal>
        <AppModal visible={rpDmgReasonModalVisible} titleID="IDS_REPORT_DAMAGE"
                  hideOkButton={true} hideCancelButton={true} closable={true}
                  showBackButton={true} onBack={reportDamageItems}
                  onVisibleChange={(visible) => setRpDmgReasonModalVisible(visible)}>
          <div style={{marginBottom: 24}}>
            <FormattedMessage id="IDS_CHOOSE_A_REASON"/>
          </div>
          <div className="app-button modal-rp-dmg-action">
            <Button type={rpDmgFormModalMeta.mode === MODE_EDIT? 'primary' : ''}
                    onClick={() => handleDamageReasonTypeSelected(reasonType.PACKAGE_DAMAGED)}>
              <FormattedMessage id={reasonType.PACKAGE_DAMAGED.textID}/>
            </Button>
            <Button type={rpDmgFormModalMeta.mode === MODE_EDIT? 'primary' : ''}
                    onClick={() => handleDamageReasonTypeSelected(reasonType.WRONG_PRODUCT)}>
              <FormattedMessage id={reasonType.WRONG_PRODUCT.textID}/>
            </Button>
            <Button type={rpDmgFormModalMeta.mode === MODE_EDIT? 'primary' : ''}
                    onClick={() => handleDamageReasonTypeSelected(reasonType.SPOILED)}>
              <FormattedMessage id={reasonType.SPOILED.textID}/>
            </Button>
            <Button type={rpDmgFormModalMeta.mode === MODE_EDIT? 'primary' : ''}
                    onClick={() => handleDamageReasonTypeSelected(reasonType.OTHER)}>
              <FormattedMessage id={reasonType.OTHER.textID}/>
            </Button>
          </div>
        </AppModal>
        <AppModal visible={rpDmgInputReasonModalVisible} titleID="IDS_REPORT_DAMAGE"
                  hideCancelButton={true} closable={true}
                  showBackButton={true} onBack={reportDamageReasonSelection}
                  okTextID="IDS_NEXT" onOk={reportDamageForm}
                  onVisibleChange={(visible) => setRpDmgInputReasonModalVisible(visible)}>
          <div style={{marginBottom: 24}}>
            <FormattedMessage id="IDS_PLEASE_TYPE_A_DAMAGE_REASON"/>
          </div>
          <div className="modal-rp-dmg-input-reason">
            <TextArea value={rpDmgMeta.report?.other_reason}
                      onChange={handleReportDamageInputReasonChange}/>
          </div>
        </AppModal>
        <AppModal visible={rpDmgFormModalMeta.visible} titleID="IDS_REPORT_DAMAGE"
                  okTextID="IDS_REPORT_DAMAGE" onOk={handleSubmitDamageForm}
                  hideCancelButton={true} closable={true}
                  showBackButton={rpDmgFormModalMeta.mode === MODE_ADD} onBack={handleRpDmgFormBack}
                  onVisibleChange={(visible) => setRpDmgFormModalMeta({...rpDmgFormModalMeta, visible: visible})}>
          <div className="modal-rp-dmg-form">
            <Card title={<FormattedMessage id="IDS_REPORT_ITEM"/>} className="app-button report-action-group">
              <div className="selected-items">
                {
                  Object.keys(rpDmgMeta.items).map(itemId => (
                    <div key={itemId} className="item-info">
                      <div className="item-code">
                        {rpDmgMeta.items[itemId]?.code}
                      </div>
                      <div className="item-name">
                        {rpDmgMeta.items[itemId]?.name} {rpDmgMeta.items[itemId]?.pack_weight}
                      </div>
                    </div>
                  ))
                }
              </div>
              {
                rpDmgFormModalMeta.mode === MODE_EDIT &&
                <div className="app-button report-action-group">
                  <Button className="btn-action action-edit"
                          onClick={() => reportDamageItems()}>
                    <img src={icons.ic_edit} alt=""/>
                  </Button>
                </div>
              }
            </Card>
            <Card title={<FormattedMessage id="IDS_REPORT_ITEM"/>}>
              <div className="item-reason">
                <div className="reason-type">
                  {
                    rpDmgMeta.report?.reason_type &&
                    <>
                      - <FormattedMessage id={rpDmgMeta.report?.reason_type?.textID}/>
                    </>
                  }
                </div>
                {
                  rpDmgMeta.report?.reason_type === reasonType.OTHER &&
                  <div className="other-reason">
                    {rpDmgMeta.report?.other_reason || '_'}
                  </div>
                }
              </div>
              {
                rpDmgFormModalMeta.mode === MODE_EDIT &&
                <div className="app-button report-action-group">
                  <Button className="btn-action action-edit"
                          onClick={reportDamageReasonSelection}>
                    <img src={icons.ic_edit} alt=""/>
                  </Button>
                </div>
              }
            </Card>
            <Card title={<FormattedMessage id="IDS_PHOTOS_MAX" values={{max: MAX_REPORT_DAMAGED_PHOTOS}}/>}>
              <div className="list-photos">
                {renderImageButtons(rpDmgMeta.report)}
              </div>
            </Card>
          </div>
        </AppModal>
        <AppModal visible={confirmDeleteModalMeta.visible} titleID="IDS_DELETE_REPORT"
                  okTextID="IDS_DELETE" onOk={handleDeleteDamageReport}
                  onVisibleChange={(visible) => setConfirmDeleteModalMeta({...confirmDeleteModalMeta, visible: visible})}>
          <FormattedMessage id="IDS_DELETE_REPORT_CONFIRM_MESSAGE"/>
        </AppModal>
        {
          cameraModalVisible && <CameraModal onCapture={handleCaptureImage}
                                             onCameraError={handleCameraError}
                                             showBackButton={true} onBack={reportDamageForm}
                                             onVisibleChange={(visible) => setCameraModalVisible(visible)}/>
        }
      </Layout>
    </div>
  );
};

export default connect((state) => ({
  locale: state.system.locale,
}), {actionSnackBar})
(withRouter(ReceivedDetail));