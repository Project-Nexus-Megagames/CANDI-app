import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, Icon, List } from 'rsuite';
import { useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Text, } from '@chakra-ui/react';
import { getDateString } from '../../scripts/dateTime';
import { getMyCharacter } from '../../redux/entities/characters';
import socket from '../../socket';
import SelectedAction from '../Actions/SelectedAction';

const AgendaDrawer = (props) => {
	const [newComment, setNewComment] = useState('');
	const [commentId, setCommentId] = useState('');

	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef();
	const myChar = useSelector(getMyCharacter);

	let selected = props.selected;

	return (
		<Drawer
		style={{ zIndex: 2 }}
			isOpen={props.isOpen}
			placement="top"
			size="full"
			show={props.show}
			closeOnEsc="true"
			onClose={() => {
				props.closeDrawer();
			}}
		>
			<DrawerOverlay />
			<DrawerContent bgColor="#0f131a">
				<DrawerCloseButton />
				<DrawerHeader align="center">
					<Text>{selected?.name}</Text>
				</DrawerHeader>
				<DrawerBody align="center">
          {selected && <SelectedAction special={true} handleSelect={props.closeDrawer} selected={selected} />}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default AgendaDrawer;
