import React from "react";
import { Tag } from "antd";
import { STATUS_PENDING, STATUS_RECEIVED, STATUS_DAMAGED } from "utils/constants/constants";
import "./StatusTag.scss";

const StatusTag = (props) => {
    return (
        <div className="status-tag-container">
            <Tag className={`status-tag 
                ${{...props.className || ''}} 
                ${props.status === STATUS_PENDING? 'pending' : ''} 
                ${props.status === STATUS_RECEIVED? 'received' : ''}
                ${props.status === STATUS_DAMAGED? 'damaged' : ''}`
            }>
                {props.children}
            </Tag>
        </div>
    );
};

export default StatusTag;