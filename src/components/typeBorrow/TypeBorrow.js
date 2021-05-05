import React from 'react';
import { Tag } from 'antd';
import { TYPE_LEND, TYPE_BORROW } from 'utils/constants/constants';
import './TypeBorrow.scss';

const TypeBorrow = props => {
  return (
    <div className="type-borrow-container">
      <Tag
        className={`type-borrow 
                ${{ ...(props.className || '') }} 
                ${props.type === TYPE_BORROW ? 'borrow' : ''} 
                ${props.type === TYPE_LEND ? 'lend' : ''}`}
      >
        {props.children}
      </Tag>
    </div>
  );
};

export default TypeBorrow;
