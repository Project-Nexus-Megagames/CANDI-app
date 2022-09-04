import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Loader, Toggle } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter, characterUpdated } from '../../redux/entities/characters';
import { playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket';
class Support extends Component {
	constructor(props) {
		super(props);
		this.state = {
			description: ''
		};
	}


	handleSubmit = async () => {
		this.props.actionDispatched();
		// 1) make a new action
		const data = {
			id: this.props.selected._id,
      supporter: this.props.myCharacter._id
		};
		socket.emit('request', { route: 'action', action: 'support', data });
		this.props.closeNew();
	};

	render() {
		return (
			<Modal overflow style={{ zIndex: 9999 }} size="sm" show={this.props.show} onHide={() => this.props.closeNew()}>
				<Modal.Header>
					<Modal.Title>Are you sure you would like to support this Agenda?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
          This will consume you Agenda Effort. You cannot undo this. 
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => this.handleSubmit()} disabled={this.props.myCharacter.effort.find(el => el.type === 'Agenda').amount <= 0} appearance="primary">
						Yup!
					</Button>
					<Button onClick={() => this.props.closeNew()} appearance="subtle">
						Nope.
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	isDisabled() {
		if (this.state.description.length > 10) return false;
		else return true;
	}

	formattedUsedAssets = () => {
		let assets = [];
		for (const asset of this.props.usedAssets) {
			assets.push(asset.name);
		}
		return assets;
	};
}

const mapStateToProps = (state) => ({
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data)),
	actionDispatched: (data) => dispatch(playerActionsRequested(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Support);
