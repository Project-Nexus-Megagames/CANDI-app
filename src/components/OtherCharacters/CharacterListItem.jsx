import { CopyIcon } from '@chakra-ui/icons';
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Button, Flex, Hide, Spacer, useToast } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import ResourceNugget from '../Common/ResourceNugget';
import { getFadedColor } from '../../scripts/frontend';
import NexusTag from '../Common/NexusTag';

const CharacterListItem = (props) => {
	const { character, handleSelect, selected } = props;  
  const myCharacter = useSelector(state => state.auth.myCharacter);
  const characters = useSelector(state => state.characters.list);
  const toast = useToast();
  const reduxSelected = useSelector((state) => state.characters.selected);

  const copyToClipboard = (character) => {
    if (character.characterName === "The Box") {
      theBox();
    } else {
			// Build a transitive closure of all control affected.
			let board = `${character.email}`;

			// First get the control of the searched character and the current character
			let pending = [...new Set([...character.control, ...myCharacter.control])]
			let seen = [];

			while (pending.length != 0)  {
				const cur = pending.shift()
				seen.push(cur)
				const character = characters.find((el) => el.characterName.toLowerCase() === cur.toLowerCase())
				if(character) {
					// add their controllers to the list to be searched if we haven't already done them
					board = board.concat(`; ${character.email}`);
				} else {
					console.log(`${cur} could not be added to clipboard`);
					// Alert.error(`${character} could not be added to clipboard`, 6000);
				}
			}
      
      const gamecontrol = characters.find((el) => el.tags.some(tag => tag.toLowerCase() === 'game control') );
      if (gamecontrol) board = board.concat(`; ${gamecontrol.email}`);
      navigator.clipboard.writeText(board);
      // Alert.success("Email Copied!", 6000);

      if (!toast.isActive('alert')) toast({
        position: "top-right",
        isClosable: true,
        status: 'info',
        duration: 5000,
        id: board,
        title: `Email(s) copied! \n\n ${board}`,
      });
    }
  };

  const theBox = () => {
    const audio = new Audio("/candi1.mp3");
    audio.loop = true;
    audio.play();
    // setImage("https://res.cloudinary.com/df8lwfbar/image/upload/v1664447183/goblinCity/kpj2mcukweiq3edjp4ww.jpg");
  };

  const openAnvil = (character) => {
    if (character.characterName === "The Box") {
      const audio = new Audio("/candi1.mp3");
      audio.loop = true;
      audio.play();
    } else {
      if (character.wiki && character.wiki !== "") {
        let url = character.wiki;
        const win = window.open(url, "_blank");
        win.focus();
      } else if (character.tags.some((el) => el === "God" || el === "Gods")) {
        let url = `https://godswars.miraheze.org/wiki/Gods#${character.characterName}`;
        const win = window.open(url, "_blank");
        win.focus();
      } else {
        let url = "https://godswars.miraheze.org/wiki/";
        let temp = url.concat(character.characterName.split(" ").join("_"));
        const win = window.open(temp, "_blank");
        win.focus();
      }
    }
  };


	return (

  <Flex style={{ backgroundColor: reduxSelected == character ? getFadedColor('default', 0.5) : 'inherit' }} align={'center'}  width={'100%'} onClick={() => handleSelect(character)}>
    <Box flex={1}>
			<Avatar size="lg" src={character?.profilePicture} alt="?" />
		</Box>
		<Box
      flex={8}
      className="styleCenter"
			style={{
				flexDirection: 'column',
				overflow: 'hidden',
        textOverflow: 'ellipsis'
			}}
		>
			<h4>{character?.characterName}</h4>
      <Flex  >
        {character.tags && character.tags.filter(el => el.toLowerCase() !== 'public').map((item) =>
          <NexusTag key={item} value={item} width={'50px'} height={'30'} />
          )}        
      </Flex>

      {/* <Button
        onClick={(e) => { e.stopPropagation(); copyToClipboard(character)}}
        leftIcon={<CopyIcon/>}
        colorScheme='white'
        variant='outline'
      >
        {character?.email}                         
      </Button> */}
			
		</Box>  
     

  </Flex>

	);
};

export default CharacterListItem;
