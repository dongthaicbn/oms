import React from 'react';
import { Image } from 'antd';
import * as icons from 'assets';
import { ReactComponent as CloseIcon } from "assets/icons/ic_close.svg";
import './RoundImage.scss'

const RoundImage = (props) => {
  let {src, alt, className, disablePreview, deletable, onDelete} = props;
  let image = <Image src={src || icons.img_placeholder}
                     fallback={icons.img_placeholder}
                     alt={alt}
                     className={`round-image ${className || ''}`}
                     preview={disablePreview ? false :
                       {
                         maskClassName: 'round-image'
                       }
                     }/>;
  let renderContent = () => {
    if (deletable) {
      return <div className="round-image-container">
        {image}
        <CloseIcon className="close-button" onClick={onDelete}/>
      </div>
    } else {
      return image;
    }
  };
  return renderContent();
};

export default RoundImage;