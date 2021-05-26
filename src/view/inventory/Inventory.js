import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Col, Row, Tag, Typography, List, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import { routes, STATUS_SUBMITTED } from 'utils/constants/constants';
import { getYearRange, isEmpty, getLangCode, getMonth, formatDate } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import AppSelect from 'components/select/AppSelect';
import InfoGroup from 'components/infoGroup/InfoGroup';
import { getMonthlyInventory } from './InventoryService';
import './Inventory.scss'

const {Title, Text} = Typography;

const defaultSelectedYear = new Date().getFullYear();
const yearSelections = getYearRange(defaultSelectedYear, 2015)
  .map(year => {
    return {
      id: year,
      label: year
    }
  });

const Inventory = (props) => {
  const [selectedYear, setSelectedYear] = useState(defaultSelectedYear);
  const [data, setData] = useState();

  const fetchData = async (year) => {
    try {
      const res = await getMonthlyInventory(getLangCode(props.locale), year);
      if (!isEmpty(res.data)) {
        let data = res.data.data?.inventory_list;
        setData(data);
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const nagigateToInventoryDetail = (item) => {
    props.history.push(routes.INVENTORY_DETAIL.replace(':id', item.id))
  };

  const renderSubmissionInfo = (item) => {
    if (item.status === STATUS_SUBMITTED) {
      return <InfoGroup labelID="IDS_DATE" className="submision-date-color">
        <img className="date-icon" src={icons.ic_tick} alt="icon_tick"/>
        {formatDate(item.submission_date, 'DD MMM')}
      </InfoGroup>
    }
    return <InfoGroup labelID="IDS_DEADLINE" className="deadline-color">
      {formatDate(item.deadline, 'DD MMM')}
    </InfoGroup>
  };

  const renderItemActionButton = (item) => {
    if (item.status === STATUS_SUBMITTED) {
      return <Button>
        <FormattedMessage id="IDS_VIEW"/>
      </Button>
    }
    return <Button type="primary" onClick={() => nagigateToInventoryDetail(item)}>
      <FormattedMessage id="IDS_INVENTORY"/>
    </Button>
  };



  const renderListItems = (items) => {
    return (
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Card hoverable>
              <Row>
                <Col span={8}>
                  <InfoGroup labelID="IDS_INVENTORY">
                    <FormattedMessage id={getMonth(item.month)}/> {item.year}
                  </InfoGroup>
                </Col>
                <Col span={8}>
                  {renderSubmissionInfo(item)}
                </Col>
                <Col span={8}>
                  <div className="app-button item-action-container">
                    {renderItemActionButton(item)}
                  </div>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    );
  };
  return (
    <div className="inventory-container">
      <Layout emptyDrawer={true}>
        <div className="app-scrollable-container">
          <div className="app-content-container">
            <div className="header-group">
              <div className="page-info-container">
                <div className="page-title">
                  <Title level={3}>
                    <FormattedMessage id="IDS_MONTHLY_INVENTORY"/>
                  </Title>
                  <Text>
                    <FormattedMessage id="IDS_STORE_NAME" values={{name: props.account?.store?.company_name}}/>
                  </Text>
                </div>
                <div className="year-selection-container">
                  <AppSelect selections={yearSelections}
                             value={selectedYear} onChange={(newValue) => setSelectedYear(newValue)}>
                  </AppSelect>
                </div>
              </div>
            </div>
            <div className="body-group">
              {renderListItems(data)}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
};

export default connect(
  state => ({
    locale: state.system.locale,
    account: state.system.account
  }),
  {}
)(withRouter(Inventory));