import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar,
  TagLabel,
  Tag,
  TagCloseButton,
} from '@chakra-ui/react'
import { getFadedColor, getThisTeam } from '../../scripts/frontend';

const CharacterTag = ({ isDisabled, isAccessible, onClick, character }) => {
  const teams = useSelector(s => s.teams.list);
  const characters = useSelector(state => state.characters.list);

  const thisCharacter = characters?.find(el =>
    el._id === character ||
    el._id === character?._id ||
    el.account === character?._id ||
    el.account === character
  )

  if (!thisCharacter) return (
    <Tag>
      Error: No Character {character}
      {!isDisabled && isAccessible && <TagCloseButton onClick={onClick} />}
    </Tag>)
  return (
    <Tag
      margin={'2px'}
      variant={'solid'}
      style={{ backgroundColor: getFadedColor(getThisTeam(teams, thisCharacter?._id)) }}  >
      <Avatar
        size={'xs'}
        name={thisCharacter?.characterName}
        src={thisCharacter?.profilePicture}
        margin='1'
      />
      <TagLabel>{thisCharacter?.playerName && !thisCharacter?.playerName.includes("_") && thisCharacter?.playerName} - {thisCharacter?.characterName}</TagLabel>
      {!isDisabled && isAccessible && <TagCloseButton onClick={onClick} />}

    </Tag>
  );
}

export default (CharacterTag);