/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../../socket';
import { Modal, Button, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { getMyCharacter } from '../../../redux/entities/characters';
import SelectPicker from '../../Common/SelectPicker';

const NewResult = (props) => {
	const { result, mode } = props;
	const myChar = useSelector(getMyCharacter);
	const [description, setDescription] = React.useState((result && result.description) ? result.description : '');
	const [diceresult, setDiceresult] = React.useState(result && result.diceresult ? result.diceresult : '');
	const [status, setStatus] = React.useState(result ? result.status : 'Temp-Hidden');

	const isDisabled = () => {
		const boolean = diceresult?.length < 1 && diceresult?.length < 1;
		if (description.length < 10 || boolean) return true;
		else return false;
	};

	const handleSubmit = async () => {
		const data = {
			result: {
				description: description,
				resolver: myChar._id,
				status: status,
				id: result?._id
			},
			dice: diceresult ? diceresult : '0',
			id: props.selected._id,
			creator: myChar._id
		};
		socket.emit('request', { route: 'action', action: mode, data });
		props.closeNew();
	};

	const statusTypes = [
    { name: 'Public', description: 'Anyone Can see this' }, 
    { name: 'Private', description: 'Only Control can see this' }, 
    { name: 'Temp-Hidden', description: 'Only Control can see this. Will be made public when the round is pushed' }];

	return (
		<>
			<Modal isOpen={props.show} onClose={() => props.closeNew()}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{mode}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
            Scott will eventually replace this form with something better.
						<form>
							Status
							<SelectPicker altLabel={"description"} label={'name'} valueKey={'name'} data={statusTypes} onChange={(ddd) => setStatus(ddd)} value={status} />
							Description
							<textarea rows='6' value={description} className='textStyle' onChange={(event) => setDescription(event.target.value)}></textarea>
							Dice Roll Result
							<textarea rows='2' value={diceresult} className='textStyle' onChange={(event) => setDiceresult(event.target.value)}></textarea>
						</form>
					</ModalBody>

					<ModalFooter>
						<Button onClick={() => handleSubmit()} disabled={isDisabled()} appearance='primary'>
							{description.length < 11 ? (
								<b>Description text needs {11 - description.length} more characters</b>
							) : diceresult.length < 1 && props.selected.diceresult?.length < 1 ? (
								<b>Dice text need {1 - diceresult.length} more characters</b>
							) : (
								<b>Submit</b>
							)}
						</Button>
						<Button onClick={() => props.closeNew()} appearance='subtle'>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default NewResult;
