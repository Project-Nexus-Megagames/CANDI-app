import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Container, Content, Icon, Loader, Sidebar, Divider, } from 'rsuite';
import { useHistory } from "react-router-dom";
import HexMap from './HexMap';
import { getMyLocations } from '../../redux/entities/locations';
import NavigationBar from '../Navigation/NavigationBar';
import { MapInteractionCSS } from 'react-map-interaction';


const Map = (props) => {
	const { locations, login, loading, unlockedLocations, control, myCharacter, military } = props;
	const defaultTerr = { name: 'Hover over territory to see details',  description: '?????',  currentOwner: '????????',  influence: 0, coords: { x: 0, y: 0 }}
  const [value, setValue] = React.useState({ scale: 1, translation: { x: 0, y: 0 }});
	const [territory, setTerritory] = React.useState(defaultTerr);
  const constraintsRef = useRef(null);

	const history = useHistory();
  
	const width = 350// window.innerHeight / 2.5;


	const clickHandlerer = (type, unit, coords) => {
		console.log(type)
		switch (type) {
			case 'hex':
				const loc = locations.find(el => el.coords.x === coords.q && el.coords.y === coords.r);
				loc ? setTerritory(loc) : console.log('loc undefined');
				break;
			default: 
				console.log(`${type} is BAD!!!`)
				break;
		}
	}

  const handleIt = (value) => {
    setValue(value)
  }

  const handleHover = (x) => {
		const loc = locations.find(el => el.coords.x == x[0] && el.coords.y == x[1]);
		if (loc) {
			setTerritory(loc);
		}
		else {
			setTerritory({
				name: 'Undiscovered Territory',
				description: 'Here be Monsters...',
				currentOwner: value,
				influence: -999,
				coords: { x: parseInt(x[0]), y: parseInt(x[1]) }
			})
		}
  }

	const getHexId = (row, col) => {
	const Letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var letterIndex = parseInt(row);
	var letters = "";
	while(letterIndex > 25)
	{
		letters = [letterIndex%26] + letters;
		letterIndex -= 26;
	}
	
	return `${Letters[letterIndex] + letters + (col + 1)}`;
};

  if (!login && !loading) {
    history.push('/');
    return (<Loader inverse center content="doot..." />)
  };
	return ( // 
    <React.Fragment>
			<NavigationBar/>
      <Container  style={{ height: 'calc(100vh - 50px)', }}> 
        <Content ref={constraintsRef}>
				<MapInteractionCSS minScale={1} maxScale={4} value={value} onChange={(value) => handleIt(value)} style={{ overflow: 'hidden', height: '100%' }} showControls={true} plusBtnContents={<Icon style={{ color: 'black' }} icon="plus"/>} minusBtnContents={<Icon style={{ color: 'black' }} icon="minus"/>}>
					<HexMap handleHover={handleHover} handleClick={clickHandlerer} locations={unlockedLocations}/>  
				</MapInteractionCSS>
						
        </Content>
			{props.control && <Sidebar width={250} style={{transition: '0.8s ease'}}>
								
			{<div className="side-bar">
				<h5>This is a Control Only Panel.</h5>
				<h3>{territory.name}</h3>
				<Divider>{territory.coords ? getHexId(territory.coords.x, territory.coords.y) : <b>Bad Coords</b>} - ({territory.coords.x}, {territory.coords.y}) </Divider>
				<p className='p-left' >{territory.description}</p>
				<Divider>Unlocked By</Divider>
				{territory.unlockedBy && territory.unlockedBy.map(el => (
					<div>{el.playerName}</div>
					
				))}
			</div>}

 
			
		</Sidebar>}

      </Container>      
    </React.Fragment>

	);
}

const mapStateToProps = (state) => ({
	unlockedLocations: state.auth.character ? getMyLocations(state) : [],
	locations: state.locations.list,
	control: state.auth.control,
	characters: state.characters.list,
  login: state.auth.login,
	loading: state.auth.loading,
  user: state.auth.user,
	// myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Map);