import React from 'react';
import { connect } from 'react-redux';
import { Container, Content, FlexboxGrid, Button, Modal, Icon, Loader, Sidebar, Divider } from 'rsuite';
import { useHistory } from "react-router-dom";
// import Map from './Map';
import Map2 from './Map2';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';
import { MapInteractionCSS } from 'react-map-interaction';
import NavigationBar from "../Navigation/NavigationBar";
import { getMyCharacter } from '../../redux/entities/characters';

const MapContainer = ({ locations, login, loading, characters, user, myCharacter }) => {
	// const [scale, setScale] = React.useState(1);
  const [value, setValue] = React.useState({ scale: 1.15, translation: { x: 100, y: -470 }});
	const [territory, setTerritory] = React.useState({ name: 'Hover over territory to see details',  description: '?????',  currentOwner: '????????',  influence: 0});
	const [boolean, setBoolean] = React.useState(false);


	const history = useHistory();
  
	const width = window.innerHeight / 2.5;
  const [xPosition, setX] = React.useState(0);

  const toggleMenu = () => {
    if (xPosition < 0) { // if close
      setX(0); // open
    } else {
      setX(-width); // close
    }
  };

	const clickHandlerer = (code) => {
    const loc = locations.find(el => el.code === code)
    if (loc) {
      setTerritory(loc);
    }
    else {
      setTerritory({
        name: 'unknown',
        description: 'unknown',
        currentOwner: 'unknown',
        influence: -999
      })
    }
    setBoolean(true);
	}

  const handleIt = (value) => {

    setValue(value)
  }

	const specialStyle = () => {
		if (xPosition < 0) // if closed
			return({transform: `translate(${width}px, 2vh)`, borderTopRightRadius: '10rem', borderBottomRightRadius: '9rem'});
		else
			return({transform: `translate(${width - 20
      }px, 2vh)`, borderTopLeftRadius: '10rem', borderBottomLeftRadius: '9rem' });
	}

  const handleHover = (value) => {
    // console.log(value)
    const loc = locations.find(el => el.code === value)
    if (loc) {
      setTerritory(loc);
    }
    else {
      setTerritory({
        name: 'unknown',
        description: 'unknown',
        currentOwner: 'unknown',
        influence: -999
      })
    }
  }

  if (!login && !loading) {
    history.push('/');
    return (<Loader inverse center content="doot..." />)
  };
	return ( 
    <React.Fragment>
      	<NavigationBar/>
      <Container style={{ height: '94vh', width: '100%', position: 'relative', textAlign: 'center', backgroundColor: '#5d000e'}}>
      <Sidebar width={xPosition < 0 ? width + xPosition + 15 : width + xPosition} style={{transition: '0.8s ease'}}>
      <div
        className="side-bar"
        style={{
          transform: `translatex(${xPosition}px)`,
          width: width,
          minHeight: '100vh'
        }}
      >
        <button
          onClick={() => toggleMenu()}
          className="toggle-menu"
          style={specialStyle()}
        ></button>
			<h3>{territory.name}</h3>
      {(user.roles.some(el=> el === 'Control') || myCharacter.characterName === territory.currentOwner) && <h5 style={{backgroundColor: "#61342e", }} > Territory Value: {territory.influence} </h5>}
      <Divider>{territory.borough} - {territory.code}</Divider>
      <p><h5>Owned by: {territory.currentOwner}</h5></p>
      

      <p style={{ fontSize: '1.2em', fontWeight: '300', }}>{territory.description}</p>
			</div>   
		</Sidebar>
        <Content>
          <div style={{ width: '100%', height: '100%' }}> 
            <MapInteractionCSS minScale={1} maxScale={2.7} value={value} onChange={(value) => handleIt(value)} style={{ overflow: 'hidden', height: '100%' }} showControls={true} plusBtnContents={<Icon style={{ color: 'black' }} icon="plus"/>} minusBtnContents={<Icon style={{ color: 'black' }} icon="minus"/>}>
              <Map2 mouseOverEffect={handleHover} handleClick={clickHandlerer} locations={locations} characters={characters} />          
            </MapInteractionCSS>       
          </div>
        </Content>
        <Modal size='md' backdrop='static' show={boolean} onHide={() => setBoolean(false)} >
          <Modal.Header>
              <Modal.Title>{territory.name}</Modal.Title>
              <FlexboxGrid>
                <FlexboxGridItem colspan={12}>
                  Borough: {territory.borough}
                </FlexboxGridItem>
                <p style={{ fontSize: '1.2em', fontWeight: '300', }}>{territory.description}</p>
      {user.roles.some(el=> el === 'Control') && <FlexboxGridItem colspan={12}>
        <h3 style={{backgroundColor: "#61342e", }} >Influence: {territory.influence}</h3>
                  
      </FlexboxGridItem>}
              </FlexboxGrid>
          </Modal.Header>
            <Modal.Body>

            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setBoolean(false)} appearance="subtle">
                Cancel
              </Button>
            </Modal.Footer>
        </Modal>		
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
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>