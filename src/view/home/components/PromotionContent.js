import React, { useEffect } from 'react';
import { Card } from 'antd';
import { FormattedMessage } from 'react-intl';
import '../Home.scss';

const PromotionContent = props => {
  const { promotions } = props;
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
      const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
          left: ele.scrollLeft,
          top: ele.scrollTop,
          // Get the current mouse position
          x: e.clientX,
          y: e.clientY
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
  return (
    <div className="promotion-content">
      <p className="promotion-title">
        <FormattedMessage id="IDS_NEW_PROMOTION" />
      </p>
      <div className="card-group" id="card-group">
        {promotions.map(el => (
          <Card key={el.id} cover={<img alt="example" src={el.banner_url} />}>
            <Card.Meta
              title={el.title}
              description={
                <>
                  <p style={{ marginBottom: 8 }}>{el.description}</p>
                  <p style={{ marginBottom: 0 }}>{el.create_date}</p>
                </>
              }
            />
          </Card>
        ))}
      </div>
      <div className="view-more pointer">
        <FormattedMessage id="IDS_VIEW_MORE" />
        &nbsp;&#62;
      </div>
    </div>
  );
};

export default PromotionContent;
