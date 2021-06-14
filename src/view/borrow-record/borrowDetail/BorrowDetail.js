import React, { useEffect, useState } from 'react';
import { getBorrowDetail, updateBorrowing } from './BorrowDetailService';
import { isEmpty } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import { Row, Col, Button, Typography, Divider, notification } from 'antd';
import { ReactComponent as FilterIcon } from 'assets/icons/ic_filter.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RoundImage from 'components/image/RoundImage';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppTable from 'components/table/AppTable';
import './BorrowDetail.scss';
import SignatureCanvas from 'react-signature-canvas';
import AppModal from 'components/modal/AppModal';
import IconLoading from 'components/icon-loading/IconLoading';
import { routes } from 'utils/constants/constants';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const TYPE_REJECT = 2;
const TYPE_ACCEPT = 1;

const itemColumns = [
  {
    title: <FormattedMessage id="IDS_ITEMS" />,
    render: (item) => (
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
    ),
  },
  {
    title: 'Borrowed Qty',
    align: 'center',
    width: '100px',
    render: (item) => (
      <div className="borrowed-qty">{item.borrowed_qty.toFixed(1)}</div>
    ),
  },
  {
    title: 'Unit',
    align: 'center',
    width: '100px',
    render: (item) => <div className="unit">{item.unit}</div>,
  },
];
const BorrowDetail = (props) => {
  let [data, setData] = useState({});
  let [sigCanvas, setSigCanvas] = useState(null);
  let [modalVisible, setModalVisible] = useState(false);
  let [loading, setLoading] = useState(false);
  let [imageSign, setImageSign] = useState(null);
  let [stateAction, setStateAction] = useState(null);
  let [showEdit, setShowEdit] = useState(false);
  const fetchData = async () => {
    try {
      const res = await getBorrowDetail(1, props.match.params.id);
      if (!isEmpty(res.data)) {
        setData(res.data.data);
        if (res.data.data && res.data.data.borrowing && res.data.data.borrowing.status == "Processing" && res.data.data.borrowing.type != 'lend') {
          setShowEdit(true)
        }
      }
    } catch (e) { }
  };
  const intl = useIntl();
  const goBack = () => {
    console.log("goBack")
    props.history.goBack();
  };
  useEffect(() => {

    fetchData();
  }, []);
  const onClearSign = () => {
    if (sigCanvas) {
      sigCanvas.clear();
    }
  };
  const openNotificationError = (message) => {
    notification['error']({
      message: intl.formatMessage({ id: 'IDS_ERROR' }),
      description: message,
    });
  };
  const onOk = async () => {
    setLoading(true);
    setImageSign(sigCanvas.toDataURL());

    try {
      const res = await updateBorrowing(
        props.match.params.id,
        stateAction,
        sigCanvas.toDataURL()
      );
      handleResultUpdate(res.data);
    } catch (e) {
      setLoading(false);
      sigCanvas.clear();
      openNotificationError('An error occurred');
    }
  };
  const handleResultUpdate = (res) => {
    let status = res && res.result && res.result.status;
    switch (status) {
      case 200:
        localStorage.setItem('idItemUpdateBorrow', data.borrowing ?.no);
        localStorage.setItem('typeUpdateBorrow', stateAction);
        setModalVisible(false);
        setLoading(false);
        sigCanvas.clear();
        props.history.push(routes.BORROW_RECORD);
        break;
      default:
        openNotificationError(res.result && res.result.message);
        setModalVisible(false);
        setLoading(false);
        sigCanvas.clear();
    }
  };
  const onReject = () => {
    setStateAction(TYPE_REJECT);
    setModalVisible(true);
  };
  const onConfirm = () => {
    setStateAction(TYPE_ACCEPT);
    setModalVisible(true);
  };
  return (
    <div>
      <div className="borrow-detail-container">
        <div className="app-content-container content-container">
          <Row className="borrow-detail-header">
            <Col span={16}>
              {/* <div className="app-flex-container height-full flex-va-center">
                <Title level={3}>{data.borrowing?.name}</Title>
              </div> */}
              <div className="first-line-title-borrow">
                <InfoGroup labelID="IDS_BORROW_FROM" noColon>
                  {data ?.borrowing ?.name}
                </InfoGroup>
                <div className="date-borrow">
                  <InfoGroup labelID="IDS_DATE" noColon>
                    {data && data.borrowing && data.borrowing.date
                      ? moment(data && data.borrowing.date).format('DD MMM')
                      : '_'}
                  </InfoGroup>
                </div>
              </div>
              <div className="borrow-no">
                <Paragraph>
                  <FormattedMessage id="IDS_BORROWING_NO" />
                  :&nbsp;
                  <Text strong>{data ?.borrowing ?.no}</Text>
                </Paragraph>
              </div>
            </Col>
            <Col span={8}>
              <div className="app-flex-container flex-end app-button modal-button-container">
                {/* <IconButton icon={<FilterIcon />}>
                  <FormattedMessage id="IDS_FILTER" />
                </IconButton> */}
                {showEdit ?
                  <Button
                    type="primary"
                    className="action-button reject-button-container"
                    style={{ float: 'right' }}
                    onClick={onReject}
                  >
                    <FormattedMessage id="IDS_REJECT" />
                  </Button> : null}
              </div>
            </Col>
          </Row>
          <Row className="borrow-detail-table">
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
          {showEdit ?
            <Button
              type="primary"
              className="action-button"
              style={{ float: 'right' }}
              onClick={onConfirm}
            >
              <FormattedMessage id="IDS_COMFIRM" />
            </Button> : null}
        </div>
      </div>
      <AppModal
        visible={modalVisible}
        titleID={
          stateAction === TYPE_REJECT
            ? 'IDS_REJECT_BORROWING'
            : 'IDS_CONFIRM_BORROWING'
        }
        okTextID={stateAction === TYPE_REJECT ? 'IDS_REJECT' : 'IDS_COMFIRM'}
        onOk={onOk}
        onClickNotCloseModal={true}
        cancelTextID="IDS_CLEAR"
        onCancel={onClearSign}
        closable
        onVisibleChange={() => setModalVisible(false)}
        hideCancelButton={loading}
        hideOkButton={loading}
      >
        {stateAction === TYPE_REJECT ? (
          <FormattedMessage id="IDS_PLEASE_SIGN_TO_REJECT" />
        ) : (
            <FormattedMessage id="IDS_PLEASE_SIGN_TO_CONFIRM" />
          )}

        {loading ? (
          <div>
            <img className="image-sign" src={imageSign} />
            <div className="icon-loading">
              <IconLoading />
            </div>
          </div>
        ) : (
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                width: 420,
                height:
                  window.innerHeight - 300 > 300 ? 300 : window.innerHeight - 300,
                className: 'sigCanvas',
              }}
              ref={(ref) => {
                setSigCanvas(ref);
              }}
            />
          )}
      </AppModal>
    </div>
  );
};
export default connect()(withRouter(BorrowDetail));
