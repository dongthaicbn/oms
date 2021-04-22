import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import { Button } from 'antd';
import './VehicleSchedule.scss';
import { actionToggleMenu } from '../system/systemAction';
import { getScheduleDetail } from './VehicleScheduleActions';
import { getLangCode, isEmpty } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import { routes } from 'utils/constants/constants';
import { Fragment } from 'react';
import * as icons from 'assets';
const MockData = [
  {
    items: [
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      }
    ],
    name: 'A AND C ENGINEERING (HK) LIMITED'
  },
  {
    items: [
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      },
      {
        code: 'FA0005',
        image:
          'https://toa-oms-dev.legato.co/storage/app/media/Request_A_Sample_1532534180500_0.jpg',
        name: '竹蔗',
        order_before_day: 2,
        pack_weight: '(~1/PCS)',
        vehicle_schdules: '1-3, 5-7'
      }
    ],
    name: 'BC'
  }
];
const VehicleScheduleDetail = props => {
  const [dataDetail, setDataDetail] = useState({});
  const { id } = props.match.params;
  const paramsUrl = queryString.parse(props.location.search);
  const fetchData = async () => {
    try {
      const { data } = await getScheduleDetail({
        lang_code: getLangCode(props.locale),
        is_favorite_category: paramsUrl.type === 'categories' ? 0 : 1,
        id
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

  // const { category, suppliers } = dataDetail;
  const { category } = dataDetail;
  const suppliers = MockData;
  console.log('dataDetail', dataDetail);
  return (
    <Layout>
      <div className="scrollable-container">
        <div className="content-container">
          <div className="header-container vehicle-detail">
            <span className="title-info">
              {!isEmpty(category) ? category.name : ''}
            </span>
          </div>

          <div className="page-content vehicle-detail">
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
                            <img
                              src={icons.img_pic}
                              alt=""
                              style={{
                                maxWidth: 75,
                                maxHeight: 60,
                                marginRight: 12
                              }}
                            />
                            <div className="items-column">
                              <span
                                style={{
                                  fontSize: 14,
                                  lineHeight: '21px',
                                  marginBottom: 2
                                }}
                              >
                                {item.code}
                              </span>
                              <span
                                style={{
                                  fontSize: 18,
                                  lineHeight: '27px',
                                  fontWeight: 600
                                }}
                              >
                                {item.name}&nbsp;
                                {item.pack_weight}
                              </span>
                            </div>
                          </div>
                          <div className="vehicle-column">
                            <span className="value-item">
                              {item.vehicle_schdules}
                            </span>
                          </div>
                          <div className="order-column">
                            <span className="value-item">
                              {item.order_before_day}
                            </span>
                          </div>
                        </div>
                      ))}
                  </Fragment>
                ))}
            </>
          </div>

          <div className="page-footer">
            <Button className="footer-btn" onClick={handleBack}>
              <FormattedMessage id="IDS_BACK" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default connect(
  state => ({
    locale: state.system.locale
  }),
  { actionToggleMenu }
)(withRouter(VehicleScheduleDetail));
