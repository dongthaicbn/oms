import React, { useEffect } from 'react';
import { Card } from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import '../Home.scss';
import { ReactComponent as DropDownIcon } from 'assets/icons/ic_dropdown.svg';

import { routes } from 'utils/constants/constants';
import { isEmpty } from 'utils/helpers/helpers';

const PromotionContent = (props) => {
  const { promotions } = props;
  let refImage = [];
  useEffect(() => {
    const ele = document.getElementById('card-group');
    ele.style.cursor = 'grab';

    let pos = { top: 0, left: 0, x: 0, y: 0 };
    let mousedDownFired = false;
    function mouseMoveHandler(e) {
      // How far the mouse has been moved
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;
      mousedDownFired = true;
      // Scroll the element
      ele.scrollTop = pos.top - dy;

      ele.scrollLeft = pos.left - dx;
    }
    function mouseUpHandler() {
      ele.style.cursor = 'grab';
      ele.style.removeProperty('user-select');
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }

    function handlekeydownEvent() {
      const mouseDownHandler = function (e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
          left: ele.scrollLeft,
          top: ele.scrollTop,
          // Get the current mouse position
          x: e.clientX,
          y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      };

      // Attach the handler
      ele.addEventListener('mousedown', mouseDownHandler);
      ele.addEventListener('click', () => {
        if (!mousedDownFired) {
          window.open('');
        } else {
          mousedDownFired = false;
        }
      });
    }

    document.addEventListener('DOMContentLoaded', handlekeydownEvent);
    return () => {
      document.removeEventListener('DOMContentLoaded', handlekeydownEvent);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, []);
  const openViewMore = () => {
    props.history.push(routes.NEWS_AND_PROMOTION);
  };
  const gotoDetail = (id) => {
    props.history.push(routes.NEWS_AND_PROMOTION + `/detail/${id}`);
  };
  return (
    <div className="promotion-content">
      <p className="promotion-title">
        <FormattedMessage id="IDS_NEW_PROMOTION" />
      </p>
      <div className="card-group" id="card-group">
        {promotions.map((el) => (
          <Card
            key={el.id}
            cover={
              <img
                alt="example"
                src={el.banner_url}
                ref={(divElement) => {
                  refImage.push(divElement);
                }}
              />
            }
            onClick={() => gotoDetail(el.id)}
          >
            <Card.Meta
              title={el.title}
              description={
                <>
                  <p style={{ marginBottom: 8 }}>{el.description}</p>
                  <p style={{ marginBottom: 0 }} className="date-text">
                    {!isEmpty(el.create_date) &&
                      `${moment(el.create_date).format('DD')} ${moment(
                        el.create_date
                      ).format('MMM')} ${moment(el.create_date).format(
                        'YYYY'
                      )}`}
                  </p>
                </>
              }
            />
          </Card>
        ))}
      </div>
      <div className="view-more pointer">
        <span style={{ cursor: 'pointer' }} onClick={openViewMore}>
          <FormattedMessage id="IDS_VIEW_MORE" />
          &nbsp;
          <DropDownIcon
            style={{ transform: 'rotate(-90deg)', marginBottom: -4 }}
          />
        </span>
      </div>
    </div>
  );
};

export default withRouter(PromotionContent);
