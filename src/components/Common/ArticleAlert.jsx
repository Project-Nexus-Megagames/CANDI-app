import React, { useEffect } from "react";
import { AlertDescription, AlertIcon, AlertTitle, Alert, Image, } from '@chakra-ui/react';

export const ArticleAlert = (props) => {
  const article = props.data;

  useEffect(() => {
    const audio = new Audio("/skullsound2.mp3");
    audio.loop = false;
    audio.volume = 0.15;
    audio.play();
  }, []);


  return (
    <Alert
    style={{ backgroundColor: '#15181e', borderRadius: '10px' }}
    status='success'
    flexDirection='column'
    alignItems='center'
    justifyContent='center'
    textAlign='center'
    height='300px'
  >
    <h5>New Article Posted!</h5>
    {article.image && <Image src={article.image} width="100%" height={'20vh'} fit='cover' />}
    <h3>      {article.title}    </h3>
  </Alert>
  );
};