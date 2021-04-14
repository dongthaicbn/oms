import React from "react";
import { Image } from "antd";
import * as icons from "assets";
import './RoundImage.scss'

const RoundImage = (props) => {
    return (
        <Image src={props.src || icons.img_placeholder}
               fallback={icons.img_placeholder}
               alt={props.alt}
               className="round-image"
               preview={{
                   maskClassName: "round-image"
               }}/>
    );
};

export default RoundImage;