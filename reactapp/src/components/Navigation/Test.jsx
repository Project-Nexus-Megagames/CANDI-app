import React from 'react';
import { connect } from 'react-redux';
import { Container, Content, FlexboxGrid, Button, Modal, Icon, Loader } from 'rsuite';
import { useHistory } from "react-router-dom";
// import Map from './Map';
import Map2 from './Map2';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';
import { MapInteractionCSS } from 'react-map-interaction';
import NavigationBar from "../Navigation/NavigationBar";

const MapContainer = ({ locations, login, loading }) => {
	// const [scale, setScale] = React.useState(1);
  const [value, setValue] = React.useState({ scale: 1.15, translation: { x: 100, y: -470 }});
	const [territory, setTerritory] = React.useState({});
	const [boolean, setBoolean] = React.useState(false);

	const history = useHistory();
		
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
    if (value.scale > 2.1) {
      console.log(value.translation)
      console.log(value.scale)
      if (value.translation.x > 600) value.translation.x = 600; // Left
      if (value.translation.x < -1200) value.translation.x = -1200; //Right
      if (value.translation.y > -400) value.translation.y = -400; // Up
      if (value.translation.y < -2200) value.translation.y = -2200; // Down
    }
    else if(value.scale <= 2.1 && value.scale > 1.9) {
      console.log('3');
      if (value.translation.x > 600) value.translation.x = 600; // Left
      if (value.translation.x < -900) value.translation.x = -900; //Right
      if (value.translation.y > -400) value.translation.y = -400; // Up
      if (value.translation.y < -2200) value.translation.y = -2200; // Down
    }
    else if(value.scale <= 1.9 && value.scale > 1.7) {
      console.log('3');
      if (value.translation.x > 600) value.translation.x = 600; // Left
      if (value.translation.x < -600) value.translation.x = -600; //Right
      if (value.translation.y > -400) value.translation.y = -400; // Up
      if (value.translation.y < -1700) value.translation.y = -1700; // Down
    }
    else if (value.scale <= 1.7 && value.scale > 1.4) {
      console.log('2')
      console.log(value.scale)
      if (value.translation.x > 600) value.translation.x = 600;
      if (value.translation.x < -250) value.translation.x = -250;
      if (value.translation.y > -90) value.translation.y = -90;
      if (value.translation.y < -1300) value.translation.y = -1300;
    }
    else if (value.scale <= 1.4 && value.scale > 1.15) {
      console.log('1')
      console.log(value.translation)
      console.log(value.scale)
      if (value.translation.x > 600) value.translation.x = 600;
      if (value.translation.x < 90) value.translation.x = 90;
      if (value.translation.y > -250) value.translation.y = -250;
      if (value.translation.y < -900) value.translation.y = -900;
    }
    else if (value.scale <= 1.15 && value.scale > 1) {
      console.log('0')
      if (value.translation.x > 600) value.translation.x = 600;
      if (value.translation.x < 100) value.translation.x = 100;
      if (value.translation.y > -250) value.translation.y = -250;
      if (value.translation.y < -900) value.translation.y = -900;
    }
    else { // if scale is 1.15
      console.log('max')
      console.log(value.translation)
      console.log(value.scale)
      if (value.translation.x > 600) value.translation.x = 600;
      if (value.translation.x < 290) value.translation.x = 290;
      if (value.translation.y > -250) value.translation.y = -250;
      if (value.translation.y < -650) value.translation.y = -650;
    }
    setValue(value)
  }



  if (!login && !loading) {
    history.push('/');
    return (<Loader inverse center content="doot..." />)
  };
	return ( 
		<Container style={{ overflow: 'hidden', height: '99vh', width: '100%', position: 'relative', display: 'inline-block', textAlign: 'center', backgroundColor: '#29525f'}}>
			<NavigationBar/>
      <Content style={{ overflow: 'hidden' }}>
        <FlexboxGrid>
            <MapInteractionCSS minScale={1} maxScale={2.5} value={value} onChange={(value) => handleIt(value)} style={{ overflow: 'hidden' }} showControls={true} plusBtnContents={<Icon style={{ color: 'black' }} icon="plus"/>} minusBtnContents={<Icon style={{ color: 'black' }} icon="minus"/>}>
              <Map2 handleClick={clickHandlerer} />          
            </MapInteractionCSS>
        </FlexboxGrid>

			</Content>

			<Modal size='md' backdrop='static' show={boolean} onHide={() => setBoolean(false)} >
			  <Modal.Header>
            <Modal.Title>{territory.name}</Modal.Title>
            <FlexboxGrid>
              <FlexboxGridItem colspan={12}>
                Borough: {territory.borough}
              </FlexboxGridItem>
              <FlexboxGridItem colspan={12}>
                Influence: {territory.influence}
              </FlexboxGridItem>
            </FlexboxGrid>
        </Modal.Header>
          <Modal.Body>
            {territory.description}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setBoolean(false)} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
			</Modal>		
		</Container>
	);
}


const mapStateToProps = (state) => ({
	locations: state.locations.list,
  login: state.auth.login,
	loading: state.auth.loading,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>