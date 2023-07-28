import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getThisEffort } from '../../../scripts/frontend';
import { getMyAssets } from '../../../redux/entities/assets';
import { getMyCharacter } from '../../../redux/entities/characters';
import socket from '../../../socket';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Tag,
	Icon,
	Spinner,
	Box,
	Flex,
	Button,
	ButtonGroup,
	Tooltip,
	Divider,
	Spacer,
  Center
} from '@chakra-ui/react';
import CheckerPick from '../../Common/CheckerPick';
import { CheckIcon, PlusSquareIcon } from '@chakra-ui/icons';
import NexusSlider from '../../Common/NexusSlider';
import AssetCard from '../../Common/AssetCard';
import { AddAsset } from '../../Common/AddAsset';
import ActionForm from '../Forms/ActionForm';

/**
 * Form for a new ACTION
 * @param {*} props
 * @returns Component
 */
const NewAction = (props) => {
	const { gameConfig } = useSelector((state) => state);
	const { myCharacter } = useSelector((s) => s.auth);
	// const myCharacter = useSelector(getMyCharacter);

	const [effort, setEffort] = React.useState({ effortType: 'Normal', amount: 0 });
	const [resource, setResource] = React.useState([]);
	const [actionType, setActionType] = React.useState(false);
	const [description, setDescription] = React.useState('');
	const [intent, setIntent] = React.useState('');
	const [name, setName] = React.useState('');
	const [max, setMax] = React.useState(0);

	const setMaxEffort = () => {
		let charEffort = getThisEffort(myCharacter.effort, actionType.type);
    console.log(myCharacter.effort, actionType.type)
		setMax(charEffort < actionType.maxEffort ? charEffort : actionType.maxEffort);
	};
  
  useEffect(() => {
    newMap(actionType.maxAssets);
	}, [])

	useEffect(() => {
		if (actionType && actionType.type) {
			setEffort({ effortType: actionType.type, amount: 0 });
			setMaxEffort();
      newMap(actionType.maxAssets);
		}
	}, [actionType?.type]);

  useEffect(() => {
    newMap(actionType.maxAssets);
	}, [actionType])

	useEffect(() => {
		if (effort) setMaxEffort();
	}, [effort]);




  function newMap(number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(undefined);
    }
    setResource(arr);
  }


	return (
		<Modal size='5xl' isOpen={props.show} onClose={() => props.closeNew()}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Submit a new{actionType ? ` ~${actionType.type}~` : ''} Action</ModalHeader>
				<ModalCloseButton />
				<ModalBody style={{ border: `4px solid ${getFadedColor(actionType.type)}`, borderRadius: '5px', padding: '15px' }}>
					{props.actionLoading && <Spinner />}

          <ActionForm {...props} />

				</ModalBody>
				<ModalFooter></ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default NewAction;
