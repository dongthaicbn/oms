import React, { useEffect, useState } from 'react';
// import { getBorrowDetail, updateBorrowing } from './BorrowDetailService';
import { getLedingFormCategoriesDetail } from '../LendingFormService';
import { isEmpty, getLangCode } from 'utils/helpers/helpers';
import Layout from 'components/layout/Layout';
import { Row, Col, Button, Typography, Divider } from 'antd';
import { ReactComponent as FilterIcon } from 'assets/icons/ic_filter.svg';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RoundImage from 'components/image/RoundImage';
import InfoGroup from 'components/infoGroup/InfoGroup';
import AppTable from 'components/table/AppTable';
import './LendingGoodCategoryDetail.scss';
import queryString from 'query-string';
import NumberEditPopup from 'components/input/NumberEditPopup';
import UnitEditPopup from 'components/input/UnitEditPopup'
import { routes } from '../../../utils/constants/constants'


const { Title, Text, Paragraph } = Typography;
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
    title: (actionProviders) => {
      return (actionProviders.addedItem ? 'Borrowed qty' : '')
    },
    align: 'center',
    width: '100px',
    render: (item, actionProviders) => {
      if (item.edited) {
        return (
          // <div className="borrowed-qty">{item.borrowed_qty}</div>
          <div className="app-button quantity-button borrowed-quantity">
            <NumberEditPopup value={item.borrowed_qty} minValue={0} maxValue={99999} disableFractional={false}
              onCancel={() => actionProviders.updateItemActualWeight(item._index, item.borrowed_qty)}
              onPopupCancel={(originValue) => actionProviders.updateItemActualWeight(item._index, originValue)}
              onValueChanged={(newValue) => actionProviders.updateItemActualWeight(item._index, newValue)}>
              <Button>
                {item.borrowed_qty || 0}
              </Button>
            </NumberEditPopup>
          </div>
        )
      }
      return null
    }

  },
  {
    title: (actionProviders) => { return (actionProviders.addedItem ? 'Unit' : '') },
    align: 'center',
    width: '120px',
    render: (item, actionProviders) => {
      if (item.edited) {
        console.log("item.edited")
        return (
          <UnitEditPopup value={item.unit_id} minValue={0} maxValue={99999} disableFractional={true}
            onCancel={() => { }}
            onPopupCancel={(originValue) => actionProviders.updateItemUnit(item._index, originValue)}
            onValueChanged={(newValue) => actionProviders.updateItemUnit(item._index, newValue)}
            units={actionProviders.units}
          >
            <div className="unit">{item.unit_name}</div>
          </UnitEditPopup>

        )
      } else {
        return (
          <div className="borrow" onClick={() => actionProviders.onChangeStateLending(item._index)}>Borrow</div>
        )
      }

    }
  }
];

