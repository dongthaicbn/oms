import React from 'react';
import { withRouter } from 'react-router-dom';
import './Layout.scss';
import LayoutSider from './LayoutSider';

const Layout = props => {
  let { emptyDrawer } = props;
  return (
    <>
      <div className="layout-container">
        <LayoutSider empty={emptyDrawer}/>
        <div className="layout-content">{props.children}</div>
      </div>
    </>
  );
};
export default withRouter(Layout);
