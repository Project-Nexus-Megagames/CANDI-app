import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';

const CharacterNugget = (props) => {
	const { character, loading, size, altIconPath } = props;
  let altP = altIconPath ? altIconPath : "";

	return (
    <Tooltip openDelay={200} hasArrow placement='top' label={<div>
      {character.characterName}
      <p>{character.discord}</p>
      </div>}>
        <Avatar size={size ? size :'md'} name={character.characterName} src={character.profilePicture} />
    </Tooltip>
	);
};

export default CharacterNugget;
