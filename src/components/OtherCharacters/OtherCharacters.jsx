import React, { useEffect } from 'react';
import { ButtonGroup, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Avatar, IconButton, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon, Table, Divider} from 'rsuite';
import AddAsset from './AddAsset';
import ModifyCharacter from './ModifyCharacter';
import NavigationBar from '../Navigation/NavigationBar';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { connect } from 'react-redux';
import socket from '../../socket'; 
import NewCharacter from '../Control/NewCharacter'; 
import MobileOtherCharacters from './MobileOtherCharacters';
import DynamicForm from './DynamicForm';
import { getGodBonds, getMortalBonds } from '../../redux/entities/assets';

const { HeaderCell, Cell, Column, } = Table;

const  OtherCharacters = (props) => {
	const [selected, setSelected] = React.useState(null);
	const [asset, setAsset] = React.useState(false);
	const [filter, setFilter] = React.useState('');
	const [tagFilter, setTagFilter] = React.useState([]);
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

	const copyToClipboard = (character) => {
		// console.log(character)
		let board = `${character.email}`;
		let array = [ ...character.control ];

		for (const controller of props.myCharacter.control) {
			if (!array.some(el => el === controller)) {
				array.push(controller);
			}
		}

		for (const controller of array) {
			const character = props.characters.find(el => el.characterName === controller)
			if (character) {
				board = board.concat(`; ${character.email}`)
			}
			else 
				console.log(`${controller} could not be added to clipboard`)
				Alert.error(`${controller} could not be added to clipboard`, 6000);
		}

		navigator.clipboard.writeText(board);
		Alert.success('Email Copied!', 6000);
	}

	const openAnvil = (character) => {
		if (character.wiki && character.wiki !== '') {
			let url = character.wiki;
			const win = window.open(url, '_blank');
			win.focus();
		}
		else if (character.tags.some(el => el === 'God' || el === 'Gods')) {
			let url = `https://godswars.miraheze.org/wiki/Gods#${character.characterName}`;
			const win = window.open(url, '_blank');
			win.focus();
		}
		else {
			let url = 'https://godswars.miraheze.org/wiki/'
			let temp = url.concat(character.characterName.split(' ').join('_'));		
			const win = window.open(temp, '_blank');
			win.focus();	
		}
	}

	
	useEffect(() => {
		if (props.characters && selected) {
			const updated = props.characters.find(el => el._id === selected._id);
			setSelected(updated);
			filterThis('');
		}
	}, [props.characters]);

	
	const makeButton = () => {
		if (selected.supporters.some(el => el === props.myCharacter.characterName)) {
			return (<Button size='xs' onClick={()=> lendSupp()} color='red'>Take Back Support!</Button>)
		}
		else {
			return (<Button size='xs' onClick={()=> lendSupp()} appearance="primary">Lend Support!</Button>)	
		}
	}

	const lendSupp = async () => {
		socket.emit('characterRequest', 'support', { id: selected._id, supporter: props.myCharacter.characterName }); // new Socket event
	}
	
	const filterThis = (fil) => {
		const filtered = props.characters.filter(char => 
		char.characterName.toLowerCase().includes(fil.toLowerCase()) || 
		char.email.toLowerCase().includes(fil.toLowerCase()) || 
		char.characterTitle.toLowerCase().includes(fil.toLowerCase()) || 
		char.tags.some(el => el.toLowerCase().includes(fil.toLowerCase())));
		setFilteredCharacters(filtered);
	}
	
	if (!props.login) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	}	
	if (window.innerWidth < 768) {
		return (<MobileOtherCharacters />)
	}
	else return ( 
		<React.Fragment>
		<NavigationBar/>
		<Container style={{ height: 'calc(100vh - 50px)'}}>
		<Sidebar className="side-bar">
			<PanelGroup>					
				<div style={{ height: '40px', borderRadius: '0px', backgroundColor: "#000101", margin: '1px' }}>
					<InputGroup>
						<Input style={{ height: '39px' }} onChange={(value)=> filterThis(value)} placeholder="Search by Name or Email"></Input>
						{props.myCharacter.tags.some(el=> el === 'Control') && <Button color='green' onClick={() => setShowNew(true)}>
      			  <Icon  icon="plus" />
      			</Button>}
					</InputGroup>
				</div>
				<div bodyFill style={{ height: 'calc(100vh - 80px)', borderRadius: '0px', overflow: 'auto', scrollbarWidth: 'none', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>					
					<List hover size="sm">
						{filteredCharacters.filter(el => el.tags.some(el => el === 'God')).map((character, index) => (
							<List.Item key={index} index={index} onClick={() => setSelected(character)} style={listStyle(character)}>
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
							<List.Item key={index} index={index} onClick={() => setSelected(character)} style={listStyle(character)}>
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
							<List.Item key={index} index={index} onClick={() => setSelected(character)} style={listStyle(character)}>
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
							<List.Item key={index} index={index} onClick={() => setSelected(character)} style={listStyle(character)}>
								<FlexboxGrid>
									<FlexboxGrid.Item colspan={5} style={styleCenter}>
										<Avatar src={character.tags.some(el => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt='?' circle/>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={19} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
										<b style={titleStyle}>{character.characterName}
											{character.tags.some(el => el === 'Control') && <Tag color='orange' style={{ marginLeft: '15px', color: 'black' }} >Control</Tag>}
										</b>	
										<b style={slimText}>{character.email}</b>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							</List.Item>
						))}

						{props.myCharacter.tags.some(el=> el === 'Control') && <div>
							<h5>Control Only</h5>
							{filteredCharacters.filter(el => !el.tags.some(el2 => (el2 === 'Control' || el2 === 'NPC' || el2 === 'PC' || el2 === 'God'))).map((character, index) => (
								<List.Item key={index} index={index} onClick={() => setSelected(character)} style={listStyle(character)}>
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
		</Sidebar>
		{selected &&
			<Content style={{overflow: 'auto', height: 'auto'}}>
				<FlexboxGrid >
					{/*Control Panel*/}
					{props.myCharacter.tags.some(el=> el === 'Control') && <FlexboxGrid.Item colspan={24}>
					<Panel style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center', height: 'auto'}}>
					<h4>Control Panel</h4>
					<h5>Effort Left: {selected.effort} </h5>
					<ButtonGroup style={{marginTop: '5px', }} >
						<Button appearance={"ghost"} onClick={() => setEdit(true)}>Modify</Button>
						<Button appearance={"ghost"} onClick={() => setAdd(true)}>+ Resources</Button>
					</ButtonGroup>

					<Panel style={{backgroundColor: '#15181e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
						<h5>Resources</h5>
						<Row style={{ display: 'flex', overflow: 'auto' }}>
						{props.assets.filter(el => el.ownerCharacter === selected._id).length === 0 && <h5>No assets assigned</h5>}
						{props.assets.filter(el => el.ownerCharacter === selected._id).map((asset, index) => (
							<Col md={6} sm={12}>
								<Panel onClick={() => setAsset(asset)} index={index} bordered>
									<h5>{asset.name}</h5>
									<b>{asset.type}</b>
								</Panel>
								</Col>
						))}
						</Row>
					</Panel>
				</Panel>
				</FlexboxGrid.Item>}
					<FlexboxGrid.Item colspan={24} >
						<Panel style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e", whiteSpace: 'pre-line'}}>
							<FlexboxGrid>
								<FlexboxGrid.Item colspan={14} style={{ textAlign: 'center' }}>
								<FlexboxGrid align='middle' style={{textAlign: "center"}}>
										<FlexboxGrid.Item colspan={12}>
											<h2>{selected.characterName}</h2>	
											{selected.characterTitle !== 'None' && <h5>{selected.characterTitle}</h5>	}
										</FlexboxGrid.Item>		

										<FlexboxGrid.Item colspan={12}>
											<TagGroup>Tags:
												{selected.tags && selected.tags.map((item, index) => (
													tagStyle(item)
												))}	
											</TagGroup>			
										</FlexboxGrid.Item>					
									</FlexboxGrid>

									<Button appearance='ghost' block onClick={()=> copyToClipboard(selected)}>{selected.email}</Button>
									<FlexboxGrid style={{paddingTop: '5px'}}>
										<FlexboxGrid.Item colspan={12}>
											<p>
											<TagGroup>Controllers:
												{selected.tags && selected.control.map((item, index) => (
													<Tag style={{ color: 'black' }} color='orange' index={index}>{item}</Tag>
												))}	
											</TagGroup> 
											</p>
											<p>
												Character Pronouns: <b>{selected.pronouns}</b>			
											</p>
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={12}>
											<p>
												Time Zone: <b>{selected.timeZone}</b>
											</p>										
										</FlexboxGrid.Item>
									</FlexboxGrid>
									<br></br>
									<p style={{color: 'rgb(153, 153, 153)'}}>Bio</p>
									<p>{selected.bio}</p>
								</FlexboxGrid.Item>

								<FlexboxGrid.Item colspan={1}/>

								{/*Profile Pic*/}
								<FlexboxGrid.Item colspan={9} style={{ cursor: 'pointer' }} onClick={() => openAnvil(selected)}> 
									<img src={selected.tags.some(el => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${selected.characterName}.jpg`} alt="Img could not be displayed" width="90%" style={{ maxHeight: '50vh' }} />
								</FlexboxGrid.Item>

								{/*Lend Support*/}
								{/* <FlexboxGrid.Item> 
									<List autoScroll size="md" >
										<h5 style={{ backgroundColor: '#15181e' }} >Supporters</h5>
										<Button size='xs' onClick={()=> lendSupp()} appearance="primary">Toggle Support!</Button>
										{selected.supporters.map((supporter, index) => (
											<List.Item key={index} index={index} size='md'>
												<div>{supporter}</div>
											</List.Item>
										))}
									</List>
								</FlexboxGrid.Item> */}

							</FlexboxGrid>
						</Panel>
					</FlexboxGrid.Item>



					{/*God's Bonds */}
					{selected.tags.some(el => el === 'God') && <FlexboxGrid.Item colspan={24}>
						<Divider>Total Bonds with {selected.characterName}</Divider>
						<FlexboxGrid>
							<FlexboxGrid.Item colspan={8}>
								<Panel bordered style={{backgroundColor: '#272b34'}} header='Preferred'>
									{props.godBonds.filter(el => el.with._id === selected._id && el.level === 'Preferred').length}
								</Panel>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={8}>
								<Panel bordered style={{backgroundColor: '#272b34'}} header='Favoured'>
									{props.godBonds.filter(el => el.with._id === selected._id && el.level === 'Favoured').length}
								</Panel>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={8}>
								<Panel bordered style={{backgroundColor: '#272b34'}} header='Blessed'>
									{props.godBonds.filter(el => el.with._id === selected._id && el.level === 'Blessed').length}
								</Panel>
							</FlexboxGrid.Item>						
						</FlexboxGrid>
					</FlexboxGrid.Item>	}	

					{/*NPC's Bonds */}
					{selected.tags.some(el => el === 'NPC') && <FlexboxGrid.Item colspan={24}>
						<Divider>Total Bonds with {selected.characterName}</Divider>
						<FlexboxGrid>
							<FlexboxGrid.Item colspan={8}>
								<Panel bordered style={{backgroundColor: '#272b34'}} header='Warm'>
									{props.mortalBonds.filter(el => el.with._id === selected._id && el.level === 'Warm').length}
								</Panel>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={8}>
								<Panel bordered style={{backgroundColor: '#272b34'}} header='Friendly'>
									{props.mortalBonds.filter(el => el.with._id === selected._id && el.level === 'Friendly').length}
								</Panel>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={8}>
								<Panel bordered style={{backgroundColor: '#272b34'}} header='Bonded'>
									{props.mortalBonds.filter(el => el.with._id === selected._id && el.level === 'Bonded').length}
								</Panel>
							</FlexboxGrid.Item>						
						</FlexboxGrid>
					</FlexboxGrid.Item>	}	

					{/* <FlexboxGrid.Item colspan={24}>
					<Divider>Bonds</Divider>
						<Table data={props.assets.filter(el => el.ownerCharacter === selected._id && (el.type === 'GodBond' || el.type === 'MortalBond'))}> 
							<Column  flexGrow={2}>
								<HeaderCell>Bond Name</HeaderCell>
								<Cell dataKey='name' />
							</Column>

							<Column  flexGrow={2}>
								<HeaderCell>With</HeaderCell>
								<Cell>
									{rowData => {
										let thing = props.characters.find(el => el._id === rowData.with)
										return <b>{thing.characterName}</b>
									}}
								</Cell>
							</Column>

							<Column  flexGrow={2}>
								<HeaderCell>Level</HeaderCell>
								<Cell dataKey='level' />
							</Column>

						</Table>
					</FlexboxGrid.Item> */}
				</FlexboxGrid>	
				
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
			<DynamicForm
				show={asset !== false}
				selected={asset}
				closeDrawer={()=> setAsset(false)}
			/>

		</Content>		
		}
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
	godBonds: getGodBonds(state),
	mortalBonds: getMortalBonds(state),
	login: state.auth.login,
	characters: state.characters.list,
	duck: state.gamestate.duck,
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherCharacters);
