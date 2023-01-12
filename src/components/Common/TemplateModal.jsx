import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../socket';
import { useDrop } from 'react-dnd';
import { getTeamAccount } from '../../redux/entities/accounts';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

const TemplateModal = (props) => {
	const navigate = useNavigate();
	const blueprints = useSelector(s => s.blueprints.list);
	const { login, team, character} = useSelector(s => s.auth);
	const loading =  useSelector(s => s.gamestate.loading);
	const account = useSelector(getTeamAccount);


	const [levels, setLevels] = React.useState([]);

	useEffect(() => {
		if(!props.login)
			navigate('/');
	}, [props.login, navigate])
		
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "asset",
		drop: (item) => item.facility ? socket.emit('request', { route: 'asset', action: 'remove', data: { worker: item.id, facility: item.facility } }) : console.log('nope'),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));
	
	if (!login || !character || !team) return (<div />);	
	return ( 
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Lorem count={2} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
	);
}

export default (TemplateModal);