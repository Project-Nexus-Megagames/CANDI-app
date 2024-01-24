import React, { useEffect, useState } from "react";
import { AlertDescription, AlertIcon, AlertTitle, Alert, Image, CloseButton, useDisclosure, } from '@chakra-ui/react';

export const SuccessAlert = (props) => {
	const [show, setShow] = useState(true);  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: true })

  return (
    <>
      {show && <Alert status='success' variant='solid'>
        <AlertIcon />
        <AlertTitle>{props.message}</AlertTitle>
        <CloseButton
          alignSelf='flex-start'
          position='relative'
          right={-1}
          top={0}
          onClick={() => setShow(false)}
        />
      </Alert>}
    </>

  );
};