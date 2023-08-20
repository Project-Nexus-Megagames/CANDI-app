import React from 'react';
import { getFadedColor } from '../../../scripts/frontend';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Spinner} from '@chakra-ui/react';
import ActionForm from '../Forms/ActionForm';

/**
 * Form for a new ACTION
 * @param {*} props
 * @returns Component
 */
const NewAction = (props) => {
	return (
		<Modal size='5xl' isOpen={props.show} onClose={() => props.closeNew()}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Submit a new Action</ModalHeader>
				<ModalCloseButton />
				<ModalBody style={{ border: `4px solid ${getFadedColor('default')}`, borderRadius: '5px', padding: '15px' }}>
					{props.actionLoading && <Spinner />}

          <ActionForm {...props} />

				</ModalBody>
				<ModalFooter></ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default NewAction;
