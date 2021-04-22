import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Drawer, Typography } from 'antd';
import AvatarImage from 'components/image/AvatarImage';
import LogoutModal from './LogoutModal';
import { FormattedMessage } from 'react-intl';
import * as icons from 'assets';
import { ReactComponent as HomeIcon } from 'assets/icons/ic_home.svg';
import { ReactComponent as OrderIcon } from 'assets/icons/ic_order.svg';
import { ReactComponent as ReceivedDeliveryIcon } from 'assets/icons/ic_received_delivery.svg';
import { ReactComponent as InventoryBorrowingIcon } from 'assets/icons/ic_inventory_borrowing.svg';
import { ReactComponent as InventoryIcon } from 'assets/icons/ic_inventory.svg';
import { ReactComponent as NewPromotionIcon } from 'assets/icons/ic_new_promotion.svg';
import { routes } from 'utils/constants/constants';
import { isLoggedIn } from '../../utils/helpers/helpers';
import {
  actionToggleMenu,
  actionSelectActionMenuItem,
  actionChangeLang
} from 'view/system/systemAction';
import './Layout.scss';

const { Paragraph } = Typography;

const actionMenuItems = [
  {
    id: 1,
    icon: <HomeIcon />,
    textID: 'IDS_HOME',
    loggedInRequired: false,
    route: '/'
  },
  {
    id: 2,
    icon: <OrderIcon />,
    textID: 'IDS_ORDER',
    loggedInRequired: true,
    route: '/order-record'
  },
  {
    id: 3,
    icon: <ReceivedDeliveryIcon />,
    textID: 'IDS_RECEIVED_DELIVERY',
    loggedInRequired: true,
    route: ''
  },
  {
    id: 4,
    icon: <InventoryBorrowingIcon />,
    textID: 'IDS_INVENTORY_BORROWING',
    loggedInRequired: true,
    route: ''
  },
  {
    id: 5,
    icon: <InventoryIcon />,
    textID: 'IDS_INVENTORY',
    loggedInRequired: true,
    route: ''
  },
  {
    id: 6,
    icon: <NewPromotionIcon />,
    textID: 'IDS_NEW_PROMOTION',
    loggedInRequired: false,
    route: ''
  }
];

const DrawerMenu = props => {
  const { showMenu, selectedActionMenuItemId, account } = props;
  const closeMenu = () => props.actionToggleMenu(false);
  let [showLogoutModal, setShowLogoutModal] = useState(false);

  const logout = () => {
    setShowLogoutModal(true);
    closeMenu();
  };

  const onActionMenuItemSelected = item => {
    props.actionSelectActionMenuItem(item.id);
    props.history.push(item.route);
    closeMenu();
  };
  const changeLanguage = language => () => {
    props.actionChangeLang(language);
  };
  const renderMenuBody = () => {
    let userLoggedIn = isLoggedIn();
    let loginInfo;
    if (userLoggedIn) {
      loginInfo = (
        <>
          <div className="app-button login-info app-flex-container">
            <AvatarImage src={account?.user?.avatar} alt="" />
            <Paragraph ellipsis={true}>
              {`${account?.store?.company_name}` || '_'}
              <div> {`${account?.user?.email}` || ''}</div>
            </Paragraph>
          </div>
        </>
      );
    } else {
      loginInfo = (
        <>
          <div className="app-button login-info login-btn">
            <Button href={routes.LOGIN}>
              <FormattedMessage id="IDS_LOGIN" />
            </Button>
          </div>
        </>
      );
    }

    return (
      <>
        {loginInfo}
        <div className="action-menu">
          {actionMenuItems.map(menuItem => {
            if (menuItem.loggedInRequired && !userLoggedIn) {
              return <></>;
            }
            return (
              <div
                key={menuItem.id}
                className={`app-button menu-item
              ${selectedActionMenuItemId === menuItem.id ? 'active-item' : ''}`}
              >
                <Button onClick={() => onActionMenuItemSelected(menuItem)}>
                  <div className="icon">{menuItem.icon}</div>
                  <FormattedMessage id={menuItem.textID} />
                </Button>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={closeMenu}
        visible={showMenu}
        className={`sidebar-menu-container ${!showMenu && 'closed-menu'}`}
        width={window.innerWidth > 576 ? 388 : '100vw'}
      >
        {showMenu && (
          <span className="close-menu-icon" onClick={closeMenu}>
            <img src={icons.ic_close} alt="" />
          </span>
        )}
        <div className="side-bar-content">
          <div className="header-menu">
            <img src={icons.ic_logo} alt="" />
          </div>

          {renderMenuBody()}
          <div className="footer-menu">
            <div className="container-language">
              <div
                id="english"
                className={
                  props.locale === 'en'
                    ? `button-language button-language-choosed`
                    : `button-language button-language-not-choosed`
                }
                onClick={changeLanguage('en')}
              >
                English
              </div>
              <div
                id="hongkong"
                className={
                  props.locale === 'zh_CN'
                    ? `button-language button-language-choosed`
                    : `button-language button-language-not-choosed`
                }
                onClick={changeLanguage('zh_CN')}
              >
                繁體中文
              </div>
            </div>

            <span className="logout-icon" onClick={logout}>
              <img src={icons.ic_logout} alt="" />
            </span>
          </div>
        </div>
      </Drawer>
      {showLogoutModal && (
        <LogoutModal closeModal={() => setShowLogoutModal(false)} />
      )}
    </>
  );
};
export default connect(
  state => ({
    showMenu: state.system.showMenu,
    selectedActionMenuItemId: state.system.selectedActionMenuItemId,
    locale: state.system.locale,
    account: state.system.account
  }),
  { actionToggleMenu, actionSelectActionMenuItem, actionChangeLang }
)(withRouter(DrawerMenu));
