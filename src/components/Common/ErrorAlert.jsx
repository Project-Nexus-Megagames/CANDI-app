import React, { useEffect, useState } from "react";
import { AlertDescription, AlertIcon, AlertTitle, Alert, Image, CloseButton, } from '@chakra-ui/react';

export const ErrorAlert = (props) => {
	const [show, setShow] = useState(true);


  useEffect(() => {
    const audio = new Audio("/skullsound2.mp3");
    audio.loop = false;
    audio.volume = 0.15;
    audio.play();
  }, []);


  return (
    <Alert status='error' variant='solid'>
      <AlertIcon />
      <AlertTitle>{props.error}</AlertTitle>
    </Alert>
  );
};