import React, { useEffect, useState } from 'react';
import { getBorrowDetail, updateBorrowing } from './BorrowDetailService';
import { isEmpty } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import { Row, Col, Button, Typography, Divider } from 'antd';
import { ReactComponent as FilterIcon } from 'assets/icons/ic_filter.svg';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RoundImage from 'components/image/RoundImage';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppTable from 'components/table/AppTable';
import './BorrowDetail.scss';
import SignatureCanvas from 'react-signature-canvas';
import AppModal from 'components/modal/AppModal';
import IconLoading from 'components/icon-loading/IconLoading';

const { Title, Text, Paragraph } = Typography;
const TYPE_REJECT = 2
const TYPE_ACCEPT = 1

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
    render: item => <div className="unit">{item.unit}</div>
  }
];
const BorrowDetail = props => {
  let [data, setData] = useState({});
  let [sigCanvas, setSigCanvas] = useState(null);
  let [modalVisible, setModalVisible] = useState(false);
  let [loading, setLoading] = useState(false);
  let [imageSign, setImageSign] = useState(null);
  let [stateAction, setStateAction] = useState(null)
  const fetchData = async () => {
    try {
      const res = await getBorrowDetail(1, props.match.params.id);
      if (!isEmpty(res.data)) {
        setData(res.data.data);
        console.log(res.data.data);
      }
    } catch (e) { }
  };
  const goBack = () => {
    props.history.goBack();
  };
  useEffect(() => {
    fetchData();
  }, []);
  const onClearSign = () => {
    sigCanvas.clear();
  };
  const onOk = async () => {
    setLoading(true);
    setImageSign(sigCanvas.toDataURL());
    try {
      const res = await updateBorrowing(props.match.params.id, stateAction, sigCanvas.toDataURL());

    } catch (e) { }
  };
  const onReject = () => {
    setStateAction(TYPE_REJECT)
    setModalVisible(true)

  }
  const onConfirm = () => {
    setStateAction(TYPE_ACCEPT)
    setModalVisible(true)
  }
  return (
    <Layout>
      <div className="borrow-detail-container">
        <div className="app-content-container content-container">
          <Row className="borrow-detail-header">
            <Col span={20}>
              {/* <div className="app-flex-container height-full flex-va-center">
                <Title level={3}>{data.borrowing?.name}</Title>
              </div> */}
              <InfoGroup labelID="IDS_BORROW_FROM" noColon>
                {data.borrowing ?.name}
              </InfoGroup>
              <div className="borrow-no">
                <Paragraph>
                  <FormattedMessage id="IDS_BORROWING_NO" />
                  :&nbsp;
                  <Text strong>{data.borrowing ?.no}</Text>
                </Paragraph>
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
                  onClick={onReject}
                >
                  <FormattedMessage id="IDS_REJECT" />
                </Button>
              </div>
            </Col>
          </Row>
          <Row className="borrow-detail-table">
            <Col span={24}>
              <AppTable
                columns={itemColumns}
                // columnDataSource={mapFormData}
                dataSource={data.categories}
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
            onClick={onConfirm}
          >
            <FormattedMessage id="IDS_COMFIRM" />
          </Button>
        </div>
      </div>
      <AppModal
        visible={modalVisible}
        titleID={stateAction === TYPE_REJECT ? "IDS_REJECT_BORROWING" : "IDS_CONFIRM_BORROWING"}
        okTextID={stateAction === TYPE_REJECT ? "IDS_REJECT" : "IDS_COMFIRM"}
        onOk={onOk}
        cancelTextID="IDS_CLEAR"
        onCancel={onClearSign}
        closable
        onClose={() => setModalVisible(false)}
        hideCancelButton={loading}
        hideOkButton={loading}
      >
        {stateAction === TYPE_REJECT ? <FormattedMessage id="IDS_PLEASE_SIGN_TO_REJECT" /> : <FormattedMessage id="IDS_PLEASE_SIGN_TO_CONFIRM" />}

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
                className: 'sigCanvas'
              }}
              ref={ref => {
                setSigCanvas(ref);
              }}
            />
          )}
      </AppModal>
    </Layout>
  );
};
export default connect()(withRouter(BorrowDetail));
