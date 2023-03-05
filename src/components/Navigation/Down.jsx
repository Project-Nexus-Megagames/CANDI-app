import { Button } from '@chakra-ui/button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { signOut } from '../../redux/entities/auth';

const Down = (props) => {
	const { control,  } = useSelector(s => s.auth);
	const reduxAction = useDispatch();
	const navigate = useNavigate();

  const handleLogOut = async () => {
		reduxAction(signOut());
    navigate('/login');
  }

  return ( 
    <React.Fragment>
      <img src='http://cdn.lowgif.com/full/02b057d73bf288f7-.gif' alt={'No Character...'} onClick={()=> this.bored()} />  
      <p>CANDI is offline for maintenence. Please check in Discord for annoncements regarding this down time.</p>
			{control && <div>
				<p>... unless you are control. Which if you can read this, you are. Go right in but shit might break yo</p>
				<Button onClick={()=> navigate('/control')}>Take me to Control Terminal</Button>
				<Button onClick={()=> navigate('/actions')}>Take me to Actions</Button>
				<Button onClick={()=> navigate('/others')}>Take me to Other Characters</Button>
			</div>}
    </React.Fragment>
  );    
}

export default (Down);

