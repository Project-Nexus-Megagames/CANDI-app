import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Content, Footer, FlexboxGrid, Button, PanelGroup, Panel, Input, List, RadioGroup, Radio, Toggle, ButtonToolbar, Modal, ButtonGroup, Icon } from 'rsuite';
import { useHistory } from "react-router-dom";
import Map from './Map';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';
import { MapInteractionCSS } from 'react-map-interaction';
import NavigationBar from "../Navigation/navigationBar";


console.log(window.innerWidth)
console.log(window.innerHeight)

const Memories = ({ locations }) => {
	const [filter, setFilter] = React.useState('');
	const [territory, setTerritory] = React.useState({});
	const [boolean, setBoolean] = React.useState(false);

  let height = window.innerHeight
  let width = window.innerWidth

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

	return ( 
		<Container style={{ overflow: 'hidden', height: '99vh', width: '100%', position: 'relative', display: 'inline-block', textAlign: 'center', }}>
			<NavigationBar/>
      <Content style={{ overflow: 'hidden' }}>
        <MapInteractionCSS style={{ overflow: 'hidden' }} translationBounds={{ xMin: -250, xMax: 500, yMin: -250, yMax: 500 }} showControls={true} plusBtnContents={<Icon style={{ color: 'black' }} icon="plus"/>} minusBtnContents={<Icon style={{ color: 'black' }} icon="minus"/>}>
          <Map handleClick={clickHandlerer} />          
        </MapInteractionCSS>

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
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Memories);

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>