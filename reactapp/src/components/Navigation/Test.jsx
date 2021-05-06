import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Content, Footer, FlexboxGrid, Button, PanelGroup, Panel, Input, List, RadioGroup, Radio, Toggle, ButtonToolbar, Modal, ButtonGroup, Icon, Loader } from 'rsuite';
import { useHistory } from "react-router-dom";
import Map from './Map';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';
import { MapInteractionCSS } from 'react-map-interaction';
import NavigationBar from "../Navigation/NavigationBar";

const MapContainer = ({ locations, login, loading }) => {
	// const [scale, setScale] = React.useState(1);
  const [value, setValue] = React.useState({ scale: 1, translation: { x: 0, y: 0 }});
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

  const getScale = () => {
    return { xMin: -250, xMax: 250, yMin: -1350, yMax: 50 }
  }

  const handleIt = (value) => {
    console.log(value.translation)
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
            <MapInteractionCSS minScale={1.25} maxScale={2.5} value={value} onChange={(value) => handleIt(value)} style={{ overflow: 'hidden' }} translationBounds={getScale()} showControls={true} plusBtnContents={<Icon style={{ color: 'black' }} icon="plus"/>} minusBtnContents={<Icon style={{ color: 'black' }} icon="minus"/>}>
              <Map handleClick={clickHandlerer} />          
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

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>