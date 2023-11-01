import React from 'react';
import {   Modal,   ModalOverlay,   ModalContent,   ModalHeader,   ModalFooter,   ModalBody,   ModalCloseButton, 	Divider, 	Box, 	Flex, 	Button, } from '@chakra-ui/react'

function AssetInfo({ asset, showInfo, closeInfo }) {
	return (
		<Modal isOpen={showInfo} onClose={closeInfo}>
		<ModalOverlay />
		<ModalContent>
			<ModalHeader><p>{asset.name}</p></ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				<p>Level {asset.level}</p>
				
				{asset.description}
				<Divider/>
				<Flex>
					<Box colSpan={12} >
						<p>Dice: {asset.dice}</p>
					</Box>
				</Flex>
			</ModalBody>

			<ModalFooter>
				<Button colorScheme='blue' mr={3} onClick={closeInfo}>
					Close
				</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>
	);
}

export default AssetInfo;