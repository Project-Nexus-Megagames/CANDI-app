import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loader,	Panel,	IconButton,	Icon,	Form,	FormGroup,	Button,	ButtonToolbar,	FormControl,	ControlLabel,	Divider,	Content,	Tag,	Modal,	Drawer,	SelectPicker,	Placeholder,	Grid,	Col,	Row,	List,	TagGroup} from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import { assetLent,	assetUpdated,	getMyAssets} from '../../redux/entities/assets';
import socket from '../../socket';
// import { playerActionsRequested } from "../../redux/entities/playerActions";
import NavigationBar from '../Navigation/NavigationBar';
import AssetInfo from '../Actions/AssetInfo';
import Contacts from '../MyCharacters/Contacts';

class CharacterProfile extends Component {
	state = {
		formValue: {
			textarea: ''
		},
		memory: '',
		show: false,
		lending: null,
		target: null,
		characters: null,
		lendShow: false,
		unlend: false, // boolean for displaying the "unlend" modal
		unleanding: null, // what is being "Unlent"
		showContacts: false,
		infoModal: false,
		infoAsset: {}
	};

	componentDidMount = () => {
		const char = this.props.myCharacter;
		if (char !== undefined) {
			const formValue = {
				textarea: char.standingOrders
			};
			const characters = { ...this.props.characters };
			this.setState({ formValue, characters });
		}
	};

	componentDidUpdate = (prevProps) => {
		if (this.props.playerCharacter !== prevProps.playerCharacter) {
			const char = this.props.playerCharacter;
			const formValue = {
				textarea: char.standingOrders
			};
			this.setState({ formValue });
		}
	};

	openAnvil = (character) => {
		if (character.wiki && character.wiki !== '') {
			let url = character.wiki;
			const win = window.open(url, '_blank');
			win.focus();
		} else {
			let url = 'https://godswars.miraheze.org/wiki/';
			let temp = url.concat(character.characterName.split(' ').join('_'));
			const win = window.open(temp, '_blank');
			win.focus();
			console.log(temp);
		}
	};

	showMemory = (memory) => {
		this.setState({ memory, show: true });
	};

	tagStyle = (item) => {
		switch (item) {
			case 'Control':
				return (
					<Tag style={{ color: 'black' }} color="orange">
						{item}
					</Tag>
				);
			case 'God':
				return <Tag color="green">{item}</Tag>;
			case 'NPC':
				return <Tag color="blue">{item}</Tag>;
			case 'PC':
				return <Tag color="cyan">{item}</Tag>;
			default:
				return <Tag>{item}</Tag>;
		}
	};

	openLend = (lending) => {
		this.setState({ lending, lendShow: true });
	};

	closeLend = () => {
		this.setState({ lendShow: false });
	};

	openUnlend = (unleanding) => {
		this.setState({ unleanding, unlend: true });
	};

	handleSharingContacts = () => {
		console.log('boop');
		this.setState({ showContacts: true });
	};

	openInfo = (asset) => {
		console.log(asset);
		const found = this.props.assets.find((el) => el._id === asset._id);
		this.setState({ infoAsset: found, infoModal: true });
	};

