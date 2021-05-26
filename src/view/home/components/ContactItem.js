import { Box } from '@material-ui/core';
import React from 'react';

const ContactItem = (props) => {
  const { title, content } = props;
  return (
    <Box style={{ width: '100%', marginBottom: 32 }}>
      <p
        style={{
          color: '#828282',
          fontWeight: 'bold',
          fontSize: 14,
          lineHeight: '21px',
          marginBottom: 2,
        }}
      >
        {title}
      </p>
      <p
        style={{
          color: '#6461B4',
          fontWeight: 'bold',
          fontSize: 16,
          lineHeight: '24px',
          margin: 0,
        }}
      >
        {content}
      </p>
    </Box>
  );
};

export default ContactItem;
