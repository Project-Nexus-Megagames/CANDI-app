import { Button } from '@chakra-ui/button';
import React from 'react';
const NoCharacter = (props) => {

	const handleLogOut = async () => {
		// this.props.logOut();
		// this.props.history.push('/login');
	}

  return ( 
    <React.Fragment>
      <img src='http://cdn.lowgif.com/full/02b057d73bf288f7-.gif' alt={'No Character...'} onClick={()=> this.bored()} /> 
      <p>Looks like you have no character assigned to your user. If you think this is in error then please contact Tech Support. Or just spam f5. It's a free world.</p>
			<Button onClick={()=> this.handleLogOut()}>Log Out</Button>
    </React.Fragment>
  );
}


export default (NoCharacter);