	render() {
		const playerCharacter = this.props.myCharacter;
		if (!this.props.login) {
			this.props.history.push('/');
			return <Loader inverse center content="doot..." />;
		}
		return (
			<Content>
				<NavigationBar />
				<Grid fluid>
					<Row>
						<Col xs={24} sm={24} md={8} className="gridbox">
							<div>
								<p>
									<img
										className="portrait"
										src={`/images/${playerCharacter.characterName}.jpg`}
										alt="Unable to load img"
										width="95%"
										style={{ maxHeight: '50vh' }}
									/>
								</p>
								<TagGroup>
									Tags
									{playerCharacter.tags &&
										playerCharacter.tags.map((item, index) =>
											this.tagStyle(item)
										)}
								</TagGroup>
								<TagGroup>
									Control
									{playerCharacter.control &&
										playerCharacter.control.map((item, index) => (
											<Tag index={index}>{item}</Tag>
										))}
								</TagGroup>
								<p>
									<b>
										Wiki Link{' '}
										<IconButton
											onClick={() => this.openAnvil(playerCharacter)}
											icon={<Icon icon="link" />}
											appearance="primary"
										/>
									</b>
								</p>
								<p>
									<b>Bio:</b> {playerCharacter.bio}
								</p>
							</div>
						</Col>
						<Col xs={24} sm={24} md={8} className="gridbox">
							<Panel header="Standing Orders" style={{ width: '95%' }}>
								<Form
									fluid
									formValue={this.state.formValue}
									onChange={(value) => this.setState({ formValue: value })}
								>
									<FormGroup>
										<ControlLabel></ControlLabel>
										<FormControl
											name="textarea"
											componentClass="textarea"
											placeholder="Orders for if you miss a turn..."
										/>
									</FormGroup>
									<FormGroup>
										<ButtonToolbar>
											<Button
												appearance="primary"
												onClick={() => this.handleStanding()}
											>
												Submit
											</Button>
										</ButtonToolbar>
									</FormGroup>
								</Form>
							</Panel>
							<Panel header="My Contacts" style={{ width: '95%' }}>
								<ButtonToolbar>
									<Button
										appearance="primary"
										onClick={() => this.handleSharingContacts()}
									>
										Share My Contacts with Another Character
									</Button>
								</ButtonToolbar>
							</Panel>
						</Col>
						<Col>
							<div>
								<List
									xs={24}
									sm={24}
									md={8}
									hover
									autoScroll
									size="lg"
									style={{
										height: 'calc(100vh - 50px)',
										scrollbarWidth: 'none',
										borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
										overflow: 'scroll'
									}}
								>
									{this.renderList('Asset', 'indigo')}
									{this.renderList('Trait', 'teal')}
									{this.renderList('Power', 'purple')}
								</List>
							</div>
						</Col>
					</Row>
				</Grid>

				<Modal
					backdrop="static"
					size="sm"
					show={this.state.unlend}
					onHide={() => this.setState({ unlend: false, unleanding: null })}
				>
					{this.state.unleanding && (
						<React.Fragment>
							<Modal.Body>{this.renderUnLendation()}</Modal.Body>
							<Modal.Footer>
								<Button
									onClick={() => this.handleTakeback()}
									appearance="primary"
								>
									Take it Back!
								</Button>
								<Button
									onClick={() =>
										this.setState({ unlend: false, unleanding: null })
									}
									appearance="subtle"
								>
									Cancel
								</Button>
							</Modal.Footer>
						</React.Fragment>
					)}
				</Modal>

				<Drawer show={this.state.lendShow} onHide={() => this.closeLend()}>
					<Drawer.Body>
						<SelectPicker
							placeholder="Select a Lending Target"
							onChange={(event) => this.setState({ target: event })}
							block
							valueKey="_id"
							labelKey="characterName"
							disabledItemValues={[playerCharacter._id]}
							data={this.props.characters}
						/>
						{this.renderLendation()}
					</Drawer.Body>
				</Drawer>
				<AssetInfo
					asset={this.state.infoAsset}
					showInfo={this.state.infoModal}
					closeInfo={() => this.setState({ infoModal: false })}
				/>
				<Contacts
					show={this.state.showContacts}
					closeModal={() => this.setState({ showContacts: false })}
				/>
			</Content>
		);
	}