const LendingGoodCategoryDetail = props => {
  let [data, setData] = useState({});
  let [units, setUnits] = useState([]);
  let [addedItem, setAddedItem] = useState(false)
  const paramsUrl = queryString.parse(props.location.search);
  let [bodySend, setBodySend] = useState([]);
  let [items, setItems] = useState(null)
  const fetchData = async () => {
    try {
      const res = await getLedingFormCategoriesDetail({
        lang_code: getLangCode(props.locale),
        id: props.match.params.id,
        is_favorite_category: paramsUrl.type === 'categories' ? 0 : 1,
        shop_id: paramsUrl.shop_id
      });

      if (!isEmpty(res.data)) {
        let historyData = JSON.parse(localStorage.getItem("lendingData"));
        console.log(historyData)
        setAddedItem(true)
        let parseData = []
        let wapperParseData
        if (historyData && historyData.categories) {
          let historyItems = historyData.categories.find(element => element.name == res.data.data.category.name)


          if (historyItems) {
            parseData = mergeArrays(historyItems.items, res.data.data.category.items)
            wapperParseData = {
              name: res.data.data.category.name,
              items: parseData
            }
          } else {
            wapperParseData = res.data.data.category
          }
        } else {
          wapperParseData = res.data.data.category
        }

        let newData = res.data.data
        newData.categories = []
        newData.category = wapperParseData
        newData.categories.push(wapperParseData)
        setData(newData);
        setUnits(res.data.data.units)
        localStorage.setItem("units", JSON.stringify(res.data.data.units));
        setBodySend(wapperParseData.items)

      }
    } catch (e) { }
  };
  const mergeArrays = (a, b) => {
    var hash = {};
    var ret = [];

    for (var i = 0; i < a.length; i++) {
      var e = a[i].id;
      if (!hash[e]) {
        hash[e] = true;
        ret.push(a[i]);
      }
    }
    for (var i = 0; i < b.length; i++) {
      var e = b[i].id;
      if (!hash[e]) {
        hash[e] = true;
        ret.push(b[i]);
      }
    }

    return ret;
  }

  const goBack = () => {
    props.history.goBack();
  };
  useEffect(() => {
    fetchData();
  }, []);



  const onConfirm = () => {
    // console.log(data)
    // console.log(bodySend)
    let cleanBodySend = bodySend.filter(e => e.borrowed_qty > 0)
    let newBodySend = {
      items: cleanBodySend,
      name: data.category.name
    }
    if (addedItem) {

      let newData = JSON.parse(localStorage.getItem("lendingData"));
      if (newData) {
        let indexOfItemSelected = newData.categories.findIndex(item => item.name === data.category.name)
        if (indexOfItemSelected != -1) {
          let parseData = []
          let wapperParseData

          // parseData = mergeSplitArrays(data.categories[0].items, newData.categories[0].items)
          // newData.categories[0].items.map(e => {
          //   data.categories[0].items.map(he => {
          //     if (e.id == he.id) {
          //       parseData.push(he)
          //       return
          //     } else {
          //       parseData.push(e)

          //     }
          //   })
          // })
          // console.log(parseData)
          // wapperParseData = {
          //   name: data.category.name,
          //   items: parseData
          // }
          newData.categories.splice(indexOfItemSelected, 1, newBodySend)
        } else {
          newData.categories.push(newBodySend)
        }
        delete newData.category
        delete newData.units
        localStorage.setItem("lendingData", JSON.stringify(newData));
      } else {
        let newData = {
          categories: [
            newBodySend
          ]
        }
        // let saveData = data
        // delete saveData.category
        // delete saveData.units
        localStorage.setItem("lendingData", JSON.stringify(newData));
      }
    } else {
      console.log("addedItem false")
      // let newData = JSON.parse(localStorage.getItem("lendingData"));
      // if (newData) {
      //   let indexOfItemSelected = newData.categories.findIndex(item => item.name === data.category.name)
      //   if (indexOfItemSelected != -1) {
      //     newData.categories.splice(indexOfItemSelected, 1)
      //     localStorage.setItem("lendingData", JSON.stringify(newData));

      //   }
      // }
    }
    props.history.push(routes.LENDING_CONFIRM)
  }
  const onChangeStateLending = (index) => {
    console.log("onChangeStateLending")
    setAddedItem(true)
    let items = [...data.categories[0].items];
    items[index].edited = true
    items[index].borrowed_qty = 10;
    items[index].unit_id = units[0].id
    items[index].unit_name = units[0].name
    
    let newData = {...data};
    newData.categories[0].items = items;
    setData(newData)

    let newbodySend = bodySend
    let newItem = data.categories[0].items[index]
    newItem.borrowed_qty = 10
    newItem.unit_name = units[0].name
    newItem.unit_id = units[0].id


    let indexItem = bodySend.findIndex(e => e.id == data.categories[0].items[index].id)
    if (indexItem) {
      newbodySend.splice(indexItem, 1, newItem)
    }

    setBodySend(newbodySend)
  }
  const updateItemActualWeight = (index, newWeight) => {
    setAddedItem(true)
    data.categories[0].items[index].borrowed_qty = newWeight
    let newData = Object.assign({}, data);
    setData(newData)

    let newbodySend = bodySend
    let newItem = data.categories[0].items[index]
    newItem.borrowed_qty = newWeight
    let indexItem = bodySend.findIndex(e => e.id == data.categories[0].items[index].id)
    if (indexItem) {
      newbodySend.splice(indexItem, 1, newItem)
    }

    setBodySend(newbodySend)


  };
  const updateItemUnit = (index, newUnit) => {
    setAddedItem(true)
    data.categories[0].items[index].unit_id = newUnit
    data.categories[0].items[index].unit_name = units.find(item => item.id === newUnit).name
    let newData = Object.assign({}, data);
    setData(newData)

    let newbodySend = bodySend
    let newItem = data.categories[0].items[index]
    newItem.unit_id = newUnit
    newItem.unit_name = units.find(item => item.id === newUnit).name
    console.log(data.categories[0].items[index].id)
    let indexItem = bodySend.findIndex(e => e.id == data.categories[0].items[index].id)
    if (indexItem) {
      newbodySend.splice(indexItem, 1, newItem)
    }
    // newbodySend.push(newItem);
    setBodySend(newbodySend)
    console.log(bodySend)
    console.log(newbodySend)


  };

  return (
    <Layout emptyDrawer={true}>
      <div className="lending-form-container">
        <div className="app-content-container content-container table-container">
          <Row className="borrow-detail-header">
            <Col span={24}>
              {/* <div className="app-flex-container height-full flex-va-center">
                <Title level={3}>{data.borrowing?.name}</Title>
              </div> */}
              <div >
                <span className="category-name">
                  {paramsUrl ?.category_name}
                </span>
                <span className="sub-category-name"> - Selected items</span>
              </div>
            </Col>
          </Row>
          <Row className="lending-good-category-detail-table">
            <Col span={24}>
              <AppTable
                columns={itemColumns}
                // columnDataSource={mapFormData}
                dataSource={data && data.categories && data.categories.length > 0 && data.categories[0].items}
                // itemsKey="items"

                // groupKey="name"
                // groupExpandable={createGroupExpandable()}
                // rowExpandable={createRowExpandable()}
                // groupError={(item) => formErrors[item.supplier_id]}
                // itemError={(item) => formErrors[item.supplier_id]}
                actionProviders={{
                  onChangeStateLending: onChangeStateLending,
                  updateItemActualWeight: updateItemActualWeight,
                  updateItemUnit,
                  units,
                  addedItem
                }}
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
            <FormattedMessage id="IDS_ADD" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};
export default connect()(withRouter(LendingGoodCategoryDetail));
