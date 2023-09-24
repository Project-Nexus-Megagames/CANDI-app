import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Grid, GridItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';
import { getFadedColor } from '../../scripts/frontend';

const LocationDashboard = (props) => {
	const navigate = useNavigate();
	const locations = useSelector(s => s.locations.list);
	const { login, team, myCharacter} = useSelector(s => s.auth);
	const loading =  useSelector(s => s.gamestate.loading);


	const [levels, setLevels] = React.useState([]);
	const [selected, setSelected] = React.useState(false);

	useEffect(() => {
		if(!props.login)
			navigate('/');
	}, [props.login, navigate])

  const handleScavenge = () => {
    socket.emit('request', { route: 'location', action: 'scavenge', data: { character: myCharacter.id, location: selected._id } })
	};

		
	// const [{ isOver }, drop] = useDrop(() => ({
	// 	accept: "asset",
	// 	drop: (item) => item.facility ? socket.emit('request', { route: 'asset', action: 'remove', data: { worker: item.id, facility: item.facility } }) : console.log('nope'),
	// 	collect: (monitor) => ({
	// 		isOver: !!monitor.isOver(),
	// 	}),
	// }));
	
	//if (!login || !character) return (<div />);	
	return ( 
		<Grid
        templateAreas={`"nav main"`}
        gridTemplateColumns={ '20% 80%'}
        gap='1'
        fontWeight='bold'>

			<GridItem pl='2' bg='pink' area={'nav'} >
        Stuff Here too
        {selected && <Box>
            {selected.name}
            <br/>
            {selected.description}
            <Button onClick={handleScavenge} >Scavenge Here</Button>
        </Box>}
			</GridItem>

			<GridItem pl='2' bg={getFadedColor('')} area={'main'} >
				
				<Box style={{ height: 'calc(100vh - 100px)', overflow: 'auto', }}> 
          {locations.map(location => (
            <Box key={location._id} onClick={() => setSelected(location)} >
              {location.name}
              
            </Box>
          ))}
				</Box>
			</GridItem>
		</Grid>
	);
}

export default (LocationDashboard);