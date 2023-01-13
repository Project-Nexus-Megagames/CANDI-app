/* eslint-disable react/jsx-max-props-per-line */
import React, { useEffect } from 'react';
import {
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Switch,
} from '@chakra-ui/react'
import socket from '../../../socket';
import { useSelector } from 'react-redux';
import { getMyCharacter } from '../../../redux/entities/characters';

const NewComment = (props) => {
	const myChar = useSelector(getMyCharacter);
	const [body, setBody] = React.useState('');
	const [isPrivate, setIsPrivate] = React.useState(false);

  const handleSubmit = async () => {
		props.actionDispatched();
		// 1) make a new action
		const data = {
			id: props.selected._id,
			comment: {
				body,
				status: isPrivate ? 'Private' : 'Public',
				commentor: myChar._id
			},
		};
		socket.emit('request', { route: 'action', action: 'comment', data });
		props.closeNew();
	};

  const textStyle = {
	backgroundColor: '#1a1d24',
	border: '1.5px solid #3c3f43',
	borderRadius: '5px',
	width: '100%',
	padding: '5px',
	overflow: 'auto',
	scrollbarWidth: 'none'
};

	return ( 
    <>
      <Modal isOpen={props.show} onClose={() => props.closeNew()} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {props.actionLoading && <Spinner backdrop content="loading..." vertical />}
      			<form>
      				Comment Text
      				<br></br>
      				{myChar.tags.some((el) => el === 'Control') && (
      					<Switch defaultChecked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} >
                  {isPrivate ? "Hidden" : "Revealed"}
                </Switch>
      				)}
      				<textarea rows="6" value={body} style={textStyle} onChange={(event) => setBody(event.target.value) }></textarea>
      			</form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={'green'} onClick={() => (handleSubmit())} disabled={body.length < 11} variant="solid">
   						{body.length < 11 ? <b>Text needs {11 - body.length} more characters</b> : <b>Submit</b>}
   					</Button>
   					<Button onClick={() => props.closeNew()} variant="subtle">
   						Cancel
   					</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
	);
}

export default (NewComment);


// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { Button, Loader, Modal, Toggle } from 'rsuite';
// import { getMyAssets, getMyUsedAssets } from '../../../redux/entities/assets';
// import { characterUpdated, getMyCharacter } from '../../../redux/entities/characters';
// import { playerActionsRequested } from '../../../redux/entities/playerActions';
// import socket from '../../../socket';

// class NewComment extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			description: ''
// 		};
// 	}

// 	componentDidMount = () => {
// 		// // localStorage.removeItem('newActionState');
// 		// const stateReplace = JSON.parse(localStorage.getItem('NewCommentGW'));
// 		// if (stateReplace) this.setState({ description: stateReplace});
// 		// if (this.props.comment) {
// 		// 	this.setState({
// 		// 		description: this.props.comment.body,
// 		// 	});
// 		// }
// 	};

// 	componentDidUpdate = (prevProps, prevState) => {
// 		// if (this.state !== prevState) {
// 		// 	localStorage.setItem('NewCommentGW', JSON.stringify(this.state.description));
// 		// };
// 		if (this.props.actions !== prevProps.actions && this.props.comment) {
// 			this.setState({
// 				description: this.props.comment.body
// 			});
// 		}
// 	};



// 	render() {
// 		return (
// 			<Modal overflow style={{ width: '90%', zIndex: 9999 }} size="md" show={this.props.show} onHide={() => this.props.closeNew()}>
// 				<Modal.Header>
// 					<Modal.Title>Submit a new Comment</Modal.Title>
// 				</Modal.Header>
// 				<Modal.Body>
// 					{this.props.actionLoading && <Loader backdrop content="loading..." vertical />}

// 					<form>
// 						Comment Text
// 						<br></br>
// 						{this.props.myChar.tags.some((el) => el === 'Control') && (
// 							<Toggle defaultChecked={this.state.private} onChange={() => this.setState({ private: !this.state.private })} checkedChildren="Hidden" unCheckedChildren="Revealed" />
// 						)}
// 						<textarea rows="6" value={this.state.description} style={textStyle} onChange={(event) => this.setState({ description: event.target.value })}></textarea>
// 					</form>
// 				</Modal.Body>
// 				<Modal.Footer>
// 					<Button onClick={() => (this.props.comment ? this.handleEditSubmit() : this.handleSubmit())} disabled={this.isDisabled()} appearance="primary">
// 						{this.state.description.length < 11 ? <b>Text needs {11 - this.state.description.length} more characters</b> : <b>Submit</b>}
// 					</Button>
// 					<Button onClick={() => this.props.closeNew()} appearance="subtle">
// 						Cancel
// 					</Button>
// 				</Modal.Footer>
// 			</Modal>
// 		);
// 	}

// 	isDisabled() {
// 		if (this.state.description.length > 10) return false;
// 		else return true;
// 	}

// 	formattedUsedAssets = () => {
// 		let assets = [];
// 		for (const asset of this.props.usedAssets) {
// 			assets.push(asset.name);
// 		}
// 		return assets;
// 	};
// }


// const mapStateToProps = (state) => ({
// 	user: state.auth.user,
// 	gamestate: state.gamestate,
// 	actions: state.actions.list,
// 	actionLoading: state.actions.loading,
// 	usedAssets: getMyUsedAssets(state),
// 	getMyAssets: getMyAssets(state),
// 	myChar: state.auth.user ? getMyCharacter(state) : undefined
// });

// const mapDispatchToProps = (dispatch) => ({
// 	updateCharacter: (data) => dispatch(characterUpdated(data)),
// 	actionDispatched: (data) => dispatch(playerActionsRequested(data))
// });

// export default connect(mapStateToProps, mapDispatchToProps)(NewComment);
