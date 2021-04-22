import React from 'react';
import { withRouter } from 'react-router-dom';
import './Layout.scss';
import LayoutSider from './LayoutSider';

const Layout = props => {
  return (
    <>
      <div className="layout-container">
        <LayoutSider />
        <div className="layout-content">{props.children}</div>
      </div>
    </>
  );
};
export default withRouter(Layout);
