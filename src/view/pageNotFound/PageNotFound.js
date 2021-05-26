import React, { useState, useEffect } from 'react';
import HomeLayout from '../home/components/HomeLayout';
import './PageNotFound.scss'
import { FormattedMessage } from 'react-intl';

const PageNotFound = (props) => {
  return (
    <HomeLayout>
      <div className="wrapper-page-not-found">
        <div className="status-code">404</div>
        <div className="title-not-found">
          <FormattedMessage id="IDS_PAGE_NOT_FOUND" />
        </div>
        <div className="try-again">
          <FormattedMessage id="IDS_TRY_AGAIN" />
        </div>
      </div>
    </HomeLayout>
  )
}
export default PageNotFound;