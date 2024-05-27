import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Fade, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FadeInOut from './FadeInOut';
import WordDivider from '../Common/WordDivider';

export const MemorialScroll = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(true);
  const toggleShow = () => setShow(!show);
  const [index, setIndex] = useState(0);
  const [sayingI, setSaying] = useState(0);
  const [audio, setAudio] = useState(0);
  const [startBool, setStart] = useState(false);

  const characters = useSelector(state => state.characters.list);
  const deadChaaracters = characters.filter(el => el.tags.some(t => t.toLowerCase() === 'dead'))

  const sayings = [
    "May they rest in peace.",
    "Gone but never forgotten.",
    "In loving memory.",
    "Forever in our hearts.",
    "They lived a good life.",
    "Our thoughts and prayers are with you.",
    "They are in a better place now.",
    "May their soul find eternal peace.",
    "With deepest sympathy.",
    "Celebrating a life well-lived.",
    "Heaven gained an angel.",
    "Their legacy will live on.",
    "Gone too soon.",
    "May their memory be a blessing.",
    "We will miss them dearly.",
    "They touched so many lives.",
    "Our hearts go out to you.",
    "In God's care.",
    "Resting with the angels.",
    "Until we meet again.",
    "This one owed me money",
    "They better remember me in the will"
  ]

  const start = () => {
    setStart((startBool) => (startBool = true));
    const audioFile = new Audio('/sad.mp3');
    audioFile.loop = false;
    audioFile.play();

    const interval = setInterval(() => {
      toggleShow()
      setIndex((index) => (index + 1) % deadChaaracters.length);
      setSaying((saying) => (saying + 1) % sayings.length);
    }, 3000);
    return () => clearInterval(interval);
  };

  const cry = () => {
    setAudio(audio >= 4 ? 0 : audio + 1)
    const audioFile = new Audio(`/cry/cry${audio}.mp3`);
    audioFile.loop = false;
    audioFile.play();
  };

  return (
    <React.Fragment>
      {!startBool && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Button variant={'outline'} colorScheme='white' onClick={() => start()}>
            Enter the Sad Parade
          </Button>
        </div>
      )}
      {startBool && (
        <Box
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <WordDivider word={"In Memorium"} />
          <img
            src={`${deadChaaracters[index]?.profilePicture}`}
            alt='Img could not be displayed'
            style={{ maxHeight: "50vh", width: '90%' }}
          />

          <h5>{deadChaaracters[index]?.characterName}</h5>  
          <p>{sayings[sayingI]}</p>        

          <Button onClick={cry} variant={'solid'} colorScheme='purple' >Cry</Button>
        </Box>
      )}
    </React.Fragment>
  );
};
