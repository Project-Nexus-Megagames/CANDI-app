import React, { useEffect } from "react";
import {
  useDisclosure,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react'
import ResourceNugget from "./ResourceNugget";
import InputNumber from "./InputNumber";
import SelectPicker from "./SelectPicker";
import { useSelector } from "react-redux";
import socket from "../../socket";

export const EditAccount = ({ open, account, onClose, onOpen }) => {
  const { isOpen, onOpen: OpenModal, onClose: CloseModal } = useDisclosure();
	const gameConfig = useSelector((state) => state.gameConfig);
	const [resources, setResources] = React.useState(account.resources.map( r => {return { type: r.type, balance: r.balance }} ));
	const [add, setAdd] = React.useState(false);


  // useEffect(() => {
  //   setResources
  // }, [])

  const handleClose = () => { 
    if (onClose && onClose instanceof Function) onClose();
    CloseModal();
  };

  const handleOpen = () => {
    if (onOpen && onOpen instanceof Function) onOpen();
    OpenModal();
  }

  const editState = (incoming, type, index ) => {
    // console.log(incoming, type, index)
		let thing;
		let temp;
		switch (type) {
      case 'add':
        setResources([ ...resources, { type: incoming, balance: 0 }])
        setAdd(false)
				break;
			case 'increase':
				thing = resources[index];
				temp = [...resources];
        
				thing.balance = parseInt(incoming);
				temp[index] = thing;
				setResources(temp);
				break;
			default:
				console.log('UwU Scott made an oopsie doodle!')
		}
	}

  useEffect(() => {
    if (open) handleOpen();
    else handleClose();
  }, [open]);

  const handleSubmit = () =>{
    const data = {
      account: account._id,
      resources
    }
		socket.emit('request', { route: 'character', action: 'resetAccount', data });
  }

  return (
    <>
      <Button variant={'solid'}  onClick={handleOpen} >Edit Account</Button>

      <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {resources.map((resource, index) => 
            <Box key={index} >
              {resource.type}
              <ResourceNugget key={resource.type} type={resource.type}  width={'80px'} height={'30'} />
              <InputNumber 
                onChange={(ddd) => editState(ddd, 'increase', index)}
                defaultValue={resource.balance} 
               ></InputNumber>
            </Box>
          )}
          <Button isDisabled={resources.length == gameConfig.resourceTypes.length} onClick={() => setAdd(true)} >Add Resource</Button>
          {add && 
						<SelectPicker 
              valueKey={'type'} 
              label={'type'} 
              data={gameConfig.resourceTypes.filter(el => !resources.some(r => r.type === el.type ) )} 
              onChange={(ddd) => editState(ddd, 'add')} 
            />}
        </ModalBody>

        <ModalFooter>
          <Button variant='solid' colorScheme='red' mr={3} onClick={() => handleClose()}>
            Close
          </Button>
          <Button onClick={handleSubmit} variant='ghost'>Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>   
    </>

  );
};