import React from 'react'
import { Avatar, ButtonGroup, Card, Divider, Flex, IconButton,  } from "@chakra-ui/react";
import { IoPencilOutline, IoTrash } from 'react-icons/io5';
import { getTime } from '../../scripts/frontend';

const ActionHeader = (props) => {
  const { showButton, thing, character } = props;
  return ( 
    <Flex className={thing.status} align="middle" justify="start">
    <div style={{ margin: '5px' }} >
      <Avatar size="md" src={thing.commentor.profilePicture} alt="?" style={{ maxHeight: '50vh' }} />
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
          <IconButton size="xs" onClick={() => console.log('Hello')} colorScheme="blue" icon={<IoPencilOutline  />} />
          <IconButton size="xs" onClick={() => console.log('Hello')} colorScheme="red" icon={<IoTrash  />} />
        </ButtonGroup>
      )}
    </div>
  </Flex>
   );
}
 
export default ActionHeader;