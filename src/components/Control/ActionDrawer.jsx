import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDisclosure, Drawer, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Text, DrawerBody, Accordion } from '@chakra-ui/react';
import { getMyCharacter } from '../../redux/entities/characters';
import Action from '../Actions/ActionList/Action/Action';

const ActionDrawer = (props) => {
	const duck = useSelector((state) => state.gamestate.duck);

	let selected = props.selected;

	const getDuck = () => {
		if (duck)
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
				<DrawerBody align="center">
          <Accordion defaultIndex={[0]} >
            {selected && <Action hidebuttons handleSelect={props.closeDrawer} action={selected} />}            
          </Accordion>

        </DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default ActionDrawer;
