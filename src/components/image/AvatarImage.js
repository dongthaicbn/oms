import React, { useState } from 'react';
import { Avatar } from 'antd';
import * as icons from 'assets';

const AvatarImage = (props) => {
  let [imageSrc, setImageSrc] = useState(props.src || icons.user_placeholder);
  return (
    <Avatar src={imageSrc}
            onError={() => {
              setImageSrc(icons.user_placeholder);
              return true;
            }}
            alt={props.alt}/>
  );
};

export default AvatarImage;