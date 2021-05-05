import React from 'react';
import { Button } from 'antd';
import './IconButton.scss';

const IconButton = (props) => {
  let { icon, iconSrc, ...otherProps } = props;
  let iconImage;
  if (iconSrc) {
    iconImage = <img src={iconSrc} alt="" />;
  } else if (icon) {
    iconImage = icon;
  }
  return (
    <div className="app-button icon-button-container">
      <Button {...(otherProps || '')}>
        {iconImage}
        {props.children}
      </Button>
    </div>
  );
};

export default IconButton;
