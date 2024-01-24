import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../socket';
import { useDrop } from 'react-dnd';
import { getTeamAccount } from '../../redux/entities/accounts';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Production = (props) => {
	const navigate = useNavigate();
	const blueprints = useSelector(s => s.blueprints.list);
	const { login, team, character} = useSelector(s => s.auth);
	const loading =  useSelector(s => s.gamestate.loading);
	const account = useSelector(getTeamAccount);


	const [levels, setLevels] = React.useState([]);

	useEffect(() => {
		if(!props.login)
			navigate('/');
	}, [props.login, navigate])
		
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "asset",
		drop: (item) => item.facility ? socket.emit('request', { route: 'asset', action: 'remove', data: { worker: item.id, facility: item.facility } }) : console.log('nope'),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));
	
	if (!login || !character || !team) return (<div />);	
	return ( 
		<Grid
        templateAreas={`"nav main"`}
        gridTemplateColumns={ '20% 80%'}
        gap='1'
        fontWeight='bold'>
			<GridItem pl='2' bg='#0f131a' area={'nav'} >
	
			</GridItem>
			<GridItem pl='2' bg='#0f131a' area={'main'} >
				
				<Box style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}> 
          Stuff Here
				</Box>
			</GridItem>
		</Grid>
	);
}

export default (Production);