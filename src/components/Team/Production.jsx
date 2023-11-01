import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import socket from '../../socket';
import { useNavigate } from "react-router-dom";
import { useDrop } from 'react-dnd';
import Worker from './Worker';
import Factory from './Factory';
import { getFadedColor } from '../../scripts/frontend';
import { getTeamAccount } from '../../redux/entities/accounts';
import ResourceNugget from '../Common/ResourceNugget';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { setTeam } from '../../redux/entities/auth';
import SelectPicker from '../Common/SelectPicker';

const Production = (props) => {
	const reduxAction = useDispatch();
	const teams = useSelector(s => s.teams.list);
	const blueprints = useSelector(s => s.blueprints.list);
	const { login, team, character, control } = useSelector(s => s.auth);
	const loading =  useSelector(s => s.gamestate.loading);
	const account = useSelector(getTeamAccount);
	const { facilities, workers } = props;


	const [levels, setLevels] = React.useState([]);
	const [tags, setTags] = React.useState(['Lab', 'Factory', 'Refinery','Assembly', 'Other']);
  const [renderRounds, setRenderRounds] = React.useState(['Lab', 'Factory', 'Refinery','Assembly', 'Other']);

  const handleTemp = (team) => {
    reduxAction(setTeam(teams.find(el => el._id === team)));
  }


	useEffect(() => {
		if (facilities) {
			let uniqueChars = [];
			for (const asset of facilities ) {
				if (!uniqueChars.some(el => el === asset.level)) uniqueChars.push(asset.level);
			}
			setLevels(uniqueChars.sort())
		}
	}, [facilities]);
		
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "asset",
		drop: (item) => item.facility ? socket.emit('request', { route: 'asset', action: 'remove', data: { worker: item.id, facility: item.facility } }) : console.log('nope'),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));
	
  const handleRoundToggle = (round) => {
    if (renderRounds.some(r => r === round)) setRenderRounds(renderRounds.filter((r => r !== round)))
    else setRenderRounds([ ...renderRounds, round ])
  }

	if (!login || !character || !team) return (<div />);	
	return ( 
		<div >
			<Grid
          templateAreas={`"nav main"`}
          gridTemplateColumns={ '10% 90%'}
          gap='1'
          fontWeight='bold'>

				<GridItem pl='2' bg='#0f131a' area={'nav'}  ref={ loading ? undefined : drop} className={!isOver ? 'card-style' : 'card-style-hover'}  style={{ height: 'calc(100vh - 120px)', overflow: 'auto', marginTop: '5px'}}>
					<div style={{ height: 'calc(100vh - 140px)', overflow: 'auto', textAlign: 'center', }}>
            Drag Worker Here to remove
						{workers.filter(el => !el.facility && !el.status.some(tag => tag === 'working')).map((asset, index) => (
							<Worker key={asset._id} asset={asset}/>
						))}
					</div>	  
				</GridItem>

				<GridItem bg='#0f131a' area={'main'} >

        {control && <SelectPicker label='name' data={teams} value={team?._id} onChange={(id) => handleTemp(id)} />}
					
					<Box style={{ height: 'calc(100vh - 140px)', overflow: 'auto', textAlign: 'center', }}> 
          
						{tags.map(tag => 
							<div key={tag}>
							<Box >
                {facilities.filter(el => el.tags.some(t => t === tag.toLowerCase())).length > 0 && 
                <h5 className='toggle-tag' onClick={() => handleRoundToggle(tag)} style={{ backgroundColor: getFadedColor(tag.toLowerCase()), color: 'black', }}>{tag}</h5>}
								{renderRounds.some(r => r === tag) && facilities.filter(el => el.tags.some(t => t === tag.toLowerCase())).sort((a, b) => { // sort the catagories alphabetically 
                  if(a.level < b.level) { return -1; }
                  if(a.level > b.level) { return 1; }
                  return 0;
                }).map((facility) => (
									<Factory 
										key={facility._id} index={facility._id}
										workers={workers.filter(el => el.facility === facility._id)} 
										blueprints={blueprints.filter(el => el.target)} 
										facility={facility} />
								))}
								</Box>				
							</div>
							)}			
					</Box>
				</GridItem>
			</Grid>
		</div>
	);
}

export default (Production);