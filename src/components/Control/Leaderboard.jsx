import React, { useEffect } from 'react';
import { Grid, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Avatar, IconButton, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon, Table, Divider} from 'rsuite';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { connect } from 'react-redux';
import NavigationBar from '../Navigation/NavigationBar';
import { getGodBonds, getMortalBonds } from '../../redux/entities/assets';

const  Leaderboard = (props) => {
	const [copy, setCopy] = React.useState([]);
	const [number, setNumber] = React.useState(3);

	const aspects = [
		'Justice',
		'Trickery',
		'Balance',
		'Hedonism',
		'Bonding',
		'Arts',
		'Sporting',
		'Fabrication',
		'Scholarship',
		'Pugilism',
		'Glory',
	]

	useEffect(() => {

		if (props.login) {		
		let array = [];
		const bonds = [ ...props.godBonds, ...props.mortalBonds];
		for (const char of props.characters.filter(el => el.tags.some(tag => tag === 'PC'))) {
			// console.log(char.characterName)
			let charBonds = bonds.filter(bond => bond.ownerCharacter === char._id );

			// console.log('===Justice===')
			const Justice = calculate(charBonds, ['Hera']);
			const Trickery = calculate(charBonds, ['Hermes']);
			const Balance = calculate(charBonds, ['Demeter']);
			const Hedonism = calculate(charBonds, ['Dionysus']);
			const Bonding = calculate(charBonds, ['Aphrodite']);
			const Arts = calculate(charBonds, ['Apollo']);
			const Sporting = calculate(charBonds, ['Artemis']);
			const Fabrication = calculate(charBonds, ['Hephaestus']);
			const Scholarship = calculate(charBonds, ['Athena'], char.characterName);
			const Pugilism = calculate(charBonds, ['Ares']);
			const Glory = calculate(charBonds, ['Zeus', 'Hades', 'Poseidon']);

			// console.log(char.Pugilism)
			// console.log(Scholarship + char.Scholarship)
			const character = {
				characterName: char.characterName,
				characterTitle: char.characterTitle,
				_id: char._id,
				tags: char.tags,
				Justice: Justice + char.Justice,
        Trickery: Trickery + char.Trickery,
        Balance: Balance + char.Balance,
        Hedonism: Hedonism + char.Hedonism,
        Bonding: Bonding + char.Bonding,
        Arts: Arts + char.Arts,
        Sporting: Sporting + char.Sporting,
        Fabrication: Fabrication + char.Fabrication,
        Scholarship: Scholarship + char.Scholarship,
        Pugilism: Pugilism + char.Pugilism,
        Glory: Glory + (char.Glory * 1.25),
				originalJustice: char.Justice,
        originalTrickery: char.Trickery,
        originalBalance: char.Balance,
        originalHedonism: char.Hedonism,
        originalBonding: char.Bonding,
        originalArts: char.Arts,
        originalSporting: char.Sporting,
        originalFabrication: char.Fabrication,
        originalScholarship: char.Scholarship,
        originalPugilism: char.Pugilism,
        originalGlory: char.Glory,
				total: Justice + char.Justice + 
					char.Trickery +  Trickery + 
					char.Balance +  Balance + 
					char.Hedonism +  Hedonism + 
					char.Bonding +  Bonding + 
					char.Arts +  Arts + 
					char.Sporting +  Sporting + 
					char.Fabrication +  Fabrication + 
					char.Scholarship +  Scholarship + 
					char.Pugilism +  Pugilism + 
					(char.Glory * 1.25) + Glory
			}
			array.push(character);
		}

		for (const ass of aspects) {
			bonus(array, ass)
		}

		setCopy(array);
		}
	}, []);

	const calculate = (charBonds, gods, show) => {
		let array = charBonds.filter(bond => gods.some(god => god === bond.with.characterName));
		let bonding = 0;
		if (gods.some(god => god === 'Aphrodite')) bonding = (charBonds.filter(el => el.level === 'Bonded').length * 3);

		if (show && show === 'Anne Grath') { // Diagnostic tool
			console.log(show)
			console.log(`Preferred: + ${(array.filter(el => el.level=== 'Preferred').length)}`);
			console.log(`Favoured + ${(array.filter(el => el.level === 'Favoured').length * 3)}`);
			console.log(`Blessed + ${(array.filter(el => el.level === 'Blessed').length * 6)}`);
			console.log(`Bonded + ${bonding}`);
			console.log(`Disfavoured - ${(array.filter(el => el.level === 'Disfavoured').length )}`);
			console.log(`Condemned - ${(array.filter(el => el.level === 'Condemned').length ) * 3}\n`);		
			console.log()	
		}

		return (
		(array.filter(el => el.level=== 'Preferred').length) +
		(array.filter(el => el.level === 'Favoured').length * 3) +
		(array.filter(el => el.level === 'Blessed').length * 6) +
		bonding -
		(array.filter(el => el.level === 'Disfavoured').length ) -
		(array.filter(el => el.level === 'Condemned').length * 3))
	}

	const bonus = (characters, aspect) => { 		
		characters.sort(function(a, b){return b[aspect] - a[aspect]})
		if (characters[0] === 'Martin Keene') console.log(characters[0].total)
		characters[0].total = characters[0].total + 3;
		characters[1].total = characters[1].total + 2;
		characters[2].total = characters[2].total + 1;
		if (characters[0] === 'Martin Keene') console.log(characters[0].total)
	}
	
	if (!props.login) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	}
	else return ( 
		
		<React.Fragment>
			<NavigationBar/>
				<h3>Leaderboard</h3>
				{<Button onClick={() => setNumber(number === 3 ? 100 : 3)}>Show All</Button>}

				{<Col xs={24} sm={24} md={24} className="gridbox">
							<div style={{ border: '3px solid pink', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: 'pink', color: 'black' }}>Total</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.total - a.total}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.total}
												</div>}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
								))}
								</List>
              </div>
        </Col>}

				<Col xs={24} sm={24} md={24} className="gridbox">
							<div style={{ border: '3px solid Yellow', borderRadius: '5px', width: '100%', }} >
								<h5 style={{ backgroundColor: 'yellow', color: 'black' }}>Glory</h5>
								<List hover size="sm">
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Glory - a.Glory}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.Glory} ({character.originalGlory})
												</div>}
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
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Arts - a.Arts}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.Arts} ({character.originalArts})
											</div>}
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
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Balance - a.Balance}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.Balance} ({character.originalBalance})
											</div>}
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
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Bonding - a.Bonding}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.Bonding} ({character.originalBonding})
											</div>}
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
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Fabrication - a.Fabrication}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.Fabrication} ({character.originalFabrication})
											</div>}
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
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Hedonism - a.Hedonism}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.Hedonism} ({character.originalHedonism})
											</div>}
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
								))}
								</List>
              </div>
            </Col>

        <Grid fluid>
          <Row>
            <Col xs={24} sm={24} md={12} className="gridbox">
              <div style={{ border: '3px solid gray', borderRadius: '5px', width: '100%', }} >
							<h5 style={{ backgroundColor: 'gray' }}>Justice</h5>
							<List hover size="sm">
								{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Justice - a.Justice}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.Justice} ({character.originalJustice})
											</div>}
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
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Pugilism - a.Pugilism}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
										<FlexboxGrid>
											<FlexboxGrid.Item colspan={2}>
												<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
											</FlexboxGrid.Item>
											<FlexboxGrid.Item colspan={20}>
												{character.characterName} ({character.characterTitle})
											</FlexboxGrid.Item>
											<FlexboxGrid.Item colspan={2}>
												{<div>
												{character.Pugilism} ({character.originalPugilism})
											</div>}
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
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Scholarship - a.Scholarship}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.Scholarship} ({character.originalScholarship})
											</div>}
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
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Sporting - a.Sporting}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.Sporting} ({character.originalSporting})
											</div>}
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
									{copy.filter(el => el.tags.some(tag => tag === 'PC')).sort(function(a, b){return b.Trickery - a.Trickery}).splice(0, number).map((character, index) => (
									<List.Item key={index} index={index}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={2}>
											<b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={20}>
											{character.characterName} ({character.characterTitle})
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={2}>
											{<div>
												{character.Trickery} ({character.originalTrickery})
												</div>}
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
	mortalBonds: getMortalBonds(state),
	godBonds: getGodBonds(state),
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);
