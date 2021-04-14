import React from 'react';
import * as icons from 'assets';
import './Header.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  actionToggleMenu,
  actionChangeLang
} from '../../view/system/systemAction';
const Header = props => {
  const openMenu = () => {
    props.actionToggleMenu(true);
  };
  const changeLanguage = language => () => {
    props.actionChangeLang(language);
  };
  return (
    <div className="header">
      <div className="button-menu" onClick={openMenu}>
        <img src={icons.ic_menu} alt="icon-menu" className="icon-menu" />
      </div>
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
            props.locale === 'vi'
              ? `button-language button-language-choosed`
              : `button-language button-language-not-choosed`
          }
          onClick={changeLanguage('vi')}
        >
          繁體中文
        </div>
      </div>
    </div>
  );
};
export default connect(
  state => ({
    // users: state.system.users,
    locale: state.system.locale
  }),
  { actionToggleMenu, actionChangeLang }
)(withRouter(Header));
