import { CopyIcon } from '@chakra-ui/icons';
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Button, Flex, HStack, Hide, Spacer, Tag, useToast } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import ResourceNugget from '../Common/ResourceNugget';
import { getFadedColor, getTextColor } from '../../scripts/frontend';
import NexusTag from '../Common/NexusTag';
import TeamAvatar from '../Common/TeamAvatar';

const CharacterListItem = (props) => {
  const { character, handleSelect, selected, size } = props;
  const myCharacter = useSelector(state => state.auth.myCharacter);
  const characters = useSelector(state => state.characters.list);
  const toast = useToast();
  const reduxSelected = useSelector((state) => state.characters.selected);

  return (
    <Button
    width={'100%'}
    height={'100%'} 
    variant={"unstyled"}
    key={character._id}
    value={character._id}
    _hover={{ bg: 'gray.700' }}
    // onClick={() => {
    //   handleSelect(character);
    // }}
  >

    <HStack 
    style={{ 
      backgroundColor: reduxSelected == character ? getFadedColor('default', 0.5) : 'inherit' 
      }} 
      align={'left'} 
      width={'100%'}       
      onClick={() => handleSelect(character)}>
      <Box flex={1}>
        {character.profilePicture && <Avatar size={size || 'lg'} src={character.profilePicture} alt="?" />}
        {false && !character.profilePicture && <TeamAvatar account={character.account} />}
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
        <b>{character?.characterTitle}</b>
        <Flex  >
          {character.tags && character.tags.filter(el => el.toLowerCase() !== 'public').map((item) =>
            <Tag key={item} variant={'solid'} style={{ backgroundColor: getFadedColor(item), color: getTextColor(item), textTransform: 'capitalize', margin: '4px' }} >{item}</Tag>
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


    </HStack>
    </Button>
  );
};

export default CharacterListItem;
