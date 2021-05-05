import React from 'react';
import { Input } from 'antd';
import './AppInput.scss';

const AppInput = (props) => {
  let { icon, prefix, ...otherProps } = props;
  const renderIcon = () => {
    return (
      <img className="app-input-icon" src={icon}/>
    )
  };
  return (
    <div className="app-input-container">
      <Input {...otherProps || ''} prefix={icon? renderIcon() : prefix}/>
    </div>
  );
};

export default AppInput;