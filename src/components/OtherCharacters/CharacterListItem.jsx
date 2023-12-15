import { CopyIcon } from '@chakra-ui/icons';
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Button, Flex, Hide, Spacer, useToast } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import ResourceNugget from '../Common/ResourceNugget';
import { getFadedColor } from '../../scripts/frontend';
import NexusTag from '../Common/NexusTag';
import TeamAvatar from '../Common/TeamAvatar';

const CharacterListItem = (props) => {
  const { character, handleSelect, selected } = props;
  const myCharacter = useSelector(state => state.auth.myCharacter);
  const characters = useSelector(state => state.characters.list);
  const toast = useToast();
  const reduxSelected = useSelector((state) => state.characters.selected);

  return (
    <Flex style={{ backgroundColor: reduxSelected == character ? getFadedColor('default', 0.5) : 'inherit' }} align={'center'} width={'100%'} onClick={() => handleSelect(character)}>
      <Box flex={1}>
        {character.profilePicture && <Avatar size="lg" src={character.profilePicture} alt="?" />}
        {!character.profilePicture && <TeamAvatar account={character.account} />}
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
            <NexusTag key={item} value={item} width={'150px'} height={'30'} />
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
