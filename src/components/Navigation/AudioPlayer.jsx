import { IconButton, useDisclosure, ButtonGroup } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PauseOutline, PlayOutline } from '@rsuite/icons';
import { toggleAuido } from '../../redux/entities/gamestate';

export const AudioPlayer = () => {
	const reduxAction = useDispatch();
  const play = useSelector(state => state.gamestate.play);

  let sadAudio = useRef();

  useEffect(() => {
    // Perform some setup actions
    sadAudio.current = new Audio('/ttls.mp3');
    sadAudio.autoplay  = true;
    sadAudio.loop  = true;
    return () => {
      sadAudio.current.pause()
    };
  }, []); 


  useEffect(() => {
    if (play)sadAudio.current.play();
    else sadAudio.current.pause()
    return () => {
      sadAudio.current.pause()
    };
  }, [play]); 

  return (
    <ButtonGroup>
      <IconButton variant={'ghost'} onClick={() => reduxAction(toggleAuido())} icon={!play ? <PlayOutline /> : <PauseOutline />} />
    </ButtonGroup>
  );
};
