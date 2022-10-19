import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, FlexboxGrid, Loader, Modal } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../../redux/entities/assets';
import { characterUpdated, getMyCharacter } from '../../../redux/entities/characters';
import { playerActionsRequested } from '../../../redux/entities/playerActions';
import socket from '../../../socket';

class NewResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			description: '',
			dice: ''
		};
	}

	// componentDidMount = () => {
	// 	// localStorage.removeItem('newActionState');
	// 	const stateReplace = JSON.parse(localStorage.getItem('newResultStateGW'));
	// 	console.dir(stateReplace);
	// 	if (stateReplace) this.setState(stateReplace);
	// }

	handleSubmit = async () => {
		this.props.actionDispatched();
		// 1) make a new action
		const diceresult = this.state.dice ? this.state.dice : this.props.selected.diceresult;
		const data = {
			result: {
				description: this.state.description,
				resolver: this.props.myCharacter._id
			},
			dice: diceresult ? diceresult : '0',
			id: this.props.selected._id,
			creator: this.props.myCharacter._id,
			round: this.props.gamestate.round
		};
		socket.emit('request', { route: 'action', action: 'result', data });
		this.props.closeNew();

		this.setState({
			description: '',
			dice: ''
		});
	};

	renderDice = (asset) => {
		if (asset) {
			let ass = this.props.assets.find((el) => el._id === asset);
			const thing = ass ? <b>{ass.dice} </b> : <b>?????</b>;
			return thing;
		}
	};

	render() {
		return (
			<Modal overflow style={{ width: '90%', zIndex: 9999 }} size="md" show={this.props.show} onHide={() => this.props.closeNew()}>
				<Modal.Header>
					<Modal.Title>Submit a new Result</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.props.actionLoading && <Loader backdrop content="loading..." vertical />}
					<form>
						<FlexboxGrid>
							Description
							<textarea rows="6" value={this.state.description} style={textStyle} onChange={(event) => this.setState({ description: event.target.value })}></textarea>
						</FlexboxGrid>
						<br></br>

						<FlexboxGrid>
							<FlexboxGrid.Item
								style={{
									paddingTop: '25px',
									paddingLeft: '10px',
									textAlign: 'left'
								}}
								align="middle"
								colspan={4}
							>
								<h5>Dice Pool</h5>
								{this.props.selected && this.props.selected.submission.assets.map((asset, index) => this.renderDice(asset))}
							</FlexboxGrid.Item>
							<FlexboxGrid.Item
								style={{
									paddingTop: '25px',
									paddingLeft: '10px',
									textAlign: 'left'
								}}
								colspan={20}
							>
								Dice Roll Result
								<textarea rows="2" defaultValue={this.props.selected.diceresult} style={textStyle} onChange={(event) => this.setState({ dice: event.target.value })}></textarea>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={4}></FlexboxGrid.Item>
						</FlexboxGrid>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => this.handleSubmit()} disabled={this.isDisabled()} appearance="primary">
						{this.state.description.length < 11 ? (
							<b>Description text needs {11 - this.state.description.length} more characters</b>
						) : this.state.dice.length < 1 && this.props.selected.diceresult?.length < 1 ? (
							<b>Dice text need {1 - this.state.dice.length} more characters</b>
						) : (
							<b>Submit</b>
						)}
					</Button>
					<Button onClick={() => this.props.closeNew()} appearance="subtle">
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	isDisabled() {
		const diceresult = this.state.dice.length < 1 && this.props.selected.diceresult?.length < 1;
		if (this.state.description.length < 10 || diceresult) return true;
		else return false;
	}

	formattedUsedAssets = () => {
		let assets = [];
		for (const asset of this.props.usedAssets) {
			assets.push(asset.name);
		}
		return assets;
	};
}

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
	assets: state.assets.list,
	actionLoading: state.actions.loading,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data)),
	actionDispatched: (data) => dispatch(playerActionsRequested(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewResult);