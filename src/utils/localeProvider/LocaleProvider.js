import React from 'react';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import vi_VN from 'antd/lib/locale-provider/vi_VN';
import en_US from 'antd/lib/locale-provider/en_US';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import vi_local from '../locales/vi.json';
import en_local from '../locales/en.json';
import zh_CN_local from '../locales/zh_CN.json';

moment.locale('vi');
const getLocale = (locale) => ({
  locale,
  messages:
    locale === 'en' ? en_local : locale === 'zh_CN' ? zh_CN_local : vi_local,
});

const LocaleComponent = (props) => {
  return (
    <IntlProvider {...getLocale(props.locale.replace('_', '-'))}>
      <ConfigProvider
        locale={
          props.locale === 'en'
            ? en_US
            : props.locale === 'zh_CN'
            ? zh_CN
            : vi_VN
        }
      >
        {props.children}
      </ConfigProvider>
    </IntlProvider>
  );
};

export default connect(
  (state) => ({
    locale: state.system.locale,
  }),
  null
)(LocaleComponent);
