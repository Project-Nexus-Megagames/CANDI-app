import { Button, Center, Flex, Grid, Square, Text } from '@chakra-ui/react';
import { RemindFill } from '@rsuite/icons';
import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { connect } from 'react-redux';
import socket from '../../socket';
import Ice from './Ice';

const Target = ({	ice, facility, index, loading, targ }) => {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "ice",
		drop: (item) => socket.emit('request', { route: 'ice', action: 'assign', data: { index, facility: facility._id, ice: item.id } }),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	return  (
    <div ref={loading ? undefined : drop} 
    style={{ padding: '5px', 
              width: 150, 
              height: (isOver || targ !== 'Empty') ? 80 : 55, 
              border: !isOver ? '1px solid white' : '2px solid white', 
              borderRadius: '5px' 
              }}>
    {targ !== 'Empty' && ice && <Ice compact width={150} facility={facility} ice={ice}/>}
    {targ === 'Empty' && <Text color="GrayText" >Slot Open</Text>}
  </div>)
		// <div ref={drop}  style={{ width: '100%', height: 180, border: isOver ? '2px solid white' : '1px solid white', borderRadius: '5px'}}>
		// 	{ice !== 'Empty' && <Ice facility={server} ice={ice}/>}
		// 	{/* {<p style={{position: 'absolute', top: '10px', right: '0px', color:'white',  fontSize: '2em',}}>{ice ? ice.name : targ}</p>} */}
		// </div>)
};

const Server = (props) => {
	const { server, allIce, loading } = props;
	const [raids, setRaids] = React.useState([]);
	const [slots, setSlots] = React.useState([]);

	useEffect(() => {
		const temp = [];
		for (let i = 0; i < server.capacity; i++) {
      let indexed = server.ice.find(el => el.index === i);
			indexed ? temp.push(indexed) : temp.push('Empty');
		}
		setSlots(temp);
	}, [allIce, server])

	useEffect(() => {
		setRaids(props.raids.filter(el => el.location === server._id));
	}, [props.raids, server])

	const joinRaid = (raid) => {
		props.handleTransfer(raid)
    // tell Team Dashboard to set myRaid to this raid and then push to the raid page
	}
	
	return ( 
		<div style={{  borderRadius: '5px', border: "1px solid white", height: '180px' }}>
			<Flex color='white'>
				<Center flex='1' style={{  borderRadius: '5px', border: "1px solid white", height: '180px' }} >
			 		<div >
			 			<h5>{server.name} ({server.ice.length} / {server.capacity}) </h5>
            {server.ice.map(i => <p>{i._id} : {i.index}</p> )}
			 			<h5>Alert Level: {server.alert}</h5>
			 			{server.alert >= 10 && server.alert < 20 && <div>
			 				<RemindFill icon="remind" style={{ color: '#ffb300',  }}/> POSSIBLE RUN(S) DETECTED	<RemindFill icon="remind" style={{ color: '#ffb300',  }}/>
			 			</div>}
			 			{server.alert >= 20 && raids.length > 0 && <div>
			 				RUN(S) DETECTED
			 			</div>}
			 			<br/>
			 			<p>
			 			{false && server.alert >= 20 && raids.map(raid => 
			 				<Button key={raid._id} appearance='ghost' color='red' onClick={() => joinRaid(raid)} >{raid.leader}'s Raid</Button>)}
			 			</p>
			 			{/* {<ButtonGroup style={{ marginTop: '10px'}}>
			 				<Button onClick={() => handleBackspace()} >Backspace</Button>
			 			</ButtonGroup>} */}						
			 		</div>
				</Center>
				<Square  flex='3'>
          <Grid justify='space-around' align='middle' alignItems={"center"} templateColumns={`repeat(${slots.length}, 1fr)`} gap={1} style={{ width: '100%', height: '100%' }}>
            {slots.map((entry, index) => (
              <Target key={index} loading={loading} facility={server} index={index} targ={entry} ice={entry}/>
            ))}
          </Grid>
				 	{/* {slots.map((ice, index) => (
		 					<Target key={ice._id} server={server} index={index} ice={ice} targ={ice}  />			
		 				))}			 */}
				</Square>

			</Flex>			
		</div>
	);
};


const mapStateToProps = (state) => ({
	raids: state.raids.list,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Server);
