import React, { useEffect } from 'react';
import { Grid, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Avatar, IconButton, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon, Table, Divider} from 'rsuite';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { connect } from 'react-redux';
import NavigationBar from '../Navigation/NavigationBar';

const  Leaderboard = (props) => {
	const [copy, setCopy] = React.useState([]);

	useEffect(() => {
		setCopy(props.characters);
	}, []);
	
	if (!props.login) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	}
	else return ( 
		<React.Fragment>
			<NavigationBar/>
				<h3>Leaderboard</h3>
        <Grid fluid>
          <Row>
            <Col xs={24} sm={24} md={12} className="gridbox">
              <div style={{ border: '3px solid gray', borderRadius: '5px', width: '100%', }} >
							<h5 style={{ backgroundColor: 'gray' }}>Justice</h5>
							<List hover size="sm">
								{copy.filter(el => el.tags.some(el2 => el2 === 'PC')).sort(function(a, b){return b.Justice - a.Justice}).splice(0, 3).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{props.myCharacter.tags.some(el => el === 'Control') && character.Justice}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
							))}
						</List>
              </div>
            </Col>

						<Col xs={24} sm={24} md={12} className="gridbox">
							<div style={{ border: '3px solid Yellow', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: 'yellow', color: 'black' }}>Trickery</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(el2 => el2 === 'PC')).sort(function(a, b){return b.Trickery - a.Trickery}).splice(0, 3).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{props.myCharacter.tags.some(el => el === 'Control') && character.Trickery}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
								))}
								</List>
              </div>
            </Col>

            <Col xs={24} sm={24} md={12} className="gridbox">
							<div style={{ border: '3px solid #22a12a', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: '#22a12a' }}>Balance</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(el2 => el2 === 'PC')).sort(function(a, b){return b.Balance - a.Balance}).splice(0, 3).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{props.myCharacter.tags.some(el => el === 'Control') && character.Balance}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
								))}
								</List>
              </div>
            </Col>

            <Col xs={24} sm={24} md={12} className="gridbox">
							<div style={{ border: '3px solid Purple', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: 'Purple' }}>Hedonism</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(el2 => el2 === 'PC')).sort(function(a, b){return b.Hedonism - a.Hedonism}).splice(0, 3).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{props.myCharacter.tags.some(el => el === 'Control') && character.Hedonism}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
								))}
								</List>
              </div>
            </Col>

						<Col xs={24} sm={24} md={12} className="gridbox">
							<div style={{ border: '3px solid  #0f8095', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: ' #0f8095' }}>Bonding</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(el2 => el2 === 'PC')).sort(function(a, b){return b.Bonding - a.Bonding}).splice(0, 3).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{props.myCharacter.tags.some(el => el === 'Control') && character.Bonding}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
								))}
								</List>
              </div>
            </Col>

						<Col xs={24} sm={24} md={12} className="gridbox">
							<div style={{ border: '3px solid Brown', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: 'Brown' }}>Arts</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(el2 => el2 === 'PC')).sort(function(a, b){return b.Arts - a.Arts}).splice(0, 3).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{props.myCharacter.tags.some(el => el === 'Control') && character.Arts}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
								))}
								</List>
              </div>
            </Col>

						<Col xs={24} sm={24} md={12} className="gridbox">
							<div style={{ border: '3px solid #950f80', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: '#950f80' }}>Sporting</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(el2 => el2 === 'PC')).sort(function(a, b){return b.Sporting - a.Sporting}).splice(0, 3).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{props.myCharacter.tags.some(el => el === 'Control') && character.Sporting}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
								))}
								</List>
              </div>
            </Col>

						<Col xs={24} sm={24} md={12} className="gridbox">
							<div style={{ border: '3px solid Orange', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: 'Orange' }}>Fabrication</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(el2 => el2 === 'PC')).sort(function(a, b){return b.Fabrication - a.Fabrication}).splice(0, 3).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{props.myCharacter.tags.some(el => el === 'Control') && character.Fabrication}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
								))}
								</List>
              </div>
            </Col>

						<Col xs={24} sm={24} md={12} className="gridbox">
							<div style={{ border: '3px solid #4169e1', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: '#4169e1', color: 'black' }}>Scholarship</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(el2 => el2 === 'PC')).sort(function(a, b){return b.Scholarship - a.Scholarship}).splice(0, 3).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{props.myCharacter.tags.some(el => el === 'Control') && character.Scholarship}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
								))}
								</List>
              </div>
            </Col>

						<Col xs={24} sm={24} md={12} className="gridbox">
							<div style={{ border: '3px solid #8a0303', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: '#8a0303' }}>Pugilism</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(el2 => el2 === 'PC')).sort(function(a, b){return b.Pugilism - a.Pugilism}).splice(0, 3).map((character, index) => (
									<List.Item key={index} index={index}>
										<FlexboxGrid>
											<FlexboxGrid.Item colspan={2}>
												<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
											</FlexboxGrid.Item>
											<FlexboxGrid.Item colspan={20}>
												{character.characterName}
											</FlexboxGrid.Item>
											<FlexboxGrid.Item colspan={2}>
												{props.myCharacter.tags.some(el => el === 'Control') && character.Pugilism}
											</FlexboxGrid.Item>
										</FlexboxGrid>
									</List.Item>
								))}
								</List>
              </div>
            </Col>

          </Row>
        </Grid>
		</React.Fragment>
	);
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	assets: state.assets.list,
	login: state.auth.login,
	characters: state.characters.list,
	duck: state.gamestate.duck,
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);
