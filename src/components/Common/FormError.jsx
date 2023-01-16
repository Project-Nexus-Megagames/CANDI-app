import { CheckIcon } from '@chakra-ui/icons';
import { Tag } from '@chakra-ui/react';
import React from 'react'
import { useEffect } from 'react';

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
      <CheckIcon />
    </Tag>
  )
};

export default ErrorTag;