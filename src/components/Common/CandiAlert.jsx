import React, { useEffect, useState } from "react";
import { AlertDescription, AlertIcon, AlertTitle, Alert, Image, CloseButton, } from '@chakra-ui/react';

export const CandiAlert = (props) => {
  const { alert } = props;
	const [show, setShow] = useState(true);


  useEffect(() => {
    const audio = new Audio("/skullsound2.mp3");
    audio.loop = false;
    audio.volume = 0.15;
    audio.play();
  }, []);


  return (
    <Alert status={alert.type} style={{ margin: '5px'}}>
    <AlertIcon />
    {alert.message}
  </Alert>
  );
};