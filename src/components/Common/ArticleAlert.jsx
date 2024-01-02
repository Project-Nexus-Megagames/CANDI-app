import React, { useEffect, useState } from "react";
import { AlertDescription, AlertIcon, AlertTitle, Alert, Image, CloseButton, } from '@chakra-ui/react';

export const ArticleAlert = (props) => {
  const article = props.data;
	const [show, setShow] = useState(true);


  useEffect(() => {
    const audio = new Audio("/alert.mp3");
    audio.loop = false;
    audio.volume = 0.40;
    audio.play();
  }, []);


  return (
    <div>
      {show && <Alert
      style={{ backgroundColor: '#15181e', borderRadius: '10px' }}
      status='success'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
      height='300px'
               >
      <h5>New Article Posted!</h5>
      <CloseButton
          alignSelf='flex-end'
          position='relative'
          right={10}
          top={-20}
          onClick={() => setShow(false)}
      />
      {article.image && <Image
      src={article.image}
      width="100%"
      height={'15vh'}
      fit='cover'
                        />}
      <h3>      {article.title}    </h3>
      
    </Alert>}      
    </div>

  );
};