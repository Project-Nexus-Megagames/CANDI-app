import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Content, FlexboxGrid, Button, Modal, Icon, Loader, Sidebar, Divider, Panel, Tag, ButtonGroup } from 'rsuite';
import { useHistory } from "react-router-dom";
import { MapInteractionCSS } from 'react-map-interaction';
import HexMap from './HexMap';
import socket from '../../socket';
import NavigationBar from '../Navigation/NavigationBar';


const Map = ({ locations, login, loading, characters, user, myCharacter, military }) => {
	const defaultTerr = { name: 'Hover over territory to see details',  description: '?????',  currentOwner: '????????',  influence: 0, coords: { x: 0, y: 0 }}
  const [value, setValue] = React.useState({ scale: 1, translation: { x: 0, y: 0 }});
	const [territory, setTerritory] = React.useState(defaultTerr);
	const [selected, setSelected] = React.useState(false);
	const [tab, setTab] = React.useState('info');
	const [mission, setMission] = React.useState(undefined); 
  const [start, setStart] = React.useState();

	const history = useHistory();
  
	const width = 350// window.innerHeight / 2.5;


	const clickHandlerer = (type, unit, coords) => {
		console.log(type)
		switch (type) {
			case 'Military':
				setSelected(unit);
				setStart(coords)
				setTerritory(false)
				break;
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
				name: 'unknown',
				description: 'unknown',
				currentOwner: value,
				influence: -999,
				coords: { x: 0, y: 0 }
			})
		}
  }

	const getHexId = (row, col) => {
	const Letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var letterIndex = row;
	var letters = "";
	while(letterIndex > 25)
	{
		letters = [letterIndex%26] + letters;
		letterIndex -= 26;
	}
	return `${Letters[letterIndex] + letters + (col + 1)}`;
};

	const handleTab = (type) => {
		setTab(type);
		setMission(false);
		setTerritory(defaultTerr)
}

  if (!login && !loading) {
    history.push('/');
    return (<Loader inverse center content="doot..." />)
  };
	return ( // 
    <React.Fragment>
			<NavigationBar/>
      <Container  style={{ height: 'calc(100vh - 50px)',}}> 
        <Content>
          <div style={{ width: '100%', height: '100%' }}> 
            <MapInteractionCSS minScale={1} maxScale={4} value={value} onChange={(value) => handleIt(value)} style={{ overflow: 'hidden', height: '100%' }} showControls={true} plusBtnContents={<Icon style={{ color: 'black' }} icon="plus"/>} minusBtnContents={<Icon style={{ color: 'black' }} icon="minus"/>}>
 							<HexMap handleHover={handleHover} handleClick={clickHandlerer} locations={locations}/>
            </MapInteractionCSS>       

          </div>
        </Content>
			<Sidebar width={250} style={{transition: '0.8s ease'}}>
								
      <div
        className="side-bar"
        style={{
          width: 250,
          minHeight: '100vh'
        }}
      >
				 <button
          onClick={() => handleTab('info')}
          className="toggle-menu"
					style={{transform: `translate(${-20}px, ${100}px)`,	backgroundColor: '#087ad1' }}
        ><Icon icon='info-circle' /></button>

			{tab === 'info' && <div>
				<h3>{territory.name}</h3>
	  	 <Divider>{territory.coords ? getHexId(territory.coords.x+3, territory.coords.y+3) : <b>Bad Coords</b>} - ({territory.coords.x}, {territory.coords.y}) </Divider>
			 	<ButtonGroup>
					<Button appearance={mission !== 'move' ? 'ghost' : 'primary'} color={'green'} onClick={() => setMission('move')} >Move</Button>
				</ButtonGroup>
			</div>}

			</div>   
			
		</Sidebar>

      </Container>      
    </React.Fragment>

	);
}

const mapStateToProps = (state) => ({
	locations: state.locations.list,
	characters: state.characters.list,
  login: state.auth.login,
	loading: state.auth.loading,
  user: state.auth.user,
	// myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Map);