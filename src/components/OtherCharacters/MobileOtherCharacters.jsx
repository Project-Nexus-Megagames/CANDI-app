import React, { useEffect } from 'react';
import { ButtonGroup, Button, Content, Container, Sidebar, Input, Grid, List, PanelGroup, FlexboxGrid, Avatar, IconButton, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon, Table, Divider, Drawer} from 'rsuite';
import AddAsset from './AddAsset';
import ModifyCharacter from './ModifyCharacter';
import NavigationBar from '../Navigation/NavigationBar';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { connect } from 'react-redux';
import socket from '../../socket'; 
import NewCharacter from '../Control/NewCharacter'; 

const { HeaderCell, Cell, Column, } = Table;

const  OtherCharacters = (props) => {
	const [selected, setSelected] = React.useState(null);
	const [showDrawer, setShowDrawer] = React.useState(true);
	const [filteredCharacters, setFilteredCharacters] = React.useState(props.characters);
	const [edit, setEdit] = React.useState(false);
	const [add, setAdd] = React.useState(false);
	const [showNew, setShowNew] = React.useState(false);

	const listStyle = (item) => {
		if (item === selected) {
			return ({cursor: 'pointer', backgroundColor: "#212429"})
		}
		else return ({cursor: 'pointer'})
	}

	const copyToClipboard = (character) => {
		// console.log(character)
		let board = `${character.email}`;

		for (const controller of character.control) {
			const character = props.characters.find(el => el.characterName === controller)
			character ? board = board.concat(`; ${character.email}`) : console.log(controller);
		}

		navigator.clipboard.writeText(board);
		Alert.success('Email Copied!', 6000);
	}

	const openAnvil = (character) => {
		if (character.worldAnvil) {
			let url = character.worldAnvil;
			const win = window.open(url, '_blank');
			win.focus();
		}
		else {
			let url = 'https://godswars.miraheze.org/wiki/'
			let temp = url.concat(character.characterName.split(' ').join('_'));		
			const win = window.open(temp, '_blank');
			win.focus();	
			console.log(temp)
		}
	}

	const handleSelect = (fuuuck) => {
		setSelected(fuuuck);
        setShowDrawer(false)
	}
	
	useEffect(() => {
		if (props.characters && selected) {
			const updated = props.characters.find(el => el._id === selected._id);
			setSelected(updated);
			filterThis('');
		}
	}, [props.characters]);
	
	const filterThis = (fil) => {
		const filtered = props.characters.filter(char => char.characterName.toLowerCase().includes(fil.toLowerCase()) || 
		char.email.toLowerCase().includes(fil.toLowerCase()) || 
		
		char.tags.some(el => el.toLowerCase().includes(fil.toLowerCase())));
		setFilteredCharacters(filtered);
	}

	const tagStyle = (item) => {
		switch (item) {
			case 'Control':
				return (<Tag style={{ color: 'black' }} color='orange' >{item}</Tag>)
			case 'God':
				return (<Tag color='green' >{item}</Tag>)
			case 'NPC':
				return (<Tag color='blue' >{item}</Tag>)
			case 'PC':
				return (<Tag color='cyan' >{item}</Tag>)
			default:
				return (<Tag >{item}</Tag>)
		}
	}
	
	if (!props.login) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	}
	else return ( 
		<React.Fragment>
		<NavigationBar/>
		<Container style={{ height: 'calc(100vh - 50px)'}}>
		<Drawer className="side-bar"
			show={showDrawer}
			placement={'left'}
			backdrop={false}
			style={{ width: '200px', marginTop: '51px' }}
			onClose={() => setShowDrawer(!showDrawer)}>
			
			<PanelGroup>	
				<button
					onClick={() => setShowDrawer(!showDrawer)}
					className="toggle-menu"
					style={{
						transform: `translate(${200}px, 100px)`
					}}
				></button> 				
				<div style={{ height: '40px', borderRadius: '0px', backgroundColor: "#000101", margin: '1px' }}>
					<InputGroup>
						<Input size='xs' onChange={(value)=> filterThis(value)} placeholder="Search by Name or Email"></Input>
						{props.myCharacter.tags.some(el=> el === 'Control') && <Button color='green' onClick={() => setShowNew(true)}>
      			  <Icon  icon="plus" />
      			</Button>}
					</InputGroup>
				</div>
				<div bodyFill style={{ height: 'calc(100vh - 80px)', borderRadius: '0px', overflow: 'auto', scrollbarWidth: 'none', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>					
					<List hover size="sm">
						{filteredCharacters.filter(el => el.tags.some(el => el === 'God')).map((character, index) => (
							<List.Item key={index} index={index} onClick={() => handleSelect(character)} style={listStyle(character)}>
								<FlexboxGrid>
									<FlexboxGrid.Item colspan={5} style={styleCenter}>
										<Avatar src={character.tags.some(el => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt='?' circle/>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={19} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
										<b style={titleStyle}>{character.characterName}
											<Tag color='green' style={{ marginLeft: '15px' }} >God</Tag>
										</b>
										<b style={slimText}>{character.email}</b>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							</List.Item>
						))}

						{filteredCharacters.filter(el => el.tags.some(el => el === 'PC')).map((character, index) => (
							<List.Item key={index} index={index} onClick={() => handleSelect(character)} style={listStyle(character)}>
								<FlexboxGrid>
									<FlexboxGrid.Item colspan={5} style={styleCenter}>
										<Avatar src={character.tags.some(el => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt='?' circle/>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={19} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
										<b style={titleStyle}>{character.characterName}
											<Tag color='cyan' style={{ marginLeft: '15px' }} >PC</Tag>
										</b>	
										<b style={slimText}>{character.email}</b>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							</List.Item>
						))}


						{filteredCharacters.filter(el => el.tags.some(el => el === 'NPC')).map((character, index) => (
							<List.Item key={index} index={index} onClick={() => handleSelect(character)} style={listStyle(character)}>
								<FlexboxGrid>
									<FlexboxGrid.Item colspan={5} style={styleCenter}>
										<Avatar src={character.tags.some(el => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt='?' circle/>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={19} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
										<b style={titleStyle}>{character.characterName}
											<Tag color='blue' style={{ marginLeft: '15px' }} >NPC</Tag>
										</b>	
										<b style={slimText}>{character.email}</b>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							</List.Item>
						))}

						{filteredCharacters.filter(el => el.tags.some(el => el === 'Control')).map((character, index) => (
							<List.Item key={index} index={index} onClick={() => handleSelect(character)} style={listStyle(character)}>
								<FlexboxGrid>
									<FlexboxGrid.Item colspan={5} style={styleCenter}>
										<Avatar src={character.tags.some(el => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt='?' circle/>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={19} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
										<b style={titleStyle}>{character.characterName}
											{character.tags.some(el => el === 'Control') && <Tag color='orange' style={{ marginLeft: '15px' }} >Control</Tag>}
										</b>	
										<b style={slimText}>{character.email}</b>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							</List.Item>
						))}

						{props.myCharacter.tags.some(el=> el === 'Control') && <div>
							<h5>Control Only</h5>
							{filteredCharacters.filter(el => !el.tags.some(el2 => (el2 === 'Control' || el2 === 'NPC' || el2 === 'PC' || el2 === 'God'))).map((character, index) => (
								<List.Item key={index} index={index} onClick={() => handleSelect(character)} style={listStyle(character)}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={5} style={styleCenter}>
											<Avatar src={character.tags.some(el => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt='?' circle/>
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={19} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
											<b style={titleStyle}>{character.characterName}
												{character.tags.some(el => el === 'Control') && <Tag color='orange' style={{ marginLeft: '15px' }} >Control</Tag>}
											</b>	
											<b style={slimText}>{character.email}</b>
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
							))}
						</div>}


					</List>												
				</div>							
			</PanelGroup>
		</Drawer>
		{!showDrawer && <button
			onClick={() => setShowDrawer(!showDrawer)}
			className="toggle-menu"
			style={{
				transform: `translate(${0}px, 100px)`, transition: '0.8s ease'
			}}
		/>}
		{selected && <Content style={{overflow: 'auto', height: 'auto'}}>
		<Grid fluid>
          <Row>
            <Col xs={24} sm={24} md={8} className="gridbox">
              <div>
              <p>
                  <img
                    className="portrait"
                    src={`/images/${selected.characterName}.jpg`}
                    alt="Unable to load img"
                    width="95%"
                    style={{ maxHeight: '40vh', cursor: 'pointer' }}
										onClick={() => openAnvil(selected)}
                  />
                </p>
                <p>
                  <h5>{selected.characterName}</h5> 
									{selected.tags && selected.tags.map((item, index) => (
										tagStyle(item)
									))}	
                </p>
								<Button appearance='ghost' block onClick={()=> copyToClipboard(selected)}>{selected.email}</Button>
                <p>
                  <b>Bio:</b> {selected.bio}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={24} md={8} className="gridbox">


            </Col>
          </Row>
        </Grid>
				
			<ModifyCharacter
				show={edit}
				selected={selected}
				closeDrawer={()=> setEdit(false)}
			/>
			<AddAsset 
				show={add}
				character={selected}
				closeModal={() => setAdd(false)}
			/>

			</Content>}
	</Container>
		<NewCharacter show={showNew} 
			closeModal={() => setShowNew(false)}/>
	</React.Fragment>
	);
}

const styleCenter = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '60px'
};

const titleStyle = {
	whiteSpace: 'nowrap',
	fontWeight: 500,
	paddingLeft: 2
};

const slimText = {	
	fontSize: '0.966em',
	color: '#97969B',
	fontWeight: 'lighter',
	paddingBottom: 5,
	paddingLeft: 2, 
	whiteSpace: 'nowrap',
};


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

export default connect(mapStateToProps, mapDispatchToProps)(OtherCharacters);
