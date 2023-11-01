import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../socket';
import { useDrop } from 'react-dnd';
import Server from './Server';
import Ice from './Ice';
import { getTeamServers } from '../../redux/entities/facilities';
import { getTeamIce } from '../../redux/entities/ice';
import { Box, Divider, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';

const ServerManagement = (props) => {
  // const { facilities } = props;
  const facilities =  useSelector(s => s.facilities.list);
	const teamIce = useSelector(s => s.ice.list);//  useSelector(getTeamIce);
	const [ice, setIce] = React.useState([]);
		
	useEffect(() => {
		setIce(teamIce.filter(el => !el.status.some(tag => tag === 'used')))
	}, [teamIce]);

	const [{ isOver }, drop] = useDrop(() => ({
		accept: "ice",
		drop: (item) => item.facility ? socket.emit('request', { route: 'ice', action: 'remove', data: { ice: item.id, facility: item.facility._id, index: item.index } }) : console.log('nope'),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	return ( 
		<Grid
			templateAreas={`"nav main"`}
			gridTemplateColumns={ '30% 70%'}
			gap='1'
			fontWeight='bold'>
			<GridItem style={{ height: 'calc(100vh - 120px)', overflow: 'auto', marginTop: '1px' }} pl='2' bg='#0f131a' ref={drop} className={!isOver ? 'card-style' : 'active-card'} area={'nav'}>		
				<VStack divider={<Divider />} size='lg' width={'80%'} >
          Drag to remove Ice {ice.length}
					{ice.map((ice) => (
            <Ice expanded key={ice._id} ice={ice}/>
					))}
				</VStack>
			</GridItem>

			<GridItem pl='2' bg='#0f131a' area={'main'}>
				<Box className='page-container'  size="md" >
					{facilities && facilities.filter(el => el.tags.some(tag => tag === 'server')).map((server) => (
						<Server key={server._id} handleTransfer={props.handleTransfer} server={server} />
					))}
				</Box>		
			</GridItem>
		</Grid>
	);
}

export default (ServerManagement);