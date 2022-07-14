import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Slider, Tag, FlexboxGrid, Icon, CheckPicker, Loader } from 'rsuite';
import { getFadedColor, getThisEffort } from '../../scripts/frontend';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter } from '../../redux/entities/characters';
import { playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket';
class NewAction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			effort: 0,
			assets: [],
			id: '',
			description: '',
			intent: '',
			name: ''
		};
	}

	componentDidMount = () => {
		// // localStorage.removeItem('newActionState');
		// const stateReplace = JSON.parse(localStorage.getItem('newActionStateGW'));
		// // console.dir(stateReplace);
		// if (stateReplace) this.setState(stateReplace);
	};

	componentDidUpdate = (prevProps, prevState) => {
		// if (this.state !== prevState) {
		// 	localStorage.setItem('newActionStateGW', JSON.stringify(this.state));
		// 	// console.log(localStorage);
		// };
		if (this.props.actions !== prevProps.actions) {
			if (
				this.props.actions.some(
					(el) => el.description === this.state.description
				)
			) {
				// checking to see if the new action got added into the action list, so we can move on with our lives
				this.props.closeNew();
				this.setState({
					effort: 0,
					assets: [],
					id: '',
					description: '',
					intent: '',
					name: ''
				});
			}
		}
	};

	handleSubmit = async () => {
	//	this.props.actionDispatched();
		// 1) make a new action
		const data = {
			submission: {
				effort: this.state.effort,
				assets: this.state.assets,
				description: this.state.description,
				intent: this.state.intent,
				round: this.props.gamestate.round
			},
			name: this.state.name,
			controllers: ['Test2'],
			type: this.props.show.type,
			creator: this.props.myCharacter._id,
			round: this.props.gamestate.round,
			numberOfInjuries: this.props.myCharacter.injuries.length
		};
		// this.setState({
		// 	effort: 0,
		// 	assets: [],
		// 	id: '',
		// 	description: '',
		// 	intent: '',
		// 	name: ''
		// });
		socket.emit('request', { route: 'action', action: 'create', data });
//		this.props.closeNew();
	};


	render() {
		const effort = getThisEffort(this.props.myCharacter.effort, this.props.show.type)
		return (
			<Modal
				overflow
				style={{ width: '90%' }}
				size="md"
				show={this.props.show}
				onHide={() => this.props.closeNew()}
			>
				<Modal.Header>
					<Modal.Title>Submit a new {this.props.show.type} Action</Modal.Title>
				</Modal.Header>
				<Modal.Body
					style={{ border: `4px solid ${getFadedColor(this.props.show.type)}`, borderRadius: '5px', padding: '15px' }}
				>
					{this.props.actionLoading && (
						<Loader backdrop content="loading..." vertical />
					)}
					<form>
						Name:
						{10 - this.state.name.length > 0 && (
							<Tag style={{ color: 'black' }} color={'orange'}>
								{10 - this.state.name.length} more characters...
							</Tag>
						)}
						{10 - this.state.name.length <= 0 && (
							<Tag color={'green'}>
								<Icon icon="check" />
							</Tag>
						)}
						<textarea
							rows="1"
							value={this.state.name}
							style={textStyle}
							onChange={(event) => this.setState({ name: event.target.value })}
						></textarea>
						Description:
						{10 - this.state.description.length > 0 && (
							<Tag style={{ color: 'black' }} color={'orange'}>
								{10 - this.state.description.length} more characters...
							</Tag>
						)}
						{10 - this.state.description.length <= 0 && (
							<Tag color={'green'}>
								<Icon icon="check" />
							</Tag>
						)}
						<textarea
							rows="6"
							value={this.state.description}
							style={textStyle}
							onChange={(event) =>
								this.setState({ description: event.target.value })
							}
						></textarea>
						<br></br>
						<FlexboxGrid>
							Intent:
							{10 - this.state.intent.length > 0 && (
								<Tag style={{ color: 'black' }} color={'orange'}>
									{10 - this.state.intent.length} more characters...
								</Tag>
							)}
							{10 - this.state.intent.length <= 0 && (
								<Tag color={'green'}>
									<Icon icon="check" />
								</Tag>
							)}
							<textarea
								rows="6"
								value={this.state.intent}
								style={textStyle}
								onChange={(event) =>
									this.setState({ intent: event.target.value })
								}
							></textarea>
						</FlexboxGrid>

						{(
							<FlexboxGrid>
								<FlexboxGrid.Item
									style={{
										paddingTop: '25px',
										paddingLeft: '10px',
										textAlign: 'left'
									}}
									align="middle"
									colspan={6}
								>
									<h5 style={{ textAlign: 'center' }}>
										Effort {this.state.effort} / {effort}
										{this.state.effort === 0 && (
											<Tag style={{ color: 'black' }} color={'orange'}>
												Need Effort
											</Tag>
										)}
									</h5>
									<Slider
										graduated
										min={0}
										max={effort}
										defaultValue={0}
										progress
										value={this.state.effort}
										onChange={(event) => this.setState({ effort: event })}
									></Slider>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item
									style={{
										paddingTop: '25px',
										paddingLeft: '10px',
										textAlign: 'left'
									}}
									colspan={2}
								>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item colspan={4}></FlexboxGrid.Item>
								<FlexboxGrid.Item
									style={{
										paddingTop: '5px',
										paddingLeft: '10px',
										textAlign: 'left'
									}}
									colspan={10}
								>
									{' '}
									Resources
									<CheckPicker
										labelKey="name"
										valueKey="_id"
										data={this.props.getMyAssets}
										style={{ width: '100%' }}
										disabledItemValues={this.formattedUsedAssets()}
										onChange={(event) => this.setState({ assets: event })}
									/>
								</FlexboxGrid.Item>
							</FlexboxGrid>
						)}

					</form>
					<div
						style={{
							justifyContent: 'end',
							display: 'flex',
							marginTop: '15px'
						}}
					>

							<Button
								onClick={() => this.handleSubmit()}
								disabled={this.isDisabled(effort)}
								color={this.isDisabled(effort) ? 'red' : 'green'}
								appearance="primary"
							>
								<b>Submit</b>
							</Button>
						<Button onClick={() => this.props.closeNew()} appearance="subtle">
							Cancel
						</Button>
					</div>
				</Modal.Body>
				<Modal.Footer></Modal.Footer>
			</Modal>
		);
	}

	isDisabled(effort) {
		if (
			this.state.description.length < 10 ||
			this.state.intent.length < 10 ||
			this.state.name.length < 10
		)
			return true;
		if (effort < 1 || this.state.effort <= 0) return true;
		else return false;
	}

	formattedUsedAssets = () => {
		let temp = [];
		let assets = this.props.getMyAssets.filter(
			(el) =>
				!banned.some(
					(el1) =>
						el1 === el.level &&
						(el.type === 'GodBond' || el.type === 'MortalBond')
				)
		);
		assets = assets.filter((el) => el.uses <= 0 || el.status.used);
		for (const asset of assets) {
			temp.push(asset._id);
		}
		return temp;
	};
}

const banned = [
	'Condemned',
	'Disfavoured',
	'Loathing',
	'Unfriendly',
	'Neutral',
	'Preferred',
	'Warm'
];

const textStyle = {
	backgroundColor: '#1a1d24',
	border: '1.5px solid #3c3f43',
	borderRadius: '5px',
	width: '100%',
	padding: '5px',
	overflow: 'auto',
	scrollbarWidth: 'none'
};
const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	actions: state.actions.list,
	actionLoading: state.actions.loading,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	actionDispatched: (data) => dispatch(playerActionsRequested(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAction);
