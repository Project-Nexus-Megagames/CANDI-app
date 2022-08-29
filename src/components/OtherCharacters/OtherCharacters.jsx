import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { ButtonGroup, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon } from 'rsuite';
import AddAsset from './AddAsset';
import ModifyCharacter from './ModifyCharacter';
import NavigationBar from '../Navigation/NavigationBar';
import { connect } from 'react-redux';
import NewCharacter from '../Control/NewCharacter';
import MobileOtherCharacters from './MobileOtherCharacters';
import DynamicForm from './DynamicForm';
import { getGodBonds, getMortalBonds } from '../../redux/entities/assets';
import { getMyCharacter, getPublicCharacters, getPrivateCharacters, characterUpdated } from './../../redux/entities/characters';
import CharacterListItem from './CharacterListItem';
import { getFadedColor } from '../../scripts/frontend';
import { useDisclosure } from '@chakra-ui/react';
import { CandiDrawer } from '../Common/Drawer';
import ViewCharacter from '../Common/ViewCharacter';

const OtherCharacters = (props) => {
	const publicCharacters = useSelector(getPublicCharacters);
	const privateCharacters = useSelector(getPrivateCharacters);
	const [selected, setSelected] = useState(null);
	const [filteredCharacters, setFilteredCharacters] = useState([]);

	const [showNew, setShowNew] = useState(false);

	if (!props.login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}

	let characters = [...publicCharacters, ...props.myCharacter.knownContacts];
	const [renderTags] = React.useState(['Frog', 'Pig', 'Spider', 'Drow', 'Myconid', 'Raccoon', 'Control']); // TODO: update with Faction tags

	useEffect(() => {
		filterThis('');
	}, []);

	const tagStyle = (item, index) => {
		switch (item) {
			case 'Control':
				return (
					<Tag index={index} style={{ color: 'black' }} color="orange">
						{item}
					</Tag>
				);
			case 'God':
				return (
					<Tag index={index} color="green">
						{item}
					</Tag>
				);
			case 'NPC':
				return (
					<Tag index={index} color="blue">
						{item}
					</Tag>
				);
			case 'PC':
				return (
					<Tag index={index} color="cyan">
						{item}
					</Tag>
				);
			case 'Private':
				return (
					<Tag index={index} color="red">
						{item}
					</Tag>
				);
			default:
				return <Tag index={index}>{item}</Tag>;
		}
	};

	const listStyle = (item) => {
		if (selected && item._id === selected._id) {
			return { cursor: 'pointer', backgroundColor: '#212429' };
		} else return { cursor: 'pointer', height: '100%' };
	};

	useEffect(() => {
		if (props.characters && selected) {
			const updated = props.characters.find((el) => el._id === selected._id);
			setSelected(updated);
			filterThis('');
		}
	}, [props.characters, selected]);

	const filterThis = (fil) => {
		const filtered = characters.filter(
			(char) =>
				char.characterName.toLowerCase().includes(fil.toLowerCase()) ||
				char.email.toLowerCase().includes(fil.toLowerCase()) ||
				char.characterTitle.toLowerCase().includes(fil.toLowerCase()) ||
				char.tags.some((el) => el.toLowerCase().includes(fil.toLowerCase()))
		);
		setFilteredCharacters(filtered);
	};

	// if (window.innerWidth < 768) {
	// 	return <MobileOtherCharacters />;
	// } else
	return (
		<React.Fragment>
			<NavigationBar />
			<Container style={{ height: 'calc(100vh - 50px)' }}>
				<Sidebar>
					<PanelGroup>
						<div
							style={{
								height: '40px',
								borderRadius: '0px',
								backgroundColor: '#000101',
								margin: '1px'
							}}
						>
							<InputGroup>
								<Input style={{ height: '39px' }} onChange={(value) => filterThis(value)} placeholder="Search by Name or Email"></Input>
								{props.myCharacter.tags.some((el) => el === 'Control') && (
									<Button color="green" onClick={() => setShowNew(true)}>
										<Icon icon="plus" />
									</Button>
								)}
							</InputGroup>
						</div>
						<div
							style={{
								height: 'calc(100vh - 80px)',
								borderRadius: '0px',
								overflow: 'auto',
								scrollbarWidth: 'none',
								borderRight: '1px solid rgba(255, 255, 255, 0.12)'
							}}
						>
							<div>
								{renderTags.map((tag, index) => (
									<List key={index} hover>
										{filteredCharacters.filter((el) => el.tags.some((el) => el.toLowerCase() === tag.toLowerCase())).length > 0 && (
											<p style={{ backgroundColor: getFadedColor(tag), color: getFadedColor(`${tag}-text`) }}>{tag}</p>
										)}
										{filteredCharacters
											.filter((el) => el.tags.some((el) => el.toLowerCase() === tag.toLowerCase()))
											.map((character) => (
												<List.Item key={character._id} style={listStyle(character)}>
													<CharacterListItem setSelected={setSelected} character={character} tagStyle={tagStyle} key={character._id} />
												</List.Item>
											))}
									</List>
								))}
								{props.myCharacter.tags.indexOf('Control') !== -1 && (
									<List hover>
										<p style={{ backgroundColor: getFadedColor('Unknown'), color: getFadedColor(`${'Unknown'}-text`) }}>{'( Hidden )'}</p>
										{privateCharacters
											// .filter()
											.map((character) => (
												<List.Item key={character._id} style={listStyle(character)}>
													<CharacterListItem setSelected={setSelected} character={character} tagStyle={tagStyle} key={character._id} />
												</List.Item>
											))}
									</List>
								)}
							</div>
						</div>
					</PanelGroup>
				</Sidebar>
				<ViewCharacter
					control={props.myCharacter.tags.some((el) => el === 'Control')}
					assets={props.assets}
					isOpen={selected}
					show={selected}
					selected={selected}
					closeDrawer={() => setSelected(false)}
				/>
			</Container>
			<NewCharacter show={showNew} closeModal={() => setShowNew(false)} />
		</React.Fragment>
	);
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
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherCharacters);
