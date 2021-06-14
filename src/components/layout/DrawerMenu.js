import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Drawer, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import { ReactComponent as HomeIcon } from 'assets/icons/ic_home.svg';
import { ReactComponent as OrderIcon } from 'assets/icons/ic_order.svg';
import { ReactComponent as ReceivedDeliveryIcon } from 'assets/icons/ic_received_delivery.svg';
import { ReactComponent as InventoryBorrowingIcon } from 'assets/icons/ic_inventory_borrowing.svg';
import { ReactComponent as InventoryIcon } from 'assets/icons/ic_inventory.svg';
import { ReactComponent as NewPromotionIcon } from 'assets/icons/ic_new_promotion.svg';
import { routes } from 'utils/constants/constants';
import { isLoggedIn, isIPad } from 'utils/helpers/helpers';
import { actionToggleMenu, actionChangeLang } from 'view/system/systemAction';
import './DrawerMenu.scss';

const { Paragraph } = Typography;

const isIPadDevice = isIPad();

const actionMenuItems = [
  {
    id: 1,
    icon: <HomeIcon />,
    textID: 'IDS_HOME',
    loggedInRequired: false,
    route: '/',
    isActive: (pathname) => pathname === routes.HOME,
  },
  {
    id: 2,
    icon: <OrderIcon />,
    textID: 'IDS_ORDER',
    loggedInRequired: true,
    route: routes.ORDER_FORM,
    isActive: (pathname) => pathname.includes(routes.ORDER_FORM),
  },
  {
    id: 3,
    icon: <ReceivedDeliveryIcon />,
    textID: 'IDS_RECEIVE_DELIVERY',
    loggedInRequired: true,
    route: routes.RECEIVED_DELIVERY,
    isActive: (pathname) => pathname.includes(routes.RECEIVED_DELIVERY),
  },
  {
    id: 4,
    icon: <InventoryBorrowingIcon />,
    textID: 'IDS_INVENTORY_BORROWING',
    loggedInRequired: true,
    route: routes.BORROW_RECORD,
    isActive: (pathname) => pathname.includes(routes.BORROW_RECORD),
  },
  {
    id: 5,
    icon: <InventoryIcon />,
    textID: 'IDS_INVENTORY',
    loggedInRequired: true,
    route: routes.INVENTORY,
    isActive: (pathname) => pathname.includes(routes.INVENTORY),
  },
  {
    id: 6,
    icon: <NewPromotionIcon />,
    textID: 'IDS_NEW_PROMOTION',
    loggedInRequired: false,
    route: routes.NEWS_AND_PROMOTION,
    isActive: (pathname) => pathname.includes(routes.NEWS_AND_PROMOTION),
  },
];

const languages = [
  {
    id: 'en',
    label: 'English',
  },
  {
    id: 'zh_TW',
    label: '繁體中文',
  },
];

const DrawerMenu = (props) => {
  const { showMenu, location, account } = props;
  const closeMenu = () => props.actionToggleMenu(false);

  const logout = () => {
    localStorage.clear();
    closeMenu();
    props.history.push(routes.LOGIN);
  };

  const onActionMenuItemSelected = (item) => {
    props.history.push(item.route);
    closeMenu();
  };

  const changeLanguage = (language) => () => {
    props.actionChangeLang(language);
  };

  const goToAccountDetail = () => {
    props.history.push(routes.MY_ACCOUNT);
    closeMenu();
  };

  const handleLogoClick = () => {
    if (isLoggedIn()) {
      props.history.push(routes.ORDER_FORM);
    } else {
      props.history.push(routes.HOME);
    }
    closeMenu();
  };

  const renderMenuHeader = () => {
    return (
      <div className="menu-header">
        <img
          className="app-logo"
          src={icons.ic_logo}
          alt=""
          onClick={handleLogoClick}
        />
      </div>
    );
  };

  const renderMenuBodyAuthSection = () => {
    let userLoggedIn = isLoggedIn();
    if (userLoggedIn) {
      return (
        <div className="auth-section" onClick={goToAccountDetail}>
          <img className="avatar" src={account?.user?.avatar} alt="" />
          <div className="auth-info">
            <Paragraph ellipsis={true}>
              {account?.store?.company_name || '_'}
            </Paragraph>
            <Paragraph ellipsis={true}>{account?.user?.email || '_'}</Paragraph>
          </div>
        </div>
      );
    }
    return (
      <div className="auth-section app-button">
        <Button className="login" href={routes.LOGIN}>
          <FormattedMessage id="IDS_LOGIN" />
        </Button>
      </div>
    );
  };

  const renderMenuBody = () => {
    let userLoggedIn = isLoggedIn();
    return (
      <div className="menu-body">
        {renderMenuBodyAuthSection()}
        <div
          className={`app-button action-section ${
            isIPadDevice ? 'ipad-device' : ''
          }`}
        >
          {actionMenuItems.map((menuItem) => {
            if (!menuItem.loggedInRequired || userLoggedIn) {
              return (
                <div key={menuItem.id} className="action-item">
                  <Button
                    type={menuItem.isActive(location.pathname) ? 'primary' : ''}
                    icon={menuItem.icon}
                    onClick={() => onActionMenuItemSelected(menuItem)}
                  >
                    <FormattedMessage id={menuItem.textID} />
                  </Button>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  const renderMenuFooter = () => {
    return (
      <div className="menu-footer app-button">
        <img className="logout" src={icons.ic_logout} onClick={logout}></img>
        <div className="language-container">
          {languages.map((languague) => (
            <Button
              key={languague.id}
              type={props.locale === languague.id ? 'primary' : ''}
              onClick={changeLanguage(languague.id)}
            >
              {languague.label}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Drawer
      className="app-drawer-menu"
      visible={showMenu}
      title={null}
      placement="left"
      closable={false}
      onClose={closeMenu}
    >
      <img
        className="close-menu-icon"
        src={icons.ic_close}
        alt=""
        onClick={closeMenu}
      ></img>
      <div className="side-bar-content">
        {renderMenuHeader()}
        {renderMenuBody()}
        {renderMenuFooter()}
      </div>
    </Drawer>
  );
};
export default connect(
  (state) => ({
    showMenu: state.system.showMenu,
    locale: state.system.locale,
    account: state.system.account,
  }),
  { actionToggleMenu, actionChangeLang }
)(withRouter(DrawerMenu));
