import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getThisTeam } from '../../scripts/frontend';

const CharacterNugget = (props) => {
	const { character, loading, size, altIconPath } = props;
	const teams = useSelector(s => s.teams.list);
	/*

	*/
  const team = getThisTeam(teams, character._id);
  let altP = altIconPath ? altIconPath : "";

  if(character)
	return (
    <Tooltip openDelay={200} hasArrow placement='top' label={<div>
      {character.characterName}
      <p>{character.discord}</p>
      {/* <p>{team?.name}</p> */}
      </div>}>
        <Avatar size={size ? size :'md'} bg={getFadedColor(team)} name={character.characterName} src={character.profilePicture} />
    </Tooltip>
	);
  else return (
    <Tooltip openDelay={200} hasArrow placement='top' label={<div>
      Grunkle the Server Goblin
      </div>}>
        <Avatar size={size ? size :'md'} name={"Grunkle the Server Goblin"} src={"https://cdn.discordapp.com/attachments/857862435096100884/1140509994324856902/wrapped-sweet.png"} />
    </Tooltip>
  )
};

export default CharacterNugget;