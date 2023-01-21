import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, Icon, List } from 'rsuite';
import { useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Text, StatHelpText } from '@chakra-ui/react';
import { getDateString } from '../../scripts/dateTime';
import { getMyCharacter } from '../../redux/entities/characters';
import socket from '../../socket';
import SelectedAction from '../Actions/SelectedAction';

const ActionDrawer = (props) => {
	const [newComment, setNewComment] = useState('');
	const [commentId, setCommentId] = useState('');

	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef();
	const myChar = useSelector(getMyCharacter);
	const duck = useSelector((state) => state.gamestate.duck);
  const spook = useSelector((state) => state.gamestate.spook);

	let selected = props.selected;

	const getDuck = () => {
		if (spook)
			return {
				backgroundImage: `url("https://c.tenor.com/xXMKqzQrpJ0AAAAM/skeleton-trumpet.gif")`,
				color: 'red',
				fontFamily: 'Spook'
			};
	};

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
			<DrawerContent bgColor="#0f131a" style={getDuck()}>
				<DrawerCloseButton />
				<DrawerHeader align="center">
					<Text>{selected?.name}</Text>
				</DrawerHeader>
				<DrawerBody align="center">{selected && <SelectedAction special={false} handleSelect={props.closeDrawer} selected={selected} />}</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default ActionDrawer;
