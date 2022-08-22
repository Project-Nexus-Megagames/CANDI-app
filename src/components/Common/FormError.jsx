import React from 'react'
import { useEffect } from 'react';
import { Icon, Tag } from 'rsuite';

const ErrorTag = ({ error }) => {
  
  useEffect(() => {
    console.log(error)
  }, [error]);

  if (error) return ( 
    <Tag style={{ color: 'black' }} color={'orange'}>
      {error.message}
    </Tag>
  );

  return (
    <Tag color={'green'}>
      <Icon icon="check" />
    </Tag>
  )
};

export default ErrorTag;