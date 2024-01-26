/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/jsx-max-props-per-line */
import React from 'react';
import {  Modal,  Button,  ModalOverlay,  ModalContent,  ModalHeader,  ModalFooter,  ModalBody,  ModalCloseButton,  Spinner,  Switch,} from '@chakra-ui/react'
import socket from '../../../socket';
import { useDispatch, useSelector } from 'react-redux';
import { getMyCharacter } from '../../../redux/entities/characters';
import { playerActionsRequested } from '../../../redux/entities/playerActions';

const NewComment = (props) => {
	const { comment, mode } = props;
  const reduxAction = useDispatch();
	const {myCharacter} = useSelector(s => s.auth);
	const [body, setBody] = React.useState(props.comment?.body || '');
	const [isPrivate, setIsPrivate] = React.useState(false);

  const handleSubmit = async () => {
		reduxAction(playerActionsRequested());
		// 1) make a new action
		const data = {
			id: props.selected._id,
			comment: {
				body,
				status: isPrivate ? 'Private' : 'Public',
				commentor: myCharacter._id,
				_id: comment?._id
			},
		};
		socket.emit('request', { route: 'action', action: mode, data });
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
    <Modal closeOnOverlayClick={false} isOpen={props.show} onClose={() => props.closeNew()} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Comments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {props.actionLoading && <Spinner />}
            <form>
      				Comment Text
      				<br></br>
      				{myCharacter.tags.some((el) => el === 'Control') && (
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
	);
}

export default (NewComment);