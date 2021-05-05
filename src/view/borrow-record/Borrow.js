import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Layout from 'components/layout/Layout';
import { withRouter, Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import { Row, Col, Space, Radio, Typography, List, Card, Button } from 'antd';
import { formatDate, isEmpty, getLangCode } from 'utils/helpers/helpers';
import TypeBorrow from 'components/typeBorrow/TypeBorrow';

import { TYPE_LEND, TYPE_BORROW, routes } from 'utils/constants/constants';
import * as icons from 'assets';
import { getBorrowList } from './BorrowService';
import './Borrow.scss';
import InfoGroup from 'components/infoGroup/InfoGroup';

const { Title, Text, Paragraph } = Typography;

const Borrow = props => {
  const [borrowStatus, setBorrowStatus] = useState(0);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getBorrowList(getLangCode(props.locale), borrowStatus);
      if (!isEmpty(res.data)) {
        setAllData(res.data.data.borrowingList);
        setData(res.data.data.borrowingList);
      }
    } catch (e) { }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    switch (borrowStatus) {
      case 0:
        {
          setData(allData);
        }
        break;

      case 1:
        {
          setData(allData.filter(item => item.type === 'borrow'));
        }
        break;

      case 2:
        {
          setData(allData.filter(item => item.type === 'lend'));
        }
        break;
    }
  }, [borrowStatus]);

  const renderDate = item => {
    return (
      <InfoGroup labelID="IDS_DATE" className="date">
        {formatDate(item.date, 'DD MMM')}
      </InfoGroup>
    );
  };
  const renderNameAndType = item => {
    switch (item.type) {
      case TYPE_BORROW:
        return (
          <InfoGroup labelID="IDS_BORROW_FROM" noColon>
            {item.name.substring(15, item.name.length)}
          </InfoGroup>
        );

      case TYPE_LEND:
        return (
          <InfoGroup labelID="IDS_LEND_TO" noColon>
            {item.name.substring(7, item.name.length)}
          </InfoGroup>
        );
      default:
        return;
    }
  };
  const goToDetail = item => () => {
    console.log(item.id)
    props.history.push(`${routes.BORROW_RECORD}/${item.id}`)
  }
  const renderListItems = items => {
    if (isEmpty(items)) {
      return (
        <>
          <div className="borrowing-record-message-container">
            <Text className="message">
              <FormattedMessage id="IDS_NO_BORROW_RECORD_YET" />
            </Text>
          </div>
        </>
      );
    }
    return (
      <div className="list-borrow-record-container">
        <List
          itemLayout="vertical"
          dataSource={data}
          renderItem={item => (
            <List.Item>

              <Card hoverable>
                <Row>
                  <Col span={8}>{renderNameAndType(item)}</Col>
                  <Col span={12}>{renderDate(item)}</Col>
                  <Col span={4}>
                    <div className="borrow-date-type">
                      <Text className="date">
                        {formatDate(item.order_at, 'YYYY / MM / DD')}
                      </Text>
                      <TypeBorrow type={item.type}>{item.type}</TypeBorrow>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="borrow-no">
                      <Paragraph>
                        <FormattedMessage id="IDS_BORROWING_NO" />
                        :&nbsp;
                          <Text strong>{item.no}</Text>
                      </Paragraph>
                      {item.type == TYPE_BORROW ? (
                        <Button className="button-comfirm" onClick={goToDetail(item)}>
                          <FormattedMessage id="IDS_COMFIRM" />
                        </Button>
                      ) : null}
                    </div>
                  </Col>
                </Row>
              </Card>

            </List.Item>
          )}
        />
      </div>
    );
  };
  return (
    <Layout>
      <div className="scrollable-container">
        <div className="content-container">
          <div className="header-container">
            <div className="left-header">
              <Row>
                <Col span={24}>
                  <Title level={3}>
                    <FormattedMessage id="IDS_BORROWING_RECORD" />
                  </Title>
                </Col>
              </Row>
              <Row className="status-filter-container no-margin-bottom">
                <Col span={24}>
                  <Radio.Group
                    defaultValue="ALL"
                    buttonStyle="solid"
                    onChange={e => setBorrowStatus(e.target.value)}
                    value={borrowStatus}
                  >
                    <Space size={24}>
                      <Radio.Button value={0}>
                        <FormattedMessage id="IDS_ALL" />
                      </Radio.Button>
                      <Radio.Button value={1}>
                        <FormattedMessage id="IDS_BORROWED" />
                      </Radio.Button>
                      <Radio.Button value={2}>
                        <FormattedMessage id="IDS_LENDED" />
                      </Radio.Button>
                    </Space>
                  </Radio.Group>
                </Col>
              </Row>
            </div>
          </div>
          <div className="page-content-borrow">
            <Row>
              <Col span={24}>{renderListItems(data)}</Col>
            </Row>
          </div>
          <div className="page-footer">
            <Button className="lending-form-btn">
              <FormattedMessage id="IDS_LENDING_FORM" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default connect()(withRouter(Borrow));
