import { Button } from '@chakra-ui/button';
import React from 'react';
const Down = (props) => {

  const handleLogOut = async () => {
    this.props.logOut()
    this.props.history.push('/login');
  }

  return ( 
    <React.Fragment>
      <img src='http://cdn.lowgif.com/full/02b057d73bf288f7-.gif' alt={'No Character...'} onClick={()=> this.bored()} />  
      <p>CANDI is offline for maintenence. Please check in Discord for annoncements regarding this down time.</p>
			{this.props.user && this.props.user.roles.some(el=> el === 'Control') && <div>
				<p>... unless you are control. Which if you can read this, you are. Go right in but shit might break yo</p>
				<Button onClick={()=> this.props.history.push('/control')}>Take me to Control Terminal</Button>
				<Button onClick={()=> this.props.history.push('/actions')}>Take me to Actions</Button>
				<Button onClick={()=> this.props.history.push('/others')}>Take me to Other Characters</Button>
			</div>}
    </React.Fragment>
  );    
}

export default (Down);

