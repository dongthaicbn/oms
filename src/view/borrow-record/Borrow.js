import React, { useState, useEffect, useRef } from 'react';
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
import { parse as parseQueryString } from 'query-string';
import { actionSnackBar } from 'view/system/systemAction';
import AppList from 'components/list/AppList';

const { Title, Text, Paragraph } = Typography;

const Borrow = props => {
  const [borrowStatus, setBorrowStatus] = useState(0);
  const [data, setData] = useState([]);
  const [lengthData, setLengthData] = useState(null)
  const child = useRef(null);
  const fetchData = async (borrowStatus, lastItemNo) => {
    try {
      const res = await getBorrowList(getLangCode(props.locale), borrowStatus, lastItemNo);
      console.log(res)
      if (!isEmpty(res.data)) {
        return res.data
        // setData(res.data.data.borrowingList);

      }
    } catch (e) {

    }
  };
  useEffect(() => {
    // fetchData(borrowStatus).then(
    //   response => {
    //     setData(response.data.borrowingList);

    //   }
    // )

  }, []);
  useEffect(() => {
    setData(undefined);
    fetchData(borrowStatus).then(response => {
      setData(response.data.borrowingList);
      let showNotiNewItem = localStorage.getItem("showNotiNewItem")
      if (showNotiNewItem) {
        // console.log(showNotiNewItem)
        localStorage.removeItem("showNotiNewItem")

        props.actionSnackBar({
          open: true,
          type: 'success',
          message: `Lending form created (Borrowing No: ${response.data.borrowingList && response.data.borrowingList.length > 0 && response.data.borrowingList[0].no})`,
        });
      }
      let idItemUpdateBorrow = localStorage.getItem("idItemUpdateBorrow")
      localStorage.removeItem("idItemUpdateBorrow")
      if (idItemUpdateBorrow) {
        let typeUpdateBorrow = localStorage.getItem("typeUpdateBorrow")
        localStorage.getItem("typeUpdateBorrow")
        if (typeUpdateBorrow == 2) {
          props.actionSnackBar({
            open: true,
            type: 'success',
            message: `Borrowing record has been rejected successfully
(Borrowing No: ${idItemUpdateBorrow})`,
          });
        } else if (typeUpdateBorrow == 1) {
          props.actionSnackBar({
            open: true,
            type: 'success',
            message: `Borrowing procedure completed successfully
(Borrowing No: ${idItemUpdateBorrow})`,
          });
        }
      }
    })
  }, [borrowStatus]);

  const refreshBorrowingItems = async () => {
    let response = await fetchData(borrowStatus);
    setData(response.data.borrowingList);
    return response.pagination.hasMore;
  };

  const loadMoreBorrowingItems = async (lastItem) => {
    let lastItemId = lastItem? lastItem.id : undefined;
    let response = await fetchData(borrowStatus, lastItemId);
    if (data) {
      setData([...data, ...response.data.borrowingList]);
    } else {
      setData(response.data.borrowingList);
    }
    return response.pagination.hasMore;
  };

  const renderDate = item => {
    return (
      <InfoGroup labelID="IDS_DATE" className="date">
        {formatDate(item.date, 'DD MMM')}
      </InfoGroup>
    );
  };
  const onLendingForm = () => {
    props.history.push(routes.LENDING_FORM)
  }
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
    let message;
    if (items && isEmpty(items)) {
      message = (
        <div className="borrowing-record-message-container">
          <Text className="message">
            <FormattedMessage id="IDS_NO_BORROW_RECORD_YET"/>
          </Text>
        </div>
      );
    }
    return <>
      {message}
      <AppList
        ref={c => child = c}
        dataSource={data}
        refreshOn={borrowStatus}
        onRefresh={refreshBorrowingItems}
        onLoadMore={loadMoreBorrowingItems}
        renderItem={item => (
          <div>
            <Card hoverable>
              <Row>
                <Col span={8}>{renderNameAndType(item)}</Col>
                <Col span={12}>{renderDate(item)}</Col>
                <Col span={4}>
                  <div className="borrow-date-type">
                    <Text className="date">
                      {formatDate(item.order_at, 'YYYY / MM / DD')}
                    </Text>
                    <TypeBorrow type={item.status === "Processing" ? item.type : item.status}>{item.status === "Processing" || item.status === "Accepted" ? item.type : item.status}</TypeBorrow>
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
                    {item.type == TYPE_BORROW && item.status === "Processing" ? (
                      <Button className="button-comfirm" onClick={goToDetail(item)}>
                        <FormattedMessage id="IDS_COMFIRM" />
                      </Button>
                    ) : null}
                  </div>
                </Col>
              </Row>
            </Card>

          </div>
        )}
      />
    </>
  };
  return (
    <div className="borrow-record-container">
      <Layout emptyDrawer={true}>
        <div className="app-scrollable-container ">
          <div className="app-content-container">
            <div className="header-container header-container-borrow">
              <div className="left-header">
                <Row className="title-borrow">
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
                      onChange={e => {
                        setBorrowStatus(e.target.value)
                        console.log(child)
                        // child.current.resetHasMore()
                      }}
                      value={borrowStatus}
                    >
                      <Space size={24}>
                        <Radio.Button value={0}>
                          <FormattedMessage id="IDS_ALL" /> {lengthData ? `(${lengthData['all']})` : null}
                        </Radio.Button>
                        <Radio.Button value={1}>
                          <FormattedMessage id="IDS_BORROWED" /> {lengthData ? `(${lengthData['borrow']})` : null}
                        </Radio.Button>
                        <Radio.Button value={2}>
                          <FormattedMessage id="IDS_LENDED" />  {lengthData ? `(${lengthData['lend']})` : null}
                        </Radio.Button>
                      </Space>
                    </Radio.Group>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="body-group">
              {renderListItems(data)}
            </div>
            <div className="page-footer">
              <Button className="lending-form-btn" onClick={onLendingForm}>
                <FormattedMessage id="IDS_LENDING_FORM" />
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </div>

  );
};
export default connect(
  (state) => ({
  }),
  { actionSnackBar }
)(withRouter(Borrow));