	renderList = (type, color) => {
		return (
			<div>
				<h5 style={{ backgroundColor: color }}>{type}s</h5>
				{this.props.myAssets.filter(
					(el) => el.status.hidden !== true && el.uses > 0 && el.type === type
				).length === 0 && <List.Item>No {type}s</List.Item>}
				{this.props.myAssets
					.filter(
						(el) => el.status.hidden !== true && el.uses > 0 && el.type === type
					)
					.map((asset, index) => (
						<List.Item style={{ textAlign: 'center' }}>
							{asset.status.lendable && (
								<div>
									<b>{asset.name}</b>
									<IconButton
										size="xs"
										appearance={'link'}
										onClick={() => this.openInfo(asset)}
										color="blue"
										icon={<Icon icon="info" />}
									/>
									<p
										style={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap'
										}}
									>
										{asset.description}
									</p>

									{asset.status.lent && this.rednerHolder(asset)}
									{!asset.status.lent && !asset.status.used && (
										<Tag color="green">Ready</Tag>
									)}
									{asset.status.used && <Tag color="red">Used</Tag>}
									{asset.currentHolder &&
										asset.currentHolder ===
											this.props.myCharacter.characterName && (
											<Tag color="blue">
												Borrowed from: {asset.currentHolder}
											</Tag>
										)}
									{!asset.status.lent && (
										<Button
											onClick={() => this.openLend(asset)}
											appearance="ghost"
											size="sm"
											disabled={asset.status.used}
										>
											Lend
										</Button>
									)}
									{asset.status.lent && (
										<Button
											onClick={() => this.openUnlend(asset)}
											appearance="ghost"
											size="sm"
											disabled={asset.status.used}
										>
											Un-Lend
										</Button>
									)}
								</div>
							)}
							{!asset.status.lendable && (
								<div>
									<b>{asset.name}</b>
									<IconButton
										size="xs"
										appearance={'link'}
										onClick={() => this.openInfo(asset)}
										color="blue"
										icon={<Icon icon="info" />}
									/>
									<p
										style={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap'
										}}
									>
										{asset.description}
									</p>
									{asset.level && <b>Level: {asset.level}</b>}
								</div>
							)}
							{asset.tags.filter((el) => el === 'arcane').length > 0 && (
								<Tag color="violet">Arcane</Tag>
							)}
							{asset.uses !== 999 && <p>Uses: {asset.uses}</p>}
							{asset.uses === 999 && <p>Uses: Unlimited</p>}
						</List.Item>
					))}
			</div>
		);
	};

	rednerHolder = (asset) => {
		let holder = this.props.characters.find(
			(el) => el._id === asset.currentHolder
		);
		if (!holder) holder = this.props.myCharacter;
		return <Tag color="violet">Lent to: {holder.characterName}</Tag>;
	};

	renderLendation = () => {
		if (this.state.target === null || this.state.target === undefined) {
			return (
				<Placeholder.Paragraph rows={15}>
					Awaiting Selection
				</Placeholder.Paragraph>
			);
		} else {
			const target = this.props.characters.find(
				(el) => el._id === this.state.target
			);
			return (
				<div>
					<Divider
						style={{ textAlign: 'center', fontWeight: 'bolder', fontSize: 20 }}
					>
						{target.characterName}
					</Divider>
					<p>{target.bio}</p>
					<Divider></Divider>
					<p style={{ fontWeight: 'bolder', fontSize: 20 }}>
						Are you sure you want to lend your '{this.state.lending.name}' to
						this person?{' '}
					</p>
					<Button
						onClick={() => this.handleSubmit()}
						disabled={
							this.state.target === null || this.state.target === undefined
						}
						appearance="primary"
					>
						Lend
					</Button>
				</div>
			);
		}
	};

	renderUnLendation = () => {
		let holder = this.props.characters.find(
			(el) => el._id === this.state.unleanding.currentHolder
		);
		if (this.state.unleanding === null) {
			return (
				<Placeholder.Paragraph rows={15}>
					Awaiting Selection
				</Placeholder.Paragraph>
			);
		} else {
			return (
				<p>
					Are you sure you want to take back your {this.state.unleanding.name}{' '}
					from {holder.characterName}?
				</p>
			);
		}
	};

	handleSubmit = async () => {
		const data = {
			id: this.state.lending._id,
			target: this.state.target,
			lendingBoolean: true
		};

		socket.emit('request', { route: 'asset', action: 'lend', data });
		this.setState({ lending: null, target: null });
		this.closeLend();
	};

	handleTakeback = async () => {
		const data = {
			id: this.state.unleanding._id,
			lendingBoolean: false,
			owner: this.props.myCharacter._id
		};
		socket.emit('request', { route: 'asset', action: 'lend', data });
		this.setState({ unlend: false });
	};

	handleStanding = async () => {
		const char = this.props.myCharacter;
		const data = {
			characterName: char.characterName,
			email: char.email,
			worldAnvil: char.worldAnvil,
			tag: char.tags,
			timeZone: char.timeZone,
			playerName: char.playerName,
			bio: char.bio,
			icon: char.icon,
			popSupport: char.popSupport,
			standingOrders: this.state.formValue.textarea,
			_id: char._id
		};
		socket.emit('request', { route: 'character', action: 'modify', data });
	};
}

const mapStateToProps = (state) => ({
	login: state.auth.login,
	user: state.auth.user,
	assets: state.assets.list,
	characters: state.characters.list,
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined,
	myAssets: getMyAssets(state)
});

const mapDispatchToProps = (dispatch) => ({
	updateAsset: (data) => dispatch(assetUpdated(data)),
	lendAsset: (data) => dispatch(assetLent(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CharacterProfile);
