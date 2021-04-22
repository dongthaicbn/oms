import React from 'react';
import { Button } from 'antd';
import './IconButton.scss'

const IconButton = (props) => {
  let icon;
  if (props.iconSrc) {
    icon =  <img src={props.iconSrc}/>
  } else if (props.icon) {
    icon = props.icon;
  }
  return (
    <div className="app-button icon-button-container">
      <Button>
        {icon}
        {props.children}
      </Button>
    </div>
  )
};

export default IconButton;
