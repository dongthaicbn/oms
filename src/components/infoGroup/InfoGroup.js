import React from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "antd";
import "./InfoGroup.scss";

const { Paragraph, Text } = Typography;

const InfoGroup = (props) => {
    let label;
    if (props.labelID) {
        label = <FormattedMessage id={props.labelID}/>;
    } else {
        label = props.label;
    }
    return (
        <div className="info-group-container">
            <Text className={`text-label ${props.labelClassName || ''}`}>
                {label}{props.noColon? '' : ':'}
            </Text>
            <Paragraph className={`text-info ${props.className || ''}`}>
                {props.children || '_'}
            </Paragraph>
        </div>
    );
};

export default InfoGroup;