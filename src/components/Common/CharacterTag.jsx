import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar,
  TagLabel,
  Tag,
  TagCloseButton,
} from '@chakra-ui/react'
import { getFadedColor, getThisTeam } from '../../scripts/frontend';

const CharacterTag = ({ character, isDisabled, isAccessible, onClick}) => {
	const teams = useSelector(s => s.teams.list);

	return ( 
    <Tag 
    margin={'2px'} 
    variant={'solid'} 
    style={{ backgroundColor: getFadedColor(getThisTeam(teams, character?._id)) }}  >
    <Avatar
      size={'xs'}
      name={character?.characterName}
      src={character?.profilePicture}
      margin='1'
    />
    <TagLabel>{character?.playerName && !character?.playerName.includes("_") && character?.playerName} - {character?.characterName}</TagLabel>
    {!isDisabled && isAccessible && <TagCloseButton onClick={onClick} />}

  </Tag>
	);
}

export default (CharacterTag);