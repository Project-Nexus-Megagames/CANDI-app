import { Button } from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../redux/entities/auth';
import socket from '../../socket';

const NoCharacter = (props) => {
  const navigate = useNavigate();
  const reduxAction = useDispatch();

  const handleLogOut = () => {
    reduxAction(signOut());
    socket.emit('logout');
    navigate('/login');
  };

  return ( 
    <React.Fragment>
      {/* <img src='http://cdn.lowgif.com/full/02b057d73bf288f7-.gif' alt={'No Character...'} />  */}
      <p>Looks like you have no character assigned to your user. If you think this is in error then please contact Tech Support. Or just spam f5. It's a free world.</p>
			<Button onClick={handleLogOut}>Log Out</Button>
    </React.Fragment>
  );
}


export default (NoCharacter);

