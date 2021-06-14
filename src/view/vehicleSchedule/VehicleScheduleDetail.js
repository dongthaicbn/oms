import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import './VehicleSchedule.scss';
import { actionToggleMenu } from '../system/systemAction';
import { getScheduleDetail } from './VehicleScheduleActions';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import { routes } from 'utils/constants/constants';
import AppTable from 'components/table/AppTable';
import InfoGroup from 'components/infoGroup/InfoGroup';
// import * as icons from 'assets';
import RoundImage from 'components/image/RoundImage';
import {isIPad} from 'utils/helpers/helpers';

const { Text } = Typography;

const itemColumns = [
  {
    title: <FormattedMessage id="IDS_ITEMS" />,
    render: (item) => (
      <div className="app-flex-container items-info-cell">
        <RoundImage src={item.image} alt="Item Image" />
        <div>
          <InfoGroup label={<Text>{item.code}</Text>} noColon={true}>
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
    title: (
      <span style={{ textAlign: 'center' }}>
        <FormattedMessage id="IDS_VEHICLE_SCHEDULE" />
      </span>
    ),
    align: 'center',
    width: '100px',
    render: (item) => (
      <span className="value-item">{item.vehicle_schdules}</span>
    ),
  },
  {
    title: (
      <span style={{ textAlign: 'center' }}>
        <FormattedMessage id="IDS_ORDER_BEFORE" />
      </span>
    ),
    align: 'center',
    width: '100px',
    render: (item) => (
      <span className="value-item">{item.order_before_day}</span>
    ),
  },
];

const VehicleScheduleDetail = (props) => {
  const [dataDetail, setDataDetail] = useState({});
  const { id } = props.match.params;
  const paramsUrl = queryString.parse(props.location.search);
  const fetchData = async () => {
    try {
      const { data } = await getScheduleDetail({
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
    props.history.push(routes.VEHICLE_SCHEDULE);
  };

  const { category, suppliers } = dataDetail;
  return (
    <Layout>
      <>
        <div className="borrow-detail-container">
          <div className={`app-content-container content-container container-vehicle-schedule-detail`}>
            <Row className="borrow-detail-header">
              <Col span={16} className="lending-confirm-info-store">
                <div className="title-info">
                  {!isEmpty(category) ? category.name : ''}
                </div>
              </Col>
            </Row>
            <Row className="lending-confirm-table">
              <Col span={24}>
                <AppTable
                  columns={itemColumns}
                  // columnDataSource={mapFormData}
                  dataSource={suppliers || []}
                  itemsKey="items"
                  groupKey="name"
                />
              </Col>
            </Row>
          </div>
          <div className="action-container app-button">
            <Button className="action-button back-button" onClick={handleBack}>
              <FormattedMessage id="IDS_BACK" />
            </Button>
          </div>
        </div>
        {/* <div className="scrollable-container" style={{ position: 'relative' }}>
        <div className="content-container">
          <div className="header-container vehicle-detail">
            <span className="title-info">
              {!isEmpty(category) ? category.name : ''}
            </span>
          </div>
          <Row className="borrow-detail-table">
            <Col span={24}>
              <AppTable
                columns={itemColumns}
                // columnDataSource={mapFormData}
                dataSource={suppliers || []}
                itemsKey="items"
                groupKey="name"
              />
            </Col>
          </Row>
          <div
            className="page-content vehicle-detail"
            // style={{ overflow: 'auto' }}
          >
            <div className="header-fix">
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
            </div>

            <div className="header-fill" />

            <>
              {!isEmpty(suppliers) &&
                suppliers.map((el, i) => (
                  <Fragment key={i}>
                    <div className="wapper-title-vehicle">
                      <p className="title-vehicle-item">{el.name}</p>
                    </div>

                    {!isEmpty(el.items) &&
                      el.items.map((item, idx) => (
                        <div className="header-group vehicle-item" key={idx}>
                          <div
                            className="items-column"
                            style={{ flexDirection: 'row' }}
                          >
                            <RoundImage src={item.image} alt="Item Image" />
                            <div className="items-column">
                              <span
                                style={{
                                  fontSize: 14,
                                  lineHeight: '21px',
                                  marginBottom: 2,
                                }}
                              >
                                {item.code}
                              </span>
                              <span
                                style={{
                                  fontSize: 18,
                                  lineHeight: '27px',
                                  fontWeight: 600,
                                }}
                              >
                                {item.name}&nbsp;
                                {item.pack_weight}
                              </span>
                            </div>
                          </div>
                          <div className="vehicle-column">
                            {!isEmpty(item.vehicle_schdules) && (
                              <span className="value-item">
                                {item.vehicle_schdules}
                              </span>
                            )}
                          </div>
                          <div className="order-column">
                            {!isEmpty(item.order_before_day) && (
                              <span className="value-item">
                                {item.order_before_day}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </Fragment>
                ))}
            </>
          </div>
        </div>
        <div
          className="page-footer"
          style={{
            background: '#f3f3f9',
            padding: '24px 12px 24px 0',
            width: 'calc(100% - 24px)',
          }}
        >
          <Button className="footer-btn" onClick={handleBack}>
            <FormattedMessage id="IDS_BACK" />
          </Button>
        </div>
      </div> */}
      </>
    </Layout>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  { actionToggleMenu }
)(withRouter(VehicleScheduleDetail));
