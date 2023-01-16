import React from 'react'
import { Avatar, ButtonGroup, Card, Divider, Flex, IconButton,  } from "@chakra-ui/react";
import { IoPencilOutline, IoTrash } from 'react-icons/io5';
import { getTime } from '../../scripts/frontend';

const aaaaaaaa = (props) => {
  const { showButton, thing, character } = props;
  return ( 
    <Flex className={thing.status} align="middle" justify="start">
    <div style={{ margin: '5px' }} >
      <Avatar circle size="md" src={thing.commentor.profilePicture} alt="?" style={{ maxHeight: '50vh' }} />
    </div>

    <div >
      <h5>
        {character}'s {thing.status} {thing.type}
      </h5>
      <p className='slimText'>{getTime(thing.createdAt)}</p>
    </div>

    <div >
      {showButton && (
        <ButtonGroup>
          <IconButton size="xs" onClick={() => console.log('Hello')} colorScheme="blue" icon={<IoPencilOutline icon="pencil" />} />
          <IconButton size="xs" onClick={() => console.log('Hello')} colorScheme="red" icon={<IoTrash icon="trash2" />} />
        </ButtonGroup>
      )}
    </div>
  </Flex>
   );
}

const publicComm = {
	backgroundColor: '#00a0bd'
};

const privateComm = {
	backgroundColor: '#61342e'
};

const infoComm = {
	backgroundColor: '#531ba8'
};
 
export default aaaaaaaa;