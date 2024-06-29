import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getThisTeam } from '../../scripts/frontend';

const CharacterNugget = (props) => {
  const { character, loading, size, altIconPath } = props;
  const teams = useSelector(s => s.teams.list);
  /*

  */
  let altP = altIconPath ? altIconPath : "";

  if (character) {
    const team = getThisTeam(teams, character._id);
    return (
      <Tooltip openDelay={200} hasArrow placement='top' label={<div>
        {character.characterName}
        <p>{character.discord}</p>
        {/* <p>{team?.name}</p> */}
      </div>}>
        <Avatar size={size ? size : 'md'} bg={getFadedColor(team)} name={character.characterName} src={character.profilePicture} />
      </Tooltip>
    );
  }
  else return ("Cannot render Character :(")
};

export default CharacterNugget;
