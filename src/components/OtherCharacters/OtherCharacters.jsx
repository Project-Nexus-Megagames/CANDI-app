import React, { useEffect } from 'react';
import { ButtonGroup, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Avatar, IconButton, Icon, Tag, Divider, Loader} from 'rsuite';
import AddAsset from './AddAsset';
import ModifyCharacter from './ModifyCharacter';
import NavigationBar from '../Navigation/NavigationBar';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { connect } from 'react-redux';
import socket from '../../socket';

const  OtherCharacters = (props) => {
	const [selected, setSelected] = React.useState(null);
	const [filter, setFilter] = React.useState('');
	const [tagFilter, setTagFilter] = React.useState([]);
	const [edit, setEdit] = React.useState(false);
	const [add, setAdd] = React.useState(false);

	const listStyle = (item) => {
		if (item === selected) {
			return ({cursor: 'pointer', backgroundColor: "#212429"})
		}
		else return ({cursor: 'pointer'})
	}

	const copyToClipboard = (email, controlEmail) => {
		navigator.clipboard.writeText(`${email} ${controlEmail}`);
	}

	const openAnvil = (url) => {
		const win = window.open(url, '_blank');
		win.focus();
	}

	
	useEffect(() => {
	}, []);

	const makeButton = () => {
		if (selected.supporters.some(el => el === props.myCharacter.characterName)) {
			return (<Button onClick={()=> lendSupp()} color='red'>Take Back Support!</Button>)
		}
		else {
			return (<Button onClick={()=> lendSupp()} appearance="primary">Lend Support!</Button>)	
		}
	}

	const lendSupp = async () => {
		socket.emit('characterRequest', 'support', { id: selected._id, supporter: props.myCharacter.characterName }); // new Socket event
		setSelected('');
	}
	
	// filter = (fil) => {
	// 	const filtered = this.props.characters.filter(char => char.characterName.toLowerCase().includes(fil.toLowerCase()) || 
	// 	char.email.toLowerCase().includes(fil.toLowerCase()) || 
	// 	char.characterActualName.toLowerCase().includes(fil.toLowerCase()) || 
	// 	char.tag.toLowerCase().includes(fil.toLowerCase()));
	// 	this.setState({ filtered });
	// 	this.createListCatagories(filtered);
	// }
	
	if (!props.login) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	}
	else return ( 
		<React.Fragment>
		<NavigationBar/>
		<Container style={{ height: '94vh'}}>
		<Sidebar style={{backgroundColor: "black"}}>
			<PanelGroup>					
				<Panel style={{ height: '8vh', backgroundColor: "#000101"}}>
					<Input onChange={(value)=> setFilter(value)} placeholder="Search by Name or Email"></Input>
				</Panel>
				<Panel bodyFill style={{height: '86vh', borderRadius: '0px', overflow: 'auto', scrollbarWidth: 'none', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>					

						<List hover size="sm">
							{props.characters.map((character, index) => (
								<List.Item key={index} index={index} onClick={() => setSelected(character)} style={listStyle(character)}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={5} style={styleCenter}>
											<Avatar src={props.duck ? `/duck/${character.characterName}.jpg` : `/images/${character.characterName}.jpg`} alt='?' circle/>
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={16} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
											<b style={titleStyle}>{character.characterName}</b>
											<b style={slimText}>{character.email}</b>
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
							))}
						</List>												

				</Panel>							
			</PanelGroup>
		</Sidebar>
		{selected &&
			<Content style={{overflow: 'auto', height: 'auto'}}>
				<FlexboxGrid >
					<FlexboxGrid.Item colspan={3} >
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={14} >
						<Panel style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e", whiteSpace: 'pre-line'}}>
							<h3 style={{textAlign: "center"}}> {selected.characterName}</h3>		
							{selected.characterActualName !== 'None' && <h5 style={{textAlign: "center"}}> {selected.characterActualName}</h5>		}
							<div>
								<h6><IconButton placement="right" onClick={()=> openAnvil(selected.worldAnvil)} icon={<Icon icon="link"/>} appearance="primary">World Anvil Link</IconButton></h6>
							</div>
							<div>
								Email
							</div>
								<FlexboxGrid>
									<FlexboxGrid.Item colspan={22}>
										<b>{selected.email}</b> 
									</FlexboxGrid.Item>
									{/*<FlexboxGrid.Item >
										<IconButton icon={<Icon icon="envelope"/>} color="blue" circle />										
									</FlexboxGrid.Item>*/}
								</FlexboxGrid>
								<Button appearance='ghost' block onClick={()=> copyToClipboard(selected.email, selected.controlEmail)}>Copy email to clipboard</Button>
							<FlexboxGrid style={{paddingTop: '5px'}}>
								<FlexboxGrid.Item colspan={12}>
									<p>
										Faction: <b>{selected.tag}</b>			
									</p>
									<p>
										Character Pronouns: <b>{selected.pronouns}</b>			
									</p>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item colspan={12}>
									<p>
										Time Zone: <b>{selected.timeZone}</b>
									</p>		
									<p>
										Controller: <b>{selected.control}</b>
									</p>									
								</FlexboxGrid.Item>
							</FlexboxGrid>
							<br></br>
							<p style={{color: 'rgb(153, 153, 153)'}}>Bio:</p>
							<p>{selected.bio}</p>
							<Divider>{makeButton()}</Divider>
								<FlexboxGrid>
									<FlexboxGrid.Item colspan={12}>
										<img src={props.duck? `/duck/${selected.characterName}.jpg` : `/images/${selected.characterName}.jpg`} alt="Img could not be displayed" width="90%" />
									</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={12} style={{ textAlign: 'center' }}>
										<h4>Supporters</h4>
									<List size="md" >
										{selected.supporters.map((supporter, index) => (
											<List.Item key={index} index={index} size='md'>
												<div>{supporter}</div>
											</List.Item>
										))}
									</List>
									</FlexboxGrid.Item>
								</FlexboxGrid>
						</Panel>
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={1} />
			<FlexboxGrid.Item colspan={5}>
				{props.user.roles.some(el=> el === 'Control') && <Panel header={"Control Panel"} style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
					<ButtonGroup style={{marginTop: '5px', }} >
						<Button appearance={"ghost"} onClick={() => setEdit(true)}>Modify</Button>
						<Button appearance={"ghost"} onClick={() => setAdd(true)}>+ Resources</Button>
					</ButtonGroup>
						<Panel style={{backgroundColor: '#15181e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}} header="Resources" >
					<List size="md" bordered>
						{selected.assets.map((asset, index) => (
							<List.Item key={index} index={index} size='md'>
								<div>{asset.name}</div>
							</List.Item>
						))}
					</List>
				</Panel>
				<h5>Effort Left: {selected.effort} </h5>
				</Panel>}
			</FlexboxGrid.Item>
				</FlexboxGrid>	
			<ModifyCharacter
				show={edit}
				selected={selected}
				closeModal={()=> setEdit(false)}
			/>
			<AddAsset 
				show={add}
				character={selected}
				closeModal={() => setAdd(false)}
			/>
		</Content>		
		}
	</Container>
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
