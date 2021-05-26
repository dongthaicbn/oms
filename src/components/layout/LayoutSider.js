import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import { routes } from 'utils/constants/constants';
import { actionToggleMenu, actionLayoutSliderRouting } from 'view/system/systemAction';

const LayoutSider = (props) => {
  const { location, empty } = props;

  const menuList = [
    {
      name: <FormattedMessage id="IDS_ORDER_FORM" />,
      url: routes.ORDER_FORM,
      icon: icons.ic_order_form,
      isActive:
        location.pathname.includes(routes.ORDER_FORM) ||
        location.pathname.includes(routes.GOODS_CATEGORIES),
    },
    {
      name: <FormattedMessage id="IDS_ORDER_RECORD" />,
      url: routes.ORDER_RECORD,
      icon: icons.ic_order_record,
      isActive: location.pathname.includes(routes.ORDER_RECORD),
    },
    {
      name: <FormattedMessage id="IDS_VEHICLE_SCHEDULE" />,
      url: routes.VEHICLE_SCHEDULE,
      icon: icons.ic_vehicle_schedule,
      isActive: location.pathname.includes(routes.VEHICLE_SCHEDULE),
    },
    {
      name: <FormattedMessage id="IDS_HOLIDAY" />,
      url: routes.HOLIDAY,
      icon: icons.ic_holiday,
      isActive: location.pathname.includes(routes.HOLIDAY),
    },
    {
      name: <FormattedMessage id="IDS_FAVOURITE" />,
      url: routes.FAVOURITE,
      icon: icons.ic_favourite,
      isActive: location.pathname === routes.FAVOURITE,
    },
  ];
  const handleClickMenu = (el) => {
    props.actionLayoutSliderRouting(props.location.pathname);
    props.history.push(el.url);
  };
  const openMenu = () => {
    props.actionToggleMenu(true);
  };
  return (
    <div className="layout-sider">
      <img
        src={icons.ic_menu}
        alt=""
        style={{
          marginTop: 12,
          cursor: 'pointer',
          borderRadius: 8,

        }}
        onClick={openMenu}
      />
      {!empty && menuList.map((el, i) => {
        return (
          <div
            key={i}
            className={`menu-sider-item ${el.isActive ? 'active-item' : ''}`}
            onClick={() => handleClickMenu(el)}
          >
            <img src={el.icon} alt="" />
            <span className="name-tab">{el.name}</span>
          </div>
        );
      })}
    </div>
  );
};
export default connect(
  (state) => ({
    // locale: state.system.locale,
  }),
  { actionToggleMenu, actionLayoutSliderRouting }
)(withRouter(LayoutSider));
