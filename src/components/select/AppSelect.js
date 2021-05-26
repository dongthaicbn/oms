import React from 'react';
import { Select } from 'antd';
import * as icons from 'assets';
import './AppSelect.scss'

const {Option} = Select;

const AppSelect = (props) => {
  let {className, value, onChange, selections} = props;
  const handleOnChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };
  return (
    <div className="app-select-container">
      <Select className={className}
              value={value} onChange={handleOnChange}
              suffixIcon={<img src={icons.ic_drop_down} alt=""/>}
              dropdownClassName="app-select-dropdown">
        {
          selections.map(item => (
            <Option key={item.id} id={item.id}>{item.label}</Option>
          ))
        }
      </Select>
    </div>
  )
};

export default AppSelect;