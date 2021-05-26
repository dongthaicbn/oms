import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
import { routes, reasonType, UPLOAD_TYPE_FILE, UPLOAD_TYPE_URL } from 'utils/constants/constants';
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
        return (
          <div className="app-button quantity-button actual-quantity">
            <NumberEditPopup value={actualWeight?.editValue} minValue={0} maxValue={99999} maxFractionalDigits={2}
                             onCancel={() => actionProviders.updateItemActualWeight(item.id, item.actual_weight)}
                             onPopupCancel={(originValue) => actionProviders.updateItemActualWeight(item.id, originValue)}
                             onValueChanged={(newValue) => actionProviders.updateItemActualWeight(item.id, newValue)}
                             onVisibleChange={(visible) => actionProviders.updateEditingActualWeightItemId(visible? item.id : null)}>
              <Button>
                {editing? (actualWeight?.editValue || '0') : formatNumber(actualWeight?.editValue || '00.00', '0.00')}
              </Button>
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
      return (
        <div className="app-button quantity-button received-quantity">
          <NumberEditPopup value={value} minValue={0} maxValue={99999} disableFractional={true}
                           onCancel={() => actionProviders.updateItemReceivedQty(item.id, item.received_qty)}
                           onPopupCancel={(originValue) => actionProviders.updateItemReceivedQty(item.id, originValue)}
                           onValueChanged={(newValue) => actionProviders.updateItemReceivedQty(item.id, newValue)}>
            <Button>
              {value || 0}
            </Button>
          </NumberEditPopup>
        </div>
      );
    },
  }
];

const ReceivedDetail = (props) => {
  const {orderNo} = props.match.params;
  const [data, setData] = useState([]);
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

  const fetchData = async (orderNo) => {
    try {
      const res = await getReceivedDeliveryDetail(getLangCode(props.locale), orderNo);
      if (!isEmpty(res.data)) {
        let data = res.data.data;
        setData(data);
        initMapItems(data.items);
      }
    } catch (e) {
    }
  };

  const initMapItems = (items) => {
    let result = {};
    items.forEach(item => result[item.id] = {
      ...item,
      actual_weight: {
        originValue: item.actual_weight || 0,
        editValue: item.actual_weight || 0
      },
      received_qty: {
        originValue: item.received_qty || 0,
        editValue: item.received_qty || 0
      }
    });
    setMapItems(result);
  };

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

  useEffect(() => fetchData(orderNo), []);

  const receiveDelivery = async () => {
    setReceivedDeliveryModalVisible(true);

    let items = Object.keys(mapItems).map((itemId) => ({
      id: itemId,
      actual_weight: mapItems[itemId].actual_weight.editValue || 0,
      received_qty: mapItems[itemId].received_qty.editValue || 0
    }));

    await receivedDeliveryOrder(orderNo, items);

    setReceivedDeliveryModalVisible(false);
    props.actionSnackBar({
      open: true,
      type: 'success',
      messageID: 'IDS_RECEIVED_DELIVERY_SUCCESSFULLY',
      messageParams: {
        orderNo: orderNo
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
      await addDamageRecord(orderNo, reasonType, otherReason, items, photos);
    } else if (rpDmgFormModalMeta.mode === MODE_EDIT) {
      await updateDamageRecord(rpDmgMeta.report.report_id, reasonType, otherReason, items, photos);
    }
    fetchData(orderNo);
  };

  const showCameraModal = () => {
    setCameraModalVisible(true);
    setRpDmgFormModalMeta({
      ...rpDmgFormModalMeta,
      visible: false
    });
  };

  const renderAddImageButton = (photos) => {
    if (!photos || photos.length < MAX_REPORT_DAMAGED_PHOTOS) {
      return <div className="item-photo item-add" onClick={() => showCameraModal()}>
        <PlusIcon/>
      </div>
    }
  };

  const handleRemoveImage = (index) => {
    let newRpDmgMeta = {...rpDmgMeta};
    newRpDmgMeta.report.photos.splice(index, 1);
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
    let newRpDmgMeta = {...rpDmgMeta};
    newRpDmgMeta.report.photos.push({
      upload_type: UPLOAD_TYPE_FILE,
      file: base64Image
    });
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
            upload_type: UPLOAD_TYPE_URL,
            file: photo.file_url
          })) || []
      }
    });
    reportDamageForm(MODE_EDIT);
  };

  const handleDeleteDamageReport = async () => {
    await deleteDamageRecord(confirmDeleteModalMeta.deleteReportId, getLangCode(props.locale));
    fetchData(orderNo);
    props.actionSnackBar({
      open: true,
      type: 'success',
      messageID: 'IDS_DELETE_REPORT_SUCCESS_MESSAGE'
    });
  };

  const goBack = () => {
    if (props.editMode) {
      props.history.push(routes.ORDER_DETAILS.replace(':orderNo', orderNo));
    } else {
      props.history.push(routes.RECEIVED_DELIVERY);
    }
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

  const renderActionButton = () => {
    let buttonLabel;
    if (props.editMode) {
      buttonLabel = <FormattedMessage id="IDS_UPDATE"/>;
    } else {
      buttonLabel = <FormattedMessage id="IDS_RECEIVED_DELIVERY"/>;
    }
    return (
      <Button type="primary" className="received-delivery-button"
              onClick={receiveDelivery}>
        {buttonLabel}
      </Button>
    );
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
              {renderDamageReports()}
              <AppTable columns={itemColumns}
                        dataSource={data.items}
                        actionProviders={{
                          getItemById: getItemById,
                          updateItemActualWeight: updateItemActualWeight,
                          updateItemReceivedQty: updateItemReceivedQty,
                          updateEditingActualWeightItemId: updateEditingActualWeightItemId,
                          isItemActualWeightEditing: isItemActualWeightEditing
                        }}/>
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
                {
                  rpDmgMeta.report?.photos.map((photo, index) => {
                    return <RoundImage key={index} className="item-photo"
                                       src={photo.file} deletable={true} onDelete={() => handleRemoveImage(index)}
                                       disablePreview={true}/>
                  })
                }
                {renderAddImageButton(rpDmgMeta.report?.photos)}
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